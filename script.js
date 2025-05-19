// script.js

// 1) PHONEME DATA
const clusters = [
  { id:'bl', label:'bl', type:'cluster', utter:'bul' },
  { id:'br', label:'br', type:'cluster', utter:'bur' },
  { id:'cl', label:'cl', type:'cluster', utter:'cul' },
  { id:'cr', label:'cr', type:'cluster', utter:'cur' },
  { id:'dr', label:'dr', type:'cluster', utter:'dur' },
  { id:'fl', label:'fl', type:'cluster', utter:'ful' },
  { id:'fr', label:'fr', type:'cluster', utter:'fur' },
  { id:'gl', label:'gl', type:'cluster', utter:'gul' },
  { id:'gr', label:'gr', type:'cluster', utter:'gur' },
  { id:'pl', label:'pl', type:'cluster', utter:'pul' },
  { id:'pr', label:'pr', type:'cluster', utter:'pur' },
  { id:'sh', label:'sh', type:'cluster', utter:'shuh' },
  { id:'sl', label:'sl', type:'cluster', utter:'suhl' },
  { id:'sm', label:'sm', type:'cluster', utter:'sum' },
  { id:'sp', label:'sp', type:'cluster', utter:'sup' },
  { id:'st', label:'st', type:'cluster', utter:'stuh' },
  { id:'th', label:'th', type:'cluster', utter:'thuh' },
  { id:'tr', label:'tr', type:'cluster', utter:'tur' },
  { id:'wh', label:'wh', type:'cluster', utter:'wuh' },
];

const consonants = 'b c d f g h j k l m n p q r s t v w x y z'
  .split(' ')
  .map(ch => ({ id: ch, label: ch, type: 'consonant', utter: ch }));

const vowels = [
  { id:'a',       label:'SHORT a', type:'vowel', utter:'a' },
  { id:'e',       label:'SHORT e', type:'vowel', utter:'e' },
  { id:'i',       label:'SHORT i', type:'vowel', utter:'i' },
  { id:'o',       label:'SHORT o', type:'vowel', utter:'o' },
  { id:'u',       label:'SHORT u', type:'vowel', utter:'u' },

  { id:'a_long',  label:'LONG a',  type:'long',  utter:'A' },
  { id:'e_long',  label:'LONG e',  type:'long',  utter:'E' },
  { id:'i_long',  label:'LONG i',  type:'long',  utter:'I' },
  { id:'o_long',  label:'LONG o',  type:'long',  utter:'O' },
  { id:'u_long',  label:'LONG u',  type:'long',  utter:'U' },
];

const endings = [
  'ab','ack','ail','ake','all','an','ap','at','eed','ell','et',
  'ick','ill','in','it','ow','op','ore','ot','ug','um'
].map(end => ({ id: end, label: end, type: 'ending', utter: end }));

const items = [
  ...clusters,
  ...consonants,
  ...vowels,
  ...endings
];

// 2) RENDER GRID
const grid = document.getElementById('grid');
items.forEach(item => {
  const btn = document.createElement('button');
  btn.textContent = item.label;
  btn.className   = `cell ${item.type}`;
  btn.dataset.id  = item.id;

  // — make buttons bigger / more obvious —
  btn.style.fontSize   = '1.5rem';
  btn.style.padding    = '1rem';
  btn.style.minWidth   = '3rem';
  btn.style.minHeight  = '3rem';

  grid.appendChild(btn);
  btn.addEventListener('click', () => onPhonemeClick(item));
});

// 3) DISPLAY & CONTROL ELEMENTS
const display = document.getElementById('current-word');
document.getElementById('clear')
  .addEventListener('click', () => display.textContent = '');

document.getElementById('backspace')
  .addEventListener('click', () => {
    display.textContent = display.textContent.slice(0, -1);
  });

document.getElementById('speak-word')
  .addEventListener('click', () => speakText(display.textContent));

// — also let kids click the displayed word itself to hear it —
display.addEventListener('click', () => speakText(display.textContent));

// 4) HELPER FOR SPEECH
function speakText(text) {
  if (!text) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  window.speechSynthesis.speak(u);
}

// 5) WHAT HAPPENS ON A PHONEME CLICK
function onPhonemeClick(item) {
  // append the raw label (strip off "SHORT " / "LONG ")
  const chunk = item.label.replace(/^SHORT |^LONG /, '');
  display.textContent += chunk;

  // speak the phoneme -- use `item.utter` if provided
  speakText(item.utter || chunk);
}
