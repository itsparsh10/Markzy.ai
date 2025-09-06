const mongoose = require('mongoose');
const PaymentHistory = require('../services/models/PaymentHistory');
const User = require('../services/models/User');
const Subscription = require('../services/models/Subscription');
const dbConnect = require('../services/db');

async function generateRealisticPayments() {
  try {
    await dbConnect();
    
    console.log('🔍 Fetching existing users and subscriptions...');
    
    // Get all users from the database
    const users = await User.find({}).limit(10);
    console.log(`Found ${users.length} users`);
    
    if (users.length === 0) {
      console.log('❌ No users found in database. Please create users first.');
      return;
    }
    
    // Get all subscriptions from the database
    const subscriptions = await Subscription.find({}).limit(10);
    console.log(`Found ${subscriptions.length} subscriptions`);
    
    // Define subscription plans with realistic data
    const subscriptionPlans = [
      { name: 'Basic Monthly Plan', amount: 19.99, duration: 30, description: 'Essential marketing tools for small businesses' },
      { name: 'Premium Monthly Plan', amount: 29.99, duration: 30, description: 'Advanced features for growing businesses' },
      { name: 'Pro Monthly Plan', amount: 49.99, duration: 30, description: 'Professional tools for marketing agencies' },
      { name: 'Enterprise Monthly Plan', amount: 99.99, duration: 30, description: 'Complete solution for large organizations' },
      { name: 'Lifetime Plan', amount: 299.99, duration: 36500, description: 'One-time payment for lifetime access' }
    ];
    
    // Generate realistic payment history for each user
    const allPayments = [];
    
    for (const user of users) {
      console.log(`\n📝 Generating payments for user: ${user.name || user.email}`);
      
      // Get user's subscriptions
      const userSubscriptions = subscriptions.filter(sub => 
        sub.userId && sub.userId.toString() === user._id.toString()
      );
      
      // Generate payments based on user's subscription history
      if (userSubscriptions.length > 0) {
        // Use actual subscription data
        for (const subscription of userSubscriptions) {
          const paymentCount = Math.floor(Math.random() * 6) + 1; // 1-6 payments
          
          for (let i = 0; i < paymentCount; i++) {
            const paymentDate = new Date();
            paymentDate.setMonth(paymentDate.getMonth() - (paymentCount - i - 1));
            
            const payment = {
              userId: user._id,
              userName: user.name || user.email,
              userEmail: user.email,
              subscriptionId: subscription.subscriptionId || `sub_${Date.now()}_${i}`,
              subscriptionName: subscription.subscriptionName || subscription.name || 'Subscription Payment',
              createdDate: paymentDate,
              amount: subscription.amount || subscriptionPlans[Math.floor(Math.random() * subscriptionPlans.length)].amount,
              status: Math.random() > 0.1 ? 'success' : (Math.random() > 0.5 ? 'pending' : 'failed'),
              invoiceUrl: null,
              description: subscriptionPlans.find(plan => plan.name === (subscription.subscriptionName || subscription.name))?.description || 'Subscription Payment'
            };
            
            allPayments.push(payment);
          }
        }
      } else {
        // Generate random payments for users without subscriptions
        const randomPlan = subscriptionPlans[Math.floor(Math.random() * subscriptionPlans.length)];
        const paymentCount = Math.floor(Math.random() * 4) + 1; // 1-4 payments
        
        for (let i = 0; i < paymentCount; i++) {
          const paymentDate = new Date();
          paymentDate.setMonth(paymentDate.getMonth() - (paymentCount - i - 1));
          
          const payment = {
            userId: user._id,
            userName: user.name || user.email,
            userEmail: user.email,
            subscriptionId: `sub_${Date.now()}_${user._id}_${i}`,
            subscriptionName: randomPlan.name,
            createdDate: paymentDate,
            amount: randomPlan.amount,
            status: Math.random() > 0.1 ? 'success' : (Math.random() > 0.5 ? 'pending' : 'failed'),
            invoiceUrl: null,
            description: randomPlan.description
          };
          
          allPayments.push(payment);
        }
      }
    }
    
    // Clear existing payment history
    console.log('\n🧹 Clearing existing payment history...');
    await PaymentHistory.deleteMany({});
    
    // Insert all payments
    console.log(`\n💾 Inserting ${allPayments.length} payment records...`);
    const result = await PaymentHistory.insertMany(allPayments);
    
    console.log('✅ Payment history generated successfully!');
    console.log(`Added ${result.length} payment records`);
    
    // Display summary by user
    console.log('\n📊 Payment Summary by User:');
    for (const user of users) {
      const userPayments = await PaymentHistory.find({ userId: user._id }).sort({ createdDate: -1 });
      const totalAmount = userPayments.reduce((sum, payment) => sum + payment.amount, 0);
      
      console.log(`\n👤 ${user.name || user.email}:`);
      console.log(`   Total Payments: ${userPayments.length}`);
      console.log(`   Total Amount: $${totalAmount.toFixed(2)}`);
      console.log(`   Last Payment: ${userPayments.length > 0 ? userPayments[0].createdDate.toLocaleDateString() : 'N/A'}`);
      
      // Show recent payments
      userPayments.slice(0, 3).forEach((payment, index) => {
        console.log(`   ${index + 1}. ${payment.subscriptionName} - $${payment.amount} (${payment.status}) - ${payment.createdDate.toLocaleDateString()}`);
      });
    }
    
    // Show overall statistics
    const allPaymentsData = await PaymentHistory.find({}).sort({ createdDate: -1 });
    const totalAmount = allPaymentsData.reduce((sum, payment) => sum + payment.amount, 0);
    const successPayments = allPaymentsData.filter(p => p.status === 'success').length;
    const failedPayments = allPaymentsData.filter(p => p.status === 'failed').length;
    const pendingPayments = allPaymentsData.filter(p => p.status === 'pending').length;
    
    console.log('\n📈 Overall Statistics:');
    console.log(`   Total Payments: ${allPaymentsData.length}`);
    console.log(`   Total Amount: $${totalAmount.toFixed(2)}`);
    console.log(`   Successful: ${successPayments}`);
    console.log(`   Failed: ${failedPayments}`);
    console.log(`   Pending: ${pendingPayments}`);

  } catch (error) {
    console.error('❌ Error generating payment history:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script
generateRealisticPayments(); 