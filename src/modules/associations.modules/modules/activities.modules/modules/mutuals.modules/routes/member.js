export default [
   // -----------------  credit details  ------------------------//
   {
    path: '/association/my-activities/mutual/credit/details',
    name: 'association:my-activities:mutual:credit:details',
    component: () => import('../pages/page.detailCredit.vue'),
    meta: {
        breadcrumb: [
          { title: 'Home', url: '/association/home' },
          { title: 'Activities', i18n: 'activities', url: '/association/activities/my-activities'},
          { title: 'Epargne-Credit', i18n: 'EpargneCredit', url: '/association/activities/mutual/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/my-activities/mutual/details' },
            { title: 'Credit ', i18n: 'credit', active: true },
        ],
        pageTitle: 'credit',
        rule: 'editor',
        title: 'Credit details'
    }
  },
  // -----------------  Mutual details  ------------------------//
  {
    path: '/association/my-activities/mutual/details',
    name: 'association:my-activities:mutual:details',
    component: () => import('../pages/page.details.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/home' },
            { title: 'Activities', i18n: 'activities', url: '/association/activities/my-activities'},
            { title: 'Epargne-Credit', i18n: 'EpargneCredit', url: '/association/activities/mutual/all' },
            { title: 'Details ', i18n: 'detail', active: true },
        ],
        pageTitle: 'detail',
        rule: 'editor',
        title: 'Mutual details'
    }
  },

  // -----------------  All mutual activities  ------------------------//
  {
    path: '/association/activities/mutual/all',
    name: 'association:activities:mutual:all',
    component: () => import('../pages/page.list.vue'),
    meta: {
        //middleware: [isAdmin],
        breadcrumb: [
            { title: 'Home', url: '/association/home' },
            { title: 'Activities', i18n: 'activities', url: '/association/activities/my-activities'},
            { title: 'Epargne - Credit', i18n: 'EpargneCredit', active: true },
        ],
        pageTitle: 'EpargneCredit',
        rule: 'editor',
        title: 'Mutuals'
    }
  },

  // -----------------  Mutual activities transactions details  ------------------------//
  {
    path: '/association/activities/mutual/member-transactions',
    name: 'association:activities:mutual:member-transactions',
    component: () => import('../pages/page.membertransactions.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/home' },
            { title: 'Activities', i18n: 'activities', url: '/association/activities/my-activities'},
            { title: 'Epargne - Credit', i18n: 'EpargneCredit', url: '/association/activities/mutual/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/my-activities/mutual/details' },
            { title: 'Transactions', i18n: 'transactions', active: true }
        ],
        pageTitle: 'transactions',
        rule: 'isControler',
        title: 'Member transactions'
    }
  },

]
