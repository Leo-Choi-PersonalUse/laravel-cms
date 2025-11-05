import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/axios'

export interface Staff {
  id: number
  user_id?: number
  company_id: number
  department_id: number
  role_id: number
  employee_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  hire_date: string
  termination_date?: string
  status: 'active' | 'inactive' | 'terminated'
  created_at: string
  updated_at: string
  user?: any
  company?: any
  department?: any
  role?: any
}

export interface StaffFormData {
  user_id?: number
  company_id: number
  department_id: number
  role_id: number
  employee_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  hire_date: string
  termination_date?: string
  status: 'active' | 'inactive' | 'terminated'
}

export const useStaffStore = defineStore('staff', () => {
  const staffList = ref<Staff[]>([])
  const currentStaff = ref<Staff | null>(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchStaff(page = 1, filters?: {
    company_id?: number
    department_id?: number
    status?: string
  }) {
    loading.value = true
    error.value = null
    try {
      let url = `/staff?page=${page}`
      if (filters?.company_id) {
        url += `&company_id=${filters.company_id}`
      }
      if (filters?.department_id) {
        url += `&department_id=${filters.department_id}`
      }
      if (filters?.status) {
        url += `&status=${filters.status}`
      }
      const response = await api.get(url)
      staffList.value = response.data.data
      pagination.value = {
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        per_page: response.data.per_page,
        total: response.data.total
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch staff'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchStaffMember(id: number) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/staff/${id}`)
      currentStaff.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch staff member'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createStaff(data: StaffFormData) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/staff', data)
      await fetchStaff()
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create staff member'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateStaff(id: number, data: StaffFormData) {
    loading.value = true
    error.value = null
    try {
      const response = await api.put(`/staff/${id}`, data)
      await fetchStaff()
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update staff member'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteStaff(id: number) {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/staff/${id}`)
      await fetchStaff()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete staff member'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    staffList,
    currentStaff,
    pagination,
    loading,
    error,
    fetchStaff,
    fetchStaffMember,
    createStaff,
    updateStaff,
    deleteStaff
  }
})
