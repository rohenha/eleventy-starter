import { body } from '@scripts/utils/environment'

/**
 * Create a grid helper
 * @description Create a grid helper to toggle grid visibility with "control + g" keys
 */

export default function setGridHelper() {
  // Toggle grid
  let ctrlDown = false;
  let isActive = false;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Control') {
      ctrlDown = true
    } else if (ctrlDown && e.key === 'g') {
      body.classList.toggle('-isGridVisible')
      isActive = !isActive;
    }
  })

  document.addEventListener('keyup', (e) => {
    if (e.key === 'Control') {
      ctrlDown = false
    }
  })
}
