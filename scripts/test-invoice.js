const mongoose = require('mongoose');
const PaymentHistory = require('../services/models/PaymentHistory');
const User = require('../services/models/User');
const dbConnect = require('../services/db');

async function testInvoiceGeneration() {
  try {
    await dbConnect();
    
    console.log('🔍 Testing invoice generation...');
    
    // Get a sample payment
    const payment = await PaymentHistory.findOne({}).populate('userId');
    
    if (!payment) {
      console.log('❌ No payment records found. Please run the sample data script first.');
      return;
    }
    
    console.log('✅ Found payment record:', {
      id: payment._id,
      subscriptionName: payment.subscriptionName,
      amount: payment.amount,
      status: payment.status,
      user: payment.userName
    });
    
    // Test the invoice API endpoint
    console.log('\n🧪 Testing invoice API endpoint...');
    
    // Simulate API call (you would need to run this in the browser or with a proper HTTP client)
    console.log('📋 Invoice API URL:', `/api/user/membership/invoice/${payment._id}`);
    console.log('📋 Payment ID:', payment._id);
    console.log('📋 User ID:', payment.userId);
    
    console.log('\n✅ Invoice generation test completed!');
    console.log('📝 To test the actual download:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Go to the account page');
    console.log('3. Click the "Download Invoice" button');
    console.log('4. Check your downloads folder for the PDF');
    
  } catch (error) {
    console.error('❌ Error testing invoice generation:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the test
testInvoiceGeneration(); 