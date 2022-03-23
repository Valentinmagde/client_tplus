export default [
  //---------- Association's members ----------//
  {
    path: '/association/members',
    name: 'association:members',
    component: () => import('../pages/page.membres.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/home' },
            { title: 'Members', i18n:'members', active: true },
        ],
        pageTitle: 'members',
        rule: 'editor',
        title: 'Association\'s members'
    },
  },
]
