<template>
  <div class="company-form">
    <div class="header">
      <h1>{{ isEdit ? 'Edit Company' : 'Create Company' }}</h1>
      <button @click="goBack" class="btn-back">Back</button>
    </div>

    <div v-if="companyStore.loading" class="loading">Loading...</div>

    <form v-else @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="name">Company Name *</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          placeholder="Enter company name"
        />
      </div>

      <div class="form-group">
        <label for="code">Company Code *</label>
        <input
          id="code"
          v-model="form.code"
          type="text"
          required
          placeholder="Enter company code"
        />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="Enter email address"
        />
      </div>

      <div class="form-group">
        <label for="phone">Phone</label>
        <input
          id="phone"
          v-model="form.phone"
          type="tel"
          placeholder="Enter phone number"
        />
      </div>

      <div class="form-group">
        <label for="address">Address</label>
        <textarea
          id="address"
          v-model="form.address"
          rows="3"
          placeholder="Enter company address"
        ></textarea>
      </div>

      <div class="form-group">
        <label class="checkbox-label">
          <input
            v-model="form.is_active"
            type="checkbox"
          />
          <span>Active</span>
        </label>
      </div>

      <div v-if="error" class="error-message">{{ error }}</div>

      <div class="form-actions">
        <button type="button" @click="goBack" class="btn-cancel">Cancel</button>
        <button type="submit" class="btn-submit" :disabled="companyStore.loading">
          {{ isEdit ? 'Update' : 'Create' }} Company
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCompanyStore, type CompanyFormData } from '../stores/company'

const router = useRouter()
const route = useRoute()
const companyStore = useCompanyStore()

const isEdit = computed(() => !!route.params.id)
const error = ref<string | null>(null)

const form = reactive<CompanyFormData>({
  name: '',
  code: '',
  address: '',
  phone: '',
  email: '',
  is_active: true
})

onMounted(async () => {
  if (isEdit.value) {
    try {
      const company = await companyStore.fetchCompany(Number(route.params.id))
      Object.assign(form, {
        name: company.name,
        code: company.code,
        address: company.address || '',
        phone: company.phone || '',
        email: company.email || '',
        is_active: company.is_active
      })
    } catch (err) {
      error.value = 'Failed to load company'
    }
  }
})

async function handleSubmit() {
  error.value = null
  try {
    if (isEdit.value) {
      await companyStore.updateCompany(Number(route.params.id), form)
    } else {
      await companyStore.createCompany(form)
    }
    router.push('/dashboard/companies')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to save company'
  }
}

function goBack() {
  router.push('/dashboard/companies')
}
</script>

<style scoped>
.company-form {
  padding: 2rem;
  max-width: 800px;
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

.btn-back {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  color: #4a5568;
}

.btn-back:hover {
  background: #f7fafc;
}

.form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2d3748;
}

input[type="text"],
input[type="email"],
input[type="tel"],
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

textarea {
  resize: vertical;
  font-family: inherit;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  cursor: pointer;
}

.error-message {
  padding: 1rem;
  background: #fed7d7;
  color: #c53030;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  color: #4a5568;
  font-weight: 500;
}

.btn-cancel:hover {
  background: #f7fafc;
}

.btn-submit {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.btn-submit:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading {
  padding: 2rem;
  text-align: center;
  color: #4a5568;
}
</style>
