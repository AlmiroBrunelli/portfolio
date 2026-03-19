<script setup>
const items = [
  { label: 'Projetos', icon: '🚀' },
  { label: 'Currículo', icon: '📄' },
  { label: 'Links', icon: '🌐' },
  { label: 'Certificados', icon: '🏆' },
  { label: 'Blog', icon: '📝' }
]
</script>

<template>
  <div class="main-view">
    <div class="content-header">
      <h2 class="section-title">Pastas</h2>
    </div>
    <div class="grid">
      <div v-for="item in items" :key="item.label" class="grid-item">
        <div class="icon-wrapper">
          <span class="icon">{{ item.icon }}</span>
        </div>
        <span class="label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-view {
  flex: 1;
  background: #fff;
  padding: 24px;
  overflow-y: auto;
}

.content-header {
  margin-bottom: 20px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 24px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  border: 1px solid transparent;
}

.grid-item:hover {
  background: rgba(0, 120, 212, 0.05);
  border-color: rgba(0, 120, 212, 0.1);
}

.icon-wrapper {
  font-size: 48px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.label {
  font-size: 13px;
  color: #333;
  text-align: center;
}
</style>
