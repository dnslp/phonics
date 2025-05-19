// 1) your phoneme definitions
//    add an optional `utter` if you want something other than `label` spoken
const items = [
  { id: 'bl',   label: 'bl',    type: 'cluster', utter: 'bl' },
  { id: 'br',   label: 'br',    type: 'cluster', utter: 'br' },
  { id: 'ch',   label: 'ch',    type: 'cluster', utter: 'ch' },
  /* … all your other clusters … */

  { id: 'b',    label: 'b',     type: 'consonant' },
  { id: 'c',    label: 'c',     type: 'consonant' },
  /* … all your other single consonants … */

  { id: 'a',    label: 'SHORT a',  type: 'vowel',  utter: 'a' },
  { id: 'e',    label: 'SHORT e',  type: 'vowel',  utter: 'e' },
  /* … short vowels … */

  { id: 'a_long', label: 'LONG a', type: 'long',   utter: 'A' },
  { id: 'e_long', label: 'LONG e', type: 'long',   utter: 'E' },
  /* … long vowels … */

  { id: 'ack',  label: 'ack',   type: 'ending' },
  { id: 'all',  label: 'all',   type: 'ending' },
  /* … all your endings … */
];

// 2) build the grid UI exactly as before
const grid = document.getElementById('grid');
items.forEach(item => {
  const btn = document.createElement('button');
  btn.textContent = item.label;
  btn.className = `cell ${item.type}`;
  btn.dataset.id = item.id;
  grid.appendChild(btn);
  btn.addEventListener('click', () => onPhonemeClick(item));
});

// 3) display & controls
const display = document.getElementById('current-word');
document.getElementById('clear')
  .addEventListener('click', () => display.textContent = '');
document.getElementById('backspace')
  .addEventListener('click', () => {
    display.textContent = display.textContent.slice(0, -1);
  });
document.getElementById('speak-word')
  .addEventListener('click', () => {
    speakText(display.textContent);
  });

// 4) helper to speak any string
function speakText(text) {
  if (!text) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  window.speechSynthesis.speak(u);
}

// 5) phoneme click handler
function onPhonemeClick(item) {
  // append the raw label (you can tweak this if you want spacing or separators)
  let chunk = item.label.replace(/^SHORT |^LONG /, '');
  display.textContent += chunk;

  // speak the phoneme (use item.utter if provided, else the chunk itself)
  speakText(item.utter || chunk);
}
