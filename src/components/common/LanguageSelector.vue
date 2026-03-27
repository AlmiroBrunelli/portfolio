<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { i18n } from '../../i18n'

const isOpen = ref(false)
const selectorRef = ref(null)

const languages = [
  { code: 'pt-BR', short: 'POR', region: 'PTB2', name: 'Português (Brasil)' },
  { code: 'en-US', short: 'ENG', region: 'US', name: 'English (United States)' }
]

const currentLanguage = computed(() => {
  return languages.find(l => l.code === i18n.state.locale) || languages[1]
})

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const selectLanguage = (code) => {
  i18n.setLocale(code)
  isOpen.value = false
}

const handleClickOutside = (event) => {
  if (selectorRef.value && !selectorRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<template>
  <div class="language-selector-container" ref="selectorRef">
    <div class="language-btn" @click="toggleMenu" :class="{ active: isOpen }">
      <div class="lang-text">
        <span class="short-code">{{ currentLanguage.short }}</span>
        <span class="region-code">{{ currentLanguage.region }}</span>
      </div>
    </div>

    <Transition name="slide-up">
      <div v-if="isOpen" class="language-menu">
        <div class="menu-header">{{ i18n.t('languages.title') }}</div>
        <div 
          v-for="lang in languages" 
          :key="lang.code"
          class="menu-item"
          :class="{ selected: lang.code === i18n.state.locale }"
          @click="selectLanguage(lang.code)"
        >
          <span class="item-short">{{ lang.short }}</span>
          <div class="item-name">{{ lang.name }}</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.language-selector-container {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
}

.language-btn {
  height: 40px;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
  user-select: none;
}

.language-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.language-btn.active {
  background: rgba(255, 255, 255, 0.15);
}

.lang-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 0;
  gap: 6px;
  height: 100%;
}

.short-code {
  font-size: 11px;
  font-weight: 400; /* Removed bold */
  line-height: 1;
}

.region-code {
  font-size: 11px;
  font-weight: 400; /* Removed bold */
  line-height: 1;
}

.language-menu {
  position: absolute;
  bottom: 54px;
  right: 0;
  width: 200px; /* Reduced about 30% from 280px */
  background: rgba(32, 32, 32, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  padding: 6px 0;
  z-index: 2000;
}

.menu-header {
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 600;
  color: #aaa;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 4px;
  text-align: left;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 8px 12px; /* Aligned to 12px */
  gap: 12px;
  cursor: pointer;
  transition: background 0.2s;
  justify-content: flex-start; /* Align left */
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.menu-item.selected {
  background: rgba(96, 205, 255, 0.15);
  border-left: 2px solid #60cdff;
  padding-left: 10px;
}

.item-short {
  font-size: 11px;
  font-weight: 500;
  min-width: 32px;
  color: #60cdff;
  text-align: left; /* Align text left */
}

.item-name {
  font-size: 12px;
  text-align: left; /* Align text left */
}

/* Animations */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.2s cubic-bezier(0, 0, 0.2, 1), opacity 0.2s;
}

.slide-up-enter-from {
  transform: translateY(10px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
