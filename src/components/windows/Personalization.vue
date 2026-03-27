<script setup lang="ts">
import { windowsState } from '../../store'

const themes = [
  { id: 'light', name: 'Light Mode', color: '#f3f3f3' },
  { id: 'dark', name: 'Dark Mode', color: '#1c1c1c' }
]

const selectTheme = (id: 'light' | 'dark') => {
  windowsState.setTheme(id)
}
</script>

<template>
  <div class="personalization-container">
    <div class="header">
      <h2>Escolha o seu modo</h2>
      <p>Alterne entre os temas claro e escuro para o seu sistema.</p>
    </div>

    <div class="theme-grid">
      <div 
        v-for="theme in themes" 
        :key="theme.id"
        class="theme-card"
        :class="{ active: windowsState.theme === theme.id }"
        @click="selectTheme(theme.id as 'light' | 'dark')"
      >
        <div class="preview" :style="{ backgroundColor: theme.color }">
          <div class="taskbar-preview"></div>
          <div class="window-preview"></div>
        </div>
        <div class="theme-name">{{ theme.name }}</div>
        <div class="radio-indicator">
          <div class="dot" v-if="windowsState.theme === theme.id"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.personalization-container {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
  background: var(--win-bg);
  color: var(--win-text);
  transition: background 0.3s, color 0.3s;
}

.header h2 {
  margin: 0 0 8px;
  font-size: 20px;
  color: inherit;
}

.header p {
  margin: 0;
  opacity: 0.7;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.theme-card {
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 12px;
  background: v-bind('windowsState.theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"');
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.theme-card:hover {
  background: v-bind('windowsState.theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"');
}

.theme-card.active {
  border-color: #0078d4;
  background: v-bind('windowsState.theme === "dark" ? "rgba(0, 120, 212, 0.1)" : "rgba(0, 120, 212, 0.05)"');
}

.preview {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(128, 128, 128, 0.2);
}

.taskbar-preview {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 4px;
  background: #0078d4;
}

.window-preview {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40%;
  height: 30%;
  background: rgba(128, 128, 128, 0.5);
  border-radius: 2px;
}

.theme-name {
  font-weight: 500;
  font-size: 14px;
}

.radio-indicator {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot {
  width: 8px;
  height: 8px;
  background: #0078d4;
  border-radius: 50%;
}
</style>
