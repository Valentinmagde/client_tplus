export default [
  //---------- Association's member activities ----------//
  {
    path: '/association/member/activities',
    name: 'association:member:activities',
    component: () => import('../pages/page.memberactivities.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/home' },
            { title: 'Members', i18n:'members', url: '/association/members'},
            { title: 'Activities', i18n:'activities', active: true },
        ],
        pageTitle: 'activities',
        rule: 'editor',
        title: 'Member\'s activities'
    },
  },

  // -----------------  List of activities - Member's panel  ------------------------//
  {
    path: '/association/activities/my-activities',
    name: 'association:activities:my-activities',
    component: () => import('../pages/page.allactivities.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/home' },
            { title: 'Activities', i18n: 'activities', active: true },
        ],
        pageTitle: 'allActivities',
        rule: 'editor',
        title: 'My activities'
    },
  },
]
