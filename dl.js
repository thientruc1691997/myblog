/* ═══════════════════════════════════════════════════════════
   dl.js  —  Deep Learning page logic
   Sections:
     1. TAB SWITCHING & PANEL
     2. MINDMAP  (nodes, edges, render, interaction)
     3. NODE PANEL ROUTER  ← add new architectures here
     4. CNN — Explanation
     5. CNN — Datasets
     6. CNN — Code
   ─────────────────────────────────────────────────────────
   To add content for a new architecture:
     a) Add a node entry in NODES array (section 2)
     b) Add an edge in EDGES array  (section 2)
     c) Add an else-if in openNodePanel()  (section 3)
     d) Write three fill functions  (sections 4-6 as template)
═══════════════════════════════════════════════════════════ */


/* ─────────────────────────────────────────────────────────
   1. TAB SWITCHING & PANEL
───────────────────────────────────────────────────────── */
function switchTab(name, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.getElementById('tab-' + name).classList.add('active');
}

function closePanel() {
  document.getElementById('dl-detail-panel').style.display = 'none';
}

/* helper: open panel by node id from outside (e.g. coming-soon rows) */
function openNodeById(id) {
  const node = NODES.find(n => n.id === id);
  if (node) openNodePanel(node);
}


/* ─────────────────────────────────────────────────────────
   2. MINDMAP
   ─── To add a node ───
       Add an object to NODES with: id, label, x, y, r, color,
       textColor, fontSize, fontW, and optionally clickable:true
   ─── To add an edge ───
       Add ['from-id', 'to-id'] to EDGES
───────────────────────────────────────────────────────── */
const NODES = [
  /* root */
  { id:'root',         label:'Deep\nLearning', x:0,    y:0,    r:44, color:'#6c63ff', textColor:'#fff',    fontSize:13, fontW:'700' },

  /* CNNs branch */
  { id:'cnns',         label:'CNNs',           x:-240, y:-60,  r:36, color:'#3b82f6', textColor:'#fff',    fontSize:13, fontW:'600' },
  { id:'lenet',        label:'LeNet\nAlexNet', x:-385, y:-135, r:28, color:'#1d4ed8', textColor:'#bfdbfe', fontSize:11, fontW:'500' },
  { id:'resnet',       label:'ResNet\nVGG',    x:-405, y:-30,  r:28, color:'#1d4ed8', textColor:'#bfdbfe', fontSize:11, fontW:'500' },
  { id:'yolo',         label:'YOLO\nR-CNN',    x:-360, y:70,   r:28, color:'#1d4ed8', textColor:'#bfdbfe', fontSize:11, fontW:'500' },
  { id:'effnet',       label:'EfficientNet',   x:-250, y:125,  r:24, color:'#1e3a8a', textColor:'#93c5fd', fontSize:10, fontW:'500' },

  /* Transformers branch */
  { id:'transformers', label:'Transformers',   x:20,   y:-160, r:38, color:'#7c3aed', textColor:'#fff',    fontSize:12, fontW:'600' },
  { id:'bert',         label:'BERT',           x:-85,  y:-235, r:26, color:'#4c1d95', textColor:'#c4b5fd', fontSize:11, fontW:'500' },
  { id:'gpt',          label:'GPT',            x:40,   y:-265, r:26, color:'#4c1d95', textColor:'#c4b5fd', fontSize:11, fontW:'500' },
  { id:'vit',          label:'ViT',            x:155,  y:-225, r:24, color:'#4c1d95', textColor:'#c4b5fd', fontSize:10, fontW:'500' },
  { id:'llms',         label:'LLMs',           x:90,   y:-155, r:28, color:'#5b21b6', textColor:'#ddd6fe', fontSize:12, fontW:'600' },

  /* GANs branch */
  { id:'gans',         label:'GANs',           x:230,  y:-100, r:34, color:'#d97706', textColor:'#fff',    fontSize:13, fontW:'600' },
  { id:'stylegan',     label:'StyleGAN',       x:345,  y:-162, r:26, color:'#92400e', textColor:'#fde68a', fontSize:10, fontW:'500' },
  { id:'cyclegan',     label:'CycleGAN',       x:395,  y:-60,  r:26, color:'#92400e', textColor:'#fde68a', fontSize:10, fontW:'500' },

  /* RNNs branch */
  { id:'rnns',         label:'RNNs',           x:-220, y:105,  r:34, color:'#059669', textColor:'#fff',    fontSize:13, fontW:'600' },
  { id:'lstm',         label:'LSTM',           x:-315, y:165,  r:26, color:'#064e3b', textColor:'#6ee7b7', fontSize:11, fontW:'500' },
  { id:'gru',          label:'GRU',            x:-205, y:190,  r:22, color:'#064e3b', textColor:'#6ee7b7', fontSize:10, fontW:'500' },

  /* Diffusion branch */
  { id:'diffusion',    label:'Diffusion\nModels', x:220, y:105, r:34, color:'#db2777', textColor:'#fff',   fontSize:11, fontW:'600' },
  { id:'ddpm',         label:'DDPM',           x:335,  y:82,   r:24, color:'#831843', textColor:'#fbcfe8', fontSize:10, fontW:'500' },
  { id:'sd',           label:'Stable\nDiff.',  x:335,  y:158,  r:24, color:'#831843', textColor:'#fbcfe8', fontSize:10, fontW:'500' },

  /* VAEs */
  { id:'vaes',         label:'VAEs',           x:60,   y:175,  r:30, color:'#0e7490', textColor:'#fff',    fontSize:12, fontW:'600' },
  { id:'vqvae',        label:'VQ-VAE',         x:155,  y:225,  r:22, color:'#164e63', textColor:'#a5f3fc', fontSize:10, fontW:'500' },

  /* GNNs */
  { id:'gnns',         label:'GNNs',           x:-60,  y:185,  r:28, color:'#f97316', textColor:'#fff',    fontSize:12, fontW:'600' },
  { id:'gcn',          label:'GCN\nGAT',       x:-100, y:248,  r:22, color:'#7c2d12', textColor:'#fed7aa', fontSize:10, fontW:'500' },
];

const EDGES = [
  ['root','cnns'], ['root','transformers'], ['root','gans'],
  ['root','rnns'], ['root','diffusion'],   ['root','vaes'], ['root','gnns'],
  ['cnns','lenet'], ['cnns','resnet'], ['cnns','yolo'], ['cnns','effnet'],
  ['transformers','bert'], ['transformers','gpt'], ['transformers','vit'], ['transformers','llms'],
  ['gans','stylegan'], ['gans','cyclegan'],
  ['rnns','lstm'], ['rnns','gru'],
  ['diffusion','ddpm'], ['diffusion','sd'],
  ['vaes','vqvae'], ['gnns','gcn'],
];

/* Canvas state */
let mmReady = false;
const canvas = document.getElementById('mindmap-canvas');
const ctx    = canvas.getContext('2d');
let W, H, scale = 1, offsetX = 0, offsetY = 0;
let dragging = false, lastX = 0, lastY = 0;

function worldToScreen(x, y) { return [x*scale + W/2 + offsetX, y*scale + H/2 + offsetY]; }
function screenToWorld(sx,sy) { return [(sx - W/2 - offsetX)/scale, (sy - H/2 - offsetY)/scale]; }

function mmResize() {
  const wrap = document.getElementById('mindmap-wrap');
  if (!wrap) return;
  W = wrap.clientWidth; H = 520;
  canvas.width  = W * devicePixelRatio;
  canvas.height = H * devicePixelRatio;
  canvas.style.width  = W + 'px';
  canvas.style.height = H + 'px';
  ctx.setTransform(1,0,0,1,0,0);
  ctx.scale(devicePixelRatio, devicePixelRatio);
  mmDraw();
}

function mmDraw() {
  if (!ctx) return;
  ctx.clearRect(0, 0, W, H);

  /* edges */
  EDGES.forEach(([a, b]) => {
    const na = NODES.find(n => n.id === a);
    const nb = NODES.find(n => n.id === b);
    const [ax, ay] = worldToScreen(na.x, na.y);
    const [bx, by] = worldToScreen(nb.x, nb.y);
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
    ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.lineWidth = 1.5; ctx.stroke();
  });

  /* nodes */
  NODES.forEach(node => {
    const [sx, sy] = worldToScreen(node.x, node.y);
    const r = node.r * scale;

    ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fillStyle   = node.color;
    ctx.strokeStyle = node.id === 'root' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.18)';
    ctx.lineWidth   = node.id === 'root' ? 1 : 1.5;
    ctx.fill(); ctx.stroke();

    /* label */
    ctx.fillStyle = node.textColor;
    const fs = Math.max(8, node.fontSize * scale);
    ctx.font = `${node.fontW} ${fs}px Syne, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const lines = node.label.split('\n');
    const lh = fs * 1.3;
    lines.forEach((line, i) =>
      ctx.fillText(line, sx, sy - (lh * (lines.length - 1)) / 2 + i * lh)
    );
  });

  /* no hover hints — all nodes open panel on click */
}

function initMindmap() {
  if (mmReady) { mmResize(); return; }
  mmReady = true;
  mmResize();

  canvas.addEventListener('mousedown', e => { dragging = true; lastX = e.clientX; lastY = e.clientY; });
  window.addEventListener('mouseup',   ()  => dragging = false);
  window.addEventListener('mousemove', e   => {
    if (!dragging) return;
    offsetX += e.clientX - lastX; offsetY += e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY; mmDraw();
  });
  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const [wx, wy] = screenToWorld(mx, my);
    scale = Math.max(.4, Math.min(3, scale * (e.deltaY > 0 ? .9 : 1.1)));
    offsetX = mx - wx * scale - W / 2;
    offsetY = my - wy * scale - H / 2;
    mmDraw();
  }, { passive: false });

  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const [wx, wy] = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
    for (const node of NODES) {
      const dx = node.x - wx, dy = node.y - wy;
      if (Math.sqrt(dx*dx + dy*dy) < node.r + 4 && node.id !== 'root') {
        openNodePanel(node); break;
      }
    }
  });

  window.addEventListener('resize', mmResize);
}

initMindmap();


/* ─────────────────────────────────────────────────────────
   3. NODE PANEL ROUTER
   ─── To add a new architecture ───
       else if (node.id === 'transformers') {
         document.getElementById('panel-tag').textContent   = 'Transformers';
         document.getElementById('panel-title').textContent = 'Transformers';
         fillTransformersExplain();
         fillTransformersDataset();
         fillTransformersCode();
       }
───────────────────────────────────────────────────────── */
function openNodePanel(node) {
  const panel = document.getElementById('dl-detail-panel');
  panel.style.display = 'block';

  /* reset tabs to Explanation */
  document.querySelectorAll('.tab-btn').forEach((b, i)  => b.classList.toggle('active', i === 0));
  document.querySelectorAll('.tab-content').forEach((c, i) => c.classList.toggle('active', i === 0));

  if (node.id === 'cnns') {
    /* ── CNNs — fully written ── */
    document.getElementById('panel-tag').textContent   = 'Convolutional Neural Networks';
    document.getElementById('panel-title').textContent = 'CNNs';
    fillCNNExplain();
    fillCNNDataset();
    fillCNNCode();

  /* ════════════════════════════════════════════
     ADD OTHER ARCHITECTURES BELOW THIS LINE
     ════════════════════════════════════════════
  } else if (node.id === 'transformers') {
    document.getElementById('panel-tag').textContent   = 'Transformers';
    document.getElementById('panel-title').textContent = 'Transformers';
    fillTransformersExplain();
    fillTransformersDataset();
    fillTransformersCode();
  ════════════════════════════════════════════ */

  } else {
    /* ── Placeholder for nodes without content yet ── */
    const name = node.label.replace('\n', ' ');
    document.getElementById('panel-tag').textContent   = 'Architecture';
    document.getElementById('panel-title').textContent = name;
    const placeholder = msg => `
      <div class="placeholder-blank">
        <div class="ph-marker"></div>
        <div class="ph-title">Content placeholder</div>
        <div class="ph-desc">${msg} <strong>${name}</strong></div>
      </div>`;
    document.getElementById('tab-explain').innerHTML = placeholder('Add your explanation for');
    document.getElementById('tab-dataset').innerHTML = `<div style="padding:2rem;color:var(--text3);font-family:var(--mono);font-size:12px">// Add dataset info for ${name}</div>`;
    document.getElementById('tab-code').innerHTML    = `<div style="padding:2rem;color:var(--text3);font-family:var(--mono);font-size:12px">// Add code examples for ${name}</div>`;
  }

  setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
}


/* ─────────────────────────────────────────────────────────
   4. CNN — EXPLANATION
   ─── Edit the innerHTML string below to change the text ───
───────────────────────────────────────────────────────── */
function fillCNNExplain() {
  document.getElementById('tab-explain').innerHTML = `
<div class="explanation-grid">
  <div class="exp-card">
    <div class="exp-card-label">Core idea</div>
    <div class="exp-card-title">Local connectivity</div>
    <p>A small kernel slides across the image computing dot products — detecting patterns wherever they appear, not at fixed positions.</p>
  </div>
  <div class="exp-card">
    <div class="exp-card-label">Key property</div>
    <div class="exp-card-title">Weight sharing</div>
    <p>The same kernel weights are reused at every spatial position, giving translation invariance and dramatically fewer parameters than dense layers.</p>
  </div>
  <div class="exp-card">
    <div class="exp-card-label">Output</div>
    <div class="exp-card-title">Feature maps</div>
    <p>Each kernel produces a 2-D activation map. Stacking N kernels yields N channels — a richer representation at each layer depth.</p>
  </div>
  <div class="exp-card">
    <div class="exp-card-label">Pooling</div>
    <div class="exp-card-title">Spatial downsampling</div>
    <p>Max or average pooling reduces spatial dimensions by 2×, retaining what activated — building invariance to small translations.</p>
  </div>
</div>

<div class="arch-viz">
  <svg viewBox="0 0 700 160" xmlns="http://www.w3.org/2000/svg" style="font-family:DM Mono,monospace">
    <defs>
      <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M2 1L8 5L2 9" fill="none" stroke="#4a4a6a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </marker>
    </defs>
    <!-- Input -->
    <rect x="20" y="50" width="60" height="60" rx="5" fill="#1e1e2e" stroke="#3b82f6" stroke-width="1"/>
    <rect x="26" y="44" width="60" height="60" rx="5" fill="#1e1e2e" stroke="#3b82f6" stroke-width="1"/>
    <rect x="32" y="38" width="60" height="60" rx="5" fill="#1a1a2e" stroke="#3b82f6" stroke-width="1.5"/>
    <text x="62" y="74" text-anchor="middle" fill="#93c5fd" font-size="11" font-weight="500">Input</text>
    <text x="62" y="88" text-anchor="middle" fill="#3b5280" font-size="10">H×W×3</text>
    <line x1="96" y1="80" x2="124" y2="80" stroke="#2a2a3a" stroke-width="1.5" marker-end="url(#arr)"/>
    <!-- Conv -->
    <rect x="126" y="38" width="90" height="84" rx="8" fill="#1e1e2e" stroke="#6c63ff" stroke-width="1.5"/>
    <text x="171" y="72" text-anchor="middle" fill="#a78bfa" font-size="12" font-weight="600">Conv</text>
    <text x="171" y="86" text-anchor="middle" fill="#4a4a6a" font-size="10">3×3 kernel</text>
    <text x="171" y="100" text-anchor="middle" fill="#34d399" font-size="10">ReLU</text>
    <line x1="218" y1="80" x2="244" y2="80" stroke="#2a2a3a" stroke-width="1.5" marker-end="url(#arr)"/>
    <!-- Feature maps -->
    <rect x="246" y="55" width="50" height="50" rx="4" fill="#1e1e2e" stroke="#3b82f6" stroke-width="1"/>
    <rect x="250" y="50" width="50" height="50" rx="4" fill="#1e1e2e" stroke="#3b82f6" stroke-width="1"/>
    <rect x="254" y="45" width="50" height="50" rx="4" fill="#1a1a2e" stroke="#6c63ff" stroke-width="1.5"/>
    <text x="279" y="76" text-anchor="middle" fill="#a78bfa" font-size="10">Feature</text>
    <text x="279" y="88" text-anchor="middle" fill="#a78bfa" font-size="10">maps</text>
    <line x1="308" y1="80" x2="334" y2="80" stroke="#2a2a3a" stroke-width="1.5" marker-end="url(#arr)"/>
    <!-- MaxPool -->
    <rect x="336" y="48" width="80" height="64" rx="8" fill="#1e1e2e" stroke="#22d3ee" stroke-width="1.5"/>
    <text x="376" y="78" text-anchor="middle" fill="#22d3ee" font-size="12" font-weight="600">MaxPool</text>
    <text x="376" y="94" text-anchor="middle" fill="#4a4a6a" font-size="10">2×2 stride 2</text>
    <line x1="418" y1="80" x2="444" y2="80" stroke="#2a2a3a" stroke-width="1.5" marker-end="url(#arr)"/>
    <!-- Flatten -->
    <rect x="446" y="60" width="14" height="40" rx="3" fill="#1a1a2e" stroke="#5a5a7a" stroke-width="1"/>
    <text x="453" y="115" text-anchor="middle" fill="#4a4a6a" font-size="9">Flatten</text>
    <line x1="462" y1="80" x2="488" y2="80" stroke="#2a2a3a" stroke-width="1.5" marker-end="url(#arr)"/>
    <!-- FC -->
    <rect x="490" y="38" width="76" height="84" rx="8" fill="#1e1e2e" stroke="#fb7185" stroke-width="1.5"/>
    <text x="528" y="72" text-anchor="middle" fill="#fb7185" font-size="12" font-weight="600">FC</text>
    <text x="528" y="86" text-anchor="middle" fill="#4a4a6a" font-size="10">Dense +</text>
    <text x="528" y="100" text-anchor="middle" fill="#4a4a6a" font-size="10">Dropout</text>
    <line x1="568" y1="80" x2="592" y2="80" stroke="#2a2a3a" stroke-width="1.5" marker-end="url(#arr)"/>
    <!-- Softmax -->
    <rect x="594" y="55" width="70" height="50" rx="8" fill="#1e1e2e" stroke="#fbbf24" stroke-width="1.5"/>
    <text x="629" y="78" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="600">Softmax</text>
    <text x="629" y="92" text-anchor="middle" fill="#4a4a6a" font-size="10">N classes</text>
    <!-- Loop annotation -->
    <path d="M126 148 Q126 156 250 156 Q374 156 418 148" fill="none" stroke="#2a2a3a" stroke-width="1" stroke-dasharray="3 3"/>
    <text x="272" y="152" text-anchor="middle" fill="#3a3a5a" font-size="10">repeated conv+pool blocks → hierarchical features</text>
  </svg>
</div>

<div class="exp-prose">
  <h3>Why CNNs dominate vision tasks</h3>
  <ul>
    <li><strong>Parameter efficiency</strong> — A 3×3 kernel needs only 9 weights, shared across the entire image.</li>
    <li><strong>Hierarchical features</strong> — Early layers detect edges; deeper layers compose shapes and objects.</li>
    <li><strong>Translation invariance</strong> — Pooling means the network recognises a cat anywhere in the frame.</li>
  </ul>
  <h3>Landmark architectures</h3>
  <ul>
    <li><strong>LeNet-5 (1998)</strong> — Yann LeCun's pioneering digit recogniser. Established the conv–pool–FC pattern.</li>
    <li><strong>AlexNet (2012)</strong> — Won ImageNet by a wide margin. Added ReLU, Dropout, GPU training.</li>
    <li><strong>VGG-16 (2014)</strong> — Showed depth with 3×3 kernels beats large kernels.</li>
    <li><strong>ResNet (2015)</strong> — Skip connections solved vanishing gradients, enabling 152-layer networks.</li>
    <li><strong>EfficientNet (2019)</strong> — Compound scaling of width, depth, and resolution.</li>
  </ul>
</div>`;
}


/* ─────────────────────────────────────────────────────────
   5. CNN — DATASETS
   ─── Edit DATASETS object to change dataset info ───
   ─── Edit renderSamples() to change preview tiles ───
───────────────────────────────────────────────────────── */
let selectedDS = 'mnist';

const DATASETS = {
  mnist: {
    name: 'MNIST', badge: 'green', badgeLabel: 'Beginner',
    meta: '70,000 images · 28×28 · 10 classes',
    desc: 'Handwritten digits 0–9. The "hello world" of computer vision.',
    info: [['Images','70,000'],['Size','28×28px'],['Classes','10'],['Format','Grayscale'],['Train/Test','60k / 10k'],['Source','NIST']],
  },
  cifar10: {
    name: 'CIFAR-10', badge: 'amber', badgeLabel: 'Intermediate',
    meta: '60,000 images · 32×32 · 10 classes',
    desc: '10 natural object categories: airplane, car, bird, cat, deer, dog, frog, horse, ship, truck.',
    info: [['Images','60,000'],['Size','32×32px'],['Classes','10'],['Format','RGB'],['Train/Test','50k / 10k'],['Source','Krizhevsky']],
  },
  imagenet: {
    name: 'ImageNet', badge: 'teal', badgeLabel: 'Advanced',
    meta: '1.28M images · 224×224 · 1,000 classes',
    desc: 'The benchmark that sparked the deep learning revolution. 1,000 synsets from WordNet.',
    info: [['Images','1.28M'],['Size','224×224px'],['Classes','1,000'],['Format','RGB'],['Train/Val','1.2M / 50k'],['Source','Stanford']],
  },
};

function fillCNNDataset() { renderDSTab(); }

function renderDSTab() {
  const ds = DATASETS[selectedDS];
  document.getElementById('tab-dataset').innerHTML = `
<div class="dataset-grid">
  ${Object.entries(DATASETS).map(([k, d]) => `
  <div class="dataset-card ${k === selectedDS ? 'selected' : ''}" onclick="selectDS('${k}')">
    <div class="ds-name">${d.name}</div>
    <div class="ds-meta">${d.meta}</div>
    <div class="ds-desc">${d.desc}</div>
    <div class="ds-badge ${d.badge}">${d.badgeLabel}</div>
  </div>`).join('')}
</div>
<div class="ds-samples">
  <div class="ds-samples-title">Sample preview — ${ds.name}</div>
  <div class="sample-grid" id="sample-grid"></div>
  <div class="sample-info">
    ${ds.info.map(([l,v]) => `
    <div class="info-pill">
      <div class="info-pill-label">${l}</div>
      <div class="info-pill-value">${v}</div>
    </div>`).join('')}
  </div>
</div>`;
  renderSamples(ds);
}

function selectDS(key) { selectedDS = key; renderDSTab(); }

function renderSamples(ds) {
  const grid = document.getElementById('sample-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const bgColors = ['#374151','#1e3a5f','#1f3d26','#3d1f1f','#3d2f1f','#2d1f3d','#1f3d38','#3d3d1f','#3a1f3a','#1f3828'];
  const cifar    = ['airplane','car','bird','cat','deer','dog','frog','horse','ship','truck'];

  for (let i = 0; i < 16; i++) {
    const div = document.createElement('div');
    div.className = 'sample-cell sample-mnist';

    if (ds.name === 'MNIST') {
      const c = document.createElement('canvas');
      c.width = 28; c.height = 28;
      const x = c.getContext('2d');
      x.fillStyle = '#000'; x.fillRect(0, 0, 28, 28);
      drawDigit(x, i % 10);
      div.appendChild(c);
    } else {
      div.style.background = bgColors[i % bgColors.length];
      div.style.color = 'rgba(255,255,255,0.3)';
      div.textContent = cifar[i % 10];
    }
    grid.appendChild(div);
  }
}

/* Hand-drawn digit paths for MNIST preview */
function drawDigit(ctx, d) {
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const cx = 14, cy = 14;
  const shapes = [
    () => { ctx.beginPath(); ctx.ellipse(cx,cy,5,7,0,0,Math.PI*2); ctx.stroke(); },
    () => { ctx.beginPath(); ctx.moveTo(cx,7); ctx.lineTo(cx,21); ctx.stroke(); },
    () => { ctx.beginPath(); ctx.moveTo(9,8); ctx.quadraticCurveTo(19,7,18,12); ctx.quadraticCurveTo(9,17,9,21); ctx.lineTo(19,21); ctx.stroke(); },
    () => { ctx.beginPath(); ctx.moveTo(9,8); ctx.lineTo(18,8); ctx.lineTo(12,14); ctx.quadraticCurveTo(19,16,18,20); ctx.quadraticCurveTo(16,23,9,21); ctx.stroke(); },
    () => { ctx.beginPath(); ctx.moveTo(16,7); ctx.lineTo(8,16); ctx.lineTo(20,16); ctx.moveTo(16,7); ctx.lineTo(16,21); ctx.stroke(); },
    () => { ctx.beginPath(); ctx.moveTo(18,7); ctx.lineTo(9,7); ctx.lineTo(9,14); ctx.quadraticCurveTo(18,12,18,18); ctx.quadraticCurveTo(18,22,9,22); ctx.stroke(); },
    () => { ctx.beginPath(); ctx.moveTo(17,7); ctx.quadraticCurveTo(7,7,8,14); ctx.quadraticCurveTo(8,22,14,22); ctx.quadraticCurveTo(20,22,20,16); ctx.quadraticCurveTo(20,10,8,14); ctx.stroke(); },
    () => { ctx.beginPath(); ctx.moveTo(8,7); ctx.lineTo(20,7); ctx.lineTo(12,21); ctx.stroke(); },
    () => { ctx.beginPath(); ctx.ellipse(cx,11,5,4,0,0,Math.PI*2); ctx.stroke(); ctx.beginPath(); ctx.ellipse(cx,19,5,4,0,0,Math.PI*2); ctx.stroke(); },
    () => { ctx.beginPath(); ctx.moveTo(20,14); ctx.quadraticCurveTo(20,7,14,7); ctx.quadraticCurveTo(8,7,8,14); ctx.quadraticCurveTo(8,19,20,14); ctx.lineTo(20,21); ctx.stroke(); },
  ];
  (shapes[d] || shapes[0])();
}


/* ─────────────────────────────────────────────────────────
   6. CNN — CODE
   ─── Edit CODE object to change framework examples ───
   ─── Add a key + object to add a new framework tab ───
───────────────────────────────────────────────────────── */
let currentLang = 'pytorch';

const CODE = {
  pytorch: {
    filename: 'cnn_mnist.py', dotColor: '#3b82f6',
    code: `<span class="cm"># CNN for MNIST — PyTorch</span>
<span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> torch.optim <span class="kw">as</span> optim
<span class="kw">from</span> torchvision <span class="kw">import</span> datasets, transforms
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> DataLoader

<span class="cm"># ── Dataset ──────────────────────────────────────</span>
transform = transforms.<span class="fn">Compose</span>([
    transforms.<span class="fn">ToTensor</span>(),
    transforms.<span class="fn">Normalize</span>((<span class="num">0.1307</span>,), (<span class="num">0.3081</span>,))
])
train_ds = datasets.<span class="cls">MNIST</span>(<span class="str">'./data'</span>, train=<span class="kw">True</span>,  download=<span class="kw">True</span>, transform=transform)
test_ds  = datasets.<span class="cls">MNIST</span>(<span class="str">'./data'</span>, train=<span class="kw">False</span>, transform=transform)
train_loader = <span class="fn">DataLoader</span>(train_ds, batch_size=<span class="num">64</span>,   shuffle=<span class="kw">True</span>)
test_loader  = <span class="fn">DataLoader</span>(test_ds,  batch_size=<span class="num">1000</span>)

<span class="cm"># ── Model ─────────────────────────────────────────</span>
<span class="kw">class</span> <span class="cls">SimpleCNN</span>(nn.<span class="cls">Module</span>):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().__init__()
        self.features = nn.<span class="fn">Sequential</span>(
            nn.<span class="fn">Conv2d</span>(<span class="num">1</span>, <span class="num">32</span>, kernel_size=<span class="num">3</span>, padding=<span class="num">1</span>), nn.<span class="fn">ReLU</span>(), nn.<span class="fn">MaxPool2d</span>(<span class="num">2</span>),
            nn.<span class="fn">Conv2d</span>(<span class="num">32</span>, <span class="num">64</span>, kernel_size=<span class="num">3</span>, padding=<span class="num">1</span>), nn.<span class="fn">ReLU</span>(), nn.<span class="fn">MaxPool2d</span>(<span class="num">2</span>),
        )
        self.classifier = nn.<span class="fn">Sequential</span>(
            nn.<span class="fn">Flatten</span>(),
            nn.<span class="fn">Linear</span>(<span class="num">64</span> * <span class="num">7</span> * <span class="num">7</span>, <span class="num">128</span>), nn.<span class="fn">ReLU</span>(), nn.<span class="fn">Dropout</span>(<span class="num">0.5</span>),
            nn.<span class="fn">Linear</span>(<span class="num">128</span>, <span class="num">10</span>),
        )
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="kw">return</span> self.classifier(self.features(x))

<span class="cm"># ── Train ─────────────────────────────────────────</span>
device  = torch.device(<span class="str">'cuda'</span> <span class="kw">if</span> torch.cuda.<span class="fn">is_available</span>() <span class="kw">else</span> <span class="str">'cpu'</span>)
model   = <span class="cls">SimpleCNN</span>().<span class="fn">to</span>(device)
opt     = optim.<span class="fn">Adam</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e-3</span>)
loss_fn = nn.<span class="fn">CrossEntropyLoss</span>()

<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5</span>):
    model.<span class="fn">train</span>()
    <span class="kw">for</span> imgs, labels <span class="kw">in</span> train_loader:
        imgs, labels = imgs.<span class="fn">to</span>(device), labels.<span class="fn">to</span>(device)
        opt.<span class="fn">zero_grad</span>()
        loss = <span class="fn">loss_fn</span>(model(imgs), labels)
        loss.<span class="fn">backward</span>(); opt.<span class="fn">step</span>()
    <span class="fn">print</span>(<span class="str">f"Epoch {epoch+1} — loss: {loss.item():.4f}"</span>)
<span class="cm"># ≈99.2% test accuracy after 5 epochs</span>`,
  },

  tensorflow: {
    filename: 'cnn_mnist.py', dotColor: '#f97316',
    code: `<span class="cm"># CNN for MNIST — TensorFlow / Keras</span>
<span class="kw">import</span> tensorflow <span class="kw">as</span> tf
<span class="kw">from</span> tensorflow.keras <span class="kw">import</span> layers, models

<span class="cm"># ── Dataset ──────────────────────────────────────</span>
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.<span class="fn">load_data</span>()
x_train = x_train[..., tf.<span class="fn">newaxis</span>] / <span class="num">255.0</span>
x_test  = x_test[...,  tf.<span class="fn">newaxis</span>] / <span class="num">255.0</span>

<span class="cm"># ── Model ─────────────────────────────────────────</span>
model = models.<span class="fn">Sequential</span>([
    layers.<span class="fn">Conv2D</span>(<span class="num">32</span>, (<span class="num">3</span>,<span class="num">3</span>), activation=<span class="str">'relu'</span>, input_shape=(<span class="num">28</span>,<span class="num">28</span>,<span class="num">1</span>)),
    layers.<span class="fn">MaxPooling2D</span>((<span class="num">2</span>,<span class="num">2</span>)),
    layers.<span class="fn">Conv2D</span>(<span class="num">64</span>, (<span class="num">3</span>,<span class="num">3</span>), activation=<span class="str">'relu'</span>),
    layers.<span class="fn">MaxPooling2D</span>((<span class="num">2</span>,<span class="num">2</span>)),
    layers.<span class="fn">Flatten</span>(),
    layers.<span class="fn">Dense</span>(<span class="num">128</span>, activation=<span class="str">'relu'</span>),
    layers.<span class="fn">Dropout</span>(<span class="num">0.5</span>),
    layers.<span class="fn">Dense</span>(<span class="num">10</span>, activation=<span class="str">'softmax'</span>),
])

<span class="cm"># ── Train ─────────────────────────────────────────</span>
model.<span class="fn">compile</span>(optimizer=<span class="str">'adam'</span>,
              loss=<span class="str">'sparse_categorical_crossentropy'</span>,
              metrics=[<span class="str">'accuracy'</span>])
model.<span class="fn">fit</span>(x_train, y_train, batch_size=<span class="num">64</span>, epochs=<span class="num">5</span>,
         validation_data=(x_test, y_test))
<span class="cm"># ≈99.1% test accuracy after 5 epochs</span>`,
  },

  jax: {
    filename: 'cnn_flax.py', dotColor: '#a78bfa',
    code: `<span class="cm"># CNN for MNIST — JAX + Flax</span>
<span class="kw">import</span> jax
<span class="kw">import</span> jax.numpy <span class="kw">as</span> jnp
<span class="kw">import</span> flax.linen <span class="kw">as</span> nn
<span class="kw">import</span> optax
<span class="kw">from</span> flax.training <span class="kw">import</span> train_state

<span class="kw">class</span> <span class="cls">CNN</span>(nn.<span class="cls">Module</span>):
    <span class="kw">@</span>nn.<span class="fn">compact</span>
    <span class="kw">def</span> <span class="fn">__call__</span>(self, x, training=<span class="kw">False</span>):
        x = nn.<span class="fn">relu</span>(nn.<span class="fn">Conv</span>(features=<span class="num">32</span>, kernel_size=(<span class="num">3</span>,<span class="num">3</span>))(x))
        x = nn.<span class="fn">avg_pool</span>(x, window_shape=(<span class="num">2</span>,<span class="num">2</span>), strides=(<span class="num">2</span>,<span class="num">2</span>))
        x = nn.<span class="fn">relu</span>(nn.<span class="fn">Conv</span>(features=<span class="num">64</span>, kernel_size=(<span class="num">3</span>,<span class="num">3</span>))(x))
        x = nn.<span class="fn">avg_pool</span>(x, window_shape=(<span class="num">2</span>,<span class="num">2</span>), strides=(<span class="num">2</span>,<span class="num">2</span>))
        x = x.<span class="fn">reshape</span>((x.shape[<span class="num">0</span>], -<span class="num">1</span>))
        x = nn.<span class="fn">relu</span>(nn.<span class="fn">Dense</span>(features=<span class="num">256</span>)(x))
        x = nn.<span class="fn">Dropout</span>(<span class="num">0.5</span>)(x, deterministic=<span class="kw">not</span> training)
        <span class="kw">return</span> nn.<span class="fn">Dense</span>(features=<span class="num">10</span>)(x)

model  = <span class="cls">CNN</span>()
key    = jax.random.<span class="fn">PRNGKey</span>(<span class="num">0</span>)
params = model.<span class="fn">init</span>(key, jnp.<span class="fn">ones</span>((<span class="num">1</span>,<span class="num">28</span>,<span class="num">28</span>,<span class="num">1</span>)))[<span class="str">'params'</span>]
state  = train_state.<span class="cls">TrainState</span>.<span class="fn">create</span>(
    apply_fn=model.apply, params=params,
    tx=optax.<span class="fn">adam</span>(<span class="num">1e-3</span>))

<span class="kw">@</span>jax.<span class="fn">jit</span>
<span class="kw">def</span> <span class="fn">train_step</span>(state, batch):
    imgs, labels = batch
    <span class="kw">def</span> <span class="fn">loss_fn</span>(params):
        logits = model.<span class="fn">apply</span>({<span class="str">'params'</span>: params}, imgs, training=<span class="kw">True</span>)
        <span class="kw">return</span> optax.<span class="fn">softmax_cross_entropy_with_integer_labels</span>(logits, labels).<span class="fn">mean</span>()
    grads = jax.<span class="fn">grad</span>(loss_fn)(state.params)
    <span class="kw">return</span> state.<span class="fn">apply_gradients</span>(grads=grads)`,
  },
};

function fillCNNCode() { renderCodeTab(); }

function renderCodeTab() {
  const lang = CODE[currentLang];
  document.getElementById('tab-code').innerHTML = `
<p style="color:var(--text2);font-size:.9rem;margin-bottom:1rem">
  Full training pipeline for a CNN on MNIST. Switch frameworks below.
</p>
<div class="code-toolbar">
  ${Object.keys(CODE).map(k => `
  <button class="code-lang-btn ${k === currentLang ? 'active' : ''}" onclick="switchLang('${k}')">
    ${{ pytorch:'PyTorch', tensorflow:'TensorFlow', jax:'JAX / Flax' }[k]}
  </button>`).join('')}
</div>
<div class="code-block">
  <div class="code-header">
    <div class="code-filename">
      <div class="code-dot" style="background:${lang.dotColor}"></div>
      ${lang.filename}
    </div>
    <button class="copy-btn" onclick="copyCode()">Copy</button>
  </div>
  <pre id="code-pre">${lang.code}</pre>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1.4rem">
  <div class="exp-card">
    <div class="exp-card-label">Expected result</div>
    <div class="exp-card-title">~99.2% accuracy</div>
    <p>On MNIST test set after 5 epochs. ~2 min on CPU, ~20 s on GPU.</p>
  </div>
  <div class="exp-card">
    <div class="exp-card-label">Next steps</div>
    <div class="exp-card-title">Try CIFAR-10</div>
    <p>Add BatchNorm, deeper conv blocks, or data augmentation for RGB images.</p>
  </div>
</div>`;
}

function switchLang(lang) {
  currentLang = lang;
  renderCodeTab();
  /* keep Code tab active */
  document.querySelectorAll('.tab-btn').forEach((b, i)     => b.classList.toggle('active', i === 2));
  document.querySelectorAll('.tab-content').forEach((c, i) => c.classList.toggle('active', i === 2));
}

function copyCode() {
  const pre = document.getElementById('code-pre');
  if (!pre) return;
  navigator.clipboard.writeText(pre.innerText).then(() => {
    const btn = document.querySelector('.copy-btn');
    if (btn) { btn.textContent = 'Copied!'; setTimeout(() => btn.textContent = 'Copy', 2000); }
  });
}
