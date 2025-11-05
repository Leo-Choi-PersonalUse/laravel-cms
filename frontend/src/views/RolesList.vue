<template>
  <div class="roles-list">
    <div class="header">
      <h1>Roles</h1>
      <button @click="goToCreate" class="btn-primary">
        <span>+</span> Add Role
      </button>
    </div>

    <div v-if="roleStore.loading" class="loading">Loading roles...</div>
    <div v-else-if="roleStore.error" class="error">{{ roleStore.error }}</div>

    <div v-else class="table-container">
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Description</th>
            <th>Users</th>
            <th>Staff</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="role in roleStore.roles" :key="role.id">
            <td>{{ role.code }}</td>
            <td>{{ role.name }}</td>
            <td>{{ role.description || '-' }}</td>
            <td>{{ role.users_count || 0 }}</td>
            <td>{{ role.staff_count || 0 }}</td>
            <td class="actions">
              <button @click="goToEdit(role.id)" class="btn-edit">Edit</button>
              <button @click="confirmDelete(role.id)" class="btn-delete">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination">
        <button 
          @click="changePage(roleStore.pagination.current_page - 1)"
          :disabled="roleStore.pagination.current_page === 1"
          class="btn-page"
        >
          Previous
        </button>
        <span class="page-info">
          Page {{ roleStore.pagination.current_page }} of {{ roleStore.pagination.last_page }}
        </span>
        <button 
          @click="changePage(roleStore.pagination.current_page + 1)"
          :disabled="roleStore.pagination.current_page === roleStore.pagination.last_page"
          class="btn-page"
        >
          Next
        </button>
      </div>
    </div>

    <div v-if="showDeleteConfirm" class="modal-overlay" @click="showDeleteConfirm = false">
      <div class="modal" @click.stop>
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete this role?</p>
        <div class="modal-actions">
          <button @click="showDeleteConfirm = false" class="btn-cancel">Cancel</button>
          <button @click="deleteRole" class="btn-delete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRoleStore } from '../stores/role'

const router = useRouter()
const roleStore = useRoleStore()
const showDeleteConfirm = ref(false)
const roleToDelete = ref<number | null>(null)

onMounted(() => {
  roleStore.fetchRoles()
})

function goToCreate() {
  router.push('/dashboard/roles/create')
}

function goToEdit(id: number) {
  router.push(`/dashboard/roles/${id}/edit`)
}

function confirmDelete(id: number) {
  roleToDelete.value = id
  showDeleteConfirm.value = true
}

async function deleteRole() {
  if (roleToDelete.value) {
    try {
      await roleStore.deleteRole(roleToDelete.value)
      showDeleteConfirm.value = false
      roleToDelete.value = null
    } catch (error) {
      console.error('Error deleting role:', error)
    }
  }
}

function changePage(page: number) {
  roleStore.fetchRoles(page)
}
</script>

<style scoped>
.roles-list {
  padding: 2rem;
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
}

.btn-primary:hover {
  opacity: 0.9;
}

.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f7fafc;
}

th {
  text-align: left;
  padding: 1rem;
  font-weight: 600;
  color: #4a5568;
  border-bottom: 2px solid #e2e8f0;
}

td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit, .btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
}

.btn-edit {
  background: #e6fffa;
  color: #234e52;
}

.btn-edit:hover {
  background: #b2f5ea;
}

.btn-delete {
  background: #fff5f5;
  color: #c53030;
}

.btn-delete:hover {
  background: #fed7d7;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f7fafc;
}

.btn-page {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
}

.btn-page:hover:not(:disabled) {
  background: #edf2f7;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #4a5568;
  font-weight: 500;
}

.loading, .error {
  padding: 2rem;
  text-align: center;
  color: #4a5568;
}

.error {
  color: #c53030;
}

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
}

.modal h3 {
  margin: 0 0 1rem 0;
  color: #1a202c;
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
}

.btn-cancel:hover {
  background: #f7fafc;
}
</style>
