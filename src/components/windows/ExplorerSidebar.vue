<script setup>
defineProps({
  currentPath: String
})

const emit = defineEmits(['navigate'])

const navItems = [
  { label: 'Acesso rápido', icon: '⭐' },
  { label: 'OneDrive', icon: '☁️' },
  { label: 'Este Computador', icon: '🖥️' },
  { label: 'Rede', icon: '🌐' }
]
</script>

<template>
  <div class="sidebar">
    <div 
      v-for="item in navItems" 
      :key="item.label" 
      class="nav-item" 
      :class="{ active: currentPath === item.label }"
      @click="emit('navigate', item.label)"
    >
      <span class="icon">{{ item.icon }}</span>
      <span class="label">{{ item.label }}</span>
    </div>
    
    <div class="separator"></div>
    
    <div class="nav-group">
      <div 
        class="nav-item" 
        :class="{ active: currentPath === 'Documentos' }"
        @click="emit('navigate', 'Documentos')"
      >
        <span class="icon">📁</span>
        <span class="label">Documentos</span>
      </div>
      <div 
        class="nav-item" 
        :class="{ active: currentPath === 'Imagens' }"
        @click="emit('navigate', 'Imagens')"
      >
        <span class="icon">🖼️</span>
        <span class="label">Imagens</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 220px;
  background: rgba(243, 243, 243, 0.7);
  backdrop-filter: blur(10px);
  border-right: 1px solid #e5e5e5;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  gap: 12px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.1s;
  color: #333;
}

.nav-item:hover {
  background: rgba(0,0,0,0.05);
}

.nav-item.active {
  background: rgba(0,0,0,0.05);
  font-weight: 600;
}

.icon {
  font-size: 16px;
}

.separator {
  height: 1px;
  background: #e5e5e5;
  margin: 8px 12px;
}

.nav-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
}
</style>
