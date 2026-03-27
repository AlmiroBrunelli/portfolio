import { reactive } from 'vue'

interface WindowsState {
  volume: number;
  brightness: number;
  theme: 'light' | 'dark';
  isMuted: boolean;
  setVolume: (val: number) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleMute: () => void;
}

export const windowsState = reactive<WindowsState>({
  volume: 70,
  brightness: 80,
  theme: 'dark',
  isMuted: false,
  
  setVolume(val: number) {
    this.volume = val
    if (val > 0) this.isMuted = false
    else this.isMuted = true
  },

  setTheme(theme: 'light' | 'dark') {
    this.theme = theme
  },
  
  toggleMute() {
    this.isMuted = !this.isMuted
  }
})
