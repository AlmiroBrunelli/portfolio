import { ref, reactive } from 'vue'

export type ContextMenuItem = 
  | {
      label: string;
      icon?: string;
      action?: () => void;
      shortcut?: string;
      submenu?: ContextMenuItem[];
      disabled?: boolean;
      divider?: false;
    }
  | {
      divider: true;
    };

const isVisible = ref(false)
const position = reactive({ x: 0, y: 0 })
const menuItems = ref<ContextMenuItem[]>([])

export function useContextMenu() {
  const showMenu = (event: MouseEvent, items: ContextMenuItem[]) => {
    event.preventDefault()
    isVisible.value = false
    
    // Position adjustments (to keep menu within viewport)
    // We'll use more conservative estimates for the main menu
    const menuWidth = 240
    const menuHeight = items.length * 32 + 20
    
    let x = event.clientX
    let y = event.clientY
    
    // Ensure menu doesn't go off the right edge (flip to left)
    if (x + menuWidth > window.innerWidth) {
      x -= menuWidth
    }
    
    // Ensure menu doesn't go off the bottom edge (flip to top)
    if (y + menuHeight > window.innerHeight) {
      y -= menuHeight
    }
    
    // Ensure menu doesn't go off the top/left edge (shift if still off-screen)
    if (x < 10) x = 10
    if (y < 10) y = 10
    
    position.x = x
    position.y = y
    menuItems.value = items
    
    setTimeout(() => {
      isVisible.value = true
    }, 10)
  }

  const hideMenu = () => {
    isVisible.value = false
  }

  return {
    isVisible,
    position,
    menuItems,
    showMenu,
    hideMenu
  }
}
