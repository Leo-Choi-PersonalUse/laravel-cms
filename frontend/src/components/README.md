# Button Components

Reusable button components for the Laravel CMS.

## Components

### Button.vue
Main button component with different variants and loading states.

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' (default: 'primary')
- `icon`: String emoji or icon character (optional)
- `loading`: Boolean to show loading spinner (default: false)
- `disabled`: Boolean to disable button (default: false)

**Events:**
- `@click`: Emitted when button is clicked

**Usage:**
```vue
<Button variant="primary" icon="➕" @click="handleCreate">
  Add Company
</Button>

<Button variant="danger" :loading="isDeleting" @click="handleDelete">
  Delete
</Button>

<Button variant="secondary" :disabled="true">
  Disabled Button
</Button>
```

### IconButton.vue
Compact icon-only button for actions like edit, delete.

**Props:**
- `icon`: String emoji or icon character (required)
- `variant`: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' (default: 'secondary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `tooltip`: String tooltip text (optional)
- `disabled`: Boolean to disable button (default: false)

**Events:**
- `@click`: Emitted when button is clicked

**Usage:**
```vue
<IconButton icon="✏️" variant="info" tooltip="Edit" @click="handleEdit" />
<IconButton icon="🗑️" variant="danger" tooltip="Delete" @click="handleDelete" />
<IconButton icon="👁️" variant="secondary" size="sm" tooltip="View" @click="handleView" />
```

### ButtonGroup.vue
Container for grouping multiple buttons with proper spacing.

**Props:**
- `align`: 'left' | 'center' | 'right' | 'space-between' (default: 'left')

**Usage:**
```vue
<ButtonGroup align="right">
  <Button variant="secondary" @click="cancel">Cancel</Button>
  <Button variant="primary" @click="save">Save</Button>
</ButtonGroup>

<ButtonGroup align="space-between">
  <Button variant="danger" @click="deleteAll">Delete All</Button>
  <div>
    <Button variant="secondary" @click="cancel">Cancel</Button>
    <Button variant="primary" @click="save">Save</Button>
  </div>
</ButtonGroup>
```

## Complete Example

```vue
<template>
  <div class="page">
    <div class="header">
      <h1>Companies</h1>
      <Button variant="primary" icon="➕" @click="goToCreate">
        Add Company
      </Button>
    </div>

    <table>
      <tr v-for="company in companies" :key="company.id">
        <td>{{ company.name }}</td>
        <td>
          <ButtonGroup align="right">
            <IconButton 
              icon="✏️" 
              variant="info" 
              tooltip="Edit" 
              @click="edit(company.id)" 
            />
            <IconButton 
              icon="🗑️" 
              variant="danger" 
              tooltip="Delete" 
              @click="confirmDelete(company.id)" 
            />
          </ButtonGroup>
        </td>
      </tr>
    </table>

    <ButtonGroup align="right">
      <Button variant="secondary" @click="cancel">Cancel</Button>
      <Button 
        variant="success" 
        :loading="isSaving" 
        @click="save"
      >
        Save Changes
      </Button>
    </ButtonGroup>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/Button.vue'
import IconButton from '@/components/IconButton.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'

// Your component logic here
</script>
```
