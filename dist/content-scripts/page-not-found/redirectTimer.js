/**
 * jsore/dist/content-scripts/page-not-found/redirectTimer.js
 */

/** timer functionality */

document.addEventListener('DOMContentLoaded', (event) => {
  const timer = document.getElementById('redirect-timer');
  timer.innerHTML = 'script reached';
  // window.location.replace("https://jsore.com");
});
