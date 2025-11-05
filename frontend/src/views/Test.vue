<template>
  <div class="companies-page">
    <div class="page-header">
      <h1>Companies Management</h1>
      <p class="subtitle">Manage your companies and their information</p>
    </div>

    <DataTable
      :data="companyStore.companies"
      :columns="columns"
      :loading="companyStore.loading"
      :row-actions="rowActions"
      searchable
      paginate
      :default-per-page="15"
    >
      <!-- Global Actions -->
      <template #actions>
        <button @click="handleAddCompany" class="btn-primary">
          + Add Company
        </button>
        <button @click="handleRefresh" class="btn-secondary">
          🔄 Refresh
        </button>
      </template>

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

    <!-- Company Details Modal (optional) -->
    <div v-if="selectedCompany" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedCompany.name }}</h2>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="detail-row">
            <span class="label">Code:</span>
            <span class="value">{{ selectedCompany.code }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Address:</span>
            <span class="value">{{ selectedCompany.address || '-' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Phone:</span>
            <span class="value">{{ selectedCompany.phone || '-' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Email:</span>
            <span class="value">{{ selectedCompany.email || '-' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Status:</span>
            <span class="value">{{ selectedCompany.is_active ? 'Active' : 'Inactive' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Created:</span>
            <span class="value">{{ formatDate(selectedCompany.created_at) }}</span>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="handleEdit(selectedCompany)" class="btn-primary">Edit</button>
          <button @click="closeModal" class="btn-secondary">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from '../components/DataTable.vue'
import { useCompanyStore, type Company } from '../stores/company'

const companyStore = useCompanyStore()
const selectedCompany = ref<Company | null>(null)

// Column definitions
const columns = [
  { 
    key: 'id', 
    label: 'ID', 
    sortable: true 
  },
  { 
    key: 'name', 
    label: 'Company Name', 
    sortable: true 
  },
  { 
    key: 'code', 
    label: 'Code', 
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
    name: 'view',
    label: 'View',
    handler: (row: Company) => handleView(row),
    class: 'btn-info'
  },
  {
    name: 'edit',
    label: 'Edit',
    handler: (row: Company) => handleEdit(row),
    class: 'btn-edit'
  },
  {
    name: 'delete',
    label: 'Delete',
    handler: (row: Company) => handleDelete(row),
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

// Action handlers
const handleAddCompany = () => {
  console.log('Add new company')
  alert('Add Company form would open here')
  // TODO: Navigate to add company form or open modal
}

const handleRefresh = async () => {
  await companyStore.fetchCompanies()
}

const handleView = (company: Company) => {
  console.log('View company:', company)
  selectedCompany.value = company
}

const handleEdit = (company: Company) => {
  console.log('Edit company:', company)
  alert(`Edit company: ${company.name}`)
  // TODO: Navigate to edit form or open edit modal
  closeModal()
}

const handleDelete = async (company: Company) => {
  if (confirm(`Are you sure you want to delete "${company.name}"?`)) {
    try {
      await companyStore.deleteCompany(company.id)
      alert('Company deleted successfully')
    } catch (error) {
      console.error('Failed to delete company:', error)
      alert('Failed to delete company')
    }
  }
}

const closeModal = () => {
  selectedCompany.value = null
}

// Fetch companies on mount
onMounted(async () => {
  await companyStore.fetchCompanies()
})
</script>

<style scoped>
.companies-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #6b7280;
  font-size: 1rem;
}

/* Button Styles */
.btn-primary,
.btn-secondary,
.btn-info,
.btn-edit,
.btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
}

.btn-info {
  background-color: #0ea5e9;
  color: white;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
}

.btn-info:hover {
  background-color: #0284c7;
}

.btn-edit {
  background-color: #10b981;
  color: white;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
}

.btn-edit:hover {
  background-color: #059669;
}

.btn-delete {
  background-color: #ef4444;
  color: white;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
}

.btn-delete:hover {
  background-color: #dc2626;
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #6b7280;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.modal-body {
  padding: 1.5rem;
}

.detail-row {
  display: flex;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row .label {
  font-weight: 600;
  color: #4b5563;
  min-width: 120px;
}

.detail-row .value {
  color: #1f2937;
  flex: 1;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

/* Responsive */
@media (max-width: 768px) {
  .companies-page {
    padding: 1rem;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }

  .modal-content {
    width: 95%;
  }

  .detail-row {
    flex-direction: column;
    gap: 0.25rem;
  }

  .detail-row .label {
    min-width: auto;
  }
}
</style>
