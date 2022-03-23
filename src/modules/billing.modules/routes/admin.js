export default [

  // --------------------- Bill list ----------------------//
  {
    path: '/association/administration/bills',
    name: 'association:administration:bills',
    component: () => import('../pages/page.bills.vue'),
    meta: {
      breadcrumb: [
        { title: 'Home', url: '/association/administration' },
        { title: 'Billing', i18n: 'billing', active: true },
      ],
      pageTitle: 'billing',
      rule: 'isAdmin',
      title: 'Billing'
    }
  },

  // --------------------- Bill details ----------------------//
  {
    path: '/association/administration/bill/details',
    name: 'association:administration:billing:details',
    component: () => import('../pages/page.details.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Billing', i18n: 'billing', url: '/association/administration/bills' },
            { title: 'Bill', i18n: 'bill', active: true },
        ],
        pageTitle: 'billing',
        rule: 'isAdmin',
        title: 'Bill details'
    },
  },

  // --------------------- Pay ----------------------//
  {
    path: '/association/administration/billing/pay',
    name: 'association:administration:billing:pay',
    component: () => import('../pages/page.pay.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Billing', i18n: 'billing', url: '/association/administration/bills' },
            { title: 'Bill', i18n: 'bill', url: '/association/administration/bill/details' },
            { title: 'Pay', i18n: 'pay', active: true},
        ],
        pageTitle: 'pay',
        rule: 'isAdmin',
        title: 'Pay'
    },
  }
]
