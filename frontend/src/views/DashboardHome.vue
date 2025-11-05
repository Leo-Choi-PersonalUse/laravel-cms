<template>
  <div class="dashboard-home">
    <h1>Dashboard</h1>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📝</div>
        <div class="stat-content">
          <h3>Total Posts</h3>
          <p class="stat-number">{{ postStore.pagination.total }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <h3>Published</h3>
          <p class="stat-number">{{ publishedCount }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📄</div>
        <div class="stat-content">
          <h3>Drafts</h3>
          <p class="stat-number">{{ draftCount }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">👤</div>
        <div class="stat-content">
          <h3>User</h3>
          <p class="stat-text">{{ authStore.user?.name }}</p>
        </div>
      </div>
    </div>

    <div class="recent-posts">
      <h2>Recent Posts</h2>
      <div v-if="postStore.loading" class="loading">Loading...</div>
      <div v-else-if="postStore.posts.length === 0" class="empty-state">
        <p>No posts yet. Create your first post!</p>
        <router-link to="/dashboard/posts/create" class="btn-primary">
          Create Post
        </router-link>
      </div>
      <div v-else class="posts-preview">
        <div v-for="post in recentPosts" :key="post.id" class="post-preview-card">
          <div class="post-status" :class="post.status">
            {{ post.status }}
          </div>
          <h3>{{ post.title }}</h3>
          <p class="post-excerpt">{{ getExcerpt(post.content) }}</p>
          <div class="post-meta">
            <span>{{ formatDate(post.created_at) }}</span>
            <router-link :to="`/dashboard/posts/${post.id}/edit`">Edit</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { usePostStore } from '../stores/post'

const authStore = useAuthStore()
const postStore = usePostStore()

const publishedCount = computed(() => 
  postStore.posts.filter(p => p.status === 'published').length
)

const draftCount = computed(() => 
  postStore.posts.filter(p => p.status === 'draft').length
)

const recentPosts = computed(() => 
  postStore.posts.slice(0, 5)
)

function getExcerpt(content: string, length = 100) {
  return content.length > length ? content.substring(0, length) + '...' : content
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  postStore.fetchPosts()
})
</script>

<style scoped>
.dashboard-home {
  max-width: 1200px;
}

h1 {
  margin: 0 0 30px 0;
  font-size: 32px;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  font-size: 40px;
  opacity: 0.8;
}

.stat-content h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.stat-number {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #333;
}

.stat-text {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #667eea;
}

.recent-posts {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recent-posts h2 {
  margin: 0 0 20px 0;
  font-size: 24px;
  color: #333;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.empty-state p {
  margin-bottom: 20px;
}

.btn-primary {
  display: inline-block;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: transform 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
}

.posts-preview {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.post-preview-card {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  position: relative;
  transition: box-shadow 0.2s;
}

.post-preview-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.post-status {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.post-status.published {
  background: #d4edda;
  color: #155724;
}

.post-status.draft {
  background: #fff3cd;
  color: #856404;
}

.post-preview-card h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #333;
}

.post-excerpt {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #999;
}

.post-meta a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.post-meta a:hover {
  text-decoration: underline;
}
</style>
