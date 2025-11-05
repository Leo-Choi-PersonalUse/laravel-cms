<template>
  <div class="companies-list">
    <div class="header">
      <h1>Companies</h1>
      <button @click="goToCreate" class="btn-primary">
        <span>+</span> Add Company
      </button>
    </div>

    <DataTable
      :data="companyStore.companies"
      :columns="columns"
      :loading="companyStore.loading"
      :row-actions="rowActions"
      searchable
      paginate
      :default-per-page="15"
      :item-count="companyStore.pagination.total"
      @page-change="handlePageChange"
      @per-page-change="handlePerPageChange"
      @sort-change="handleSort"
    >
      <!-- Custom Code Cell -->
      <template #cell-code="{ value }">
        <span class="company-code">{{ value }}</span>
      </template>

      <!-- Custom Email Cell -->
      <template #cell-email="{ value }">
        <a v-if="value" :href="`mailto:${value}`" class="email-link">
          {{ value }}
        </a>
        <span v-else class="text-muted">-</span>
      </template>

      <!-- Custom Phone Cell -->
      <template #cell-phone="{ value }">
        <a v-if="value" :href="`tel:${value}`" class="phone-link">
          {{ value }}
        </a>
        <span v-else class="text-muted">-</span>
      </template>

      <!-- Custom Status Cell -->
      <template #cell-is_active="{ value }">
        <span :class="['status-badge', value ? 'active' : 'inactive']">
          {{ value ? 'Active' : 'Inactive' }}
        </span>
      </template>

      <!-- Custom Created At Cell -->
      <template #cell-created_at="{ value }">
        <span class="date-cell">{{ formatDate(value) }}</span>
      </template>
    </DataTable>

    <div v-if="showDeleteConfirm" class="modal-overlay" @click="showDeleteConfirm = false">
      <div class="modal" @click.stop>
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete this company?</p>
        <div class="modal-actions">
          <button @click="showDeleteConfirm = false" class="btn-cancel">Cancel</button>
          <button @click="deleteCompany" class="btn-delete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCompanyStore, type Company } from '../stores/company'
import DataTable from '../components/DataTable.vue'

const router = useRouter()
const companyStore = useCompanyStore()
const showDeleteConfirm = ref(false)
const companyToDelete = ref<number | null>(null)
const currentSortBy = ref('id')
const currentSortOrder = ref<'asc' | 'desc'>('asc')

// Column definitions
const columns = [
  { 
    key: 'id', 
    label: 'ID', 
    sortable: true 
  },
  { 
    key: 'code', 
    label: 'Code', 
    sortable: true 
  },
  { 
    key: 'name', 
    label: 'Company Name', 
    sortable: true 
  },
  { 
    key: 'email', 
    label: 'Email', 
    sortable: true 
  },
  { 
    key: 'phone', 
    label: 'Phone', 
    sortable: false 
  },
  { 
    key: 'is_active', 
    label: 'Status', 
    sortable: true 
  },
  { 
    key: 'created_at', 
    label: 'Created', 
    sortable: true 
  },
]

// Row actions
const rowActions = [
  {
    name: 'edit',
    label: 'Edit',
    handler: (row: Company) => goToEdit(row.id),
    class: 'btn-edit'
  },
  {
    name: 'delete',
    label: 'Delete',
    handler: (row: Company) => confirmDelete(row.id),
    class: 'btn-delete'
  }
]

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(async () => {
  try {
    await companyStore.fetchCompanies()
    console.log('Companies loaded:', companyStore.companies.length)
  } catch (error) {
    console.error('Failed to load companies:', error)
  }
})

function goToCreate() {
  router.push('/dashboard/companies/create')
}

function goToEdit(id: number) {
  router.push(`/dashboard/companies/${id}/edit`)
}

function confirmDelete(id: number) {
  companyToDelete.value = id
  showDeleteConfirm.value = true
}

async function deleteCompany() {
  if (companyToDelete.value) {
    try {
      await companyStore.deleteCompany(companyToDelete.value)
      showDeleteConfirm.value = false
      companyToDelete.value = null
    } catch (error) {
      console.error('Error deleting company:', error)
    }
  }
}

const handlePageChange = async (page: number) => {
  await companyStore.fetchCompanies(
    page,
    companyStore.pagination.per_page,
    currentSortBy.value,
    currentSortOrder.value
  )
}

const handlePerPageChange = async (perPage: number) => {
  await companyStore.fetchCompanies(
    1,
    perPage,
    currentSortBy.value,
    currentSortOrder.value
  )
}

const handleSort = async (sortBy: string, sortOrder: 'asc' | 'desc') => {
  currentSortBy.value = sortBy
  currentSortOrder.value = sortOrder
  await companyStore.fetchCompanies(
    1,
    companyStore.pagination.per_page,
    sortBy,
    sortOrder
  )
}
</script>

<style scoped>
.companies-list {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2rem;
  font-weight: 600;
  color: #1a202c;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
}

/* Custom Cell Styles */
.company-code {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #4f46e5;
  background-color: #eef2ff;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.email-link,
.phone-link {
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.2s;
}

.email-link:hover,
.phone-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

.text-muted {
  color: #9ca3af;
  font-style: italic;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active {
  background-color: #d1fae5;
  color: #065f46;
}

.status-badge.inactive {
  background-color: #fee2e2;
  color: #991b1b;
}

.date-cell {
  color: #4b5563;
  font-size: 0.875rem;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal h3 {
  margin: 0 0 1rem 0;
  color: #1a202c;
  font-size: 1.25rem;
}

.modal p {
  margin: 0 0 1.5rem 0;
  color: #4a5568;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.btn-cancel:hover {
  background: #f7fafc;
}

.btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  background: #ef4444;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.btn-delete:hover {
  background: #dc2626;
}
</style>
