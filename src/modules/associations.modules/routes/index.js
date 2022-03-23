// import genericsUrls from './routers/generics'
// import eventsUrls   from './routers/events'
// import mutuellesUrls   from './routers/mutuelles'
// import solidarityUrls   from './routers/solidarity'
import membershipUrls from '../modules/membership.modules/routes'
import activitiesUrls from '../modules/activities.modules/routes'
import newsUrls from '../modules/news.modules/routes'
import calendarUrls from '../modules/calendar.modules/routes'
import documentsrUrls from '../modules/documents.modules/routes'
import financesrUrls from '../modules/finances.modules/routes'
import sessionsUrls from '../modules/sessions.modules/routes'
import parametersUrls from '../modules/parameters.modules/routes'
import cyclesUrls from '../modules/cycles.modules/routes'

export const noWay = [

  //---------- List of registered associations ----------//
   {
    path: '/associations',
    name: 'associations:list',
    component: () => import('../pages/page.associations.vue'),
    meta: {
      rule: 'editor',
      title: 'My associations'
    },
  },

  //---------- Create an association ----------//
  {
    path: '/association/create',
    name: 'association:create',
    component: () => import('../pages/page.createassociation.vue'),
      meta: {
        rule: 'editor',
        title: 'Create an association'
      }
  },

  //---------- Join an association ----------//
  {
    path: '/association/join',
    name: 'association:join',
    component: () => import('../pages/page.joinassociation.vue'),
    meta: {
      rule: 'editor',
      title: 'Join an association'
    }
  },

];

export default [

  //---------- Association dashboard ----------//
  {
    path: '/association/home',
    name: 'association:home',
    component: () => import('../pages/dashboards/page.memberdashboard.vue'),
    meta: {
      rule: 'editor',
      title: 'Home'
    },
  },

  //---------- Association administration dashboard ----------//
  {
    path: '/association/administration',
    name: 'association:administration',
    component: () => import('../pages/dashboards/page.admindashboard.vue'),
    meta: {
      rule: 'isControler',
      title: 'Administration',
      required: true,
    }
  },

  //---------- Reset password (from dashboard panel) ----------//
  {
    path: '/association/user-settings/reset-password',
    name: 'association:user-settings:reset-password',
    component: () => import('../pages/user-management/page.resetpassword.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/home' },
            { title: 'Password reset', i18n: 'passwordReset', active: true },
        ],
        pageTitle: 'passwordReset',
        rule: 'editor',
        title: 'Password reset'
    }
  },

//   // -----------------  Edit fincancial operation  ------------------------//
//   {
//     path: '/association/finances/edit-operation',
//     name: 'association:finances:edit-operation',
//     component: () => import('../pages/Home/finance.pages/membre/page.editoperation.vue'),
//     meta: {
//         breadcrumb: [
//             { title: 'Home', url: '/association/home' },
//             { title: 'Finances', i18n: 'finances', url: '/association/finances'},
//             { title: 'Edit', i18n: 'update', active: true },
//         ],
//         pageTitle: 'finances',
//         rule: 'editor',
//         title: 'Edit operation'
//     },
//   },

//   // -----------------  Ask for bond form  ------------------------//
//   {
//     path: '/association/my-activities/mutual/bond-request',
//     name: 'association:activities:mutual:bond-request',
//     component: () => import('../pages/Home/activite.pages/mutuelle/page.askforbond.vue'),
//     meta: {
//         breadcrumb: [
//             { title: 'Home', url: '/association/administration' },
//             { title: 'Activities', i18n: 'activities', url: '/association/activities/my-activities'},
//             { title: 'Epargne - Credit', i18n: 'EpargneCredit', url: '/association/activities/mutual/all' },
//             { title: 'Details ', i18n: 'detail', url: '/association/my-activities/mutual/details' },
//             { title: 'Contribution', i18n: 'contribution', active: true }
//         ],
//         pageTitle: 'contribution',
//         rule: 'editor',
//         title: 'Bond request'
//     }
//   },

//   {
//     path: '/association/admin/activities',
//     name: 'association:admin:activities',
//     component: () => import('../pages/Home/activite.pages/page.activite.vue'),
//     meta: {
//       breadcrumb: [
//         { title: 'Home', url: '/association/admin' },
//         { title: 'Activities', i18n: 'activities' },
//         { title: 'New activity', i18n: 'newActivities', active: true },
//       ],
//       pageTitle: 'newActivities',
//       rule: 'isAdmin',
//       title: 'New Activity'
//     }
//   },
//   {
//     path: '/association/admin/all-activities',
//     name: 'association:admin:all',
//     component: () => import('../pages/Home/activite.pages/page.allActivities.vue'),
//     meta: {
//       breadcrumb: [
//         { title: 'Home', url: '/association/admin' },
//         { title: 'Activities', i18n: 'activities' },
//         { title: 'All Activities', i18n: 'allActivities', active: true },
//       ],
//       pageTitle: 'allActivities',
//       rule: 'isAdmin',
//       title: 'All Activities'
//     }
//   },
//   {
//     path: '/association/admin/tontine/create',
//     name: 'association:admin:tontine:created',
//     component: () => import('../pages/Home/activite.pages/tontine.pages/tontine.page.vue'),
//       meta: {
//         breadcrumb: [
//           { title: 'Home', url: '/association/admin' },
//           { title: 'Activities', i18n: 'activities' },
//           { title: 'New activity', i18n: 'newActivities', url: '/association/admin/activities', active: true },
//           { title: 'Tontines',i18n: 'tontine', active: true },
//         ],
//         pageTitle: 'tontine',
//         rule: 'isAdmin',
//         title: 'Create new tontine'
//       },
//   },

     ...membershipUrls,
     ...activitiesUrls,
     ...newsUrls,
     ...calendarUrls,
     ...documentsrUrls,
     ...financesrUrls,
     ...sessionsUrls,
     ...parametersUrls,
     ...cyclesUrls,
];
