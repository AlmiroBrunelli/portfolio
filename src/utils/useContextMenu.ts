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
    const menuWidth = 240 // estimated
    const menuHeight = items.length * 32 + 20 // estimated
    
    let x = event.clientX
    let y = event.clientY
    
    if (x + menuWidth > window.innerWidth) x -= menuWidth
    if (y + menuHeight > window.innerHeight) y -= menuHeight
    
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
