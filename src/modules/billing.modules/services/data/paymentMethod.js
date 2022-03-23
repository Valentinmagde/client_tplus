export const paymentMethod = [
    {
        text: "PayPal",
        value: "paypal",
        avatar: require('@/assets/images/pages/payment/payment-paypal.svg'),
        image: "",
    },
    {
        text: "creditOrDebitCard",
        value: "stripe",
        avatar: require('@/assets/images/pages/payment/credit-card.svg'),
        image: require('@/assets/images/pages/payment/credit-cards.jpg'),
    },
    {
      text: "mobileTransfer",
      value: "mobile",
      avatar: require('@/assets/images/pages/payment/smartphone-pay-dollar-1.svg'),
      image: require('@/assets/images/pages/payment/mobile-money.jpg'),
      subItems: [
        {
          text: "Orange Money",
          value: "orange money",
          slug: "om",
          number: "+237 659 432 881"
        },
        {
          text: "MTN Mobile Money",
          value: "mobile money",
          number: "+237 676 055 070"
        }
      ]
    }
]
