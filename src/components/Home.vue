<script setup>
import { ref, defineAsyncComponent } from 'vue'

const WindowsView = defineAsyncComponent(() => import('./Windows.vue'))
const WelcomeScreen = defineAsyncComponent(() => import('./WelcomeScreen.vue'))

const currentOS = ref('Windows')
const isLoggedIn = ref(false)

const handleLogin = () => {
  isLoggedIn.value = true
}

const getComponent = () => {
  return WindowsView
}
</script>

<template>
  <div class="home-wrapper">
    <Transition name="fade" mode="out-in">
      <WelcomeScreen v-if="!isLoggedIn" @logged-in="handleLogin" />
      <component v-else :is="getComponent()" />
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


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
