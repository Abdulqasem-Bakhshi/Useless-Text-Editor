// This is old code I have made

window.onload = () => {
  document.getElementById('minimize').addEventListener('click', () => {
    window.electronAPI.minimizeWindow();
  });

  document.getElementById('close').addEventListener('click', () => {
    window.electronAPI.closeWindow();
  });


  
  // Select text editor input element
  const textEditor = document.querySelector('.text-editor-input');
  const textContainer = document.querySelector('text-editor');

  // Make text editor input focusable
  textEditor.focus();

  // Event Listener to ensure onclick maintain focus on text editor
  document.addEventListener('click', (event) => {
    if (event.target == textEditor || event.target === textContainer) {
      textEditor.focus();
    }
  })

  // Select Zoom In and Zoom Out buttons
  const zoomInTextEditor = document.querySelector('#zoom-in');
  const zoomOutTextEditor = document.querySelector('#zoom-out');

  // Select current font size of text editor and save
  let currentFontSize = parseInt(window.getComputedStyle(textEditor).fontSize);

  // Listen to click event of Zoom In + Response
  document.addEventListener('click', (event) => {
    if (event.target === zoomInTextEditor) {
      currentFontSize += 1;
      textEditor.style.fontSize = `${currentFontSize}px`
    }
  });

  // Listen to click event of Zoom Out + Response
  document.addEventListener('click', (event) => {
    if (event.target === zoomOutTextEditor) {
      currentFontSize -= 1;
      textEditor.style.fontSize = `${currentFontSize}px`
    }
  });

  // Select Undo button
  const undoTextEditor = document.querySelector('#undo');

  // Listen to click event of Undo + Response
  document.addEventListener('click', (event) => {
    if (event.target === undoTextEditor) {
      const text = textEditor.value.trim().split(' ');
      const removedText = text.pop();
      redoStorage.push(removedText);

      textEditor.value = text.join(' ');
    }
  })

  // Select Redo button
  const redoTextEditor = document.querySelector('#redo');
  const redoStorage = [];

  // Listen to click event of Redo + Response
  document.addEventListener('click', (event) => {
    if (event.target === redoTextEditor) {
      if (redoStorage.length > 0) {
        const restoredText = redoStorage.pop();
        textEditor.value = textEditor.value.trim() + ' ' + restoredText
      }
    }
  }
  );

  // Select Clear Text button
  const clearTextButton = document.querySelector('#clear');

  // Listen to click event of Clear Text + Response
  document.addEventListener('click', (event) => {
    if (event.target === clearTextButton) {
      textEditor.value = '';
    }
  })

  // Select Open button
  const openTextButton = document.querySelector('#open');
  const openFileInput = document.querySelector('#open-file-input');

  // Listen to click event of Open + Response
  openTextButton.addEventListener('click', () => {
    openFileInput.click();
  });

  openFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        textEditor.value = e.target.result;
      };
      reader.readAsText(file);
    }
  })

  // Select Save button
  const saveTextButton = document.querySelector('#save');
  const saveFileInput = document.querySelector('#save-file-input');

  // Listen to click event of Save + Response
  saveTextButton.addEventListener('click', () => {

    const text = textEditor.value;
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'useless-text-editor.txt';
    link.click();
    URL.revokeObjectURL(link.href);
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
}