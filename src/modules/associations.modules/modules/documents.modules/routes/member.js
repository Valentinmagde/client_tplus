export default [
  //  -------------------- Documents --------------------- //
    {
      path: '/association/documents',
      name: 'association:documents',
      component: () => import('../pages/page.documents.vue'),
      meta: {
          //middleware: [isAdmin],
          breadcrumb: [
              { title: 'Home', url: '/association/home' },
              { title: 'Documents', i18n: 'documents', active: true },
          ],
          pageTitle: 'documents',
          rule: 'editor',
          title: 'Documents'
      },
    },
  ]
