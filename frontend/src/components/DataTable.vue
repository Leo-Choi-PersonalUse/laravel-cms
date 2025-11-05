<template>
  <div class="data-table">
    <!-- Search and Actions Bar -->
    <div class="table-header" v-if="searchable || $slots.actions">
      <div class="search-box" v-if="searchable">
        <input
          type="text"
          v-model="searchQuery"
          :placeholder="searchPlaceholder"
          class="search-input"
        />
      </div>
      <div class="table-actions" v-if="$slots.actions">
        <slot name="actions"></slot>
      </div>
    </div>

    <!-- Table -->
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="{ sortable: column.sortable !== false }"
              @click="column.sortable !== false && handleSort(column.key)"
            >
              {{ column.label }}
              <span v-if="column.sortable !== false && sortKey === column.key" class="sort-icon">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th v-if="$slots.actions || rowActions" class="actions-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td :colspan="columns.length + (($slots.actions || rowActions) ? 1 : 0)" class="loading-cell">
              <div class="loading-spinner"></div>
            </td>
          </tr>
          <tr v-else-if="paginatedData.length === 0">
            <td :colspan="columns.length + (($slots.actions || rowActions) ? 1 : 0)" class="empty-cell">
              {{ emptyText }}
            </td>
          </tr>
          <tr v-else v-for="(row, index) in paginatedData" :key="row[rowKey] || index">
            <td v-for="column in columns" :key="column.key">
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                {{ formatCell(row[column.key], column) }}
              </slot>
            </td>
            <td v-if="$slots.rowActions || rowActions" class="row-actions">
              <slot name="rowActions" :row="row" :index="index">
                <button
                  v-for="action in rowActions"
                  :key="action.name"
                  @click="action.handler(row)"
                  :class="['action-btn', action.class]"
                  :title="action.label"
                >
                  {{ action.label }}
                </button>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="table-footer" v-if="paginate && (itemCount ? itemCount > 0 : totalPages > 1)">
      <div class="pagination-info">
        Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ itemCount || filteredData.length }} entries
      </div>
      <div class="pagination">
        <button
          @click="currentPage = 1"
          :disabled="currentPage === 1"
          class="pagination-btn"
        >
          First
        </button>
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="pagination-btn"
        >
          Previous
        </button>
        <span class="page-numbers">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            :class="['pagination-btn', { active: currentPage === page }]"
          >
            {{ page }}
          </button>
        </span>
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="pagination-btn"
        >
          Next
        </button>
        <button
          @click="currentPage = totalPages"
          :disabled="currentPage === totalPages"
          class="pagination-btn"
        >
          Last
        </button>
      </div>
      <div class="per-page-selector">
        <label>
          Per page:
          <select v-model.number="perPage">
            <option v-for="option in perPageOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Column {
  key: string
  label: string
  sortable?: boolean
  format?: (value: any) => string
}

interface RowAction {
  name: string
  label: string
  handler: (row: any) => void
  class?: string
}

interface Props {
  data: any[]
  columns: Column[]
  rowKey?: string
  searchable?: boolean
  searchPlaceholder?: string
  paginate?: boolean
  perPageOptions?: number[]
  defaultPerPage?: number
  emptyText?: string
  loading?: boolean
  rowActions?: RowAction[]
  itemCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  rowKey: 'id',
  searchable: true,
  searchPlaceholder: 'Search...',
  paginate: true,
  perPageOptions: () => [10, 25, 50, 100],
  defaultPerPage: 10,
  emptyText: 'No data available',
  loading: false
})

const emit = defineEmits<{
  pageChange: [page: number]
  perPageChange: [perPage: number]
}>()

const searchQuery = ref('')
const sortKey = ref<string>('')
const sortOrder = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)
const perPage = ref(props.defaultPerPage)

// Computed: Filtered data based on search
const filteredData = computed(() => {
  if (!searchQuery.value) return props.data

  const query = searchQuery.value.toLowerCase()
  return props.data.filter(row => {
    return props.columns.some(column => {
      const value = row[column.key]
      return value != null && String(value).toLowerCase().includes(query)
    })
  })
})

// Computed: Sorted data
const sortedData = computed(() => {
  if (!sortKey.value) return filteredData.value

  return [...filteredData.value].sort((a, b) => {
    const aVal = a[sortKey.value]
    const bVal = b[sortKey.value]

    if (aVal == null) return 1
    if (bVal == null) return -1

    let comparison = 0
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      comparison = aVal - bVal
    } else {
      comparison = String(aVal).localeCompare(String(bVal))
    }

    return sortOrder.value === 'asc' ? comparison : -comparison
  })
})

// Computed: Total pages
const totalPages = computed(() => {
  if (!props.paginate) return 1
  if (props.itemCount) {
    return Math.ceil(props.itemCount / perPage.value)
  }
  return Math.ceil(sortedData.value.length / perPage.value)
})

// Computed: Visible page numbers
const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Computed: Paginated data
const paginatedData = computed(() => {
  if (!props.paginate) return sortedData.value
  
  // If using server-side pagination (itemCount provided), return data as-is
  if (props.itemCount) return sortedData.value

  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return sortedData.value.slice(start, end)
})

// Computed: Start and end indices for pagination info
const startIndex = computed(() => (currentPage.value - 1) * perPage.value)
const endIndex = computed(() => {
  const total = props.itemCount || filteredData.value.length
  return Math.min(startIndex.value + perPage.value, total)
})

// Handle sorting
const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

// Format cell value
const formatCell = (value: any, column: Column) => {
  if (column.format) {
    return column.format(value)
  }
  return value != null ? String(value) : ''
}

// Reset to first page when search or perPage changes
watch([searchQuery, perPage], () => {
  currentPage.value = 1
  if (props.itemCount) {
    emit('perPageChange', perPage.value)
  }
})

// Emit page change when using server-side pagination
watch(currentPage, (newPage) => {
  if (props.itemCount) {
    emit('pageChange', newPage)
  }
})
</script>

<style scoped>
.data-table {
  width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  gap: 1rem;
}

.search-box {
  flex: 1;
  max-width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.table-actions {
  display: flex;
  gap: 0.5rem;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
  white-space: nowrap;
}

th.sortable {
  cursor: pointer;
  user-select: none;
}

th.sortable:hover {
  background-color: #f3f4f6;
}

.sort-icon {
  margin-left: 0.5rem;
  color: #3b82f6;
}

tbody tr {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
}

tbody tr:hover {
  background-color: #f9fafb;
}

tbody tr:last-child {
  border-bottom: none;
}

td {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #1f2937;
}

.loading-cell,
.empty-cell {
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
}

.loading-spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.actions-column {
  text-align: right;
}

.row-actions {
  text-align: right;
  white-space: nowrap;
}

.action-btn {
  padding: 0.25rem 0.75rem;
  margin-left: 0.5rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  gap: 1rem;
  flex-wrap: wrap;
}

.pagination-info {
  font-size: 0.875rem;
  color: #6b7280;
}

.pagination {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.pagination-btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #000;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn.active {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.per-page-selector {
  font-size: 0.875rem;
  color: #6b7280;
}

.per-page-selector select {
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.per-page-selector select:focus {
  outline: none;
  border-color: #3b82f6;
}

@media (max-width: 768px) {
  .table-header {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: none;
  }

  .table-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .pagination {
    justify-content: center;
  }

  .per-page-selector {
    text-align: center;
  }
}
</style>
