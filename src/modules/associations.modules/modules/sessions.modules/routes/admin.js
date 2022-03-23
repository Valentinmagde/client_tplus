export default [
  // -----------------  Sessions management - List ------------------------//
  {
    path: '/association/administration/sessions',
    name: 'association:administration:sessions',
    component: () => import('../pages/administration/page.sessions.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Sessions', i18n: 'sessions', active: true },
        ],
        pageTitle: 'sessions',
        rule: 'isFinancial',
        title: 'General assemblies'
    },
  },

  // -----------------  Sessions management ------------------------//
  {
    path: '/association/administration/sessions/:uuid',
    props:true,
    name: 'association:administration:sessions:manage',
    component: () => import('../pages/administration/page.handlesession.vue'),
    meta: {
        //middleware: [IsAuthorize],
        breadcrumb: [
            { title: 'Home', url: '/association/administration/' },
            { title: 'Sessions', url: '/association/administration/sessions', i18n: 'sessions', active: true },
            { title: 'Gestion séance', i18n: 'gestionAg', active: true },
        ],
        pageTitle: 'SessionManagement',
        rule: 'isControler',
        title: 'Manage assembly'
    },
  },
]
