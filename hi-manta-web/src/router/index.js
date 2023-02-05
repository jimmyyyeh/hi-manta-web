import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/medal',
    name: 'medal',
    component: () => import('../views/MedalView.vue'),
  },
  {
    path: '/prize',
    name: 'prize',
    component: () => import('../views/PrizeView.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
