export default [
  // -----------------  Association news  ------------------------//
  {
    path: '/association/news',
    name: 'association:news',
    component: () => import('../pages/page.news.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/home' },
            { title: 'News', i18n: 'news', active: true },
        ],
        pageTitle: 'news',
        rule: 'editor',
        title: 'News'
    },
  },
]
