// script.js

// ——————————————————————————————
// 1) ALL PHONEME DEFINITIONS
//    clusters / digraphs with phonetic utterances:
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

// single consonants (26 letters)
const consonants = 'b c d f g h j k l m n p q r s t v w x y z'
  .split(' ')
  .map(ch => ({ id: ch, label: ch, type: 'consonant', utter: ch }));

// short & long vowels with phonetic overrides
const vowels = [
  { id:'a',       label:'SHORT a', type:'vowel', utter:'ae' },  // like in "cat"
  { id:'e',       label:'SHORT e', type:'vowel', utter:'eh' },  // like in "bed"
  { id:'i',       label:'SHORT i', type:'vowel', utter:'ih' },  // like in "sit"
  { id:'o',       label:'SHORT o', type:'vowel', utter:'ah' },  // like in "hot"
  { id:'u',       label:'SHORT u', type:'vowel', utter:'uh' },  // like in "cup"

  { id:'a_long',  label:'LONG a',  type:'long',  utter:'ay' },  // like in "cake"
  { id:'e_long',  label:'LONG e',  type:'long',  utter:'ee' },  // like in "meet"
  { id:'i_long',  label:'LONG i',  type:'long',  utter:'eye' }, // like in "kite"
  { id:'o_long',  label:'LONG o',  type:'long',  utter:'oh' },  // like in "rope"
  { id:'u_long',  label:'LONG u',  type:'long',  utter:'you' }  // like in "flute"
];

// common endings
const endings = [
  'ab','ack','ail','ake','all','an','ap','at','eed','ell','et',
  'ick','ill','in','it','ow','op','ore','ot','ug','um'
].map(end => ({ id: end, label: end, type: 'ending', utter: end }));

// flatten into one master list
const items = [...clusters, ...consonants, ...vowels, ...endings];


// ——————————————————————————————
// 2) LAYOUT DEFINITIONS
//    just arrays of item.id in the order you want them

const layouts = {
  phonics: [
    // row 1 (clusters)
    'bl','br','ch','sh','th','wh',
    // row 2 (clusters + single cons + a)
    'cl','cr','b','c','d','f','a','a_long',
    // row 3
    'dr','fl','fr','g','h','j','k','e','e_long',
    // row 4
    'tr','gl','gr','l','m','n','p','i','i_long',
    // row 5
    'pl','pr','q','r','s','t','o','o_long',
    // row 6
    'sl','sm','v','w','x','y','u','u_long',
    // row 7 (endings)
    'ab','ack','ail','ake','all','an','ap','at','eed','ell',
    'et','ick','ill','in','it','ow','op','ore','ot','ug','um'
  ],
  qwerty: [
    // standard keyboard rows
    'q','w','e','r','t','y','u','i','o','p',
    'a','s','d','f','g','h','j','k','l',
    'z','x','c','v','b','n','m'
  ]
};


// ——————————————————————————————
// 3) INJECT CONTROLS (layout + voice selectors)
const app = document.getElementById('app');
const controls = document.createElement('div');
controls.id = 'controls';
controls.style.marginBottom = '1rem';
controls.innerHTML = `
  <label>
    Layout:
    <select id="layout-select">
      <option value="phonics">Phonics Grid</option>
      <option value="qwerty">QWERTY</option>
    </select>
  </label>
  <label style="margin-left:1rem">
    Voice:
    <select id="voice-select"></select>
  </label>
`;
app.insertBefore(controls, document.getElementById('grid'));

// populate layout-switcher
document.getElementById('layout-select')
  .addEventListener('change', e => renderLayout(e.target.value));


// ——————————————————————————————
// 4) POPULATE VOICE LIST
let voices = [];
function loadVoices() {
  voices = window.speechSynthesis.getVoices();
  const vs = document.getElementById('voice-select');
  vs.innerHTML = '';
  voices.forEach((v,i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${v.name} (${v.lang})`;
    vs.appendChild(opt);
  });
}
// Chrome / Firefox sometimes fire this after load:
speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();


// ——————————————————————————————
// 5) RENDER GRID (based on current layout)
const grid = document.getElementById('grid');
function renderLayout(name) {
  grid.innerHTML = '';
  // pick the layout array (or default to phonics)
  const seq = layouts[name] || layouts.phonics;

  seq.forEach(id => {
    // find the phoneme definition
    const item = items.find(x => x.id === id);
    if (!item) {
      // empty/blank cell
      const blank = document.createElement('div');
      blank.className = 'cell blank';
      grid.appendChild(blank);
      return;
    }
    // otherwise, create the button
    const btn = document.createElement('button');
    btn.textContent   = item.label;
    btn.className     = `cell ${item.type}`;
    btn.dataset.id    = item.id;
    btn.style.fontSize   = '1.5rem';
    btn.style.padding    = '1rem';
    btn.style.minWidth   = '3rem';
    btn.style.minHeight  = '3rem';

    btn.addEventListener('click', () => onPhonemeClick(item));
    grid.appendChild(btn);
  });
}

// initial render
renderLayout('phonics');


// ——————————————————————————————
// 6) DISPLAY & CONTROLS
const display = document.getElementById('current-word');
document.getElementById('clear')
  .addEventListener('click', () => display.textContent = '');
document.getElementById('backspace')
  .addEventListener('click', () => {
    display.textContent = display.textContent.slice(0, -1);
  });
document.getElementById('speak-word')
  .addEventListener('click', () => speakText(display.textContent));
display.addEventListener('click', () => speakText(display.textContent));


// ——————————————————————————————
// 7) SPEAK HELPER (uses selected voice)
function speakText(text) {
  if (!text) return;
  const utter = new SpeechSynthesisUtterance(text);
  // pick voice
  const vs = document.getElementById('voice-select');
  const idx = parseInt(vs.value, 10);
  if (voices[idx]) utter.voice = voices[idx];
  utter.lang = voices[idx]?.lang || 'en-US';
  window.speechSynthesis.speak(utter);
}


// ——————————————————————————————
// 8) PHONEME CLICK HANDLER
function onPhonemeClick(item) {
  // append the raw label (strip off “SHORT ” / “LONG ”)
  const chunk = item.label.replace(/^SHORT |^LONG /, '');
  display.textContent += chunk;
  // speak its phonetic utterance
  speakText(item.utter || chunk);
}
