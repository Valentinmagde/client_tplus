
export default [

  // Login page
  {
    path: '/user/login',
    name: 'user:login',
    component: () => import('../pages/page.login.vue'),
    meta: {
			rule: 'editor',
      title: 'Login',
      requiredCurrentAssociation: false
    },
  },

  // Register page
  {
    path: '/user/register',
    name: 'user:register',
    component: () => import('../pages/page.register'),
    meta: {
			rule: 'editor',
      title: 'Register'
    },
  },

  // Verify user registration code
  {
    path: '/user/verify-code',
    name: 'user:verify-code',
    component: () => import('../pages/password/page.verifycode.vue'),
    meta: {
        rule: 'editor',
        title: 'Registration code'
    }
  },

  // Forgot password query page
  {
    path: '/user/forgot-password',
    name: 'user:recovery-password',
    component: () => import('../pages/password/page.forgotpassword'),
    meta: {
			rule: 'editor',
      title: 'Forgot Password'
    },
  },

  // User profile
  {
    path: '/user/profile',
    name: 'user:profile',
    component: () => import('../pages/profile/page.profile.vue'),
    meta: {
      breadcrumb: [
        { title: 'Home', url: '/' },
        { title: 'Pages' },
        { title: 'Profile', active: true },
      ],
      pageTitle: 'Profile',
      rule: 'editor',
      title: 'User\'s profile'
    },
  },

  // User profile edition
  {
    path: '/user/update-profile',
    name: 'user:update-profile',
    component: () => import('../pages/profile/page.updateprofile.vue'),
    meta: {
        breadcrumb: [
            { title: 'Home', url: '/' },
            { title: 'Pages' },
            { title: 'Profile', active: true },
        ],
        pageTitle: 'Profile',
        rule: 'editor',
        title: 'Profile edition'
    },
  },


  // Unauthorized page
  {
    path: '/user/unauthorized',
    name: 'user:unauthorized',
    component: () => import('../pages/error/page.unauthorized.vue'),
    meta: {
        rule: 'editor',
        title: 'Forbidden access'
    }
  },

  // Page not found
  {
    path: '/error-404',
    name: 'page-error-404',
    component: () => import('../pages/error/page.error404.vue'),
    meta: {
        rule: 'editor'
    }
  },

  //
  {
    path: '/error-500',
    name: 'page-error-500',
    component: () => import('../pages/error/page.error500.vue'),
    meta: {
        rule: 'editor'
    }
  },
];
