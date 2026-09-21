const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_XXXXXXXXXXXXXXXX'
const REPORT_PRICE = 100

export const initiateReportPayment = ({ toolName, officerName, officerEmail, onSuccess, onFailure }) => {
  if (!window.Razorpay) {
    onFailure && onFailure('Razorpay SDK not loaded. Please refresh and try again.')
    return
  }

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: REPORT_PRICE * 100,
    currency: 'INR',
    name: 'Cyber Rakhwala',
    description: `Intelligence Report — ${toolName}`,
    handler: function (response) {
      onSuccess({
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id || '',
        signature: response.razorpay_signature || '',
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
        onFailure && onFailure('Payment cancelled')
      },
      animation: true,
    }
  }

  const rzp = new window.Razorpay(options)
  rzp.on('payment.failed', function (response) {
    onFailure && onFailure(response.error.description || 'Payment failed')
  })
  rzp.open()
}