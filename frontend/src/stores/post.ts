import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/axios'

export interface Post {
  id: number
  title: string
  content: string
  status: 'draft' | 'published'
  user_id: number
  user?: {
    id: number
    name: string
    email: string
  }
  created_at: string
  updated_at: string
}

export interface PostFormData {
  title: string
  content: string
  status: 'draft' | 'published'
}

export interface PaginatedPosts {
  data: Post[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export const usePostStore = defineStore('post', () => {
  const posts = ref<Post[]>([])
  const currentPost = ref<Post | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    perPage: 15,
    total: 0,
  })

  async function fetchPosts(page = 1) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<PaginatedPosts>(`/posts?page=${page}`)
      posts.value = response.data.data
      pagination.value = {
        currentPage: response.data.current_page,
        lastPage: response.data.last_page,
        perPage: response.data.per_page,
        total: response.data.total,
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch posts'
    } finally {
      loading.value = false
    }
  }

  async function fetchPost(id: number) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<Post>(`/posts/${id}`)
      currentPost.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch post'
      return null
    } finally {
      loading.value = false
    }
  }

  async function createPost(data: PostFormData) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post<Post>('/posts', data)
      posts.value.unshift(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create post'
      return null
    } finally {
      loading.value = false
    }
  }

  async function updatePost(id: number, data: PostFormData) {
    loading.value = true
    error.value = null
    try {
      const response = await api.put<Post>(`/posts/${id}`, data)
      const index = posts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        posts.value[index] = response.data
      }
      currentPost.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update post'
      return null
    } finally {
      loading.value = false
    }
  }

  async function deletePost(id: number) {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/posts/${id}`)
      posts.value = posts.value.filter(p => p.id !== id)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete post'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    posts,
    currentPost,
    loading,
    error,
    pagination,
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
  }
})
