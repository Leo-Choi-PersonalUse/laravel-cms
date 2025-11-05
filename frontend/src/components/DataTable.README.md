# DataTable Component

A feature-rich, customizable data table component for Vue 3 with TypeScript support.

## Features

- ✅ **Sorting** - Click column headers to sort data
- ✅ **Search** - Real-time search across all columns
- ✅ **Pagination** - Built-in pagination with customizable page sizes
- ✅ **Custom Cell Rendering** - Use slots for custom cell content
- ✅ **Row Actions** - Add action buttons for each row
- ✅ **Table Actions** - Add global actions (e.g., Add, Export)
- ✅ **Loading State** - Display loading spinner
- ✅ **Empty State** - Customizable empty message
- ✅ **Responsive** - Mobile-friendly design
- ✅ **TypeScript** - Full TypeScript support

## Installation

The component is already included in the project at `src/components/DataTable.vue`.

## Basic Usage

```vue
<template>
  <DataTable
    :data="users"
    :columns="columns"
  />
</template>

<script setup lang="ts">
import DataTable from '@/components/DataTable.vue'
import { ref } from 'vue'

const users = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
])

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
]
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Array` | **Required** | Array of data objects to display |
| `columns` | `Column[]` | **Required** | Column configuration array |
| `rowKey` | `string` | `'id'` | Unique key property for rows |
| `searchable` | `boolean` | `true` | Enable/disable search functionality |
| `searchPlaceholder` | `string` | `'Search...'` | Placeholder text for search input |
| `paginate` | `boolean` | `true` | Enable/disable pagination |
| `perPageOptions` | `number[]` | `[10, 25, 50, 100]` | Options for items per page |
| `defaultPerPage` | `number` | `10` | Default items per page |
| `emptyText` | `string` | `'No data available'` | Text to show when data is empty |
| `loading` | `boolean` | `false` | Show loading spinner |
| `rowActions` | `RowAction[]` | `undefined` | Array of row action configurations |

## Column Configuration

```typescript
interface Column {
  key: string          // Property name in data object
  label: string        // Display label for column header
  sortable?: boolean   // Enable/disable sorting (default: true)
  format?: (value: any) => string  // Custom formatter function
}
```

### Example with Column Configuration

```vue
<script setup lang="ts">
const columns = [
  { 
    key: 'id', 
    label: 'ID', 
    sortable: true 
  },
  { 
    key: 'name', 
    label: 'Full Name', 
    sortable: true 
  },
  { 
    key: 'createdAt', 
    label: 'Created', 
    format: (value) => new Date(value).toLocaleDateString() 
  },
  { 
    key: 'status', 
    label: 'Status', 
    format: (value) => value.toUpperCase() 
  },
]
</script>
```

## Row Actions

```typescript
interface RowAction {
  name: string                    // Unique identifier
  label: string                   // Button text
  handler: (row: any) => void    // Click handler function
  class?: string                  // Optional CSS class
}
```

### Example with Row Actions

```vue
<template>
  <DataTable
    :data="users"
    :columns="columns"
    :row-actions="actions"
  />
</template>

<script setup lang="ts">
const actions = [
  {
    name: 'edit',
    label: 'Edit',
    handler: (row) => {
      console.log('Edit:', row)
    },
    class: 'btn-primary'
  },
  {
    name: 'delete',
    label: 'Delete',
    handler: (row) => {
      if (confirm(`Delete ${row.name}?`)) {
        // Delete logic
      }
    },
    class: 'btn-danger'
  }
]
</script>
```

## Slots

### `actions`
Add global action buttons in the table header.

```vue
<DataTable :data="users" :columns="columns">
  <template #actions>
    <button @click="addNew">Add New</button>
    <button @click="exportData">Export</button>
  </template>
</DataTable>
```

### `cell-{columnKey}`
Customize individual cell rendering.

```vue
<DataTable :data="users" :columns="columns">
  <template #cell-email="{ row, value }">
    <a :href="`mailto:${value}`">{{ value }}</a>
  </template>
  <template #cell-status="{ row, value }">
    <span :class="['badge', value]">{{ value }}</span>
  </template>
</DataTable>
```

### `rowActions`
Fully custom row actions rendering.

```vue
<DataTable :data="users" :columns="columns">
  <template #rowActions="{ row, index }">
    <button @click="edit(row)">✏️ Edit</button>
    <button @click="view(row)">👁️ View</button>
    <button @click="remove(row)">🗑️ Delete</button>
  </template>
</DataTable>
```

## Complete Example

```vue
<template>
  <div class="users-page">
    <h1>Users Management</h1>
    
    <DataTable
      :data="users"
      :columns="columns"
      :loading="loading"
      :row-actions="rowActions"
      searchable
      paginate
    >
      <!-- Global Actions -->
      <template #actions>
        <button @click="addUser" class="btn-primary">
          + Add User
        </button>
        <button @click="exportUsers" class="btn-secondary">
          Export CSV
        </button>
      </template>

      <!-- Custom Email Cell -->
      <template #cell-email="{ value }">
        <a :href="`mailto:${value}`" class="email-link">
          {{ value }}
        </a>
      </template>

      <!-- Custom Status Cell -->
      <template #cell-status="{ value }">
        <span :class="['status-badge', value]">
          {{ value }}
        </span>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from '@/components/DataTable.vue'

const loading = ref(false)
const users = ref([])

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { 
    key: 'createdAt', 
    label: 'Created', 
    sortable: true,
    format: (value) => new Date(value).toLocaleDateString()
  },
]

const rowActions = [
  {
    name: 'edit',
    label: 'Edit',
    handler: editUser,
  },
  {
    name: 'delete',
    label: 'Delete',
    handler: deleteUser,
  }
]

const fetchUsers = async () => {
  loading.value = true
  try {
    // Fetch users from API
    const response = await fetch('/api/users')
    users.value = await response.json()
  } catch (error) {
    console.error('Failed to fetch users:', error)
  } finally {
    loading.value = false
  }
}

const addUser = () => {
  // Navigate to add user form
  console.log('Add user')
}

const editUser = (user: any) => {
  // Navigate to edit user form
  console.log('Edit user:', user)
}

const deleteUser = async (user: any) => {
  if (confirm(`Delete ${user.name}?`)) {
    try {
      await fetch(`/api/users/${user.id}`, { method: 'DELETE' })
      await fetchUsers() // Refresh list
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }
}

const exportUsers = () => {
  // Export logic
  console.log('Export users')
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.users-page {
  padding: 2rem;
}

.email-link {
  color: #3b82f6;
  text-decoration: none;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
}

.status-badge.active {
  background-color: #d1fae5;
  color: #065f46;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-secondary {
  background: #6b7280;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
```

## Styling

The component uses scoped styles that can be customized by overriding CSS variables or classes. The default styling includes:

- Clean, modern design
- Hover effects on rows
- Responsive layout
- Accessible color contrast
- Mobile-friendly pagination

## TypeScript Support

The component is fully typed with TypeScript interfaces:

```typescript
import type { Column, RowAction } from '@/components/DataTable.vue'
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Part of the Laravel CMS project.
