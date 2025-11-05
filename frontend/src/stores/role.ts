import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/axios'

export interface Role {
  id: number
  name: string
  code: string
  description?: string
  permissions?: string[]
  created_at: string
  updated_at: string
  users_count?: number
  staff_count?: number
}

export interface RoleFormData {
  name: string
  code: string
  description?: string
  permissions?: string[]
}

export const useRoleStore = defineStore('role', () => {
  const roles = ref<Role[]>([])
  const currentRole = ref<Role | null>(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchRoles(page = 1) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/roles?page=${page}`)
      roles.value = response.data.data
      pagination.value = {
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        per_page: response.data.per_page,
        total: response.data.total
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch roles'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchRole(id: number) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/roles/${id}`)
      currentRole.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch role'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createRole(data: RoleFormData) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/roles', data)
      await fetchRoles()
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create role'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateRole(id: number, data: RoleFormData) {
    loading.value = true
    error.value = null
    try {
      const response = await api.put(`/roles/${id}`, data)
      await fetchRoles()
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update role'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteRole(id: number) {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/roles/${id}`)
      await fetchRoles()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete role'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    roles,
    currentRole,
    pagination,
    loading,
    error,
    fetchRoles,
    fetchRole,
    createRole,
    updateRole,
    deleteRole
  }
})
