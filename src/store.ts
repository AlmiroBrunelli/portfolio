import { reactive } from 'vue'

interface WindowsState {
  volume: number;
  brightness: number;
  isMuted: boolean;
  setVolume: (val: number) => void;
  toggleMute: () => void;
}

export const windowsState = reactive<WindowsState>({
  volume: 70,
  brightness: 80,
  isMuted: false,
  
  setVolume(val: number) {
    this.volume = val
    if (val > 0) this.isMuted = false
    else this.isMuted = true
  },
  
  toggleMute() {
    this.isMuted = !this.isMuted
  }
})
