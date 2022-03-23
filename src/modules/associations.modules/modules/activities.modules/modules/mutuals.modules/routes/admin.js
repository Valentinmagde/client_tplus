export default [
  // -----------------  credit details  ------------------------//
  {
    path: '/association/administration/activities/mutual/credit/details',
    name: 'association:administration:activities:mutual:credit:details',
    component: () => import('../pages/page.detailCredit.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities'},
            { title: 'Epargne-Credit', i18n: 'EpargneCredit', url: '/association/administration/activities/mutual/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/administration/activities/mutual/details' },
            { title: 'Credit ', i18n: 'credit', active: true },
        ],
        pageTitle: 'credit',
        rule: 'isAdmin',
        title: 'Credit details'
    }
  },

  // -----------------  Mutual details  ------------------------//
  {
    path: '/association/administration/activities/mutual/details',
    name: 'association:administration:activities:mutual:details',
    component: () => import('../pages/page.details.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities'},
            { title: 'Epargne-Credit', i18n: 'EpargneCredit', url: '/association/administration/activities/mutual/all' },
            { title: 'Details ', i18n: 'detail', active: true },
        ],
        pageTitle: 'detail',
        rule: 'isAdmin',
        title: 'Mutual details'
    }
  },

  // -----------------  Mutual activities transactions details  ------------------------//
  {
    path: '/association/administration/activities/mutual/member-transactions',
    name: 'association:administration:activities:mutual:member-transactions',
    component: () => import('../pages/page.membertransactions.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities'},
            { title: 'Epargne - Credit', i18n: 'EpargneCredit', url: '/association/administration/activities/mutual/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/administration/activities/mutual/details' },
            { title: 'Transactions', i18n: 'transactions', active: true }
        ],
        pageTitle: 'transactions',
        rule: 'isAdmin',
        title: 'Member transactions'
    }
  },

  // -----------------  All mutual activities  ------------------------ //
  {
    path: '/association/administration/activities/mutual/all',
    name: 'association:administration:activities:mutual:all',
    component: () => import('../pages/page.list.vue'),
    meta: {
        //middleware: [isAdmin],
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities'},
            { title: 'Epargne - Credit', i18n: 'EpargneCredit', active: true },
        ],
        pageTitle: 'EpargneCredit',
        rule: 'isAdmin',
        title: 'Mutuals'
    }
  },

  // -----------------  Craft a new mutual  ------------------------ //
  {
    path: '/association/administration/activity/mutual/create',
    name: 'association:administration:activity:mutual:create',
    component: () => import('../pages/page.create.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities' , url: '/association/administration/activities'},
            { title: 'New activity', i18n: 'newActivities', url: '/association/administration/activity/create', active: true },
            { title: 'Epargne et Credit', i18n: 'EpargneCredit', active: true },
        ],
        pageTitle: 'EpargneCredit',
        rule: 'isAdmin',
        title: 'Craft a new mutual activity'
    },
  },

  // -----------------  Edit a mutual  ------------------------ //
  {
    path: '/association/administration/activity/mutual/edit',
    name: 'association:administration:activity:mutual:edit',
    component: () => import('../pages/page.create.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities' , url: '/association/administration/activities'},
            { title: 'Epargne - Credit', i18n: 'EpargneCredit', url: '/association/administration/activities/mutual/all' },
            { title: 'Epargne et Credit', i18n: 'EpargneCredit', active: true },
        ],
        pageTitle: 'EpargneCredit',
        rule: 'isAdmin',
        title: 'Edit a mutual'
    },
  },

  // -----------------  Mutual settlements  ------------------------ //
  {
    path: '/association/administration/activities/mutual/settlements',
    name: 'association:administration:activities:mutual:settlements',
    component: () => import('../pages/page.settlements.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            { title: 'Epargne - Credit', i18n: 'EpargneCredit', url: '/association/administration/activities/mutual/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/administration/activities/mutual/details' },
            { title: 'Settlement', i18n: 'settlement', active: true }
        ],
        pageTitle: 'settlement',
        rule: 'isAdmin',
        title: 'Mutual settlements'
    }
  },

  // -----------------  Mutual Debts  ------------------------ //
  {
    path: '/association/administration/activities/mutual/debt',
    name: 'association:administration:activities:mutual:debt',
    component: () => import('../pages/page.debt.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            { title: 'Epargne - Credit', i18n: 'EpargneCredit', url: '/association/administration/activities/mutual/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/administration/activities/mutual/details' },
            { title: 'Debt', i18n: 'debt', active: true }
        ],
        pageTitle: 'debt',
        rule: 'isAdmin',
        title: 'Mutual debt'
    }
  },

  // -----------------  Fundings edition  ------------------------ //
  {
    path: '/association/administration/activities/mutual/fundings',
    name: 'association:administration:activities:mutual:fundings',
    component: () => import('../pages/page.fundings.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            { title: 'Epargne - Credit', i18n: 'EpargneCredit', url: '/association/administration/activities/mutual/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/administration/activities/mutual/details' },
            { title: 'Mise de fonds', i18n: 'downPayment', active: true }
        ],
        pageTitle: 'downPayment',
        rule: 'isAdmin',
        title: 'Fundings'
    }
  },

  // -----------------  Funding request  ------------------------ //
  {
    path: '/association/administration/activities/mutual/funding-request',
    name: 'association:administration:activities:mutual:funding-request',
    component: () => import('../pages/page.requestfunding.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            { title: 'Epargne - Credit', i18n: 'EpargneCredit', url: '/association/administration/activities/mutual/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/administration/activities/mutual/details' },
            { title: 'Down payment', i18n: 'downPayment', active: true }
        ],
        pageTitle: 'downPayment',
        rule: 'isAdmin',
        title: 'Funding request'
    }
  },

  // -----------------  Ask for contributions ------------------------//
  {
    path: '/association/administration/activities/mutual/ask-for-contribution',
    name: 'association:administration:activities:mutual:ask-for-contribution',
    component: () => import('../pages/page.askforcontribution.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities'  },
            { title: 'Epargne - Credit', i18n: 'EpargneCredit', url: '/association/administration/activities/mutual/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/administration/activities/mutual/details' },
            { title: 'Contribution', i18n: 'contribution', active: true }
        ],
        pageTitle: 'contribution',
        rule: 'isAdmin',
        title: 'Contribution request'
    },
  },
  // -----------------  Notes ------------------------//
  {
    path: '/association/administration/activities/mutual/notes',
    name: 'association:administration:activities:mutual:notes',
    component: () => import('../pages/page.notes.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities'  },
            { title: 'Epargne - Credit', i18n: 'EpargneCredit', url: '/association/administration/activities/mutual/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/administration/activities/mutual/details' },
            { title: 'Notes', i18n: 'notes', active: true }
        ],
        pageTitle: 'notes',
        rule: 'isAdmin',
        title: 'Notes request'
    }
  },
]
