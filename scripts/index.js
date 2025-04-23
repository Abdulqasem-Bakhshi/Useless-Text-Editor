// This is the new code I have made + help for efficient buttons ONLY

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('minimize').addEventListener('click', () => {
    window.electronAPI.minimizeWindow();
  });

  document.getElementById('close').addEventListener('click', () => {
    window.electronAPI.closeWindow();
  });



  // Select text editor input element
  const textEditor = document.querySelector('.text-editor-input');
  const textContainer = document.querySelector('.text-editor');

  // Make text editor input focusable
  textEditor.focus();

  // Event Listener to ensure onclick maintain focus on text editor
  textEditor.addEventListener('click', (event) => {
    if (event.target == textEditor || event.target === textContainer) {
      textEditor.focus();
    }
  })

  // Select Zoom In and Zoom Out buttons
  const zoomInTextEditor = document.querySelector('#zoom-in');
  const zoomOutTextEditor = document.querySelector('#zoom-out');

  const minFontSize = 16;
  const maxFontSize = 24;
  let fontScale = 20;
  const scaleStep = 1;

  function updateScale() {
    textEditor.style.fontSize = `${fontScale}px`;
  }

  // Zoom In
  zoomInTextEditor.addEventListener('click', () => {
    if (fontScale < maxFontSize) {
      fontScale = Math.min(maxFontSize, fontScale + scaleStep);
      updateScale();
    }
  });

  // Zoom Out
  zoomOutTextEditor.addEventListener('click', () => {
    if (fontScale > minFontSize) {
      fontScale = Math.max(minFontSize, fontScale - scaleStep);
      updateScale();
    }
  });


  const undoButton        = document.querySelector('#undo');
  const redoButton        = document.querySelector('#redo');
  const clearButton       = document.querySelector('#clear');
  const openButton        = document.querySelector('#open');
  const openFileInput  = document.querySelector('#open-file-input');
  const saveButton        = document.querySelector('#save');

  // State
  let undoStack = [];
  let redoStack = [];
  const maxStackSize = 100; // prevent runaway memory use

  // Helpers
  function pushUndoState() {
    undoStack.push(textEditor.value);
    if (undoStack.length > maxStackSize) {
      undoStack.shift();
    }
  }

  function render() {
    // Enable/disable buttons based on state
    undoButton.disabled = undoStack.length === 0;
    redoButton.disabled = redoStack.length === 0;
    // The textarea already shows the current value
  }

  // Record initial state
  pushUndoState();
  render();

  // Listen for changes in the text area (to record undo checkpoints)
  textEditor.addEventListener('input', () => {
    // whenever the user types, push a new state and clear redo stack
    pushUndoState();
    redoStack = [];
    render();
  });

  // Undo
  undoButton.addEventListener('click', () => {
    if (undoStack.length > 1) {
      // Current state goes to redo
      redoStack.push(undoStack.pop());
      // Restore previous
      textEditor.value = undoStack[undoStack.length - 1];
      render();
    }
  });

  // Redo
  redoButton.addEventListener('click', () => {
    if (redoStack.length > 0) {
      const next = redoStack.pop();
      pushUndoState();           // current goes onto undo
      textEditor.value = next;   // restore
      render();
    }
  });

  // Clear
  clearButton.addEventListener('click', () => {
    if (textEditor.value !== '') {
      pushUndoState();
      redoStack = [];
      textEditor.value = '';
      render();
    }
  });

  // Open
  openButton.addEventListener('click', () => openFileInput.click());
  openFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      pushUndoState();
      redoStack = [];
      textEditor.value = ev.target.result;
      render();
    };
    reader.readAsText(file);
  });

  // Save
  saveButton.addEventListener('click', () => {
    const blob = new Blob([textEditor.value], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');

    a.href = url;
    a.download = 'useless-text-editor.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // RTL Text Adjustment
  function isRTLText(text) {
    const rtlRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/; // Unicode range for Arabic and Persian
    return rtlRegex.test(text);
  }

  //Listen to input in text editor
  textEditor.addEventListener('input', () => {
    if (isRTLText(textEditor.value)) {
      textEditor.setAttribute('dir', 'rtl'); // right to left direction
    } else {
      textEditor.setAttribute('dir', 'ltr'); // left to right direction
    }
  })


  // Theme
  const themeButton = document.querySelector("#theme");
  const themeStyleSheet = document.querySelector("#theme-stylesheet");

  // Check the saved theme or default to light
  const currentTheme = localStorage.getItem("theme") || "light";

  // Apply the saved theme on page load
  if (currentTheme === "dark") {
    themeStyleSheet.href = "styles/index-black.css"; // Switch to dark theme
  }

  // Toggle theme when the button is clicked
  themeButton.addEventListener("click", () => {
    const currentTheme = themeStyleSheet.getAttribute("href");

    if (currentTheme === "styles/index-black.css") {
      themeStyleSheet.href = "styles/index.css"; // Switch to light theme
      localStorage.setItem("theme", "light"); // Save the light theme preference
    } else {
      themeStyleSheet.href = "styles/index-black.css"; // Switch to dark theme
      localStorage.setItem("theme", "dark"); // Save the dark theme preference
    }
  });
});