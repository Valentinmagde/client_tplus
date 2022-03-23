export default [
  // -----------------  Tontine activities details  ------------------------//
  {
    path: '/association/my-activities/tontine/details',
    name: 'association:my-activities:tontine:details',
    component: () => import('../pages/page.details.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/home' },
            { title: 'Activities', i18n: 'activities', url: '/association/activities/my-activities'},
            { title: 'Tontines', i18n: 'tontine', url: '/association/activities/tontines/all' },
            { title: 'Details', i18n: 'detail', active: true },
        ],
        pageTitle: 'detail',
        rule: 'editor',
        title: 'Tontine details'
    }
  },

  // -----------------  All tontine activities  ------------------------//
  {
    path: '/association/activities/tontines/all',
    name: 'association:activities:tontine:all',
    component: () => import('../pages/page.list.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/home' },
            { title: 'Activities', i18n: 'activities', url: '/association/activities/my-activities'},
            { title: 'Tontines', i18n: 'tontine', active: true },
        ],
        pageTitle: 'tontine',
        rule: 'editor',
        title: 'Tontines'
    }
  },

  // -----------------  Tontine activities transactions details  ------------------------//
  {
    path: '/association/activities/tontine/member-transactions',
    name: 'association:activities:tontine:member-transactions',
    component: () => import('../pages/page.membertransactions.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/activities/my-activities'},
            { title: 'Tontines', i18n: 'tontine', url: '/association/activities/tontines/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/my-activities/tontine/details' },
            { title: 'Transactions', i18n: 'transactions', active: true }
        ],
        pageTitle: 'transactions',
        rule: 'isControler',
        title: 'Member transactions'
    }
  },
]
