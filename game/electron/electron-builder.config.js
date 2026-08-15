/** @type {import('electron-builder').Configuration} */
module.exports = {
  appId: 'com.innerdemons.app',
  productName: 'Inner Demons',
  directories: {
    output: 'dist',
    buildResources: 'assets',
  },
  files: [
    'build/**/*',
    'app/**/*',
    'generated/**/*',
    'package.json',
    // Platform runtime + plugins, prepared by `capacitor-electron vendor`.
    { from: 'vendor/node_modules', to: 'node_modules' },
  ],
};
