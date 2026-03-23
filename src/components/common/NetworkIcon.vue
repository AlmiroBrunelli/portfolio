<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps<{
  size?: number
}>()

const isOnline = ref(navigator.onLine)
const connectionType = ref('unknown')

const updateConnectionStatus = () => {
  isOnline.value = navigator.onLine
  
  // @ts-ignore
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  if (conn) {
    connectionType.value = conn.type || 'unknown'
  }
}

onMounted(() => {
  window.addEventListener('online', updateConnectionStatus)
  window.addEventListener('offline', updateConnectionStatus)
  
  // @ts-ignore
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  if (conn) {
    conn.addEventListener('change', updateConnectionStatus)
  }
  
  updateConnectionStatus()
})

onUnmounted(() => {
  window.removeEventListener('online', updateConnectionStatus)
  window.removeEventListener('offline', updateConnectionStatus)
  
  // @ts-ignore
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  if (conn) {
    conn.removeEventListener('change', updateConnectionStatus)
  }
})

const isCable = computed(() => {
  return connectionType.value === 'ethernet'
})
</script>

<template>
  <div class="network-icon" :title="isOnline ? (isCable ? 'Ethernet' : 'Wi-Fi') : 'Offline'">
    <svg 
      v-if="!isOnline"
      viewBox="0 0 24 24" 
      :width="size || 16" 
      :height="size || 16" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
      class="offline"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>

    <svg 
      v-else-if="isCable"
      viewBox="0 0 24 24" 
      :width="size || 16" 
      :height="size || 16" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    >
      <path d="M12 2v8" />
      <path d="M12 14v8" />
      <path d="M6 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z" />
      <path d="M9 10v4" />
      <path d="M15 10v4" />
    </svg>

    <svg 
      v-else
      viewBox="0 0 24 24" 
      :width="size || 16" 
      :height="size || 16" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    >
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" stroke-width="3" />
    </svg>
  </div>
</template>

<style scoped>
.network-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
.offline {
  opacity: 0.5;
  color: #ff4d4d;
}
</style>
