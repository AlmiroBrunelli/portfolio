import volumeSound from '../assets/sounds/7 - Windows Notify System Generic.wav'

// Pre-load the audio object for instant playback
const volumeAudio = new Audio(volumeSound);
volumeAudio.load();

/**
 * Plays the Windows 11 volume sound from the pre-loaded file.
 * @param volume - Volume level from 0 to 100
 */
export const playVolumeSound = (volume: number) => {
  if (volume <= 0) return;

  try {
    // Reset playhead if it's already playing to allow rapid triggers
    volumeAudio.currentTime = 0;
    volumeAudio.volume = Math.pow(volume / 100, 2);
    volumeAudio.play().catch(e => console.warn('Audio play failed:', e));
  } catch (error) {
    console.warn('Audio initialization failed:', error);
  }
};
