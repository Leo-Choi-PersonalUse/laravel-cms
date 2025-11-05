import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import DashboardHome from '../views/DashboardHome.vue'
import PostsList from '../views/PostsList.vue'
import PostForm from '../views/PostForm.vue'
import CompaniesList from '../views/CompaniesList.vue'
import CompanyForm from '../views/CompanyForm.vue'
import RolesList from '../views/RolesList.vue'
import Test from '../views/Test.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { guest: true },
    },
    {
      path: '/test',
      name: 'test',
      component: Test,
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { guest: true },
    },
    {
      path: '/dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardHome,
        },
        {
          path: 'posts',
          name: 'posts',
          component: PostsList,
        },
        {
          path: 'posts/create',
          name: 'posts-create',
          component: PostForm,
        },
        {
          path: 'posts/:id/edit',
          name: 'posts-edit',
          component: PostForm,
        },
        {
          path: 'companies',
          name: 'companies',
          component: CompaniesList,
        },
        {
          path: 'companies/create',
          name: 'companies-create',
          component: CompanyForm,
        },
        {
          path: 'companies/:id/edit',
          name: 'companies-edit',
          component: CompanyForm,
        },
        {
          path: 'roles',
          name: 'roles',
          component: RolesList,
        },
      ],
    },
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.guest && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
