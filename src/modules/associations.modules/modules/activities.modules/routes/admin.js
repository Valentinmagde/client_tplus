export default [
  // -----------------  New activities (panel)  ------------------------//
  {
    path: '/association/administration/activity/create',
    name: 'association:administration:activity:create',
    component: () => import('../pages/page.newactivity.vue'),
    meta: {
        //middleware: [isAdmin],
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            { title: 'New activity', i18n: 'newActivities', active: true },
        ],
        pageTitle: 'newActivities',
        rule: 'isAdmin',
        title: 'Craft a new activity'
    }
  },

  // -----------------  List of activities - Administration's panel  ------------------------//
  {
    path: '/association/administration/activities',
    name: 'association:administration:activities',
    component: () => import('../pages/page.allactivities.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', active: true },
        ],
        pageTitle: 'allActivities',
        rule: 'isAdmin',
        title: 'My activities'
    },
  },

  // ----------------- Update balances of accounts registered in an activity - Shortcut ------------------------//
  {
    path: '/association/administration/activities/update-accounts',
    name: 'association:administration:activities:update-accounts',
    component: () => import('../pages/page.updatebalances.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            { title: 'Update', i18n: 'updatingBalances', active: true },
        ],
        pageTitle: 'update',
        rule: 'isAdmin',
        title: 'Update balances'
    }
  },

   // ----------------- Update checkout of activity - Shortcut ------------------------//
   {
    path: '/association/administration/activities/update-checkout/:actId',
    name: 'association:administration:activities:update-checkout',
    component: () => import('../pages/page.updatecheckout.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            { title: 'Update', i18n: 'updateCheckout', active: true },
        ],
        pageTitle: 'update',
        rule: 'isAdmin',
        title: 'Update balances'
    }
  },

  // ----------------- Add members to an activity - Shortcut ------------------------//
  {
    path: '/association/administration/activities/:actId/add-accounts',
    name: 'page-activities-add-accounts',
    component: () => import('../pages/page.registermembers.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            { title: 'AddMembers', i18n: 'addMember', active: true },
        ],
        pageTitle: 'addMember',
        rule: 'isAdmin',
        title: 'Register members to the activity'
    }
  },

  // ----------------- Add members to an activity - Shortcut ------------------------//
  {
    path: '/association/administration/activities/:activity_id/closure',
    name: 'association:administration:activities:closure',
    component: () => import('../pages/page.closure.vue'),
    meta: {
        //middleware: [isAdmin],
        breadcrumb: [
            { title: 'Home', url: '/association/administration' },
            { title: 'Activities', i18n: 'activities', url: '/association/administration/activities' },
            { title: 'Closing Activities', i18n: 'closing', active: true },
        ],
        pageTitle: 'closing',
        rule: 'isAdmin',
        title: 'Close an activity'
    }
},
]
