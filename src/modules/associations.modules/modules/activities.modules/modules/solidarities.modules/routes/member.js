export default [
  // -----------------  Solidarity details  ------------------------//
  {
    path: '/association/my-activities/solidarity/details',
    name: 'association:my-activities:solidarity:details',
    component: () => import('../pages/page.details.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/home' },
            { title: 'Activities', i18n: 'activities', url: '/association/activities/my-activities'},
            { title: 'Solidarity', i18n: 'solidarity', url: '/association/activities/solidarity/all' },
            { title: 'Details ', i18n: 'detail', active: true },
        ],
        pageTitle: 'detail',
        rule: 'editor',
        title: 'Solidarity details'
    }
  },

  // -----------------  All solidarities  ------------------------//
  {
    path: '/association/activities/solidarity/all',
    name: 'association:activities:solidarity:all',
    component: () => import('../pages/page.list.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/home'},
            { title: 'Activities', i18n: 'activities', url: '/association/activities/my-activities'},
            { title: 'Solidarite', i18n: 'solidarity', active: true },
        ],
        pageTitle: 'solidarity',
        rule: 'editor',
        title: 'Solidarities'
    }
  },

  // -----------------  Solidarities transactions details  ------------------------//
  {
    path: '/association/activities/solidarity/member-transactions',
    name: 'association:activities:solidarity:member-transactions',
    component: () => import('../pages/page.membertransactions.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/home' },
            { title: 'Activities', i18n: 'activities', url: '/association/activities/my-activities'},
            { title: 'Solidarity', i18n: 'solidarity', url: '/association/activities/solidarity/all'},
            { title: 'Details ', i18n: 'detail', url: '/association/my-activities/solidarity/details'},
            { title: 'Transactions', i18n: 'transactions', active: true }
        ],
        pageTitle: 'transactions',
        rule: 'isControler',
        title: 'Member transactions'
    }
  },
]
