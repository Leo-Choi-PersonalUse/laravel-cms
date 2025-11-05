<template>
  <button
    :class="['icon-btn', `icon-btn-${variant}`, `icon-btn-${size}`, { 'icon-btn-disabled': disabled }]"
    :disabled="disabled"
    :title="tooltip"
    @click="handleClick"
  >
    <span class="icon">{{ icon }}</span>
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Props {
  icon: string
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
  size?: 'sm' | 'md' | 'lg'
  tooltip?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'secondary',
  size: 'md',
  disabled: false
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

function handleClick(event: MouseEvent) {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: inherit;
}

.icon-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

/* Sizes */
.icon-btn-sm {
  width: 28px;
  height: 28px;
  font-size: 0.875rem;
}

.icon-btn-md {
  width: 36px;
  height: 36px;
  font-size: 1rem;
}

.icon-btn-lg {
  width: 44px;
  height: 44px;
  font-size: 1.25rem;
}

/* Variants */
.icon-btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.icon-btn-primary:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}

.icon-btn-secondary {
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.icon-btn-secondary:hover:not(:disabled) {
  background: #edf2f7;
}

.icon-btn-success {
  background: #e6fffa;
  color: #234e52;
}

.icon-btn-success:hover:not(:disabled) {
  background: #b2f5ea;
}

.icon-btn-danger {
  background: #fff5f5;
  color: #c53030;
}

.icon-btn-danger:hover:not(:disabled) {
  background: #fed7d7;
}

.icon-btn-warning {
  background: #fef5e7;
  color: #c05621;
}

.icon-btn-warning:hover:not(:disabled) {
  background: #fbd38d;
}

.icon-btn-info {
  background: #ebf8ff;
  color: #2c5282;
}

.icon-btn-info:hover:not(:disabled) {
  background: #bee3f8;
}

.icon-btn-disabled,
.icon-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon {
  line-height: 1;
}
</style>
