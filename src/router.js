import Vue from 'vue'
import Router from 'vue-router'
import auth from "@/services/auth";

import firebase from 'firebase/app'
import 'firebase/auth'

// Users modules routes
import moduleUserRoutes from '@/modules/users.modules/routes'

// Associations modules routes
import moduleAssociationRoutes from '@/modules/associations.modules/routes'
import { noWay } from '@/modules/associations.modules/routes'

// Wallets routes
// import walletRoutes from '@/modules/wallet.modules/services/urls'

// Billing management routes
import moduleBillingRoutes from '@/modules/billing.modules/routes'

import store from '@/store'

import Token from '@/helpers/token.js'

Vue.use(Router)

Vue.config.lang

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior() {
        return { x: 0, y: 0 }
    },
    routes: [

        {
            // =============================================================================
            // MAIN LAYOUT ROUTES
            // =============================================================================
            path: '',
            component: () =>
                import ('@/layouts/main/Main.vue'),
            children: [
              ...moduleAssociationRoutes,
              ...moduleBillingRoutes,
              {
                path: '/',
                redirect: '/user/login'
              },

            ],
        },
        // =============================================================================
        // FULL PAGE LAYOUTS
        // =============================================================================
        {
            path: '',
            component: () =>
              import ('@/layouts/full-page/FullPage.vue'),
            children: [
              ...moduleUserRoutes,
              ...noWay,
              // ...walletRoutes
            ]
        },
        // Redirect to 404 page, if no match found
        {
            path: '*',
            redirect: '/error-404'
        }
    ],
})


router.afterEach((to) => {
    (to.meta.title) ? document.title = `Tontine.Plus - ${to.meta.title.trim()}`: 'Tontine Plus'
    const appLoading = document.getElementById('loading-bg')
    if (appLoading) {
        appLoading.style.display = "none";
    }
})

function nextFactory(context, middleware, index) {
    const subsequentMiddleware = middleware[index];

    if (!subsequentMiddleware) return context.next;

    return (...parameters) => {
        context.next(...parameters);

        const nextMiddleware = nextFactory(context, middleware, index + 1);
        subsequentMiddleware({...context, next: nextMiddleware });
    };
}
router.beforeEach((to, from, next) => {
    firebase.auth().onAuthStateChanged(() => {

        // get firebase current user
        const firebaseCurrentUser = firebase.auth().currentUser
        firebaseCurrentUser
        auth.isAuthenticated()

        let usertoken = Token.getAccessToken();

        if (!usertoken &&
            to.path !== '/user/login' &&
            to.path !== '/user/register' &&
            to.path !== '/user/verify-code' &&
            to.path !== '/user/forgot-password')
            next('/user/login')
        else {
            if (to.meta.middleware) {
                const middleware = Array.isArray(to.meta.middleware) ? to.meta.middleware : [to.meta.middleware];
                const context = { from, next, router, to, store };
                const nextMiddleware = nextFactory(context, middleware, 1);

                return middleware[0]({...context, next: nextMiddleware });
            }
            return next();
        }
    });

});

export default router
