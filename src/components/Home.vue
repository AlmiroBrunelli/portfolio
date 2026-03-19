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

const showSwitcher = ref(false)
const selectOS = (os) => {
  loading.value = true
  showSwitcher.value = false
  setTimeout(() => {
    currentOS.value = os
    loading.value = false
  }, 800)
}
</script>

<template>
  <div class="home-wrapper">
    <!-- OS Switcher Button -->
    <div class="os-switcher-trigger" @click="showSwitcher = !showSwitcher" title="Change OS View">
        <span>🖥️</span>
    </div>

    <!-- Switcher Menu -->
    <Transition name="slide-fade">
      <div v-if="showSwitcher" class="os-menu">
        <label>Select OS Experience</label>
        <button @click="selectOS('Windows')" :class="{ active: currentOS === 'Windows' }">🪟 Windows</button>
        <button @click="selectOS('Mac')" :class="{ active: currentOS === 'Mac' }">🍎 macOS</button>
        <button @click="selectOS('Linux')" :class="{ active: currentOS === 'Linux' }">🐧 Linux</button>
      </div>
    </Transition>

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

.os-switcher-trigger {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 1000;
    width: 44px;
    height: 44px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s;
    font-size: 20px;
}

.os-switcher-trigger:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
}

.os-menu {
    position: absolute;
    top: 75px;
    right: 20px;
    z-index: 1000;
    background: rgba(20, 20, 20, 0.85);
    backdrop-filter: blur(20px);
    border-radius: 12px;
    padding: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 180px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.os-menu label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.6;
    margin-bottom: 5px;
}

.os-menu button {
    background: transparent;
    border: none;
    color: white;
    padding: 10px;
    text-align: left;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
    font-size: 14px;
}

.os-menu button:hover {
    background: rgba(255, 255, 255, 0.1);
}

.os-menu button.active {
    background: #0078d4;
    font-weight: bold;
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

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
