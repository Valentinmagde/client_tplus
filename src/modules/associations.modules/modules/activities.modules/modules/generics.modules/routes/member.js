export default [

  // -----------------  Generic activities details  ------------------------//
  {
    path: '/association/my-activities/generic/details',
    name: 'association:my-activities:generic:details',
    component: () => import('../pages/page.details.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/home' },
            { title: 'Activities', i18n: 'activities', url: '/association/activities/my-activities'},
            { title: 'Generic', i18n: 'generique', url: '/association/activities/generic/all' },
            { title: 'Details ', i18n: 'detail', active: true },
        ],
        pageTitle: 'detail',
        rule: 'editor',
        title: 'Activity details'
    }
  },

  // -----------------  Generic activities transactions details  ------------------------//
  {
    path: '/association/activities/generic/member-transactions',
    name: 'association:activities:generic:member-transactions',
    component: () => import('../pages/page.membertransactions.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/home' },
            { title: 'Activities', i18n: 'activities', url: '/association/activities/my-activities'},
            { title: 'Generic', i18n: 'generique', url: '/association/activities/generic/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/my-activities/generic/details' },
            { title: 'Transactions', i18n: 'transactions', active: true }
        ],
        pageTitle: 'transactions',
        rule: 'isControler',
        title: 'Member\'s transactions'
    }
  },

  // -----------------  All generic activities  ------------------------//
  {
    path: '/association/activities/generic/all',
    name: 'association:activities:generic:all',
    component: () => import('../pages/page.list.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/home' },
            { title: 'Activities', i18n: 'activities', url: '/association/activities/my-activities'},
            { title: 'Generic', i18n: 'generique', active: true },
        ],
        pageTitle: 'genericActivities',
        rule: 'editor',
        title: 'Generic activities'
    }
  },
]
