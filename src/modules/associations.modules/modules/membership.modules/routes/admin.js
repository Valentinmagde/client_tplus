export default [
  //---------- Association's members - Admin side ----------//
  {
    path: '/association/administration/members',
    name: 'association:administration:members',
    component: () => import('../pages/page.membres.vue'),
    meta: {
      breadcrumb: [
        { title: 'Home', url: '/association/administration' },
        { title: 'Associations', i18n:'association'},
        { title: 'Members', i18n:'members', active: true },
      ],
      pageTitle: 'members',
      rule: 'isAdmin',
      title: 'Association\'s members'
    },
  },
]
