export default [
  // -------------- Finances - Ask for contribution-------------- //
  {
    path: '/association/administration/finances/contribution',
    name: 'association:administration:finances:contribution',
    component: () => import('../pages/administration/page.askforcontribution.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Finances', i18n: 'finances' },
            { title: 'Contribution', i18n: 'Contribution', active: true},
        ],
        pageTitle: 'Contribution',
        rule: 'isControler'
    }
  },

  // -------------- Finances - Overview -------------- //
  {
    path: '/association/administration/finances/overview',
    name: 'association:administration:finances:overview',
    component: () => import('../pages/administration/page.overview.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Finances', i18n: 'finances' },
            { title: 'Overview', i18n: 'overview', active: true},
        ],
        pageTitle: 'finances',
        rule: 'isControler'
    }
  },

  // -------------- Finances - Overview - Situation Financière -------------- //
  {
    path: '/association/administration/finances/overview/details',
    name: 'association:administration:finances:overview:details',
    component: () => import('../pages/administration/page.financialsituation.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Finances', i18n: 'finances' },
            { title: 'Overview', i18n: 'overview', url: '/association/administration/finances/overview'},
            { title: 'Details', i18n: 'detail', active: true},
        ],
        pageTitle: 'detail',
        rule: 'isControler'
    }
  },

  // -------------- Finances - Treasury -------------- //
  {
    path: '/association/administration/finances/treasury',
    name: 'association:administration:finances:treasury',
    component: () => import('../pages/administration/page.treasury.vue'),
    meta: {
      breadcrumb: [
       { title: 'Home', url: '/association/administration' },
       { title: 'Finances', i18n: 'finances' },
       { title: 'Operation', i18n: 'operations', url: '/association/administration/finances/operations'},
       { title: 'Treasury', i18n: 'treasury', active: true},
    ],
    pageTitle: 'treasury',
    rule: 'isControler',
    title: 'Treasury state'
    }
  },

  // -------------- Finances - Treasury - Pending financial operations -------------- //
  {
    path: '/association/administration/finances/operations',
    name: 'association:administration:finances:operations',
    component: () => import('../pages/administration/page.operations.vue'),
    meta: {
      breadcrumb: [
        { title: 'Home', url: '/association/administration' },
        { title: 'Finances', i18n: 'finances' },
        { title: 'Operation', i18n: 'operations', active: true},
      ],
      pageTitle: 'operations',
      rule: 'isFinancial',
      title: 'Operations'
    }
  },

  // -------------- Finances - Create payment -------------- //
  {
    path: '/association/administration/finances/payment',
    name: 'association:administration:finances:payment',
    component: () => import('../pages/administration/page.newpayment.vue'),
    meta: {
      breadcrumb: [
        { title: 'Home', url: '/association/administration' },
        { title: 'Finances', i18n: 'finances' },
        { title: 'Operation', i18n: 'operations', url: '/association/administration/finances/operations'},
        { title: 'Payment', i18n: 'payment', active: true},
      ],
      pageTitle: 'payment',
      rule: 'isFinancial',
      title: 'New payment'
    }
  },

  // -------------- Finances - History -------------- //
  {
    path: '/association/administration/finances/history',
    name: 'association:administration:finances:history',
    component: () => import('../pages/administration/page.history.vue'),
    meta: {
      breadcrumb: [
        { title: 'Home', url: '/association/administration' },
        { title: 'Finances', i18n: 'finances' },
        { title: 'Operation', i18n: 'operations', url: '/association/administration/finances/operations'},
        { title: 'Historical', i18n: 'historical', active: true},
      ],
      pageTitle: 'historical',
      rule: 'isControler',
      title: 'Operations history'
    }
  },

  // -------------- Finances - Settlements -------------- //
  {
    path: '/association/administration/finances/settlements',
    name: 'association:administration:finances:settlements',
    component: () => import('../pages/administration/page.settlements.vue'),
    meta: {
      breadcrumb: [
        { title: 'Home', url: '/association/administration' },
        { title: 'Finances', i18n: 'finances' },
        { title: 'Operation', i18n: 'operations', url: '/association/administration/finances/operations'},
        { title: 'Echeances', i18n: 'settlement', active: true},
      ],
      pageTitle: 'settlement',
      rule: 'isControler',
      title: 'Settlements'
    }
  },

  // -------------- Finances - debs -------------- //
  {
    path: '/association/administration/finances/debt',
    name: 'association:administration:finances:debt',
    component: () => import('../pages/administration/page.debt.vue'),
    meta: {
      breadcrumb: [
        { title: 'Home', url: '/association/administration' },
        { title: 'Finances', i18n: 'finances' },
        { title: 'Operation', i18n: 'operations', url: '/association/administration/finances/operations'},
        { title: 'Impayes', i18n: 'debt', active: true},
      ],
      pageTitle: 'debt',
      rule: 'isControler',
      title: 'Debts'
    }
  },

  // -------------- Finances - Exit vouchers management -------------- //
  {
    path: '/association/administration/finances/exit-vouchers',
    name: 'association:administration:finances:exit-vouchers',
    component: () => import('../pages/administration/page.exitvouchers.vue'),
    meta: {
      breadcrumb: [
        { title: 'Home', url: '/association/administration' },
        { title: 'Finances', i18n: 'finances' },
        { title: 'Operation', i18n: 'operations', url: '/association/administration/finances/operations'},
        { title: 'Exit vouchers', i18n: 'exitVouchers', active: true},
      ],
      pageTitle: 'exitVouchers',
      rule: 'isAdmin',
      title: 'Exit vouchers'
    }
  },

  // -------------- Finances - New voucher -------------- //
  {
    path: '/association/administration/finances/new-voucher',
    name: 'association:administration:finances:new-voucher',
    component: () => import('../pages/administration/page.newvoucher.vue'),
    meta: {
      breadcrumb: [
        { title: 'Home', url: '/association/administration' },
        { title: 'Finances', i18n: 'finances' },
        { title: 'Exit vouchers', i18n: 'exitVouchers', url: '/association/administration/finances/exit-vouchers'},
        { title: 'New voucher', i18n: 'newVoucher', active: true},
      ],
      pageTitle: 'exitVouchers',
      rule: 'isAdmin',
      title: 'New voucher'
    }
  },

  // -------------- Finances - Withdrawal -------------- //
  {
    path: '/association/administration/finances/withdrawal',
    name: 'association:administration:finances:withdrawal',
    component: () => import('../pages/administration/page.withdrawal.vue'),
    meta: {
      breadcrumb: [
        { title: 'Home', url: '/association/administration' },
        { title: 'Finances', i18n: 'finances' },
        { title: 'Operation', i18n: 'operations', url: '/association/administration/finances/operations'},
        { title: 'Withdrawal',i18n: 'withdrawal', active: true},
      ],
      pageTitle: 'withdrawal',
      rule: 'isFinancial',
      title: 'Withdrawal'
    }
  },

  // -------------- Finances - Session payments -------------- //
  {
    path: '/association/administration/finances/session-payment',
    name: 'association:administration:finances:session-payment',
    component: () => import('../pages/administration/page.sessionpayment.vue'),
      meta: {
        breadcrumb: [
          { title: 'Home', url: '/association/administration' },
          { title: 'Finances', i18n: 'finances' },
          { title: 'Operation', i18n: 'operations', url: '/association/administration/finances/operations'},
          { title: 'Session Payment', i18n: 'sessionPayments', active: true},
        ],
        pageTitle: 'sessionPayments',
        rule: 'isFinancial',
        title: 'Session payment'
      }
  },

  // -------------- Finances - Move funds -------------- //
  {
    path: '/association/administration/finances/transfer',
    name: 'association:administration:finances:transfer',
    component: () => import('../pages/administration/page.transfer.vue'),
      meta: {
        breadcrumb: [
          { title: 'Home', url: '/association/administration' },
          { title: 'Finances', i18n: 'finances' },
          { title: 'Operation', i18n: 'operations', url: '/association/administration/finances/operations'},
          { title: 'Transfer', i18n: 'transfer', active: true},
        ],
        pageTitle: 'transfer',
        rule: 'isFinancial',
        title: 'Transfer'
      }
  },

  // -------------- Finances - Validate operation -------------- //
  {
    path: '/association/administration/finances/validate-operation',
    name: 'association:administration:finances:validate-operation',
    component: () => import('../pages/administration/page.validateoperation.vue'),
    meta: {
      breadcrumb: [
        { title: 'Home', url: '/association/administration' },
        { title: 'Finances', i18n: 'finances' },
        { title: 'Operation', i18n: 'operations', url: '/association/administration/finances/operations'},
        { title: 'Validate', i18n: 'validate', active: true},
      ],
      pageTitle: 'validate',
      rule: 'isFinancial',
      title: 'Validate operation'
    }
  },

  // -----------------  Payments details  ------------------------//
  {
    path: '/association/administration/payments',
    name: 'association:administration:payments',
    component: () => import('../pages/administration/page.payments.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Payment', i18n: 'paymentDetail', active: true }
        ],
        pageTitle: 'paymentDetail',
        rule: 'isControler',
        title: 'Payments'
    }
  },

  // -----------------  Disbursements details  ------------------------//
  {
    path: '/association/administration/disbursements',
    name: 'association:administration:disbursements',
    component: () => import('../pages/administration/page.disbursements.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Disbursement', i18n: 'disbursementDetail', active: true }
        ],
        pageTitle: 'disbursement',
        rule: 'isControler',
        title: 'Disbursements',
    }
  },
]
