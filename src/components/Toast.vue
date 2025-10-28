<template>
  <div
    class="toast"
    :class="`toast-${type}`"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    {{ message }}
  </div>
</template>

<script setup>
import { onMounted } from "vue";

const props = defineProps({
  message: String,
  type: String,
  onClose: Function
});

onMounted(() => {
  const timer = setTimeout(() => props.onClose?.(), 3000);
  return () => clearTimeout(timer);
});
</script>
