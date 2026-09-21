// Razorpay Payment Gateway Integration
// Replace RAZORPAY_KEY_ID with actual key from client

const RAZORPAY_KEY_ID = 'rzp_live_XXXXXXXXXXXXXXXX' // Client key here
const REPORT_PRICE = 100 // ₹100 per report

export const initiateReportPayment = ({ toolName, officerName, officerEmail, onSuccess, onFailure }) => {
  const options = {
    key: RAZORPAY_KEY_ID,
    amount: REPORT_PRICE * 100, // in paise
    currency: 'INR',
    name: 'Cyber Rakhwala',
    description: `Intelligence Report — ${toolName}`,
    image: '/logo.png',
    handler: function (response) {
      // Payment successful
      console.log('Payment success:', response)
      onSuccess({
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature,
      })
    },
    prefill: {
      name: officerName || 'Officer',
      email: officerEmail || '',
    },
    notes: {
      tool: toolName,
      platform: 'Cyber Rakhwala',
    },
    theme: {
      color: '#2563eb',
    },
    modal: {
      ondismiss: function () {
        onFailure && onFailure('Payment cancelled by user')
      }
    }
  }

  const rzp = new window.Razorpay(options)
  rzp.on('payment.failed', function (response) {
    console.error('Payment failed:', response.error)
    onFailure && onFailure(response.error.description)
  })
  rzp.open()
}