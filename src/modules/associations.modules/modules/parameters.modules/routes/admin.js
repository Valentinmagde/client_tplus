export default [
  // --------------------- Association settings ----------------------//
  {
    path: '/association/administration/association-settings',
    name: 'association:administration:association-settings',
    component: () => import('../pages/page.settings.vue'),
    meta: {
      breadcrumb: [
        { title: 'Home', url: '/association/administration' },
        { title: 'Associations', i18n: 'association'},
        { title: 'Settings', i18n: 'setting', active: true },
      ],
      pageTitle: 'setting',
      rule: 'isAdmin',
      title: 'Association settings'
    },
  },
]
