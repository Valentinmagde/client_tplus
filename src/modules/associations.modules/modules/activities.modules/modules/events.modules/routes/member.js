export default [
  // -----------------  Event details  ------------------------//
  {
    path: '/association/my-activities/event/details',
    name: 'association:my-activities:event:details',
    component: () => import('../pages/page.details.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/home' },
            { title: 'Activities', i18n: 'activities', url: '/association/activities/my-activities'},
            {  title: 'Events', i18n: 'event', url: '/association/activities/events/all' },
            { title: 'Details', i18n: 'detail', active: true },
        ],
        pageTitle: 'detail',
        rule: 'editor',
        title: 'Event details'
    }
  },

  // -----------------  All events  ------------------------//
  {
    path: '/association/activities/events/all',
    name: 'association:activities:events:all',
    component: () => import('../pages/page.list.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/home' },
            { title: 'Activities', i18n: 'activities', url: '/association/activities/my-activities'},
            { title: 'Events', i18n: 'event', active: true },
        ],
        pageTitle: 'event',
        rule: 'editor',
        title: 'Events'
    }
  },

  // -----------------  Event members' transactions  ------------------------//
  {
    path: '/association/activities/event/member-transactions',
    name: 'association:activities:event:member-transactions',
    component: () => import('../pages/page.membertransactions.vue'),
    meta: {
      breadcrumb: [
            { title: 'Home', url: '/association/home' },
            { title: 'Activities', i18n: 'activities', url: '/association/activities/my-activities' },
            {  title: 'Events', i18n: 'event', url: '/association/activities/events/all' },
            { title: 'Details', i18n: 'detail', url: '/association/my-activities/event/details' },
            { title: 'Transactions', i18n: 'transactions', active: true }
        ],
        pageTitle: 'transactions',
        rule: 'isControler',
        title: 'Member\'s transactions'
    }
  },
]
