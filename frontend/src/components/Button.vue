<template>
  <button
    :class="['btn', `btn-${variant}`, { 'btn-loading': loading, 'btn-disabled': disabled }]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="spinner"></span>
    <span v-if="icon && !loading" class="icon">{{ icon }}</span>
    <span class="btn-text"><slot /></span>
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
  icon?: string
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  loading: false,
  disabled: false
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

function handleClick(event: MouseEvent) {
  if (!props.loading && !props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover:not(:disabled) {
  background: #edf2f7;
}

.btn-success {
  background: #48bb78;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #38a169;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
}

.btn-danger {
  background: #f56565;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #e53e3e;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 101, 101, 0.4);
}

.btn-warning {
  background: #ed8936;
  color: white;
}

.btn-warning:hover:not(:disabled) {
  background: #dd6b20;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(237, 137, 54, 0.4);
}

.btn-info {
  background: #4299e1;
  color: white;
}

.btn-info:hover:not(:disabled) {
  background: #3182ce;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
}

.btn-disabled,
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-loading {
  cursor: wait;
}

.icon {
  font-size: 1.125rem;
  line-height: 1;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.btn-text {
  line-height: 1;
}
</style>
