<template>
  <div class="posts-list">
    <div class="page-header">
      <h1>All Posts</h1>
      <router-link to="/dashboard/posts/create" class="btn-primary">
        ➕ New Post
      </router-link>
    </div>

    <div v-if="postStore.loading" class="loading">Loading posts...</div>
    
    <div v-else-if="postStore.error" class="error-message">
      {{ postStore.error }}
    </div>

    <div v-else-if="postStore.posts.length === 0" class="empty-state">
      <p>No posts yet. Create your first post!</p>
    </div>

    <div v-else class="posts-table">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Author</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in postStore.posts" :key="post.id">
            <td class="title-cell">{{ post.title }}</td>
            <td>
              <span class="status-badge" :class="post.status">
                {{ post.status }}
              </span>
            </td>
            <td>{{ post.user?.name || 'Unknown' }}</td>
            <td>{{ formatDate(post.created_at) }}</td>
            <td class="actions-cell">
              <router-link :to="`/dashboard/posts/${post.id}/edit`" class="btn-edit">
                Edit
              </router-link>
              <button @click="handleDelete(post.id)" class="btn-delete">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="postStore.pagination.lastPage > 1" class="pagination">
        <button 
          @click="changePage(postStore.pagination.currentPage - 1)"
          :disabled="postStore.pagination.currentPage === 1"
          class="btn-page"
        >
          Previous
        </button>
        <span class="page-info">
          Page {{ postStore.pagination.currentPage }} of {{ postStore.pagination.lastPage }}
        </span>
        <button 
          @click="changePage(postStore.pagination.currentPage + 1)"
          :disabled="postStore.pagination.currentPage === postStore.pagination.lastPage"
          class="btn-page"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { usePostStore } from '../stores/post'

const postStore = usePostStore()

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

async function handleDelete(id: number) {
  if (confirm('Are you sure you want to delete this post?')) {
    await postStore.deletePost(id)
  }
}

function changePage(page: number) {
  postStore.fetchPosts(page)
}

onMounted(() => {
  postStore.fetchPosts()
})
</script>

<style scoped>
.posts-list {
  max-width: 1200px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h1 {
  margin: 0;
  font-size: 32px;
  color: #333;
}

.btn-primary {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: transform 0.2s;
  display: inline-block;
}

.btn-primary:hover {
  transform: translateY(-2px);
}

.loading, .empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error-message {
  padding: 20px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  color: #c33;
}

.posts-table {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8f9fa;
}

th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
}

td {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

tbody tr:hover {
  background: #f8f9fa;
}

.title-cell {
  font-weight: 500;
  color: #333;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.published {
  background: #d4edda;
  color: #155724;
}

.status-badge.draft {
  background: #fff3cd;
  color: #856404;
}

.actions-cell {
  display: flex;
  gap: 10px;
}

.btn-edit {
  padding: 6px 16px;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-edit:hover {
  background: #5568d3;
}

.btn-delete {
  padding: 6px 16px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-delete:hover {
  background: #c82333;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
}

.btn-page {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-page:hover:not(:disabled) {
  background: #5568d3;
}

.btn-page:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.page-info {
  font-weight: 500;
  color: #666;
}
</style>
