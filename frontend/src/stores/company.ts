import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/axios'

export interface Company {
  id: number
  name: string
  code: string
  address?: string
  phone?: string
  email?: string
  is_active: boolean
  created_at: string
  updated_at: string
  departments?: any[]
  staff?: any[]
}

export interface CompanyFormData {
  name: string
  code: string
  address?: string
  phone?: string
  email?: string
  is_active: boolean
}

export const useCompanyStore = defineStore('company', () => {
  const companies = ref<Company[]>([])
  const currentCompany = ref<Company | null>(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchCompanies(page = 1) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/companies?page=${page}`)
      companies.value = response.data.data
      pagination.value = {
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        per_page: response.data.per_page,
        total: response.data.total
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch companies'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCompany(id: number) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/companies/${id}`)
      currentCompany.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch company'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createCompany(data: CompanyFormData) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/companies', data)
      await fetchCompanies()
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create company'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateCompany(id: number, data: CompanyFormData) {
    loading.value = true
    error.value = null
    try {
      const response = await api.put(`/companies/${id}`, data)
      await fetchCompanies()
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update company'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteCompany(id: number) {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/companies/${id}`)
      await fetchCompanies()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete company'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    companies,
    currentCompany,
    pagination,
    loading,
    error,
    fetchCompanies,
    fetchCompany,
    createCompany,
    updateCompany,
    deleteCompany
  }
})
