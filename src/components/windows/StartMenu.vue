<script setup>
import { ref } from 'vue'
import { i18n } from '../../i18n'

const emit = defineEmits(['change-os', 'close', 'open-app'])

const pinnedApps = [
  { name: 'Edge', icon: 'ms-edge.png' },
  { name: 'Word', icon: '📝' },
  { name: 'Photos', icon: '🖼️' },
  { name: 'Settings', icon: 'cog.png' },
  { name: 'Calculator', icon: 'calculator.png' },
  { name: 'Spotify', icon: '🎵' },
  { name: 'VS Code', icon: '💻' },
  { name: 'Terminal', icon: '🐚' },
  { name: 'GitHub', icon: '🐙' },
  { name: 'Mail', icon: '✉️' },
  { name: 'Calendar', icon: '📅' },
  { name: 'Store', icon: '🛍️' }
]

const recommendedFiles = [
  { name: 'index.html', time: 'Há 2 horas' },
  { name: 'portfolio_plan.pdf', time: 'Ontem às 14:30' },
  { name: 'projeto_final.zip', time: 'Segunda-feira' }
]
</script>

<template>
  <div class="start-menu-overlay" @click.self="emit('close')">
    <div class="start-menu">
      <div class="search-section">
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input type="text" :placeholder="i18n.t('start.search')" />
        </div>
      </div>

      <div class="content-section">
        <div class="section-header">
          <span class="section-title">{{ i18n.t('start.pinned') }}</span>
          <button class="all-apps">{{ i18n.t('start.all_apps') }} ></button>
        </div>
        <div class="apps-grid">
          <div v-for="app in pinnedApps" :key="app.name" class="app-item" @click="emit('open-app', app.name)">
            <img v-if="app.icon.endsWith('.png')" :src="'../../assets/windows/' + app.icon" width="32" height="32" :alt="app.name" />
            <span v-else class="app-icon">{{ app.icon }}</span>
            <span class="app-name">{{ app.name }}</span>
          </div>
        </div>

        <div class="section-header recommended">
          <span class="section-title">{{ i18n.t('start.recommended') }}</span>
          <button class="all-apps">{{ i18n.t('start.more') }} ></button>
        </div>
        <div class="recommended-list">
          <div v-for="file in recommendedFiles" :key="file.name" class="recommended-item">
            <span class="file-icon">📄</span>
            <div class="file-info">
              <span class="file-name">{{ file.name }}</span>
              <span class="file-time">{{ file.time }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="user-power-section">
        <div class="user-profile">
          <div class="avatar">
            <img src="../../assets/windows/user.png" width="32" height="32" alt="User" />
          </div>
          <span class="username">{{ i18n.t('welcome.username') }}</span>
        </div>
        <div class="power-os-group">
          <button class="power-btn" :title="i18n.t('start.power')">
            <span class="power-icon">⏻</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.start-menu-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  padding-left: 12px;
  padding-bottom: 10px;
  box-sizing: border-box;
}

.start-menu {
  width: 640px;
  max-width: calc(100% - 24px);
  height: 600px;
  max-height: calc(100vh - 70px);
  background: rgba(28, 28, 28, 0.85);
  backdrop-filter: blur(25px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  animation: start-open 0.3s cubic-bezier(0.1, 0.9, 0.2, 1);
}

@keyframes start-open {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* Responsiveness */
@media (max-width: 680px) {
    .start-menu-overlay {
        justify-content: center;
        padding-left: 0;
    }
    .start-menu {
        width: calc(100% - 16px);
        max-width: 500px;
    }
    .search-section, .content-section, .user-power-section {
        padding-left: 16px;
        padding-right: 16px;
    }
}

.search-section {
  padding: 30px 48px 15px;
}

.search-bar {
  background: rgba(255, 255, 255, 0.9);
  height: 36px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  gap: 12px;
  border-bottom: 2px solid #0078d4;
}

.search-icon { color: #333; font-size: 14px; }
.search-bar input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: #000;
}

.content-section {
  flex: 1;
  padding: 0 48px;
  overflow-y: auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 15px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
}

.all-apps {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.apps-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  margin-bottom: 30px;
}

.app-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 4px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.app-item:hover { background: rgba(255, 255, 255, 0.1); }

.app-icon { font-size: 24px; }
.app-name { font-size: 11px; color: #fff; text-align: center; }

.recommended-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.recommended-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
}

.recommended-item:hover { background: rgba(255, 255, 255, 0.1); }

.file-icon { font-size: 20px; }
.file-info { display: flex; flex-direction: column; }
.file-name { font-size: 12px; color: #fff; }
.file-time { font-size: 10px; color: rgba(255, 255, 255, 0.6); }

.user-power-section {
  height: 64px;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 48px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
}

.user-profile:hover { background: rgba(255, 255, 255, 0.1); }

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
}

.username { font-size: 12px; font-weight: 500; color: #fff; }

.power-os-group {
    display: flex;
    align-items: center;
    gap: 4px;
}

.os-btn, .power-btn {
    width: 36px;
    height: 36px;
    background: transparent;
    border: none;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background 0.2s;
}

.os-btn:hover, .power-btn:hover { background: rgba(255, 255, 255, 0.1); }

.separator-v {
    width: 1px;
    height: 20px;
    background: rgba(255, 255, 255, 0.2);
    margin: 0 4px;
}

.power-icon { font-size: 18px; color: #fff; }

/* Responsiveness */
@media (max-width: 680px) {
    .start-menu {
        width: calc(100% - 24px);
        height: 80vh;
        max-height: 600px;
    }
    .search-section, .content-section, .user-power-section {
        padding-left: 24px;
        padding-right: 24px;
    }
}

@media (max-width: 500px) {
    .apps-grid { grid-template-columns: repeat(4, 1fr); }
    .recommended-list { grid-template-columns: 1fr; }
    .start-menu { height: 85vh; }
}

@media (max-width: 400px) {
    .apps-grid { grid-template-columns: repeat(3, 1fr); }
}
</style>
