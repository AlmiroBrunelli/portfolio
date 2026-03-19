<script setup>
import { ref } from 'vue'

const emit = defineEmits(['change-os', 'close'])

const pinnedApps = [
  { name: 'Edge', icon: '🌐' },
  { name: 'Word', icon: '📝' },
  { name: 'Photos', icon: '🖼️' },
  { name: 'Settings', icon: '⚙️' },
  { name: 'Calculator', icon: '🔢' },
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
          <input type="text" placeholder="Pesquisar aplicativos, arquivos e configurações" />
        </div>
      </div>

      <div class="content-section">
        <div class="section-header">
          <span class="section-title">Fixado</span>
          <button class="all-apps">Todos os aplicativos ></button>
        </div>
        <div class="apps-grid">
          <div v-for="app in pinnedApps" :key="app.name" class="app-item">
            <span class="app-icon">{{ app.icon }}</span>
            <span class="app-name">{{ app.name }}</span>
          </div>
        </div>

        <div class="section-header recommended">
          <span class="section-title">Recomendado</span>
          <button class="all-apps">Mais ></button>
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
          <div class="avatar">👤</div>
          <span class="username">Almiro Brunelli</span>
        </div>
        <div class="power-os-group">
          <!-- OS Switchers -->
          <button class="os-btn mac" @click="emit('change-os', 'Mac')" title="Ir para macOS">
            <svg viewBox="0 0 512 512" width="18" height="18">
                <path d="M407.4 341.4c-22.1 43.4-44.1 86.8-90.2 87.2-46.1.4-60.9-27.8-113.8-27.8-52.9 0-69.1 27.2-113.8 28.3-44.7 1.1-70.5-47.5-92.6-90.9-45.2-88.6-79.8-251.4 46.1-251.4 62.7 0 106.9 38.6 145.2 38.6 38.3 0 91.3-47.5 167.3-39.2 31.8 3.5 120.9 14.8 178.4 99.1-4.7 2.9-106.9 62.2-106.9 184.1 0 102.3 88.6 137.9 100.4 142.9zm-94.4-275.6c0 0 55.6-66.9 51-135 0 0-71.8 16.2-114.7 66.8-31 36.6-43.1 76-35.4 116.8 0 0 81.3 6.9 99.1-48.6z" fill="white"/>
            </svg>
          </button>
          <button class="os-btn linux" @click="emit('change-os', 'Linux')" title="Ir para Linux">
            <svg viewBox="0 0 512 512" width="18" height="18">
                <path d="M444.6 391.5a140.2 140.2 0 0 0-41-39.3c.7-6.2 1-12.6 1-19.1 0-74.8-59.5-135.4-133-135.4-73.4 0-133 60.6-133 135.4a159.2 159.2 0 0 0 16 70c-26.6 6.8-50.6 20.3-69.7 39a117 117 0 0 0-32.9 83.2c0 4.1 3.5 7.5 7.6 7.5h33.8c130 .8 260 .8 390 0h33.8c4 0 7.4-3.4 7.4-7.5 0-46-15.6-90.3-43.5-121.2zM217 312c0-12.7 9.8-23 22-23s22 10.3 22 23-9.8 23-22 23c-12.2.1-22-10.2-22-23zm131.7 131H163.3c.8-11.8 3.3-22.3 7-31.4h171.4c3.7 9.1 6.2 19.6 7 31.4zm-22-96c-12.2 0-22-10.3-22-23s9.8-23 22-23 22 10.3 22 23-9.8 23-22 23z" fill="white"/>
            </svg>
          </button>
          <div class="separator-v"></div>
          <button class="power-btn" title="Desligar">
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
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 2px;
}

.start-menu {
  width: 640px;
  height: 600px;
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
  background: #0078d4;
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
</style>
