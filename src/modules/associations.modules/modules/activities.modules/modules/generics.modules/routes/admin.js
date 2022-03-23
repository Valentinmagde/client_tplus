export default [
  // -----------------  Generic activities details  ------------------------//
  {
    path: '/association/administration/activities/generic/details',
    name: 'association:administration:activities:generic:details',
    component: () => import('../pages/page.details.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities'},
            { title: 'Generic', i18n: 'generique', url: '/association/administration/activities/generic/all' },
            { title: 'Details ', i18n: 'detail', active: true },
        ],
        pageTitle: 'detail',
        rule: 'isAdmin',
        title: 'Activity details'
    }
  },

  // -----------------  Generic activities transactions details  ------------------------//
  {
    path: '/association/administration/activities/generic/member-transactions',
    name: 'association:administration:activities:generic:member-transactions',
    component: () => import('../pages/page.membertransactions.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities'},
            { title: 'Generic', i18n: 'generique', url: '/association/administration/activities/generic/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/administration/activities/generic/details' },
            { title: 'Transactions', i18n: 'transactions', active: true }
        ],
        pageTitle: 'transactions',
        rule: 'isAdmin',
        title: 'Member\'s transactions'
    }
  },

  // -----------------  Craft a new generic activity ------------------------//
  {
    path: '/association/administration/activity/generic/create',
    name: 'association:administration:activity:generic:create',
    component: () => import('../pages/page.create.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            { title: 'New activity', i18n: 'newActivities', url: '/association/administration/activity/create', active: true },
            { title: 'Generic activities', i18n: 'genericActivities', active: true },
        ],
        pageTitle: 'genericActivities',
        rule: 'isAdmin',
        title: 'Create generic activity'
    }
  },

  // -----------------  Edit generic activity ------------------------//
  {
    path: '/association/administration/activity/generic/edit',
    name: 'association:administration:activity:generic:edit',
    component: () => import('../pages/page.create.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            { title: 'Generic', i18n: 'generique', url: '/association/administration/activities/generic/all' },
            { title: 'Generic activities', i18n: 'genericActivities', active: true },
        ],
        pageTitle: 'genericActivities',
        rule: 'isAdmin',
        title: 'Edit a generic activity'
    }
  },

  // -----------------  All generic activities  ------------------------//
  {
    path: '/association/administration/activities/generic/all',
    name: 'association:administration:activities:generic:all',
    component: () => import('../pages/page.list.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities'},
            { title: 'Generic', i18n: 'generique', active: true },
        ],
        pageTitle: 'genericActivities',
        rule: 'isAdmin',
        title: 'Generic activities'
    }
  },

  // -----------------  Generic activity settlements ------------------------//
  {
    path: '/association/administration/activities/generic/settlements',
    name: 'association:administration:activities:generic:settlements',
    component: () => import('../pages/page.settlements.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            { title: 'Generic', i18n: 'generique', url: '/association/administration/activities/generic/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/administration/activities/generic/details' },
            { title: 'Settlement', i18n: 'settlement', active: true }
        ],
        pageTitle: 'settlement',
        rule: 'isAdmin',
        title: 'Generic activity\'s settlements'
    }
  },



  // -----------------  generic Debts  ------------------------ //
  {
    path: '/association/administration/activities/generic/debt',
    name: 'association:administration:activities:generic:debt',
    component: () => import('../pages/page.debt.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            { title: 'Generic', i18n: 'generique', url: '/association/administration/activities/generic/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/administration/activities/generic/details' },
            { title: 'Debt', i18n: 'debt', active: true }
        ],
        pageTitle: 'debt',
        rule: 'isAdmin',
        title: 'Generic debt'
    }
  },

  // -----------------  Generic activity disbursement ------------------------//
  {
    path: '/association/administration/activities/generic/disbursement',
    name: 'association:administration:activities:generic:disbursement',
    component: () => import('../pages/page.disbursement.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            { title: 'Generic', i18n: 'generique', url: '/association/administration/activities/generic/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/administration/activities/generic/details' },
            { title: 'decaissementParams', i18n: 'decaissementParams', active: true }
        ],
        pageTitle: 'decaissementParams',
        rule: 'isAdmin',
        title: 'Disburse in a generic activity'
    }
  },

    // -----------------  Ask for contributions ------------------------//
    {
        path: '/association/administration/activities/generic/ask-for-contribution',
        name: 'association:administration:activities:generic:ask-for-contribution',
        component: () => import('../pages/page.askforcontribution.vue'),
        meta: {
            breadcrumb: [
                { title: 'Home', url: '/association/administration' },
                { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
                { title: 'Generic', i18n: 'generique', url: '/association/administration/activities/generic/all' },
                { title: 'Details ', i18n: 'detail', url: '/association/administration/activities/generic/details' },
                { title: 'Contribution', i18n: 'contribution', active: true }
            ],
            pageTitle: 'contribution',
            rule: 'isAdmin',
            title: 'Contribution request'
        }
    },

    // -----------------  Notes ------------------------//
    {
        path: '/association/administration/activities/generic/notes',
        name: 'association:administration:activities:generic:notes',
        component: () => import('../pages/page.notes.vue'),
        meta: {
            breadcrumb: [
                { title: 'Home', url: '/association/administration' },
                { title: 'Activities', i18n: 'activities', url: '/association/administration/activities'  },
                { title: 'Generic', i18n: 'generique', url: '/association/administration/activities/generic/all' },
                { title: 'Details ', i18n: 'detail', url: '/association/administration/activities/generic/details' },
                { title: 'Notes', i18n: 'notes', active: true }
            ],
            pageTitle: 'notes',
            rule: 'isAdmin',
            title: 'Notes request'
        }
    },
]
