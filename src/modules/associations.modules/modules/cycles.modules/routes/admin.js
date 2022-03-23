export default [
  {
      path: '/association/administration/cycles',
      name: 'association:administration:cycles',
      component: () => import('../pages/page.cycles.vue'),
      meta: {
        breadcrumb: [
          { title: 'Home', url: '/association/administration' },
          { title: 'Association', i18n:'association' },
          { title: 'Cycle', i18n:'cycles', active: true },
        ],
        pageTitle: 'cycles',
        rule: 'isAdmin',
        title: 'Cycles'
      },
  },

    {
    path: '/association/administration/cycles/list',
    name: 'association:administration:cycles:list',
    component: () => import('../pages/page.cycleslist.vue'),
      meta: {
        breadcrumb: [
          { title: 'Home', url: '/association/administration' },
          { title: 'Association', i18n:'association' },
          { title: 'Cycle', i18n:'cycles', url: '/association/administration/cycles', active: true },
          { title: 'List', i18n:'list', active: true },
        ],
        pageTitle: 'list',
        rule: 'isAdmin',
        title: 'Cycles list'
      },
  },

  {
    path: '/association/administration/cycles/close/:cyId',
    name: 'association:administration:cycles:close',
    component: () => import('../pages/page.closecycles.vue'),
      meta: {
        breadcrumb: [
          { title: 'Home', url: '/association/administration' },
          { title: 'Association', i18n:'association' },
          { title: 'Cycle', i18n:'cycles', url: '/association/administration/cycles', active: true },
          { title: 'Close', i18n:'cloturer', active: true },
        ],
        pageTitle: 'cloturer',
        rule: 'isAdmin',
        title: 'close cycles'
      },
  },
]
