import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/axios'

export interface Department {
  id: number
  company_id: number
  name: string
  code: string
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
  company?: any
  staff?: any[]
}

export interface DepartmentFormData {
  company_id: number
  name: string
  code: string
  description?: string
  is_active: boolean
}

export const useDepartmentStore = defineStore('department', () => {
  const departments = ref<Department[]>([])
  const currentDepartment = ref<Department | null>(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchDepartments(page = 1, companyId?: number) {
    loading.value = true
    error.value = null
    try {
      let url = `/departments?page=${page}`
      if (companyId) {
        url += `&company_id=${companyId}`
      }
      const response = await api.get(url)
      departments.value = response.data.data
      pagination.value = {
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        per_page: response.data.per_page,
        total: response.data.total
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch departments'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchDepartment(id: number) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/departments/${id}`)
      currentDepartment.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch department'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createDepartment(data: DepartmentFormData) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/departments', data)
      await fetchDepartments()
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create department'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateDepartment(id: number, data: DepartmentFormData) {
    loading.value = true
    error.value = null
    try {
      const response = await api.put(`/departments/${id}`, data)
      await fetchDepartments()
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update department'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteDepartment(id: number) {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/departments/${id}`)
      await fetchDepartments()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete department'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    departments,
    currentDepartment,
    pagination,
    loading,
    error,
    fetchDepartments,
    fetchDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment
  }
})
