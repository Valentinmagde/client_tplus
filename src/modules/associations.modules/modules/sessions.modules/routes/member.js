export default [
  // -----------------  Sessions - Member panel  ------------------------//
  {
    path: '/association/sessions',
    name: 'association:sessions',
    component: () => import('../pages/member/page.sessions.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/home' },
            { title: 'Sessions', i18n: 'sessions', active: true },
        ],
        pageTitle: 'sessions',
        rule: 'editor',
        title: 'Sessions'
    },
  },

  // -----------------  Sessions management ------------------------//
  {
    path: '/association/sessions/:uuid',
    props:true,
    name: 'association:sessions:manage',
    component: () => import('../pages/member/page.handlesession.vue'),
    meta: {
        //middleware: [IsAuthorize],
        breadcrumb: [
            { title: 'Home', url: '/association/home' },
            { title: 'Sessions', url: '/association/sessions', i18n: 'sessions', active: true },
            { title: 'Gestion séance', i18n: 'gestionAg', active: true },
        ],
        pageTitle: 'sessionManagement',
        rule: 'isControler',
        title: 'Manage assembly'
    },
  },
]
