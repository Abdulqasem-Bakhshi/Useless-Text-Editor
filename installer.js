// build_installer.js

const path = require('path');
const { MSICreator } = require('electron-wix-msi');

async function buildInstaller() {
  // Set absolute paths for the app and output directories
  const APP_DIR = path.resolve(__dirname, 'dist/win-unpacked');
  const OUT_DIR = path.resolve(__dirname, './windows-installer');

  // Instantiate MSICreator with metadata and UI options
  const msiCreator = new MSICreator({
    appDirectory: APP_DIR,
    outputDirectory: OUT_DIR,
    exe: 'Useless Text Editor',
    name: 'Useless Text Editor',
    manufacturer: 'Abdulqasem Bakhshi',
    version: '1.0.0',
    description: 'A totally useless but fun text editor',

    // Add UI support for choosing install directory
    ui: {
      chooseDirectory: true
    },

    // Optional: Add icon if you have one
    icon: path.resolve(__dirname, 'assets/icon.ico'),
  });

  // Step 1: Create the .wxs template
  await msiCreator.create();

  // Step 2: Compile it into an .msi
  await msiCreator.compile();

  console.log('✅ MSI Installer created at:', OUT_DIR);
}

buildInstaller().catch(err => {
  console.error('❌ Error building installer:', err);
});
