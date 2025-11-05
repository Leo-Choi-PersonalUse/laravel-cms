<template>
  <div class="example-container">
    <h1>DataTable Component Examples</h1>

    <!-- Example 1: Basic Usage -->
    <section class="example-section">
      <h2>Basic Usage</h2>
      <DataTable
        :data="users"
        :columns="userColumns"
        :loading="loading"
      />
    </section>

    <!-- Example 2: With Custom Actions -->
    <section class="example-section">
      <h2>With Row Actions</h2>
      <DataTable
        :data="users"
        :columns="userColumns"
        :row-actions="rowActions"
      />
    </section>

    <!-- Example 3: With Custom Cell Rendering -->
    <section class="example-section">
      <h2>With Custom Cell Slots</h2>
      <DataTable
        :data="users"
        :columns="userColumns"
      >
        <template #cell-email="{ value }">
          <a :href="`mailto:${value}`" class="email-link">{{ value }}</a>
        </template>
        <template #cell-status="{ value }">
          <span :class="['status-badge', value]">{{ value }}</span>
        </template>
        <template #rowActions="{ row }">
          <button @click="editUser(row)" class="btn-edit">Edit</button>
          <button @click="deleteUser(row)" class="btn-delete">Delete</button>
        </template>
      </DataTable>
    </section>

    <!-- Example 4: With Table Actions -->
    <section class="example-section">
      <h2>With Table Actions</h2>
      <DataTable
        :data="users"
        :columns="userColumns"
      >
        <template #actions>
          <button @click="addUser" class="btn-primary">Add User</button>
          <button @click="exportData" class="btn-secondary">Export</button>
        </template>
      </DataTable>
    </section>

    <!-- Example 5: Without Search or Pagination -->
    <section class="example-section">
      <h2>Simple Table (No Search/Pagination)</h2>
      <DataTable
        :data="users.slice(0, 5)"
        :columns="userColumns"
        :searchable="false"
        :paginate="false"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DataTable from './DataTable.vue'

// Sample data
const loading = ref(false)
const users = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'inactive' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Manager', status: 'active' },
  { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'pending' },
  { id: 6, name: 'Diana Prince', email: 'diana@example.com', role: 'Admin', status: 'active' },
  { id: 7, name: 'Eve Davis', email: 'eve@example.com', role: 'User', status: 'inactive' },
  { id: 8, name: 'Frank Miller', email: 'frank@example.com', role: 'Manager', status: 'active' },
  { id: 9, name: 'Grace Lee', email: 'grace@example.com', role: 'User', status: 'active' },
  { id: 10, name: 'Henry Wilson', email: 'henry@example.com', role: 'User', status: 'pending' },
])

// Column definitions
const userColumns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { 
    key: 'status', 
    label: 'Status', 
    sortable: true,
    format: (value: string) => value.toUpperCase()
  },
]

// Row actions
const rowActions = [
  {
    name: 'edit',
    label: 'Edit',
    handler: (row: any) => editUser(row),
    class: 'btn-edit'
  },
  {
    name: 'delete',
    label: 'Delete',
    handler: (row: any) => deleteUser(row),
    class: 'btn-delete'
  }
]

// Action handlers
const editUser = (user: any) => {
  console.log('Edit user:', user)
  alert(`Editing user: ${user.name}`)
}

const deleteUser = (user: any) => {
  console.log('Delete user:', user)
  if (confirm(`Are you sure you want to delete ${user.name}?`)) {
    const index = users.value.findIndex(u => u.id === user.id)
    if (index > -1) {
      users.value.splice(index, 1)
    }
  }
}

const addUser = () => {
  console.log('Add new user')
  alert('Add new user clicked')
}

const exportData = () => {
  console.log('Export data')
  alert('Export data clicked')
}
</script>

<style scoped>
.example-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #1f2937;
}

.example-section {
  margin-bottom: 3rem;
}

.example-section h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #374151;
}

.email-link {
  color: #3b82f6;
  text-decoration: none;
}

.email-link:hover {
  text-decoration: underline;
}

.status-badge {
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

.status-badge.pending {
  background-color: #fef3c7;
  color: #92400e;
}

.btn-primary,
.btn-secondary,
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
</style>
