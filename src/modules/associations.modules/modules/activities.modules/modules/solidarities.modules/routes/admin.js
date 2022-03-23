export default [
  // -----------------  Solidarity details  ------------------------//
  {
    path: '/association/administration/activities/solidarity/details',
    name: 'association:administration:activities:solidarity:details',
    component: () => import('../pages/page.details.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities'},
            { title: 'Solidarity', i18n: 'solidarity', url: '/association/administration/activities/solidarities/all' },
            { title: 'Details ', i18n: 'detail', active: true },
        ],
        pageTitle: 'detail',
        rule: 'isAdmin',
        title: 'Solidarity details'
    }
  },

  // -----------------  Solidarities transactions details  ------------------------//
  {
    path: '/association/administration/activities/solidarity/member-transactions',
    name: 'association:administration:activities:solidarity:member-transactions',
    component: () => import('../pages/page.membertransactions.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities'},
            { title: 'Solidarity', i18n: 'solidarity', url: '/association/administration/activities/solidarities/all'},
            { title: 'Details ', i18n: 'detail', url: '/association/administration/activities/solidarity/details'},
            { title: 'Transactions', i18n: 'transactions', active: true }
        ],
        pageTitle: 'transactions',
        rule: 'isAdmin',
        title: 'Member transactions'
    }
  },

  // -----------------  Craft a new solidarity ------------------------//
  {
    path: '/association/administration/activity/solidarity/create',
    name: 'association:administration:activity:solidarity:create',
    component: () => import('../pages/page.create.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            { title: 'New activity', i18n: 'newActivities', url: '/association/administration/activity/create', active: true },
            { title: 'Solidarity', i18n: 'solidarity', active: true },
        ],
        pageTitle: 'solidarity',
        rule: 'isAdmin',
        title: 'Create a solidarity'
    }
  },

  // -----------------  Edit a solidarity ------------------------//
  {
    path: '/association/administration/activity/solidarity/edit',
    name: 'association:administration:activity:solidarity:edit',
    component: () => import('../pages/page.create.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            { title: 'Solidarity', i18n: 'solidarity', url: '/association/administration/activities/solidarities/all'},
            { title: 'Solidarity', i18n: 'solidarity', active: true },
        ],
        pageTitle: 'solidarity',
        rule: 'isAdmin',
        title: 'Edit a solidarity'
    }
  },

  // -----------------  All solidarities  ------------------------//
  {
    path: '/association/administration/activities/solidarities/all',
    name: 'association:administration:activities:solidarities:all',
    component: () => import('../pages/page.list.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            { title: 'Solidarite', i18n: 'solidarity', active: true },
        ],
        pageTitle: 'solidarity',
        rule: 'isAdmin',
        title: 'Solidarities'
    }
  },

  // -----------------  Solidarity settlements  ------------------------ //
  {
    path: '/association/administration/activities/solidarity/settlements',
    name: 'association:administration:activities:solidarity:settlements',
    component: () => import('../pages/page.settlements.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            { title: 'Solidarite', i18n: 'solidarity', url: '/association/administration/activities/solidarity/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/administration/activities/solidarity/details' },
            { title: 'Settlement', i18n: 'settlement', active: true }
        ],
        pageTitle: 'settlement',
        rule: 'isAdmin',
        title: 'Solidarity settlements'
    }
  },



  // -----------------  Solidarity Debts  ------------------------ //
  {
    path: '/association/administration/activities/solidarity/debt',
    name: 'association:administration:activities:solidarity:debt',
    component: () => import('../pages/page.debt.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            { title: 'Solidarity', i18n: 'solidarity', url: '/association/administration/activities/solidarity/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/administration/activities/solidarity/details' },
            { title: 'Debt', i18n: 'debt', active: true }
        ],
        pageTitle: 'debt',
        rule: 'isAdmin',
        title: 'Solidarity debt'
    }
  },

  // -----------------  Solidarity assistances  ------------------------//
  {
    path: '/association/administration/activities/solidarity/assistance',
    name: 'association:administration:activities:solidarity:assistance',
    component: () => import('../pages/page.assists.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            { title: 'Solidarity', i18n: 'solidarity', url: '/association/administration/activities/solidarities/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/administration/activities/solidarity/details' },
            { title: 'Assistance', i18n: 'assistance', active: true }
        ],
        pageTitle: 'assistance',
        rule: 'isAdmin',
        title: 'Assistance management'
    },
  },

  // -----------------  Contribution request  ------------------------//
  {
    path: '/association/administration/activities/solidarity/ask-for-contribution',
    name: 'association:administration:activities:solidarity:ask-for-contribution',
    component: () => import('../pages/page.askforcontribution.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            { title: 'Solidarity', i18n: 'solidarity', url: '/association/administration/activities/solidarities/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/administration/activities/solidarity/details' },
            { title: 'Contribution', i18n: 'contribution', active: true }
        ],
        pageTitle: 'contribution',
        rule: 'isAdmin',
        title: 'Contribution request'
    }
  },
  // -----------------  Notes ------------------------//
  {
    path: '/association/administration/activities/solidarity/notes',
    name: 'association:administration:activities:solidarity:notes',
    component: () => import('../pages/page.notes.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities'  },
            { title: 'Solidarity', i18n: 'solidarity', url: '/association/administration/activities/solidarities/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/administration/activities/solidarity/details' },
            { title: 'Notes', i18n: 'notes', active: true }
        ],
        pageTitle: 'notes',
        rule: 'isAdmin',
        title: 'Notes request'
    }
  },
]
