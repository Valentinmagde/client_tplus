export default [
  // -----------------  Event details  ------------------------//
  {
    path: '/association/administration/activities/event/details',
    name: 'association:administration:activities:event:details',
    component: () => import('../pages/page.details.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities'},
            {  title: 'Events', i18n: 'event', url: '/association/administration:activities/events/all' },
            { title: 'Details', i18n: 'detail', active: true },
        ],
        pageTitle: 'detail',
        rule: 'isAdmin',
        title: 'Event details'
    }
  },

  // -----------------  Event members' transactions  ------------------------//
  {
    path: '/association/administration/activities/event/member-transactions',
    name: 'association:administration:activities:event:member-transactions',
    component: () => import('../pages/page.membertransactions.vue'),
    meta: {
      breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            {  title: 'Events', i18n: 'event', url: '/association/administration/activities/events/all' },
            { title: 'Details', i18n: 'detail', url: '/association/administration/activities/event/details' },
            { title: 'Transactions', i18n: 'transactions', active: true }
        ],
        pageTitle: 'transactions',
        rule: 'isAdmin',
        title: 'Member\'s transactions'
    }
  },

  // -----------------  Craft a new event ------------------------//
  {
    path: '/association/administration/activity/event/create',
    name: 'association:administration:activity:event:create',
    component: () => import('../pages/page.create.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            { title: 'New activity', i18n: 'newActivities', url: '/association/administration/activity/create', active: true },
            { title: 'Events', i18n: 'event', active: true },
        ],
        pageTitle: 'event',
        rule: 'isAdmin',
        title: 'Plan an event'
    }
  },

  // -----------------  Edit an event ------------------------//
  {
    path: '/association/administration/activity/event/edit',
    name: 'association:administration:activity:event:edit',
    component: () => import('../pages/page.create.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            {  title: 'Events', i18n: 'event', url: '/association/administration/activities/events/all' },
            { title: 'Events', i18n: 'event', active: true },
        ],
        pageTitle: 'event',
        rule: 'isAdmin',
        title: 'Plan an event'
    }
  },

  // -----------------  All events  ------------------------//
  {
    path: '/association/administration/activities/events/all',
    name: 'association:administration:activities:events:all',
    component: () => import('../pages/page.list.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities'},
            { title: 'Events', i18n: 'event', active: true },
        ],
        pageTitle: 'event',
        rule: 'isAdmin',
        title: 'Events'
    }
  },

  // -----------------  Event settlements  ------------------------//
  {
    path: '/association/administration/activities/event/settlements',
    name: 'association:administration:activities:event:settlements',
    component: () => import('../pages/page.settlements.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            {  title: 'Events', i18n: 'event', url: '/association/administration/activities/events/all' },
            { title: 'Details', i18n: 'detail', url: '/association/administration/activities/event/details' },
            { title: 'Settlement', i18n: 'settlement', active: true }
        ],
        pageTitle: 'settlement',
        rule: 'isAdmin',
        title: 'Event settlements'
    }
  },

  // -----------------  Event Debts  ------------------------ //
  {
    path: '/association/administration/activities/event/debt',
    name: 'association:administration:activities:event:debt',
    component: () => import('../pages/page.debt.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            { title: 'Events', i18n: 'event', url: '/association/administration/activities/events/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/administration/activities/event/details' },
            { title: 'Debt', i18n: 'debt', active: true }
        ],
        pageTitle: 'debt',
        rule: 'isAdmin',
        title: 'Event debt'
    }
  },

  // -----------------  Ask for contributions  ------------------------//
  {
    path: '/association/administration/activities/event/ask-for-contribution',
    name: 'association:administration:activities:event:ask-for-contribution',
    component: () => import('../pages/page.askforcontribution.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            {  title: 'Events', i18n: 'event', url: '/association/administration/activities/events/all' },
            { title: 'Details', i18n: 'detail', url: '/association/administration/activities/event/details' },
            { title: 'Contribution', i18n: 'contribution', active: true }
        ],
        pageTitle: 'contribution',
        rule: 'isAdmin',
        title: 'Contribution request'
    }
  },

  // -----------------  Event disbursement  ------------------------//
  {
    path: '/association/administration/activities/event/disbursement',
    name: 'association:administration:activities:event:disbursement',
    component: () => import('../pages/page.disbursement.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            {  title: 'Events', i18n: 'event', url: '/association/administration/activities/events/all' },
            { title: 'Details', i18n: 'detail', url: '/association/administration/activities/event/details' },
            { title: 'decaissementParams', i18n: 'decaissementParams', active: true }
        ],
        pageTitle: 'decaissementParams',
        rule: 'isAdmin',
        title: 'Disburse in an event activity'
    }
  },

  // -----------------  Notes ------------------------//
  {
    path: '/association/administration/activities/event/notes',
    name: 'association:administration:activities:event:notes',
    component: () => import('../pages/page.notes.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities'  },
            { title: 'Events', i18n: 'event', url: '/association/administration/activities/events/all' },
            { title: 'Details ', i18n: 'detail', url: '/association/administration/activities/events/details' },
            { title: 'Notes', i18n: 'notes', active: true }
        ],
        pageTitle: 'notes',
        rule: 'isAdmin',
        title: 'Notes request'
    }
  },
]
