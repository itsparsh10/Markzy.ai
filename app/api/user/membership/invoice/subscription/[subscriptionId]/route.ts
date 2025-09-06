import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import jsPDF from "jspdf";

// Import your models and db connection
const Subscription = require("../../../../../../../services/models/Subscription");
const User = require("../../../../../../../services/models/User");
const PaymentHistory = require("../../../../../../../services/models/PaymentHistory");
const dbConnect = require("../../../../../../../services/db");

interface RouteParams {
  params: Promise<{ subscriptionId: string }>;
}

export async function GET(request: NextRequest, context: RouteParams) {
  const params = await context.params;

  try {
    // === AUTHENTICATION ===
    let token = request.cookies.get("authToken")?.value;
    
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.replace("Bearer ", "");
      } else if (authHeader?.startsWith("bearer ")) {
        token = authHeader.replace("bearer ", "");
      }
    }
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as any;
    const userId = decoded.userId;

    await dbConnect();

    // === FETCH DATA ===
    const subscription = await Subscription.findOne({
      subscriptionId: params.subscriptionId,
      userId: userId,
    });

    if (!subscription) {
      return NextResponse.json(
        { success: false, message: "Subscription not found" },
        { status: 404 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const payment = await PaymentHistory.findOne({
      subscriptionId: params.subscriptionId,
      userId: userId,
    });

    // === GENERATE PDF ===
    const pdfContent = generateSubscriptionInvoicePDF(subscription, user, payment);

    return new NextResponse(new Uint8Array(pdfContent), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="subscription-invoice-${params.subscriptionId}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating subscription invoice:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate invoice" },
      { status: 500 }
    );
  }
}

// === ENHANCED PDF GENERATOR WITH IMPROVED TABLE ===
function generateSubscriptionInvoicePDF(subscription: any, user: any, payment?: any): Buffer {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = 210;
  const pageHeight = 297;
  const leftSidebarWidth = 75;
  const contentStartX = leftSidebarWidth + 10;
  const contentWidth = pageWidth - contentStartX - 10;

  // === LEFT BLUE SIDEBAR ===
  // Clean gradient sidebar without decorative circles
  doc.setFillColor(59, 130, 246); // Blue-500
  doc.rect(0, 0, leftSidebarWidth, pageHeight / 3, "F");
  
  doc.setFillColor(37, 99, 235); // Blue-600
  doc.rect(0, pageHeight / 3, leftSidebarWidth, pageHeight / 3, "F");
  
  doc.setFillColor(29, 78, 216); // Blue-700
  doc.rect(0, (pageHeight * 2) / 3, leftSidebarWidth, pageHeight / 3, "F");

  // === COMPANY BRANDING ===

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Markzy", 15, 45);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 220, 255);
  doc.text("Your Smart Marketing Buddy", 15, 52);

  // === CUSTOMER INFORMATION ===
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("TO:", 15, 75);

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(user.name || "Customer", 15, 85);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 220, 255);
  
  let yPos = 92;
  if (user.additionalData?.companyName) {
    doc.text(user.additionalData.companyName, 15, yPos);
    yPos += 7;
  }
  if (user.email) {
    doc.text(user.email, 15, yPos);
    yPos += 7;
  }
  if (user.additionalData?.address) {
    const addressLines = doc.splitTextToSize(user.additionalData.address, 55);
    doc.text(addressLines, 15, yPos);
    yPos += addressLines.length * 7;
  }

  // === PAYMENT METHOD SECTION ===
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Payment Method", 15, 140);

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, 145, 50, 18, 2, 2, "F");
  
  doc.setTextColor(37, 99, 235);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(subscription.paymentMethod || "Credit Card", 18, 152);
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Processed securely", 18, 158);

  // === TERMS & CONDITIONS ===
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Terms & Conditions", 15, 185);
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 220, 255);
  const terms = [
    "• Payment due upon receipt",
    "• Late payments subject to fees", 
    "• All amounts in USD",
    "• Contact us for questions"
  ];
  
  terms.forEach((term, index) => {
    doc.text(term, 15, 193 + (index * 6));
  });

  // === RIGHT CONTENT AREA ===
  doc.setTextColor(0, 0, 0);

  // === HEADER SECTION ===
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("INVOICE", contentStartX, 35);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  doc.text(`NO/ISN ${subscription.subscriptionId}`, contentStartX, 45);

  // === DATE SECTION (Right aligned) ===
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.text("Invoice Date", pageWidth - 15, 25, { align: "right" });
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  const invoiceDate = new Date(subscription.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(invoiceDate, pageWidth - 15, 33, { align: "right" });

  // Clean separator line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(contentStartX, 50, pageWidth - 15, 50);

  // === ENHANCED TABLE SECTION ===
  const tableStartY = 70;
  const tableStartX = contentStartX;
  const tableWidth = contentWidth - 5;
  const headerHeight = 12;
  const rowHeight = 20;

  // Define column widths that match the image
  const qtyWidth = 10;
  const descWidth = 54;
  const priceWidth = 25;
  const totalWidth = 18;

  // === TABLE HEADER ===
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(tableStartX, tableStartY, tableWidth, headerHeight, 2, 2, "F");

  // Header border
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.roundedRect(tableStartX, tableStartY, tableWidth, headerHeight, 2, 2, "S");

  // Header text
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(75, 85, 99);
  
  // Column headers with proper positioning
  doc.text("QTY", tableStartX + (qtyWidth / 2), tableStartY + 8, { align: "center" });
  doc.text("DESCRIPTION", tableStartX + qtyWidth + 5, tableStartY + 8);
  doc.text("PRICE", tableStartX + qtyWidth + descWidth + (priceWidth / 2), tableStartY + 8, { align: "center" });
  doc.text("TOTAL", tableStartX + qtyWidth + descWidth + priceWidth + (totalWidth / 2), tableStartY + 8, { align: "center" });

  // === VERTICAL COLUMN SEPARATORS IN HEADER ===
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  
  // Separator after QTY
  doc.line(tableStartX + qtyWidth, tableStartY, tableStartX + qtyWidth, tableStartY + headerHeight);
  // Separator after DESCRIPTION  
  doc.line(tableStartX + qtyWidth + descWidth, tableStartY, tableStartX + qtyWidth + descWidth, tableStartY + headerHeight);
  // Separator after PRICE
  doc.line(tableStartX + qtyWidth + descWidth + priceWidth, tableStartY, tableStartX + qtyWidth + descWidth + priceWidth, tableStartY + headerHeight);

  // === TABLE CONTENT ROW ===
  const rowY = tableStartY + headerHeight;
  
  // Row background
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(tableStartX, rowY, tableWidth, rowHeight, 2, 2, "F");
  
  // Row border
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.roundedRect(tableStartX, rowY, tableWidth, rowHeight, 2, 2, "S");

  // === VERTICAL COLUMN SEPARATORS IN CONTENT ROW ===
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  
  // Separator after QTY
  doc.line(tableStartX + qtyWidth, rowY, tableStartX + qtyWidth, rowY + rowHeight);
  // Separator after DESCRIPTION
  doc.line(tableStartX + qtyWidth + descWidth, rowY, tableStartX + qtyWidth + descWidth, rowY + rowHeight);
  // Separator after PRICE
  doc.line(tableStartX + qtyWidth + descWidth + priceWidth, rowY, tableStartX + qtyWidth + descWidth + priceWidth, rowY + rowHeight);

  // Subscription item data
  const subscriptionItem = {
    qty: 1,
    name: subscription.subscriptionName || "Small Business",
    description: subscription.type === 'lifetime' 
      ? 'Lifetime Access - Unlimited access to all features'
      : `Monthly Subscription - ${subscription.duration || 30} days access`,
    price: subscription.amount || 29.00,
    total: subscription.amount || 29.00
  };

  // === ROW CONTENT WITH PROPER ALIGNMENT ===
  
  // Quantity - centered in column
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(31, 41, 55);
  doc.text(String(subscriptionItem.qty), tableStartX + (qtyWidth / 2), rowY + 12, { align: "center" });
  
  // Description - with proper spacing and formatting
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(31, 41, 55);
  doc.text(subscriptionItem.name, tableStartX + qtyWidth + 5, rowY + 8);
  
  // Description subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  const descLines = doc.splitTextToSize(subscriptionItem.description, descWidth - 10);
  doc.text(descLines[0], tableStartX + qtyWidth + 5, rowY + 15);
  
  // Price - centered in column
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(31, 41, 55);
  doc.text(`$${subscriptionItem.price.toFixed(2)}`, 
    tableStartX + qtyWidth + descWidth + (priceWidth / 2), rowY + 12, { align: "center" });
  
  // Total - centered in column, bold
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(31, 41, 55);
  doc.text(`$${subscriptionItem.total.toFixed(2)}`, 
    tableStartX + qtyWidth + descWidth + priceWidth + (totalWidth / 2), rowY + 12, { align: "center" });

  // === TOTALS SECTION ===
  const totalsY = rowY + rowHeight + 20;
  const totalsWidth = 60;
  const totalsStartX = pageWidth - 15 - totalsWidth;
  
  const subtotal = subscription.amount || 29.00;
  const taxRate = 0;
  const taxAmount = subtotal * taxRate;
  const grandTotal = subtotal + taxAmount;

  // Totals container
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(totalsStartX, totalsY, totalsWidth, 35, 3, 3, "F");
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(totalsStartX, totalsY, totalsWidth, 35, 3, 3, "S");

  // Subtotal
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  doc.text("Sub Total", totalsStartX + 5, totalsY + 8);
  doc.text(`$${subtotal.toFixed(2)}`, totalsStartX + totalsWidth - 5, totalsY + 8, { align: "right" });

  // Tax
  doc.text(`Tax (${(taxRate * 100).toFixed(1)}%)`, totalsStartX + 5, totalsY + 16);
  doc.text(`$${taxAmount.toFixed(2)}`, totalsStartX + totalsWidth - 5, totalsY + 16, { align: "right" });

  // Separator line
  doc.setDrawColor(226, 232, 240);
  doc.line(totalsStartX + 5, totalsY + 20, totalsStartX + totalsWidth - 5, totalsY + 20);

  // Grand Total
  doc.setFillColor(37, 99, 235);
  doc.roundedRect(totalsStartX, totalsY + 23, totalsWidth, 12, 2, 2, "F");
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("GRAND TOTAL", totalsStartX + 5, totalsY + 30);
  doc.setFontSize(12);
  doc.text(`$${grandTotal.toFixed(2)}`, totalsStartX + totalsWidth - 5, totalsY + 30, { align: "right" });

  // === SUBSCRIPTION DETAILS SECTION ===
  const detailsY = totalsY + 50;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(37, 99, 235);
  doc.text("Subscription Details", contentStartX, detailsY);

  // Details container with proper dimensions
  const containerY = detailsY + 8;
  const containerHeight = 70;
  const containerWidth = contentWidth - 5;

  // Main container
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(contentStartX, containerY, containerWidth, containerHeight, 3, 3, "F");
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.roundedRect(contentStartX, containerY, containerWidth, containerHeight, 3, 3, "S");

  // Create proper table structure for details
  const detailsPadding = 6;
  const leftColX = contentStartX + detailsPadding;
  const middleColX = contentStartX + (containerWidth * 0.5) + detailsPadding;
  const colWidth = (containerWidth * 0.5) - (detailsPadding * 2);
  
  // Function to add detail row with proper table structure
  function addDetailRow(leftLabel: string, leftValue: string, rightLabel: string, rightValue: string, yPosition: number) {
    // Left column
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(75, 85, 99);
    doc.text(leftLabel, leftColX, yPosition);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(31, 41, 55);
    
    // Truncate long values
    let displayLeftValue = leftValue;
    if (leftValue.length > 22) {
      displayLeftValue = leftValue.substring(0, 19) + "...";
    }
    doc.text(displayLeftValue, leftColX, yPosition + 5);
    
    // Right column
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(75, 85, 99);
    doc.text(rightLabel, middleColX, yPosition);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(31, 41, 55);
    
    let displayRightValue = rightValue;
    if (rightValue.length > 22) {
      displayRightValue = rightValue.substring(0, 19) + "...";
    }
    doc.text(displayRightValue, middleColX, yPosition + 5);
  }

  // Add status indicators
  function addStatusIndicator(status: string, type: string, yPos: number) {
    // Status indicator for subscription status
    if (status.toLowerCase() === 'active') {
      doc.setFillColor(34, 197, 94); // Green
    } else if (status.toLowerCase() === 'expired') {
      doc.setFillColor(239, 68, 68); // Red
    } else {
      doc.setFillColor(107, 114, 128); // Gray
    }
    doc.circle(leftColX + 45, yPos + 2, 1.5, "F");
    
    // Type indicator
    const typeColors: { [key: string]: number[] } = {
      'monthly': [59, 130, 246], // Blue
      'yearly': [168, 85, 247],  // Purple
      'lifetime': [34, 197, 94]  // Green
    };
    
    const typeColor = typeColors[type.toLowerCase()] || [107, 114, 128];
    doc.setFillColor(typeColor[0], typeColor[1], typeColor[2]);
    doc.circle(middleColX + 35, yPos + 2, 1.5, "F");
  }

  // Add detail rows with proper spacing
  let currentDetailY = containerY + 15;
  const detailRowSpacing = 16;

  // First row
  addDetailRow(
    "Subscription ID:",
    subscription.subscriptionId || 'N/A',
    "Started:",
    subscription.createdAt ? new Date(subscription.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) : 'N/A',
    currentDetailY
  );

  // Second row with status indicators
  currentDetailY += detailRowSpacing;
  addDetailRow(
    "Status:",
    (subscription.status || 'Unknown').toUpperCase(),
    "Expires:",
    subscription.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) : 'N/A',
    currentDetailY
  );
  
  // Add status indicators for this row
  addStatusIndicator(subscription.status || 'unknown', subscription.type || 'monthly', currentDetailY);

  // Third row
  currentDetailY += detailRowSpacing;
  addDetailRow(
    "Type:",
    (subscription.type || 'Unknown').toUpperCase(),
    "Payment ID:",
    payment ? String(payment._id || payment.paymentId || 'N/A').substring(0, 20) + '...' : 'N/A',
    currentDetailY
  );

  // Fourth row
  currentDetailY += detailRowSpacing;
  addDetailRow(
    "Currency:",
    subscription.currency || 'USD',
    "Payment Status:",
    payment ? (payment.status || 'PENDING').toUpperCase() : 'N/A',
    currentDetailY
  );

  // Add horizontal separator lines between sections for better organization
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  
  // Separator after first row
  doc.line(leftColX, containerY + 28, contentStartX + containerWidth - detailsPadding, containerY + 28);
  
  // Separator after third row
  doc.line(leftColX, containerY + 60, contentStartX + containerWidth - detailsPadding, containerY + 60);

  // === FOOTER SECTION ===
  const footerY = detailsY + containerHeight + 15;
  
  // Clean separator line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(contentStartX, footerY, pageWidth - 15, footerY);

  // Thank you message
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(37, 99, 235);
  const centerX = contentStartX + (contentWidth / 2);
  doc.text("Thank you for your business!", centerX, footerY + 15, { align: "center" });

  // Generation timestamp
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  const generationDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long", 
    day: "numeric",
  });
  doc.text(`This invoice was generated on ${generationDate}`, centerX, footerY + 25, { align: "center" });

  return Buffer.from(doc.output("arraybuffer"));
}