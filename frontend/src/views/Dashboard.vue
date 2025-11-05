<template>
  <div class="dashboard-layout">
    <nav class="sidebar">
      <div class="sidebar-header">
        <h2>Laravel CMS</h2>
        <p>Welcome, {{ authStore.user?.name }}</p>
      </div>
      
      <ul class="nav-menu">
        <li>
          <router-link to="/dashboard" class="nav-link">
            <span class="icon">📊</span>
            Dashboard
          </router-link>
        </li>
        <li>
          <router-link to="/dashboard/posts" class="nav-link">
            <span class="icon">📝</span>
            Posts
          </router-link>
        </li>
        <li>
          <router-link to="/dashboard/posts/create" class="nav-link">
            <span class="icon">➕</span>
            New Post
          </router-link>
        </li>
        <li class="nav-divider"></li>
        <li>
          <router-link to="/dashboard/companies" class="nav-link">
            <span class="icon">🏢</span>
            Companies
          </router-link>
        </li>
        <li>
          <router-link to="/dashboard/roles" class="nav-link">
            <span class="icon">👥</span>
            Roles
          </router-link>
        </li>
      </ul>

      <div class="sidebar-footer">
        <button @click="handleLogout" class="btn-logout">
          <span class="icon">🚪</span>
          Logout
        </button>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}

.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
}

.sidebar-header {
  padding: 30px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
}

.sidebar-header p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.nav-menu {
  flex: 1;
  list-style: none;
  padding: 20px 0;
  margin: 0;
}

.nav-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 10px 20px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  color: white;
  text-decoration: none;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.icon {
  font-size: 20px;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-logout {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.2);
}

.main-content {
  margin-left: 260px;
  flex: 1;
  padding: 40px;
  width: calc(100% - 260px);
}
</style>
