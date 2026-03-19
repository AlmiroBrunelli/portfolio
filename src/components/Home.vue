<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'

const WindowsView = defineAsyncComponent(() => import('./Windows.vue'))
const LinuxView = defineAsyncComponent(() => import('./Linux.vue'))
const MacView = defineAsyncComponent(() => import('./Mac.vue'))

const currentOS = ref(null)
const loading = ref(true)

const detectOS = () => {
  const userAgent = window.navigator.userAgent.toLowerCase()
  const platform = window.navigator.platform.toLowerCase()
  
  if (userAgent.includes('win') || platform.includes('win')) {
    return 'Windows'
  } else if (userAgent.includes('mac') || platform.includes('mac')) {
    return 'Mac'
  } else if (userAgent.includes('linux') || platform.includes('linux')) {
    return 'Linux'
  }
  
  // Default to Windows if not detected or other
  return 'Windows'
}

onMounted(() => {
  // Simulate loading for effect
  setTimeout(() => {
    currentOS.value = detectOS()
    loading.value = false
  }, 1500)
})

const getComponent = () => {
  switch (currentOS.value) {
    case 'Windows': return WindowsView
    case 'Linux': return LinuxView
    case 'Mac': return MacView
    default: return WindowsView
  }
}

const selectOS = (os) => {
  loading.value = true
  setTimeout(() => {
    currentOS.value = os
    loading.value = false
  }, 800)
}
</script>

<template>
  <div class="home-wrapper">

    <Transition name="fade" mode="out-in">
      <div v-if="loading" class="loader-container">
        <div class="spinner"></div>
        <p>Configurando seu ambiente...</p>
      </div>
      <component v-else :is="getComponent()" @change-os="selectOS" />
    </Transition>
  </div>
</template>

<style>
.home-wrapper {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  background: #121212;
  color: white;
  overflow: hidden;
  position: relative;
}


.loader-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #0078d4;
  border-radius: 50%;
  animation: rotate 1s infinite linear;
}

@keyframes rotate {
  to { transform: rotate(360deg); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
