// Must find a way to use the below to avoid electron when opening link.

const { shell } = require('electron');
const link = document.getElementById('attribute-link');

link.addEventListener('click', (event) => {
  event.preventDefault(); // Stop the default behavior
  shell.openExternal(link.href); // Open in default browser
});

/*
HTML Link to GitHub
<a id="attribute-link" class="link" href="https://github.com/Abdulqasem-Bakhshi" target="_blank">GitHub</a>

*/