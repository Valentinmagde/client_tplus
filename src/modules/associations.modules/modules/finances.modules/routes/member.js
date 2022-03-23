export default [
  // -----------------  Association finances  ------------------------//
    {
      path: '/association/finances',
      name: 'association:finances',
      component: () => import('../pages/member/page.operations.vue'),
      meta: {
          breadcrumb: [
              { title: 'Home', url: '/association/home' },
              { title: 'Finances', i18n: 'finances', active: true },
          ],
          pageTitle: 'finances',
          rule: 'editor',
          title: 'My finances',
      },
    },

    // -----------------  Finances - Payment  ------------------------//
    {
      path: '/association/finances/payment',
      name: 'association:finance:payment',
      component: () => import('../pages/member/page.newpayment.vue'),
      meta: {
          breadcrumb: [
              { title: 'Home', url: '/association/home' },
              { title: 'Finances', i18n: 'finances', url: '/association/finances'},
              { title: 'Payment', i18n: 'payment', active: true},
          ],
          pageTitle: 'finances',
          rule: 'editor',
          title: 'New financial operation'
      }
    },

    //Finance - Editer - Operation - Membre
    {
        path: '/association/finances/payment/edit/:opId',
        name: 'association:finance:payment:edit',
        component: () => import('../pages/member/page.editoperation.vue'),
        meta: {
            breadcrumb: [
                { title: 'Home', url: '/association/home' },
                { title: 'Finances', i18n: 'finances', url: '/association/finance'},
                { title: 'Edit', i18n: 'update', active: true },
            ],
            pageTitle: 'finances',
            rule: 'editor'
        }
    },

    //  -------------------- Settlements --------------------- //
    {
      path: '/association/finances/settlements',
      name: 'association:finances:settlements',
      component: () => import('../pages/member/page.settlements.vue'),
      meta: {
          breadcrumb: [
              { title: 'Home', url: '/association/home' },
              { title: 'My Finances', i18n: 'finances', url: '/association/finances'},
              { title: 'Settlement', i18n: 'settlement', active: true }
          ],
          pageTitle: 'finances',
          rule: 'editor',
          title: 'My settlements'
      }
    },

    // -----------------  Finances - Transfer  ------------------------//
    {
      path: '/association/finances/transfer',
      name: 'association:finances:transfer',
      component: () => import('../pages/member/page.transfer.vue'),
      meta: {
          breadcrumb: [
              { title: 'Home', url: '/association/home' },
              { title: 'Finances', i18n: 'finances', url: '/association/finances'},
              { title: 'Transfer', i18n: 'transfer', active: true},
          ],
          pageTitle: 'finances',
          rule: 'editor',
          title: 'Transfer funds'
      }
    },

    // -----------------  Finances - Histories  ------------------------//
    {
      path: '/association/finances/histories',
      name: 'association:finances:histories',
      component: () => import('../pages/member/page.histories.vue'),
      meta: {
          breadcrumb: [
              { title: 'Home', url: '/association/home' },
              { title: 'Finances', i18n: 'finances', url: '/association/finances'},
              { title: 'Histories', i18n: 'history', active: true},
          ],
          pageTitle: 'finances',
          rule: 'editor',
          title: 'Transfer funds'
      }
    },


    // -----------------  Payments details  ------------------------//
    {
      path: '/association/my-payments',
      name: 'association:my-payments',
      component: () => import('../pages/member/page.payments.vue'),
      meta: {
          breadcrumb: [
              { title: 'Home', url: '/association/home' },
              { title: 'Payment', i18n: 'paymentDetail', active: true }
          ],
          pageTitle: 'payment',
          rule: 'editor',
          title: 'My payments'
      }
    },

    // -----------------  Disbursements details  ------------------------//
    {
      path: '/association/my-disbursements',
      name: 'association:my-disbursements',
      component: () => import('../pages/member/page.disbursements.vue'),
      meta: {
          breadcrumb: [
              { title: 'Home', url: '/association/home' },
              { title: 'Disbursement', i18n: 'disbursementDetail', active: true }
          ],
          pageTitle: 'disbursement',
          rule: 'editor',
          title: 'My disbursements',
      }
    },

  ]
