export default [
  // -----------------  Tontine activities details  ------------------------//
  {
    path: '/association/administration/activities/tontine/details',
    name: 'association:administration:activities:tontine:details',
    component: () => import('../pages/page.details.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities'},
            { title: 'Tontines', i18n: 'tontine', url: '/association/administration/activities/tontines/all' },
            { title: 'Details', i18n: 'detail', active: true },
        ],
        pageTitle: 'detail',
        rule: 'isAdmin',
        title: 'Tontine details'
    }
  },

  // -----------------  All tontine activities  ------------------------//
  {
    path: '/association/administration/activities/tontines/all',
    name: 'association:administration:activities:tontines:all',
    component: () => import('../pages/page.list.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities'},
            { title: 'Tontines', i18n: 'tontine', active: true },
        ],
        pageTitle: 'tontine',
        rule: 'isAdmin',
        title: 'Tontines'
    }
  },

  // -----------------  Tontine activities transactions details  ------------------------//
  {
    path: '/association/administration/activities/tontine/member-transactions',
    name: 'association:administration:activities:tontine:member-transactions',
    component: () => import('../pages/page.membertransactions.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities'},
            { title: 'Tontines', i18n: 'tontine', url: '/association/administration/activities/tontines/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/administration/activities/tontine/details' },
            { title: 'Transactions', i18n: 'transactions', active: true }
        ],
        pageTitle: 'transactions',
        rule: 'isAdmin',
        title: 'Tontine transactions'
    }
  },

  // -----------------  Craft a new tontine activity ------------------------//
  {
    path: '/association/administration/activity/tontine/create',
    name: 'association:administration:activity:tontine:create',
    component: () => import('../pages/page.create.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            { title: 'New activity', i18n: 'newActivities', url: '/association/administration/activity/create', active: true },
            { title: 'Tontine activities', i18n: 'tontine', active: true },
        ],
        pageTitle: 'tontine',
        rule: 'isAdmin',
        title: 'Create a tontine'
    }
  },

  // -----------------  Edit tontine activity ------------------------//
  {
    path: '/association/administration/activity/tontine/edit',
    name: 'association:administration:activity:tontine:edit',
    component: () => import('../pages/page.create.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities'},
            { title: 'Tontines', i18n: 'tontine', url: '/association/administration/activities/tontines/all' },
            { title: 'Tontine activities', i18n: 'tontine', active: true },
        ],
        pageTitle: 'tontine',
        rule: 'isAdmin',
        title: 'Edit a tontine'
    }
  },

  // -----------------  Tontine settlements ------------------------//
  {
    path: '/association/administration/activities/tontine/settlements',
    name: 'association:administration:activities:tontine:settlements',
    component: () => import('../pages/page.settlements.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            { title: 'Tontines', i18n: 'tontine', url: '/association/administration/activities/tontines/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/administration/activities/tontine/details' },
            { title: 'Settlement', i18n: 'settlement', active: true }
        ],
        pageTitle: 'settlement',
        rule: 'isAdmin',
        title: 'Tontine settlements'
    }
  },



  // -----------------  Tontine Debts  ------------------------ //
  {
    path: '/association/administration/activities/tontine/debt',
    name: 'association:administration:activities:tontine:debt',
    component: () => import('../pages/page.debt.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            { title: 'Tontines', i18n: 'tontine', url: '/association/administration/activities/tontines/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/administration/activities/tontine/details' },
            { title: 'Debt', i18n: 'debt', active: true }
        ],
        pageTitle: 'debt',
        rule: 'isAdmin',
        title: 'Tontine debt'
    }
  },

  // -----------------  Ask for contributions ------------------------//
  {
    path: '/association/administration/activities/tontine/ask-for-contribution',
    name: 'association:administration:activities:tontine:ask-for-contribution',
    component: () => import('../pages/page.askforcontribution.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities'  },
            { title: 'Tontines', i18n: 'tontine', url: '/association/administration/activities/tontines/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/administration/activities/tontine/details' },
            { title: 'Contribution', i18n: 'contribution', active: true }
        ],
        pageTitle: 'contribution',
        rule: 'isAdmin',
        title: 'Contribution request'
    }
  },

  // -----------------  Notes ------------------------//
  {
    path: '/association/administration/activities/tontine/notes',
    name: 'association:administration:activities:tontine:notes',
    component: () => import('../pages/page.notes.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities'  },
            { title: 'Tontines', i18n: 'tontine', url: '/association/administration/activities/tontines/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/administration/activities/tontine/details' },
            { title: 'Notes', i18n: 'notes', active: true }
        ],
        pageTitle: 'notes',
        rule: 'isAdmin',
        title: 'Notes request'
    }
  },
]
