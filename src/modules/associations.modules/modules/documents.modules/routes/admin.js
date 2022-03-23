export default [
  //  -------------------- Documents --------------------- //
  {
    path: '/association/administration/documents',
    name: 'association:administration:documents',
    component: () => import('../pages/page.documents.vue'),
    meta: {
        //middleware: [isAdmin],
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Documents', i18n: 'documents', active: true },
        ],
        pageTitle: 'documents',
        rule: 'isAdmin',
        title: 'Documents'
    },
  },
]
