<template>
  <div :class="['button-group', `button-group-${align}`]">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  align?: 'left' | 'center' | 'right' | 'space-between'
}

withDefaults(defineProps<Props>(), {
  align: 'left'
})
</script>

<style scoped>
.button-group {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.button-group-left {
  justify-content: flex-start;
}

.button-group-center {
  justify-content: center;
}

.button-group-right {
  justify-content: flex-end;
}

.button-group-space-between {
  justify-content: space-between;
}
</style>
