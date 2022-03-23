export default [
  // -----------------  Calendar  ------------------------//
  {
    path: '/association/calendar',
    name: 'association:calendar',
    component: () => import('../pages/page.calendar.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/home' },
            { title: 'Calendar', i18n: 'Calendar', active: true },
        ],
        pageTitle: 'Calendar',
        rule: 'editor',
        title: 'Calendar'
    },
  },
]
