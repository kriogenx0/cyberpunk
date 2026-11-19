import dagre from '@dagrejs/dagre';
import './style.css';
import { ACTS, NODES, EDGES, BY_ID, ENDINGS, SECRET } from './data.js';

const SVGNS = 'http://www.w3.org/2000/svg';
const STORE_KEY = 'ncdm-state-v1';

// ───────────────────────── state ─────────────────────────
function loadState() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
    return {
      done: new Set(raw.done || []),
      picks: raw.picks || {},
      manual: raw.manual || {},
      spoilers: !!raw.spoilers,
    };
  } catch {
    return { done: new Set(), picks: {}, manual: {}, spoilers: false };
  }
}
const state = loadState();
function save() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({ ...state, done: [...state.done] }));
  } catch { /* storage unavailable: progress lives for this tab only */ }
}

const quests = NODES.filter((n) => n.kind === 'quest');

function pick(choiceId, optId) {
  if (state.picks[choiceId] === optId) {
    delete state.picks[choiceId];
  } else {
    state.picks[choiceId] = optId;
    state.done.add(choiceId);
    // picking an option implies the quests that lead to it are done
    markAncestorsDone(choiceId);
  }
  commit();
}
function toggleDone(id) {
  if (state.done.has(id)) {
    state.done.delete(id);
    delete state.picks[id];
  } else {
    state.done.add(id);
    markAncestorsDone(id);
  }
  commit();
}
function markAncestorsDone(id) {
  const seen = new Set();
  const walk = (nid) => {
    for (const ed of EDGES) {
      if (ed.to !== nid || ed.style === 'req' || seen.has(ed.from)) continue;
      seen.add(ed.from);
      const n = BY_ID[ed.from];
      if (n.kind === 'quest' && !n.choice) state.done.add(n.id);
      // stop at options: reaching a quest does not tell us which branch was taken
      if (n.kind !== 'option') walk(ed.from);
    }
  };
  walk(id);
}
function commit() {
  save();
  renderMapState();
  renderPanel();
  renderEndings();
  renderList();
  renderMeter();
}

// ───────────────────────── derived status ─────────────────────────
function optionStatus(n) {
  const chosen = state.picks[n.parent];
  if (chosen === n.id) return 'picked';
  if (chosen) return 'rejected';
  if (n.requires && n.requires.some((r) => !state.done.has(r))) return 'locked';
  return 'open';
}
function nodeStatus(n) {
  if (n.kind === 'option') return optionStatus(n);
  if (n.kind === 'ending') return endingStatus(n.id).status;
  return state.done.has(n.id) ? 'done' : 'open';
}
function endingStatus(id) {
  const def = ENDINGS.find((x) => x.id === id);
  const results = def.reqs.map((r) => {
    const pending = r.soft && r.node && !state.picks[r.node] && !state.done.has(r.node);
    return { ...r, ok: !pending && r.test(state), pending };
  });
  const hard = results.filter((r) => !r.soft);
  const blocked = results.some((r) => r.soft && !r.ok && !r.pending && r.node && state.picks[r.node]);
  let status = 'locked';
  if (hard.every((r) => r.ok)) status = 'available';
  if (blocked) status = 'missed';
  if (id === 'end_tower' && state.picks.silence === 'pl_let_go') status = 'missed';
  return { status, results, def };
}

// is a node on the player's chosen path? (used to dim alternatives)
function isMuted(n) {
  if (n.kind === 'option') return optionStatus(n) === 'rejected';
  return false;
}

// ───────────────────────── layout ─────────────────────────
const SIZE = {
  quest: { w: 230, h: 70 },
  option: { w: 200, h: 58 },
  ending: { w: 210, h: 74 },
};
function layout() {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'LR', nodesep: 18, ranksep: 64, edgesep: 12, marginx: 40, marginy: 40 });
  g.setDefaultEdgeLabel(() => ({}));
  for (const n of NODES) g.setNode(n.id, { width: SIZE[n.kind].w, height: SIZE[n.kind].h });
  // requirement edges are drawn but don't shape the layout, so Act 3 stays compact
  for (const ed of EDGES) if (ed.style !== 'req') g.setEdge(ed.from, ed.to, { weight: ed.style === 'side' ? 1 : 3, minlen: 1 });
  dagre.layout(g);
  const pos = {};
  for (const id of g.nodes()) pos[id] = g.node(id);
  const edges = EDGES.map((ed) => {
    if (ed.style !== 'req') return { ...ed, points: g.edge(ed.from, ed.to).points };
    const a = pos[ed.from];
    const z = pos[ed.to];
    const sa = SIZE[BY_ID[ed.from].kind];
    const sz = SIZE[BY_ID[ed.to].kind];
    return { ...ed, points: [{ x: a.x + sa.w / 2, y: a.y }, { x: z.x - sz.w / 2, y: z.y }] };
  });
  return { pos, edges, width: g.graph().width, height: g.graph().height };
}
const L = layout();

// ───────────────────────── svg helpers ─────────────────────────
function el(name, attrs = {}, parent) {
  const node = document.createElementNS(SVGNS, name);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (parent) parent.appendChild(node);
  return node;
}
function pathFrom(points) {
  // smooth curve through dagre points
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const mx = (p0.x + p1.x) / 2;
    d += ` C${mx},${p0.y} ${mx},${p1.y} ${p1.x},${p1.y}`;
  }
  return d;
}
function wrap(text, max) {
  const words = text.split(' ');
  const lines = [''];
  for (const w of words) {
    const cur = lines[lines.length - 1];
    if ((cur + ' ' + w).trim().length > max && cur) lines.push(w);
    else lines[lines.length - 1] = (cur + ' ' + w).trim();
  }
  if (lines.length > 2) {
    lines.length = 2;
    lines[1] = lines[1].replace(/.{0,2}$/, '…');
  }
  return lines;
}
function shape(kind, w, h) {
  const c = 12;
  if (kind === 'ending') {
    return `M${-w / 2 + 18},${-h / 2} L${w / 2 - 18},${-h / 2} L${w / 2},0 L${w / 2 - 18},${h / 2} L${-w / 2 + 18},${h / 2} L${-w / 2},0 Z`;
  }
  if (kind === 'option') {
    return `M${-w / 2},${-h / 2} L${w / 2 - c},${-h / 2} L${w / 2},${-h / 2 + c} L${w / 2},${h / 2} L${-w / 2 + c},${h / 2} L${-w / 2},${h / 2 - c} Z`;
  }
  return `M${-w / 2},${-h / 2} L${w / 2 - c},${-h / 2} L${w / 2},${-h / 2 + c} L${w / 2},${h / 2} L${-w / 2},${h / 2} Z`;
}

// ───────────────────────── map render ─────────────────────────
const svg = document.getElementById('canvas');
const wrapEl = document.getElementById('canvas-wrap');
let view = { x: 0, y: 0, k: 1 };
let selected = null;
let actFilter = null;
const nodeEls = {};
const edgeEls = [];

function buildMap() {
  const defs = el('defs', {}, svg);
  defs.innerHTML = `
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="var(--grid)" stroke-width="1"/>
    </pattern>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/>
    </marker>`;
  el('rect', { x: -5000, y: -5000, width: 20000, height: 20000, fill: 'url(#grid)', class: 'bg' }, svg);
  const world = el('g', { id: 'world' }, svg);

  // act column headers: placed at the left-most node of each act
  const heads = el('g', { class: 'act-heads' }, world);
  for (const [act, meta] of Object.entries(ACTS)) {
    const xs = NODES.filter((n) => n.act === act).map((n) => L.pos[n.id].x - SIZE[n.kind].w / 2);
    if (!xs.length || act === 'side') continue;
    const x = Math.min(...xs);
    const t = el('text', { x, y: 14, class: 'act-head', fill: meta.color }, heads);
    t.textContent = meta.label.toUpperCase();
  }

  const eg = el('g', { class: 'edges' }, world);
  for (const ed of L.edges) {
    const p = el('path', { d: pathFrom(ed.points), class: `edge edge-${ed.style}`, 'marker-end': 'url(#arrow)' }, eg);
    edgeEls.push({ ed, p });
  }

  const ng = el('g', { class: 'nodes' }, world);
  for (const n of NODES) {
    const { x, y } = L.pos[n.id];
    const { w, h } = SIZE[n.kind];
    const color = ACTS[n.act].color;
    const g = el('g', { class: `node node-${n.kind}`, transform: `translate(${x},${y})`, tabindex: 0, role: 'button', 'aria-label': n.title, 'data-id': n.id, style: `--c:${color}` }, ng);
    el('path', { d: shape(n.kind, w, h), class: 'node-body' }, g);
    if (n.kind !== 'ending') el('rect', { x: -w / 2, y: -h / 2, width: 4, height: h, class: 'node-accent' }, g);

    const lines = wrap(n.title, n.kind === 'option' ? 21 : 24);
    const tag = n.kind === 'quest' ? (n.choice ? 'DECISION' : n.type === 'side' ? 'SIDE JOB' : 'MAIN JOB') : n.kind === 'option' ? 'CHOICE' : 'ENDING';
    const tx = n.kind === 'ending' ? 0 : -w / 2 + 14;
    const anchor = n.kind === 'ending' ? 'middle' : 'start';
    const tagY = -h / 2 + 16;
    const tagEl = el('text', { x: tx, y: tagY, class: 'node-tag', 'text-anchor': anchor }, g);
    tagEl.textContent = tag;
    const startY = lines.length === 1 ? tagY + 25 : tagY + 20;
    lines.forEach((line, i) => {
      const t = el('text', { x: tx, y: startY + i * 17, class: 'node-title', 'text-anchor': anchor }, g);
      t.textContent = line;
    });
    // status badge
    const badge = el('g', { class: 'badge', transform: `translate(${w / 2 - 16},${-h / 2 + 14})` }, g);
    el('circle', { r: 8 }, badge);
    el('text', { 'text-anchor': 'middle', y: 4 }, badge);

    g.addEventListener('click', (ev) => { ev.stopPropagation(); select(n.id); });
    g.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); select(n.id); } });
    nodeEls[n.id] = g;
  }
}

function renderMapState() {
  const related = selected ? relatedSet(selected) : null;
  for (const n of NODES) {
    const g = nodeEls[n.id];
    const st = nodeStatus(n);
    g.dataset.status = st;
    g.classList.toggle('muted', isMuted(n));
    g.classList.toggle('selected', selected === n.id);
    g.classList.toggle('faded', (actFilter && n.act !== actFilter) || (related && !related.has(n.id)));
    g.classList.toggle('shield', state.spoilers && n.kind !== 'quest' && st !== 'picked');
    const badgeText = g.querySelector('.badge text');
    badgeText.textContent = { done: '✓', picked: '✓', locked: '🔒', available: '◆', missed: '✕', rejected: '–' }[st] || '';
  }
  for (const { ed, p } of edgeEls) {
    const from = BY_ID[ed.from];
    const to = BY_ID[ed.to];
    const active = (from.kind === 'option' ? optionStatus(from) === 'picked' : state.done.has(from.id)) &&
      (to.kind !== 'option' || optionStatus(to) === 'picked');
    p.classList.toggle('active', active);
    p.classList.toggle('muted', isMuted(from) || isMuted(to));
    p.classList.toggle('faded', (actFilter && from.act !== actFilter && to.act !== actFilter) || (related && !(related.has(ed.from) && related.has(ed.to))));
  }
}

function relatedSet(id) {
  const set = new Set([id]);
  for (const ed of EDGES) {
    if (ed.from === id) set.add(ed.to);
    if (ed.to === id) set.add(ed.from);
  }
  return set;
}

// ───────────────────────── pan & zoom ─────────────────────────
function applyView() {
  document.getElementById('world').setAttribute('transform', `translate(${view.x},${view.y}) scale(${view.k})`);
  svg.querySelector('.bg').setAttribute('transform', `translate(${view.x % (40 * view.k)},${view.y % (40 * view.k)}) scale(${view.k})`);
}
function fit(overview = false) {
  const r = wrapEl.getBoundingClientRect();
  const k = Math.min(r.width / (L.width + 40), r.height / (L.height + 40), 1.1);
  const kk = Math.max(k, 0.15);
  view = { k: kk, x: (r.width - L.width * kk) / 2, y: (r.height - L.height * kk) / 2 };
  if (!overview && k < 0.45) {
    // too small to read: start at the beginning of the story, readable scale
    view.k = 0.95;
    view.x = 20;
    view.y = r.height / 2 - L.pos.rescue.y * view.k;
  }
  applyView();
}
function zoomAt(factor, cx, cy) {
  const k = Math.min(2.5, Math.max(0.2, view.k * factor));
  view.x = cx - ((cx - view.x) * k) / view.k;
  view.y = cy - ((cy - view.y) * k) / view.k;
  view.k = k;
  applyView();
}
function centerOn(id, animate = true) {
  const r = wrapEl.getBoundingClientRect();
  const p = L.pos[id];
  const panelOpen = !document.getElementById('panel').hidden && r.width > 760;
  const usable = panelOpen ? r.width - 380 : r.width;
  const k = Math.max(view.k, 0.8);
  const target = { k, x: usable / 2 - p.x * k, y: r.height / 2 - p.y * k };
  if (!animate || matchMedia('(prefers-reduced-motion: reduce)').matches) { view = target; applyView(); return; }
  const from = { ...view };
  const t0 = performance.now();
  const step = (t) => {
    const u = Math.min(1, (t - t0) / 380);
    const ease = 1 - Math.pow(1 - u, 3);
    view = { k: from.k + (target.k - from.k) * ease, x: from.x + (target.x - from.x) * ease, y: from.y + (target.y - from.y) * ease };
    applyView();
    if (u < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const pointers = new Map();
let dragStart = null;
let pinchStart = null;
svg.addEventListener('pointerdown', (ev) => {
  pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
  if (pointers.size === 1) dragStart = { x: ev.clientX, y: ev.clientY, vx: view.x, vy: view.y, moved: false };
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    pinchStart = { d: Math.hypot(a.x - b.x, a.y - b.y), k: view.k };
  }
});
svg.addEventListener('pointermove', (ev) => {
  if (!pointers.has(ev.pointerId)) return;
  pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
  if (pointers.size === 2 && pinchStart) {
    const [a, b] = [...pointers.values()];
    const r = svg.getBoundingClientRect();
    const d = Math.hypot(a.x - b.x, a.y - b.y);
    zoomAt((pinchStart.k * d) / pinchStart.d / view.k, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
    return;
  }
  if (!dragStart) return;
  const dx = ev.clientX - dragStart.x;
  const dy = ev.clientY - dragStart.y;
  if (!dragStart.moved && Math.hypot(dx, dy) < 4) return;
  if (!dragStart.moved) { dragStart.moved = true; svg.setPointerCapture(ev.pointerId); svg.classList.add('dragging'); }
  view.x = dragStart.vx + dx;
  view.y = dragStart.vy + dy;
  applyView();
});
const endPointer = (ev) => {
  pointers.delete(ev.pointerId);
  if (pointers.size < 2) pinchStart = null;
  if (pointers.size === 0) {
    svg.classList.remove('dragging');
    // a click on empty space (no drag) clears selection
    if (dragStart && !dragStart.moved && ev.target.closest && !ev.target.closest('.node') && ev.type === 'pointerup') select(null);
    dragStart = null;
  }
};
svg.addEventListener('pointerup', endPointer);
svg.addEventListener('pointercancel', endPointer);
svg.addEventListener('wheel', (ev) => {
  ev.preventDefault();
  const r = svg.getBoundingClientRect();
  if (ev.ctrlKey || Math.abs(ev.deltaY) > Math.abs(ev.deltaX)) {
    zoomAt(Math.exp(-ev.deltaY * (ev.ctrlKey ? 0.01 : 0.0015)), ev.clientX - r.left, ev.clientY - r.top);
  } else {
    view.x -= ev.deltaX;
    applyView();
  }
}, { passive: false });
// the click handler on nodes stops propagation, but pointerup fires first; guard drags
svg.addEventListener('click', (ev) => { if (svg.classList.contains('dragging')) ev.stopPropagation(); }, true);

document.getElementById('zoom-in').onclick = () => { const r = svg.getBoundingClientRect(); zoomAt(1.25, r.width / 2, r.height / 2); };
document.getElementById('zoom-out').onclick = () => { const r = svg.getBoundingClientRect(); zoomAt(0.8, r.width / 2, r.height / 2); };
document.getElementById('fit').onclick = () => fit(true);

// ───────────────────────── detail panel ─────────────────────────
const panel = document.getElementById('panel');
function select(id, { center = false } = {}) {
  selected = id;
  panel.hidden = !id;
  renderPanel();
  renderMapState();
  if (id && center) centerOn(id);
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
function nodeLink(id, label) {
  const n = BY_ID[id];
  return `<button class="node-link" data-goto="${id}" style="--c:${ACTS[n.act].color}">${esc(label || n.title)}</button>`;
}

function reqItem(r) {
  const cls = r.pending ? 'later' : r.ok ? 'ok' : 'no';
  const hint = r.pending ? 'Decided at the end' : r.hint;
  return `<li class="${cls}">${r.node ? nodeLink(r.node, r.label) : esc(r.label)}${hint ? `<small>${esc(hint)}</small>` : ''}</li>`;
}

function renderPanel() {
  if (!selected) { panel.innerHTML = ''; return; }
  const n = BY_ID[selected];
  const act = ACTS[n.act];
  const st = nodeStatus(n);
  const hide = state.spoilers && n.kind !== 'quest' && st !== 'picked';
  const parts = [];
  parts.push(`<button class="panel-close" aria-label="Close">×</button>`);
  parts.push(`<div class="panel-act" style="--c:${act.color}">${esc(act.label)} · ${n.kind === 'option' ? 'Choice' : n.kind === 'ending' ? 'Ending' : n.type === 'side' ? 'Side job' : 'Main job'}</div>`);
  parts.push(`<h2 class="panel-title">${esc(n.title)}</h2>`);

  if (n.kind === 'option') {
    const parent = BY_ID[n.parent];
    parts.push(`<p class="panel-q">Answer to ${nodeLink(parent.id)}: <em>${esc(parent.choice.q)}</em></p>`);
  }
  if (n.summary) parts.push(`<p class="panel-summary ${hide ? 'blurred' : ''}">${esc(n.summary)}</p>`);

  if (n.consequences) {
    parts.push(`<h3>What it changes</h3><ul class="conseq ${hide ? 'blurred' : ''}">${n.consequences.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>`);
  }
  if (n.requires && n.requires.length) {
    parts.push(`<h3>Requires</h3><ul class="reqs">${n.requires.map((r) => `<li class="${state.done.has(r) ? 'ok' : 'no'}">${nodeLink(r)}</li>`).join('')}</ul>`);
  }

  if (n.choice) {
    parts.push(`<h3>Decision · ${esc(n.choice.q)}</h3><div class="options">`);
    for (const optId of n.choice.options) {
      const opt = BY_ID[optId];
      const os = optionStatus(opt);
      parts.push(`<button class="opt opt-${os}" data-pick="${optId}" aria-pressed="${os === 'picked'}">
        <span class="opt-title">${esc(opt.title)}${os === 'locked' ? ' <span class="opt-lock">locked</span>' : ''}</span>
        <span class="opt-sum ${state.spoilers && os !== 'picked' ? 'blurred' : ''}">${esc(opt.summary || '')}</span>
      </button>`);
    }
    parts.push(`</div><p class="hint">Click your choice to log it. Click again to undo.</p>`);
  } else if (n.kind === 'quest') {
    parts.push(`<button class="cta ${state.done.has(n.id) ? 'on' : ''}" data-done="${n.id}">${state.done.has(n.id) ? '✓ Completed' : 'Mark as completed'}</button>`);
  } else if (n.kind === 'option') {
    parts.push(`<button class="cta ${st === 'picked' ? 'on' : ''}" data-pick="${n.id}" ${st === 'locked' ? 'disabled' : ''}>${st === 'picked' ? '✓ This is my choice' : st === 'locked' ? 'Locked: finish the requirements' : 'I chose this'}</button>`);
  } else if (n.kind === 'ending') {
    const es = endingStatus(n.id);
    const label = { available: 'Reachable with your current progress', locked: 'Not reachable yet', missed: 'Ruled out by a choice you made' }[es.status];
    parts.push(`<div class="ending-state es-${es.status}">${label}</div>`);
    parts.push(`<p class="panel-route">Route: ${esc(es.def.route)}</p>`);
    parts.push(`<ul class="reqs">${es.results.map((r) => reqItem(r)).join('')}</ul>`);
  }

  if (n.tips) parts.push(`<h3>Tips</h3><ul class="tips">${n.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`);

  const prev = EDGES.filter((ed) => ed.to === n.id && ed.style !== 'choice').map((ed) => ed.from);
  const next = EDGES.filter((ed) => ed.from === n.id && ed.style !== 'choice').map((ed) => ed.to);
  if (prev.length || next.length) {
    parts.push(`<div class="nav-links">`);
    if (prev.length) parts.push(`<div><h4>Comes from</h4>${prev.map((id) => nodeLink(id)).join('')}</div>`);
    if (next.length) parts.push(`<div><h4>Leads to</h4>${next.map((id) => nodeLink(id)).join('')}</div>`);
    parts.push(`</div>`);
  }
  panel.innerHTML = parts.join('');
}

panel.addEventListener('click', (ev) => {
  const t = ev.target.closest('button');
  if (!t) return;
  if (t.classList.contains('panel-close')) return select(null);
  if (t.dataset.goto) return select(t.dataset.goto, { center: true });
  if (t.dataset.done) return toggleDone(t.dataset.done);
  if (t.dataset.pick) {
    const opt = BY_ID[t.dataset.pick];
    if (optionStatus(opt) === 'locked') return;
    pick(opt.parent, opt.id);
  }
});

// ───────────────────────── search & filters ─────────────────────────
const searchEl = document.getElementById('search');
const resultsEl = document.getElementById('search-results');
let resultIdx = 0;
function runSearch() {
  const qv = searchEl.value.trim().toLowerCase();
  if (!qv) { resultsEl.hidden = true; return; }
  const hits = NODES.filter((n) => (n.title + ' ' + (n.summary || '') + ' ' + (n.choice?.q || '')).toLowerCase().includes(qv))
    .sort((a, b) => (b.title.toLowerCase().includes(qv) ? 1 : 0) - (a.title.toLowerCase().includes(qv) ? 1 : 0))
    .slice(0, 8);
  resultIdx = 0;
  resultsEl.innerHTML = hits.length
    ? hits.map((n, i) => `<li role="option" data-id="${n.id}" class="${i === 0 ? 'hl' : ''}"><i style="background:${ACTS[n.act].color}"></i>${esc(n.title)}<small>${esc(ACTS[n.act].label)}</small></li>`).join('')
    : '<li class="empty">No matches</li>';
  resultsEl.hidden = false;
}
searchEl.addEventListener('input', runSearch);
searchEl.addEventListener('keydown', (ev) => {
  const items = [...resultsEl.querySelectorAll('li[data-id]')];
  if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
    ev.preventDefault();
    if (!items.length) return;
    resultIdx = (resultIdx + (ev.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
    items.forEach((li, i) => li.classList.toggle('hl', i === resultIdx));
  } else if (ev.key === 'Enter' && items[resultIdx]) {
    goTo(items[resultIdx].dataset.id);
  } else if (ev.key === 'Escape') {
    searchEl.value = ''; resultsEl.hidden = true; searchEl.blur();
  }
});
resultsEl.addEventListener('mousedown', (ev) => {
  const li = ev.target.closest('li[data-id]');
  if (li) { ev.preventDefault(); goTo(li.dataset.id); }
});
searchEl.addEventListener('blur', () => setTimeout(() => { resultsEl.hidden = true; }, 100));
function goTo(id) {
  resultsEl.hidden = true;
  searchEl.blur();
  showView('map');
  select(id, { center: true });
  const g = nodeEls[id];
  g.classList.remove('flash');
  void g.getBBox();
  g.classList.add('flash');
}

const chipsEl = document.getElementById('act-chips');
chipsEl.innerHTML = Object.entries(ACTS).map(([k, a]) => `<button class="chip" data-act="${k}" style="--c:${a.color}">${esc(a.label)}</button>`).join('');
chipsEl.addEventListener('click', (ev) => {
  const b = ev.target.closest('.chip');
  if (!b) return;
  actFilter = actFilter === b.dataset.act ? null : b.dataset.act;
  chipsEl.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c.dataset.act === actFilter));
  renderMapState();
  if (actFilter) {
    const first = NODES.filter((n) => n.act === actFilter).sort((a, b) => L.pos[a.id].x - L.pos[b.id].x)[0];
    centerOn(first.id);
  }
});

const spoilerEl = document.getElementById('spoilers');
spoilerEl.checked = state.spoilers;
spoilerEl.addEventListener('change', () => { state.spoilers = spoilerEl.checked; commit(); });

// ───────────────────────── endings view ─────────────────────────
const endingsEl = document.getElementById('view-endings');
function renderEndings() {
  const cards = ENDINGS.map((def) => {
    const n = BY_ID[def.id];
    const es = endingStatus(def.id);
    const label = { available: 'Reachable', locked: 'Locked', missed: 'Ruled out' }[es.status];
    return `<article class="ecard es-${es.status}">
      <header><span class="estatus">${label}</span><h3>${esc(n.title)}</h3></header>
      <p class="eroute">${esc(def.route)}</p>
      <p class="esum ${state.spoilers ? 'blurred' : ''}">${esc(n.summary)}</p>
      <ul class="reqs">${es.results.map((r) => reqItem(r)).join('')}</ul>
      <button class="link-btn" data-goto="${def.id}">Show on flowchart →</button>
    </article>`;
  });
  const sec = SECRET.reqs.map((r) => {
    const ok = r.manual ? !!state.manual[r.manual] : r.test(state);
    const body = r.manual
      ? `<label><input type="checkbox" data-manual="${r.manual}" ${ok ? 'checked' : ''}/> ${esc(r.label)}</label>`
      : nodeLink(r.node, r.label);
    return `<li class="${ok ? 'ok' : 'no'}">${body}</li>`;
  });
  const secretOk = SECRET.reqs.every((r) => (r.manual ? state.manual[r.manual] : r.test(state)));
  const available = ENDINGS.filter((d) => endingStatus(d.id).status === 'available').length;
  endingsEl.innerHTML = `
    <div class="page">
      <div class="page-head">
        <h1>Endings</h1>
        <p>You can currently reach <strong>${available} of ${ENDINGS.length}</strong> endings. Requirements update as you log quests and choices on the flowchart or checklist. Make a manual save before <em>Nocturne Op55N1</em>, the Point of No Return, and you can reload it to see every ending you have unlocked.</p>
      </div>
      <div class="egrid">${cards.join('')}
        <article class="ecard secret es-${secretOk ? 'available' : 'locked'}">
          <header><span class="estatus">${secretOk ? 'Ready' : 'Secret'}</span><h3>${esc(SECRET.title)}</h3></header>
          <p class="esum ${state.spoilers ? 'blurred' : ''}">${esc(SECRET.summary)}</p>
          <ul class="reqs">${sec.join('')}</ul>
        </article>
      </div>
    </div>`;
}
endingsEl.addEventListener('click', (ev) => {
  const b = ev.target.closest('[data-goto]');
  if (b) goTo(b.dataset.goto);
});
endingsEl.addEventListener('change', (ev) => {
  const m = ev.target.dataset.manual;
  if (m) { state.manual[m] = ev.target.checked; commit(); }
});

// ───────────────────────── checklist view ─────────────────────────
const listEl = document.getElementById('view-list');
function renderList() {
  const groups = Object.entries(ACTS).filter(([k]) => k !== 'ending').map(([k, a]) => {
    const items = quests.filter((n) => n.act === k).sort((x, y) => L.pos[x.id].x - L.pos[y.id].x || L.pos[x.id].y - L.pos[y.id].y);
    if (!items.length) return '';
    const doneCount = items.filter((n) => state.done.has(n.id)).length;
    return `<section class="lgroup" style="--c:${a.color}">
      <h2>${esc(a.label)} <span>${doneCount}/${items.length}</span></h2>
      <ul>${items.map((n) => {
        const isDone = state.done.has(n.id);
        let choice = '';
        if (n.choice) {
          choice = `<select data-choice="${n.id}" aria-label="${esc(n.choice.q)}">
            <option value="">${esc(n.choice.q)}</option>
            ${n.choice.options.map((oid) => {
              const opt = BY_ID[oid];
              const locked = optionStatus(opt) === 'locked';
              return `<option value="${oid}" ${state.picks[n.id] === oid ? 'selected' : ''} ${locked ? 'disabled' : ''}>${esc(opt.title)}${locked ? ' (locked)' : ''}</option>`;
            }).join('')}
          </select>`;
        }
        return `<li class="${isDone ? 'is-done' : ''}">
          <label class="check"><input type="checkbox" data-done="${n.id}" ${isDone ? 'checked' : ''}/><span>${esc(n.title)}</span></label>
          ${n.type === 'side' ? '<span class="pill">side</span>' : ''}
          <button class="link-btn" data-goto="${n.id}" aria-label="Show ${esc(n.title)} on flowchart">map →</button>
          ${choice}
        </li>`;
      }).join('')}</ul>
    </section>`;
  });
  listEl.innerHTML = `<div class="page"><div class="page-head"><h1>Checklist</h1><p>Every quest on the map in story order. Tick what you have finished and log your decisions; the flowchart and endings follow along.</p></div><div class="lgrid">${groups.join('')}</div></div>`;
}
listEl.addEventListener('change', (ev) => {
  const t = ev.target;
  if (t.dataset.done) toggleDone(t.dataset.done);
  if (t.dataset.choice) {
    if (t.value) pick(t.dataset.choice, t.value);
    else { delete state.picks[t.dataset.choice]; commit(); }
  }
});
listEl.addEventListener('click', (ev) => {
  const b = ev.target.closest('[data-goto]');
  if (b) goTo(b.dataset.goto);
});

// ───────────────────────── meter, tabs, keys ─────────────────────────
function renderMeter() {
  const total = quests.length;
  const pct = Math.round((quests.filter((n) => state.done.has(n.id)).length / total) * 100);
  document.getElementById('meter-text').textContent = `${pct}%`;
  document.getElementById('meter-fill').style.width = `${pct}%`;
}

function showView(name) {
  document.querySelectorAll('.tab').forEach((t) => {
    const on = t.dataset.view === name;
    t.classList.toggle('active', on);
    t.setAttribute('aria-selected', on);
  });
  document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.id === `view-${name}`));
  if (location.hash !== `#${name}`) history.replaceState(null, '', `#${name}`);
}
document.querySelectorAll('.tab').forEach((t) => t.addEventListener('click', () => showView(t.dataset.view)));

document.addEventListener('keydown', (ev) => {
  if (ev.target.matches('input, select, textarea')) return;
  if (ev.key === '/') { ev.preventDefault(); showView('map'); searchEl.focus(); }
  else if (ev.key === 'f' || ev.key === 'F') { if (document.getElementById('view-map').classList.contains('active')) fit(true); }
  else if (ev.key === 'Escape') select(null);
});

document.getElementById('reset').addEventListener('click', () => {
  if (!confirm('Clear all your logged quests and choices?')) return;
  state.done.clear();
  state.picks = {};
  state.manual = {};
  commit();
});

window.addEventListener('resize', () => applyView());

// ───────────────────────── boot ─────────────────────────
buildMap();
commit();
const initial = location.hash.slice(1);
showView(['map', 'endings', 'list'].includes(initial) ? initial : 'map');
requestAnimationFrame(() => fit());
