// Build-time SEO / GEO output, generated from the same data the app uses so it
// never drifts:
//   - a static, crawlable "Guide" tab baked into index.html (FAQ + every choice)
//   - JSON-LD structured data (WebSite, WebApplication, FAQPage)
//   - sitemap.xml, llms.txt and llms-full.txt
import { NODES, BY_ID, ENDINGS, SECRET, ACTS } from '../src/data.js';
import { WEAPONS } from '../src/weapons.js';

export const SITE = 'https://cyberpunk.kriogenx.com';
const NAME = 'Night City Decision Map';
const DESC = 'Interactive Cyberpunk 2077 decision flowchart: every major choice, what it changes, how to unlock all endings (including Phantom Liberty and the secret ending), and every iconic weapon.';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const sentence = (s) => (/[.!?]$/.test(s) ? s : `${s}.`);

const endingNodes = ENDINGS.map((e) => ({ ...e, node: BY_ID[e.id] }));
const choiceQuests = NODES.filter((n) => n.kind === 'quest' && n.choice);
const nocturne = BY_ID.nocturne;
const missable = WEAPONS.filter((w) => w.missable);

function endingAnswer(e) {
  const reqs = e.reqs.map((r) => r.label).filter((l) => !/always available/i.test(l));
  return [
    e.node.summary,
    `Route: ${e.route}.`,
    reqs.length ? `To unlock it: ${reqs.map(sentence).join(' ')}` : 'It is always available on the rooftop.',
  ].join(' ');
}

// Question/answer pairs shared by the visible FAQ, JSON-LD and llms.txt.
export function faq() {
  return [
    {
      q: 'How many endings does Cyberpunk 2077 have?',
      a: `There are ${ENDINGS.length} main endings: ${endingNodes.map((e) => e.node.title).join(', ')}. The Tower needs the Phantom Liberty expansion. There is also a secret route, ${SECRET.title}, which leads to The Sun or Temperance.`,
    },
    ...endingNodes.map((e) => ({ q: `How do I get ${/^the /i.test(e.node.title) ? '' : 'the '}${e.node.title} ending in Cyberpunk 2077?`, a: endingAnswer(e) })),
    {
      q: `How do I unlock the secret ending, ${SECRET.title}?`,
      a: `${SECRET.summary} Requirements: ${SECRET.reqs.map((r) => sentence(r.label)).join(' ')}`,
    },
    {
      q: 'What is the point of no return in Cyberpunk 2077?',
      a: `${nocturne.title}. ${nocturne.summary} ${nocturne.tips.join(' ')}`,
    },
    {
      q: 'Which iconic weapons in Cyberpunk 2077 are missable?',
      a: `${missable.map((w) => `${w.name} (${w.quest}): ${sentence(w.how)}`).join(' ')} With Phantom Liberty, Herold Lowe in Dogtown sells many missed iconics.`,
    },
  ];
}

function optionLine(id) {
  const o = BY_ID[id];
  if (!o) return null;
  const bits = [o.pick || o.summary, ...(o.consequences || [])].filter(Boolean).map(sentence);
  return { title: o.title, text: bits.join(' ') };
}

export function guideHtml() {
  const faqHtml = faq().map((f) => `<details class="gq"><summary><h3>${esc(f.q)}</h3></summary><p>${esc(f.a)}</p></details>`).join('\n');
  const byAct = {};
  for (const n of choiceQuests) (byAct[n.act] ||= []).push(n);
  const choicesHtml = Object.entries(byAct).map(([act, list]) => `
    <h3 class="gact">${esc(ACTS[act]?.label || act)}</h3>
    ${list.map((n) => `<article class="gchoice">
      <h4>${esc(n.title)}</h4>
      ${n.summary ? `<p>${esc(n.summary)}</p>` : ''}
      <p class="gqq">${esc(n.choice.q)}</p>
      <ul>${n.choice.options.map(optionLine).filter(Boolean).map((o) => `<li><strong>${esc(o.title)}:</strong> ${esc(o.text)}</li>`).join('')}</ul>
    </article>`).join('\n')}`).join('\n');

  return `<div class="page guide">
  <div class="page-head">
    <h1>Cyberpunk 2077 choices &amp; endings guide</h1>
    <p>A plain-text companion to the flowchart: how to unlock every Cyberpunk 2077 ending (base game, Phantom Liberty and the secret ending), and what each major decision changes. Spoilers ahead. Summaries are our own words; no game script is reproduced.</p>
  </div>
  <h2>Endings FAQ</h2>
  ${faqHtml}
  <h2>Every major decision and what it changes</h2>
  ${choicesHtml}
</div>`;
}

export function jsonLd() {
  const graph = [
    { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: NAME, description: DESC, inLanguage: 'en' },
    {
      '@type': 'WebApplication', '@id': `${SITE}/#app`, name: NAME, url: `${SITE}/`, description: DESC,
      applicationCategory: 'GameApplication', operatingSystem: 'Any (web browser)', isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      about: { '@type': 'VideoGame', name: 'Cyberpunk 2077', author: { '@type': 'Organization', name: 'CD PROJEKT RED' } },
    },
    {
      '@type': 'FAQPage', '@id': `${SITE}/#faq`,
      mainEntity: faq().map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ];
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`;
}

export function sitemap(date) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE}/</loc><lastmod>${date}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
</urlset>
`;
}

export function llmsTxt() {
  return `# ${NAME}

> ${DESC} Fan made, unofficial, not affiliated with CD PROJEKT RED.

The site is a single interactive page at ${SITE}/ with tabs: Flowchart (left-to-right decision map), Endings (which endings you can still reach), Iconics (every iconic weapon and how to get it), Checklist, and Guide (plain-text FAQ).

## Pages

- [Interactive decision flowchart](${SITE}/): every quest and choice, with links showing what each decision unlocks or changes.
- [Choices & endings guide](${SITE}/#guide): plain-text FAQ on all endings and every major decision.
- [Full text for LLMs](${SITE}/llms-full.txt): the complete guide as Markdown.

## Endings

${endingNodes.map((e) => `- ${e.node.title}: ${e.node.summary} Route: ${e.route}.`).join('\n')}
- Secret route, ${SECRET.title}: ${SECRET.summary}
`;
}

export function llmsFullTxt() {
  const choices = choiceQuests.map((n) => {
    const opts = n.choice.options.map(optionLine).filter(Boolean).map((o) => `- **${o.title}:** ${o.text}`).join('\n');
    return `### ${n.title} (${ACTS[n.act]?.label || n.act})\n\n${n.summary ? `${n.summary}\n\n` : ''}${n.choice.q}\n\n${opts}`;
  }).join('\n\n');
  const iconics = WEAPONS.map((w) => `- **${w.name}** (${w.type}, ${w.quest})${w.missable ? ' [missable]' : ''}: ${w.how}`).join('\n');
  return `# ${NAME}: full guide

> ${DESC} Source: ${SITE}/ (fan made, unofficial). Contains story spoilers.

## Endings FAQ

${faq().map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n')}

## Every major decision

${choices}

## Iconic weapons and how to get them

${iconics}
`;
}

// Vite plugin
export default function seo() {
  return {
    name: 'nightcity-seo',
    transformIndexHtml(html) {
      return html.replace('<!--SEO:GUIDE-->', guideHtml()).replace('<!--SEO:JSONLD-->', jsonLd());
    },
    generateBundle() {
      const date = new Date().toISOString().slice(0, 10);
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap(date) });
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: llmsTxt() });
      this.emitFile({ type: 'asset', fileName: 'llms-full.txt', source: llmsFullTxt() });
    },
  };
}
