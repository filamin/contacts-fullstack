import Vue from 'vue';
import Router from 'vue-router';
import Login from './components/Login.vue';
import Contact from './components/Contact.vue';
import Contacts from './components/Contacts.vue';
import store from '@/store';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/contacts',
      name: 'Contacts',
      component: Contacts,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/contact',
      name: 'ContactAdd',
      component: Contact,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/contact/:id',
      name: 'ContactEdit',
      component: Contact,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '*',
      redirect: '/contacts',
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters.isLoggedIn) {
      next({ name: 'Login' });
    } else {
      next(); // go to wherever I'm going
    }
  } else {
    next(); // does not require auth, make sure to always call next()!
  }
});

export default router;
