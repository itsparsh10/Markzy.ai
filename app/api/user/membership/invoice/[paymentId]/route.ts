import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import jsPDF from 'jspdf';

// Import required modules
const PaymentHistory = require('../../../../../../services/models/PaymentHistory');
const User = require('../../../../../../services/models/User');
const dbConnect = require('../../../../../../services/db');

interface RouteParams {
  params: Promise<{ paymentId: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  const params = await context.params;
  try {
    // Get token from cookies or headers
    let token = request.cookies.get('authToken')?.value;
    
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.replace('Bearer ', '');
      } else if (authHeader && authHeader.startsWith('bearer ')) {
        token = authHeader.replace('bearer ', '');
      }
    }
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token and get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const userId = decoded.userId;

    await dbConnect();

    // Get payment record
    const payment = await PaymentHistory.findOne({ 
      _id: params.paymentId,
      userId: userId 
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, message: 'Payment not found' },
        { status: 404 }
      );
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Get subscription details if available
    const Subscription = require('../../../../../../services/models/Subscription');
    const subscription = await Subscription.findOne({ 
      subscriptionId: payment.subscriptionId,
      userId: userId 
    });

    // Generate PDF content with enhanced subscription data
    const pdfContent = generateInvoicePDF(payment, user, subscription);

    // Return PDF as blob
    return new NextResponse(new Uint8Array(pdfContent), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${params.paymentId}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}

function generateInvoicePDF(payment: any, user: any, subscription?: any): Buffer {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Set font
  doc.setFont('helvetica');
  
  // ===== HEADER SECTION =====
  // Company logo area (placeholder)
  doc.setFillColor(59, 130, 246); // Blue background
  doc.rect(0, 0, 210, 40, 'F');
  
  // Company name - centered and prominent
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255); // White text
  doc.text('Markzy', 105, 20, { align: 'center' });
  
  // Company tagline - centered
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('AI-Powered Marketing Tools & Solutions', 105, 32, { align: 'center' });
  
  // ===== COMPANY INFO SECTION =====
  // Reset to white background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 40, 210, 60, 'F');
  
  // Company details - left aligned
  doc.setFontSize(10);
  doc.setTextColor(75, 85, 99); // Gray text
  doc.text('123 Markzy Street', 20, 55);
  doc.text('Digital City, DC 12345', 20, 62);
  doc.text('United States', 20, 69);
  
  // Contact information
  doc.text('hello@markzy.ai', 20, 78);
  doc.text('www.markzy.com', 20, 85);
  doc.text('Phone: +1 (555) 123-4567', 20, 92);
  doc.text('Tax ID: 12-3456789', 20, 100);
  
  // ===== INVOICE TITLE SECTION =====
  // Title background
  doc.setFillColor(248, 250, 252); // Light gray background
  doc.rect(0, 100, 210, 25, 'F');
  
  // Invoice title - centered
  doc.setFontSize(22);
  doc.setTextColor(17, 24, 39); // Dark gray
  doc.text('PAYMENT RECEIPT', 105, 115, { align: 'center' });
  
  // ===== INVOICE DETAILS SECTION =====
  // Invoice details - right side
  doc.setFontSize(11);
  doc.setTextColor(75, 85, 99);
  doc.text(`Receipt #: ${payment._id}`, 120, 130);
  doc.text(`Payment Date: ${new Date(payment.createdDate).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`, 120, 140);
  doc.text(`Transaction Time: ${new Date(payment.createdDate).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })}`, 120, 150);
  
  // ===== BILL TO SECTION =====
  // Bill to section - left side
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246); // Blue color
  doc.text('BILL TO:', 20, 130);
  
  // Customer details
  doc.setFontSize(12);
  doc.setTextColor(17, 24, 39); // Dark text
  doc.text(user.name || 'Customer', 20, 145);
  
  doc.setFontSize(10);
  doc.setTextColor(75, 85, 99); // Gray text
  doc.text(user.email || 'No email provided', 20, 155);
  
  // Add user additional data if available
  if (user.additionalData) {
    if (user.additionalData.companyName) {
      doc.text(user.additionalData.companyName, 20, 165);
    }
    if (user.additionalData.jobTitle) {
      doc.text(user.additionalData.jobTitle, 20, 175);
    }
  }
  
  // ===== PAYMENT DETAILS SECTION =====
  // Section title
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246);
  doc.text('PAYMENT DETAILS:', 20, 200);
  
  // Draw table header with better styling
  doc.setFillColor(59, 130, 246); // Blue header
  doc.rect(20, 210, 170, 12, 'F');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255); // White text
  doc.text('Description', 25, 219);
  doc.text('Quantity', 120, 219);
  doc.text('Rate', 140, 219);
  doc.text('Amount', 160, 219);
  
  // Draw table row with better styling
  doc.setFillColor(248, 250, 252); // Light gray background
  doc.rect(20, 222, 170, 15, 'F');
  doc.rect(20, 222, 170, 15, 'S'); // Border
  
  // Use subscription data if available, otherwise fall back to payment data
  const subscriptionName = subscription?.subscriptionName || payment.subscriptionName || 'Subscription Payment';
  const subscriptionType = subscription?.type || 'monthly';
  const subscriptionDuration = subscription?.duration || 30;
  
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39); // Dark text
  doc.text(subscriptionName, 25, 232);
  
  // Add subscription details as description
  let description = '';
  if (subscription) {
    if (subscription.type === 'lifetime') {
      description = 'Lifetime Access - One-time payment';
    } else if (subscription.type === 'monthly') {
      description = `Monthly Subscription - ${subscriptionDuration} days`;
    }
  } else if (payment.description) {
    description = payment.description;
  }
  
  if (description) {
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128); // Gray text
    doc.text(description, 25, 240);
    doc.setFontSize(11);
    doc.setTextColor(17, 24, 39);
  }
  
  // Add quantity and amount
  doc.text('1', 120, 232);
  doc.text(`$${payment.amount.toFixed(2)}`, 140, 232);
  doc.text(`$${payment.amount.toFixed(2)}`, 160, 232);
  
  // ===== TOTALS SECTION =====
  // Totals background
  doc.setFillColor(248, 250, 252);
  doc.rect(120, 245, 70, 30, 'F');
  doc.rect(120, 245, 70, 30, 'S');
  
  // Subtotal
  doc.setFontSize(11);
  doc.setTextColor(75, 85, 99);
  doc.text('Subtotal:', 125, 255);
  doc.text(`$${payment.amount.toFixed(2)}`, 160, 255);
  
  // Tax
  doc.text('Tax (0%):', 125, 265);
  doc.text('$0.00', 160, 265);
  
  // Total - highlighted
  doc.setFontSize(13);
  doc.setTextColor(59, 130, 246);
  doc.text('TOTAL:', 125, 275);
  doc.setFontSize(15);
  doc.setTextColor(17, 24, 39);
  doc.text(`$${payment.amount.toFixed(2)}`, 160, 275);
  
  // ===== PAYMENT INFORMATION SECTION =====
  // Payment info background
  doc.setFillColor(248, 250, 252);
  doc.rect(20, 285, 170, 40, 'F');
  doc.rect(20, 285, 170, 40, 'S');
  
  // Payment details
  doc.setFontSize(10);
  doc.setTextColor(75, 85, 99);
  doc.text(`Payment ID: ${payment.subscriptionId || 'N/A'}`, 25, 295);
  doc.text(`Status: ${payment.status.toUpperCase()}`, 25, 305);
  doc.text(`Transaction ID: ${payment._id}`, 25, 315);
  doc.text(`Payment Method: Credit Card`, 25, 325);
  
  // Add subscription information if available
  if (subscription) {
    doc.text(`Subscription Type: ${subscription.type.toUpperCase()}`, 25, 335);
    if (subscription.type === 'lifetime') {
      doc.text(`Duration: Lifetime Access`, 25, 345);
    } else {
      doc.text(`Duration: ${subscription.duration} days`, 25, 345);
    }
    doc.text(`Subscription Status: ${subscription.status.toUpperCase()}`, 25, 355);
    if (subscription.createdAt) {
      doc.text(`Started: ${new Date(subscription.createdAt).toLocaleDateString()}`, 25, 365);
    }
    if (subscription.expiresAt) {
      doc.text(`Expires: ${new Date(subscription.expiresAt).toLocaleDateString()}`, 25, 375);
    }
  }
  
  // ===== TERMS & CONDITIONS SECTION =====
  // Terms background
  doc.setFillColor(241, 245, 249);
  doc.rect(20, 385, 170, 30, 'F');
  doc.rect(20, 385, 170, 30, 'S');
  
  doc.setFontSize(9);
  doc.setTextColor(59, 130, 246);
  doc.text('Terms & Conditions:', 25, 395);
  doc.setFontSize(7);
  doc.setTextColor(75, 85, 99);
  doc.text('• Payment is due upon receipt of this invoice', 25, 405);
  doc.text('• Late payments may incur additional charges', 25, 410);
  doc.text('• All sales are final and non-refundable', 25, 415);
  doc.text('• For questions, contact hello@markzy.ai', 25, 420);
  
  // ===== FOOTER SECTION =====
  // Footer background
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 430, 210, 20, 'F');
  
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('Thank you for your payment!', 105, 440, { align: 'center' });
  doc.text('This receipt serves as proof of payment for your records.', 105, 447, { align: 'center' });
  doc.text('For support, contact us at hello@markzy.ai', 105, 454, { align: 'center' });
  
  // Return PDF as Buffer
  return Buffer.from(doc.output('arraybuffer'));
} 