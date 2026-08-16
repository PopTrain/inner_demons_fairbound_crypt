import { defineConfig } from '@capawesome/capacitor-electron/config';

export default defineConfig({
  window: {
    width: 768,
    height: 576,
    minWidth: 256,
    minHeight: 192
  },
  hooks: {
    onWindowCreated: (window) => {
      window.setTitle('Inner Demons Fairbound Crypt');
    },
  },
});
