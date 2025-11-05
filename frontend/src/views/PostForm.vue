<template>
  <div class="post-form">
    <h1>{{ isEdit ? 'Edit Post' : 'Create New Post' }}</h1>

    <form @submit.prevent="handleSubmit" class="form">
      <div v-if="postStore.error" class="error-message">
        {{ postStore.error }}
      </div>

      <div class="form-group">
        <label for="title">Title *</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          required
          placeholder="Enter post title"
          :disabled="postStore.loading"
        />
      </div>

      <div class="form-group">
        <label for="content">Content *</label>
        <textarea
          id="content"
          v-model="form.content"
          required
          rows="15"
          placeholder="Write your post content..."
          :disabled="postStore.loading"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="status">Status</label>
        <select
          id="status"
          v-model="form.status"
          :disabled="postStore.loading"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div class="form-actions">
        <router-link to="/dashboard/posts" class="btn-cancel">
          Cancel
        </router-link>
        <button type="submit" class="btn-submit" :disabled="postStore.loading">
          {{ postStore.loading ? 'Saving...' : (isEdit ? 'Update Post' : 'Create Post') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostStore } from '../stores/post'

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  title: '',
  content: '',
  status: 'draft' as 'draft' | 'published',
})

async function handleSubmit() {
  if (isEdit.value) {
    const success = await postStore.updatePost(Number(route.params.id), form)
    if (success) {
      router.push('/dashboard/posts')
    }
  } else {
    const success = await postStore.createPost(form)
    if (success) {
      router.push('/dashboard/posts')
    }
  }
}

onMounted(async () => {
  if (isEdit.value) {
    const post = await postStore.fetchPost(Number(route.params.id))
    if (post) {
      form.title = post.title
      form.content = post.content
      form.status = post.status
    }
  }
})
</script>

<style scoped>
.post-form {
  max-width: 800px;
}

h1 {
  margin: 0 0 30px 0;
  font-size: 32px;
  color: #333;
}

.form {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error-message {
  padding: 12px;
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  color: #c33;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 24px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
  font-size: 14px;
}

input, textarea, select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.3s;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: #667eea;
}

input:disabled, textarea:disabled, select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

textarea {
  resize: vertical;
  line-height: 1.6;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.btn-cancel {
  padding: 12px 24px;
  background: #f5f5f5;
  color: #666;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-submit {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
