<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useContextMenu, type ContextMenuItem } from '../../utils/useContextMenu'
import { windowsState } from '../../store'

const { isVisible, position, menuItems, hideMenu } = useContextMenu()
const activeSubmenu = ref<number | null>(null)
const menuRef = ref<HTMLElement | null>(null)

// Reset active submenu when menu visibility changes
watch(isVisible, (newVal) => {
  if (newVal) {
    activeSubmenu.value = null
  }
})

// Computed style for submenu direction
const getSubmenuStyle = (index: number) => {
  if (!menuRef.value) return {}
  
  const rect = menuRef.value.getBoundingClientRect()
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  
  // Estimate submenu dimensions
  const submenuWidth = 200
  const submenuHeight = 150 // estimated, can be improved
  
  const style: any = {}
  
  // Horizontal positioning
  if (rect.right + submenuWidth > screenWidth) {
    style.left = 'auto'
    style.right = 'calc(100% + 4px)'
  } else {
    style.left = 'calc(100% + 4px)'
    style.right = 'auto'
  }
  
  // Vertical positioning (simplified check)
  // We can also check if it would overflow the bottom
  const itemTop = rect.top + (index * 32) // estimation of item position
  if (itemTop + submenuHeight > screenHeight) {
    style.top = 'auto'
    style.bottom = '-4px'
  } else {
    style.top = '-4px'
    style.bottom = 'auto'
  }
  
  return style
}

const handleItemClick = (item: ContextMenuItem) => {
  if ('divider' in item && item.divider) return
  if ('disabled' in item && item.disabled) return
  if ('submenu' in item && item.submenu) return
  if ('action' in item && item.action) item.action()
  hideMenu()
}

const handleMouseEnter = (index: number) => {
  activeSubmenu.value = index
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.context-menu')) {
    hideMenu()
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
  window.addEventListener('contextmenu', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
  window.removeEventListener('contextmenu', handleClickOutside)
})
</script>

<template>
  <Transition name="fade">
    <div 
      v-if="isVisible" 
      ref="menuRef"
      class="context-menu"
      :style="{ top: `${position.y}px`, left: `${position.x}px` }"
      @contextmenu.prevent
    >
      <div class="menu-items">
        <template v-for="(item, index) in menuItems" :key="index">
          <div v-if="item.divider" class="divider"></div>
          
          <div 
            v-else 
            class="menu-item"
            :class="{ disabled: item.disabled, 'has-submenu': item.submenu }"
            @click="handleItemClick(item)"
            @mouseenter="handleMouseEnter(index)"
          >
            <div class="icon-slot">
              <span v-if="'icon' in item && item.icon" v-html="item.icon" class="item-icon"></span>
            </div>
            
            <span class="label">{{ 'label' in item ? item.label : '' }}</span>
            
            <span v-if="'shortcut' in item && item.shortcut" class="shortcut">{{ item.shortcut }}</span>
            
            <div v-if="'submenu' in item && item.submenu" class="submenu-arrow">
              <svg viewBox="0 0 16 16" width="12" height="12">
                <path fill="currentColor" d="M6 12.7l4.2-4.2L6 4.3l.7-.7L11.6 8.5l-4.9 4.9z"/>
              </svg>
            </div>

            <!-- Submenu (Simplified for now, can be expanded if needed) -->
            <div v-if="'submenu' in item && item.submenu && activeSubmenu === index" class="submenu" :style="getSubmenuStyle(index)">
               <div class="menu-items">
                 <div 
                  v-for="(sub, sIdx) in item.submenu" 
                  :key="sIdx" 
                  class="menu-item"
                  @click.stop="handleItemClick(sub)"
                 >
                   <div class="icon-slot"></div>
                   <span class="label">{{ 'label' in sub ? sub.label : '' }}</span>
                 </div>
               </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.context-menu {
  position: fixed;
  z-index: 10000;
  min-width: 240px;
  background: v-bind('windowsState.theme === "dark" ? "rgba(28, 28, 28, 0.85)" : "rgba(255, 255, 255, 0.85)"');
  backdrop-filter: blur(20px) saturate(1.5);
  border: 1px solid v-bind('windowsState.theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"');
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  padding: 4px;
  user-select: none;
  animation: context-menu-appear 0.1s ease-out;
}

@keyframes context-menu-appear {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.menu-items {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  margin: 1px 0;
  border-radius: 4px;
  cursor: default;
  position: relative;
  transition: background 0.1s;
}

.menu-item:hover {
  background: v-bind('windowsState.theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"');
}

.menu-item.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.icon-slot {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  color: v-bind('windowsState.theme === "dark" ? "#fff" : "#333"');
}

.item-icon {
  display: flex;
  width: 16px;
  height: 16px;
}

.label {
  flex: 1;
  font-size: 14px;
  color: v-bind('windowsState.theme === "dark" ? "#fff" : "#333"');
}

.shortcut {
  font-size: 12px;
  color: v-bind('windowsState.theme === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"');
  margin-left: 12px;
}

.submenu-arrow {
  margin-left: 8px;
  color: v-bind('windowsState.theme === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"');
}

.divider {
  height: 1px;
  background: v-bind('windowsState.theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"');
  margin: 4px 8px;
}

.submenu {
  position: absolute;
  top: -4px;
  left: calc(100% + 4px);
  min-width: 180px;
  background: v-bind('windowsState.theme === "dark" ? "rgba(28, 28, 28, 0.85)" : "rgba(255, 255, 255, 0.85)"');
  border: 1px solid v-bind('windowsState.theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"');
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  padding: 4px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.1s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
