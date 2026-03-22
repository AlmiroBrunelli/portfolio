<script setup>
import { ref, onMounted } from 'vue'
import { i18n } from '../i18n'
import LoadingSpinner from './common/LoadingSpinner.vue'

const emit = defineEmits(['logged-in'])
const showWelcome = ref(true)
const loading = ref(true)

onMounted(() => {
  // Simulate a brief loading period before allowing entry or auto-entering
  setTimeout(() => {
    loading.value = false
    // After another short delay, emit the logged-in event
    setTimeout(() => {
      emit('logged-in')
    }, 2000)
  }, 1500)
})
</script>

<template>
  <div class="welcome-screen">
    <div class="background-overlay"></div>
    
    <div class="login-container">
      <div class="profile-section">
        <div class="profile-pic">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <h1 class="username">{{ i18n.t('welcome.username') }}</h1>
      </div>

      <div class="status-section">
        <LoadingSpinner />
        <span class="status-text">{{ loading ? i18n.t('welcome.loading') : i18n.t('welcome.title') }}</span>
      </div>
    </div>

    <div class="bottom-controls">
      <div class="control-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
          <line x1="12" y1="2" x2="12" y2="12"></line>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  z-index: 9999;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: url('/src/assets/windows/windows-wallpaper.png') no-repeat center center;
  background-size: cover;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(25px);
  z-index: -1;
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  animation: fadeIn 0.8s ease-out;
}

.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.profile-pic {
  width: 180px;
  height: 180px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.profile-pic svg {
  width: 100px;
  height: 100px;
  color: white;
  opacity: 0.9;
}

.username {
  font-size: 3rem;
  font-weight: 300;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.status-section {
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.status-text {
  font-size: 1.2rem;
  font-weight: 300;
  letter-spacing: 0.5px;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.bottom-controls {
  position: absolute;
  bottom: 40px;
  right: 40px;
  display: flex;
  gap: 20px;
}

.control-icon {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  transition: background 0.2s;
  cursor: pointer;
}

.control-icon:hover {
  background: rgba(255, 255, 255, 0.1);
}

.control-icon svg {
  width: 24px;
  height: 24px;
}
</style>
