// Decision map data for Cyberpunk 2077 (base game 2.x + Phantom Liberty).
// Node kinds:
//   quest   - a mission (main or side). May carry `choice` = { q, options: [optionIds] }
//   option  - one answer to a choice. Belongs to `parent` quest.
//   ending  - a final ending.
// Acts: prologue, act1, act2, side, pl, act3, ending

export const ACTS = {
  prologue: { label: 'Prologue', color: '#7cf7ff' },
  act1: { label: 'Act 1', color: '#ff3ea5' },
  act2: { label: 'Act 2 · Main', color: '#ff7ad1' },
  side: { label: 'Side Gigs', color: '#b48cff' },
  pl: { label: 'Phantom Liberty', color: '#ffd23e' },
  act3: { label: 'Act 3', color: '#ff4d5e' },
  ending: { label: 'Endings', color: '#fff36b' },
};

const q = (id, title, act, extra = {}) => ({ id, title, act, kind: 'quest', type: 'main', ...extra });
const s = (id, title, extra = {}) => ({ id, title, act: 'side', kind: 'quest', type: 'side', ...extra });
const o = (id, title, parent, extra = {}) => ({ id, title, parent, kind: 'option', ...extra });
const e = (id, title, extra = {}) => ({ id, title, act: 'ending', kind: 'ending', ...extra });

export const NODES = [
  // ───────────── PROLOGUE ─────────────
  q('lifepath', 'Choose a Lifepath', 'prologue', {
    summary: 'Your origin sets the first ~hour of the game, unlocks unique dialogue options all game long, and changes a few scenes. It does not lock you out of any ending.',
    tips: ['Pick the flavor you like. Each lifepath has its own intro, then they all merge in The Rescue.', 'Lifepath dialogue lines are tagged in conversations and can open alternate solutions.'],
    choice: { q: 'Where does V come from?', options: ['lp_nomad', 'lp_street', 'lp_corpo'] },
  }),
  o('lp_nomad', 'Nomad', 'lifepath', { act: 'prologue', summary: 'Start in the Badlands, smuggling cargo into Night City with Jackie. Nomad lines help most with the Aldecaldos.' }),
  o('lp_street', 'Streetkid', 'lifepath', { act: 'prologue', summary: 'Start in a Heywood bar, mixed up with Kirk Sawyer. Streetkid lines help with gangs and fixers.' }),
  o('lp_corpo', 'Corpo', 'lifepath', { act: 'prologue', summary: 'Start as an Arasaka counter-intel agent working for Jenkins. Corpo lines help with Arasaka and executives.' }),

  q('rescue', 'The Rescue', 'prologue', {
    summary: 'Jackie and V pull Sandra Dorsett out of a Scav den in Watson. Tutorial mission.',
  }),
  q('pickup', 'The Pickup', 'prologue', {
    summary: 'Buy the Flathead bot from Maelstrom at All Foods. Militech agent Meredith Stout offers you a credchip to pay with. It is laced with a virus.',
    tips: ['Talk to Stout first: you can accept her chip and still decide how to use it.', 'If you want Brick freed, go loud or side with Stout and look for him on the upper floor.'],
    choice: { q: 'How do you handle Maelstrom?', options: ['pk_royce', 'pk_stout'] },
  }),
  o('pk_royce', 'Side with Royce', 'pickup', {
    act: 'prologue',
    summary: 'Pay with your own eddies, or use the chip and warn Royce about the virus. Royce lives, and Militech storms the plant instead.',
    consequences: ['Royce survives and leads Maelstrom.', 'Meredith Stout will not contact you again.'],
  }),
  o('pk_stout', 'Side with Stout / go loud', 'pickup', {
    act: 'prologue',
    summary: 'Use Stout\'s chip without warning, or just open fire. You fight through Maelstrom and Royce dies.',
    consequences: ['Royce dies. You can free Brick, who later runs Maelstrom.', 'Meredith Stout reaches out for a private meeting later.'],
  }),

  // ───────────── ACT 1 ─────────────
  q('heist', 'The Heist', 'act1', {
    summary: 'Steal the Relic from Konpeki Plaza. It goes wrong: Jackie is mortally wounded and V takes a bullet to the head. The Relic boots up.',
    tips: ['This is the end of Act 1 and fixed: Jackie always dies.', 'Finish any Watson business first, Act 2 opens the whole city.'],
    choice: { q: 'Where does Delamain take Jackie\'s body?', options: ['jk_family', 'jk_vik'] },
  }),
  o('jk_family', 'To his family', 'heist', {
    act: 'act1',
    summary: 'Jackie goes home to Mama Welles at El Coyote Cojo.',
    consequences: ['The side job Heroes is an ofrenda at El Coyote Cojo with his family.'],
  }),
  o('jk_vik', 'To Vik\'s clinic', 'heist', {
    act: 'act1',
    summary: 'Jackie\'s body goes to Viktor and Misty.',
    consequences: ['Heroes plays out with Misty. You still decide how to honor him.'],
  }),

  q('playing', 'Playing for Time', 'act2', {
    summary: 'V wakes up with Johnny Silverhand in their head and weeks to live. Act 2 opens: three leads (Evelyn, Takemura, Panam) and the whole city.',
    tips: ['The ending you can pick depends on side questlines finished in Act 2. Use the Endings tab.', 'There is no real timer. Take side gigs freely.'],
  }),

  // ───────────── ACT 2 · MAIN ─────────────
  q('evelyn', 'Automatic Love → Disasterpiece', 'act2', {
    summary: 'Track down Evelyn Parker through Lizzie\'s and Clouds, meet Judy Álvarez, and dive Woodman\'s braindance in Disasterpiece.',
    tips: ['Being kind to Judy here helps her questline later.'],
  }),
  q('voodoo', 'I Walk the Line', 'act2', {
    summary: 'Netwatch agent Bryce Mosley offers a deal to take down the Voodoo Boys netrunners in Pacifica.',
    choice: { q: 'Who do you back in Pacifica?', options: ['vb_voodoo', 'vb_netwatch'] },
  }),
  o('vb_voodoo', 'Stay with the Voodoo Boys', 'voodoo', {
    act: 'act2',
    summary: 'Ignore or warn the netrunners and finish the job for Placide.',
    consequences: ['Voodoo Boys stay neutral in Pacifica.', 'Brigitte connects you to Alt Cunningham.'],
  }),
  o('vb_netwatch', 'Help Netwatch', 'voodoo', {
    act: 'act2',
    summary: 'Disable the Voodoo Boys\' defenses for Netwatch.',
    consequences: ['Voodoo Boys turn hostile and many die.', 'The main story continues to Alt either way.'],
  }),
  q('transmission', 'Transmission', 'act2', {
    summary: 'Through cyberspace V reaches Alt Cunningham, who explains what the Relic is doing to V.',
  }),
  q('takemura', 'Down on the Street → Play It Safe', 'act2', {
    summary: 'Work with Goro Takemura to get an audience with Hanako Arasaka during the parade.',
  }),
  q('search', 'Search and Destroy', 'act2', {
    summary: 'Arasaka raids the hideout after the parade. Hanako is taken and Takemura is buried in the rubble.',
    tips: ['Go back for Takemura when given the chance if you want him around for the Arasaka route.'],
    choice: { q: 'Do you save Takemura?', options: ['tk_save', 'tk_leave'] },
  }),
  o('tk_save', 'Save Takemura', 'search', {
    act: 'act2',
    summary: 'Dig him out. He survives and joins the Arasaka ending route.',
    consequences: ['Takemura can appear in the Arasaka route and its epilogue.'],
  }),
  q('nocturne_prep', 'Ghost Town → Lightning Breaks', 'act2', {
    summary: 'Help Panam Palmer ambush Nash and the Raffen Shiv, then hijack an AV in Lightning Breaks.',
    tips: ['Starting Panam here is required for her full side questline and The Star ending.'],
  }),
  q('wartime', 'Life During Wartime', 'act2', {
    summary: 'With the AV down, find Anders Hellman.',
  }),

  // ───────────── SIDE QUESTLINES THAT MATTER ─────────────
  s('chippin', 'Chippin\' In', {
    summary: 'Let Johnny take V\'s body for a night, then track down his old Porsche and Grayson.',
    tips: ['Required for the Rogue route (The Sun / Temperance).', 'Be supportive of Johnny and agree to his requests to raise your relationship.'],
    choice: { q: 'What happens to Grayson?', options: ['cg_spare', 'cg_kill'] },
  }),
  o('cg_spare', 'Spare Grayson', 'chippin', { act: 'side', summary: 'Let Grayson live and walk away.', consequences: ['No effect on endings. Johnny reacts to how you handled it.'] }),
  o('cg_kill', 'Kill Grayson', 'chippin', { act: 'side', summary: 'Execute Grayson.', consequences: ['No effect on endings.'] }),
  s('blistering', 'Blistering Love', {
    summary: 'Johnny and Rogue go on one last drive. Lets Johnny reconnect with Rogue.',
    tips: ['Counts toward the Johnny relationship needed for the secret ending.'],
  }),
  s('tapeworm', 'Tapeworm', {
    summary: 'A series of conversations with Johnny that trigger as the main story progresses. Finish every one.',
    tips: ['Counts toward the Johnny relationship needed for the secret ending.'],
  }),
  s('queen', 'Queen of the Highway', {
    summary: 'The end of Panam\'s questline (Riders on the Storm, With a Little Help from My Friends, then this). Panam romance option for a male-bodied V.',
    tips: ['Required for The Star ending.', 'Help Saul and the Aldecaldos in Riders on the Storm.'],
  }),
  s('judy', 'Pisces → Pyramid Song', {
    summary: 'Help Judy and the Mox in Pisces, then dive into Laguna Bend in Pyramid Song. Romance option for a female-bodied V.',
    tips: ['If you romance Judy she can appear in The Star ending epilogue.'],
  }),
  s('river', 'The Hunt → Following the River', {
    summary: 'Help detective River Ward find his missing nephew. Romance option for a female-bodied V.',
  }),
  s('kerry', 'Holdin\' On → Boat Drinks', {
    summary: 'Get Kerry Eurodyne back on stage with the Samurai reunion. Romance option for a male-bodied V.',
  }),
  s('delamain', 'Human Nature', {
    summary: 'After hunting down Delamain\'s rogue cabs (Epistrophy), confront Delamain\'s divided cores.',
    choice: { q: 'What do you do with Delamain\'s core?', options: ['dl_reset', 'dl_merge', 'dl_free'] },
  }),
  o('dl_reset', 'Restore Delamain', 'delamain', { act: 'side', summary: 'Purge the personalities and restore the original Delamain.', consequences: ['The original Delamain keeps driving. The new personalities are erased.'] }),
  o('dl_merge', 'Merge the cores', 'delamain', { act: 'side', summary: 'Let Delamain absorb the divergent personalities.', consequences: ['A new, merged Delamain runs the company. Often considered the best outcome.'] }),
  o('dl_free', 'Set them free', 'delamain', { act: 'side', summary: 'Shoot the core and let the personalities escape into the Net.', consequences: ['Delamain Corp becomes something new; the cabs scatter.'] }),
  s('peralez', 'Dream On', {
    summary: 'Uncover who is manipulating mayoral candidate Jefferson Peralez.',
    choice: { q: 'Do you tell the Peralezes what you found?', options: ['pz_tell', 'pz_quiet'] },
  }),
  o('pz_tell', 'Tell them', 'peralez', { act: 'side', summary: 'Reveal that someone is tampering with their minds.', consequences: ['Jefferson and Elizabeth are shaken and their relationship suffers.'] }),
  o('pz_quiet', 'Keep it quiet', 'peralez', { act: 'side', summary: 'Say nothing.', consequences: ['Jefferson stays on track as a candidate, still under outside influence.'] }),
  s('sinnerman', 'There Is a Light That Never Goes Out', {
    summary: 'Joshua Stephenson, a death-row convict, wants a real crucifixion streamed as a braindance.',
    choice: { q: 'Do you support Joshua to the end?', options: ['sn_support', 'sn_stop'] },
  }),
  o('sn_support', 'Support him', 'sinnerman', { act: 'side', summary: 'Stay by Joshua through the crucifixion.', consequences: ['Joshua dies, and the BD is released.'] }),
  o('sn_stop', 'Talk him out', 'sinnerman', { act: 'side', summary: 'Convince him to back out.', consequences: ['Joshua lives, and the BD deal collapses.'] }),
  s('claire', 'The Beast in Me', {
    summary: 'Race with Claire Russell, then face Rhinestone, the man she blames for her husband\'s death.',
    choice: { q: 'What do you do about Rhinestone?', options: ['cl_kill', 'cl_spare'] },
  }),
  o('cl_kill', 'Let Claire kill him', 'claire', { act: 'side', summary: 'Help Claire get her revenge.', consequences: ['Rhinestone dies. Claire is left hollow.'] }),
  o('cl_spare', 'Talk her down', 'claire', { act: 'side', summary: 'Convince Claire to let it go.', consequences: ['Rhinestone lives. Claire starts to move on.'] }),

  // ───────────── PHANTOM LIBERTY ─────────────
  q('pl_start', 'Dog Eat Dog → Lucretia My Reflection', 'pl', {
    summary: 'Songbird pulls V into Dogtown to save the NUSA President. Team up with Solomon Reed and infiltrate Kurt Hansen\'s gala.',
    tips: ['Requires the Phantom Liberty expansion. Starts in Act 2.', 'Finish Phantom Liberty before Point of No Return to keep The Tower ending open.'],
  }),
  q('firestarter', 'Firestarter', 'pl', {
    summary: 'The truth about Songbird comes out. Reed wants her brought in; Songbird begs V to help her escape.',
    choice: { q: 'Who do you side with?', options: ['pl_reed', 'pl_songbird'] },
  }),
  o('pl_reed', 'Side with Reed', 'firestarter', {
    act: 'pl',
    summary: 'Stay loyal to the FIA and capture Songbird in The Killing Moon.',
    consequences: ['Songbird ends up in NUSA hands.', 'Leads to From Her to Eternity, which can unlock The Tower.'],
  }),
  o('pl_songbird', 'Side with Songbird', 'firestarter', {
    act: 'pl',
    summary: 'Help Songbird break into Cynosure in Somewhat Damaged.',
    consequences: ['You decide her fate at the spaceport in Leave in Silence.'],
  }),
  q('silence', 'Leave in Silence', 'pl', {
    summary: 'At the spaceport, the shuttle to the Moon is waiting.',
    choice: { q: 'Do you let Songbird go?', options: ['pl_let_go', 'pl_betray'] },
  }),
  o('pl_let_go', 'Let her go to the Moon', 'silence', { act: 'pl', summary: 'Songbird boards the shuttle.', consequences: ['The Tower ending is no longer possible.'] }),
  o('pl_betray', 'Hand her to Reed', 'silence', { act: 'pl', summary: 'Call Reed and turn Songbird over.', consequences: ['Leads to From Her to Eternity, which can unlock The Tower.'] }),
  q('eternity', 'From Her to Eternity', 'pl', {
    summary: 'The NUSA offers to remove the Relic at a Militech facility. Accepting it starts The Tower ending immediately.',
    tips: ['Save before calling. Accepting skips the base-game finale.'],
  }),

  // ───────────── ACT 3 ─────────────
  q('nocturne', 'Nocturne Op55N1', 'act3', {
    summary: 'Meet Hanako at Embers, then the Point of No Return. On the rooftop with Johnny, V decides who to trust for the final assault on Arasaka Tower.',
    tips: ['The game warns you before this. Make a manual save here; you can reload it to see every ending.', 'Secret ending: wait about 5 minutes on the rooftop without choosing, with high Johnny relationship.'],
    choice: { q: 'Who do you call?', options: ['r_hanako', 'r_panam', 'r_rogue', 'r_secret', 'r_suicide'] },
  }),
  o('r_hanako', 'Call Hanako', 'nocturne', { act: 'act3', summary: 'Work with Arasaka. Hanako takes you in, and you hit Yorinobu from the inside.', consequences: ['Leads only to The Devil.'], requires: [] }),
  o('r_panam', 'Call Panam', 'nocturne', { act: 'act3', summary: 'The Aldecaldos tear through Arasaka\'s defenses with a modified tank.', consequences: ['Leads to The Star or Temperance.'], requires: ['queen'] }),
  o('r_rogue', 'Let Johnny call Rogue', 'nocturne', { act: 'act3', summary: 'Johnny takes the body and storms the tower with Rogue and the Afterlife.', consequences: ['Leads to The Sun or Temperance.', 'Rogue does not survive this route.'], requires: ['chippin'] }),
  o('r_secret', 'Wait. Go in alone.', 'nocturne', { act: 'act3', summary: 'Johnny suggests a suicide run, just the two of you. No retries: dying ends the game.', consequences: ['Leads to The Sun or Temperance.', 'Very hard. Pack heals and your best gear.'], requires: ['chippin', 'blistering', 'tapeworm'] }),
  o('r_suicide', 'End it on the rooftop', 'nocturne', { act: 'act3', summary: 'V refuses every option.', consequences: ['Ends the game immediately with a bleak epilogue.'], requires: [] }),

  q('mikoshi', 'Mikoshi: the final choice', 'act3', {
    summary: 'Inside Mikoshi, Alt asks what happens to V and Johnny. On the Panam, Rogue, and secret routes you choose who keeps the body.',
    choice: { q: 'Who keeps the body?', options: ['mk_v', 'mk_johnny'] },
  }),
  o('mk_v', 'V returns', 'mikoshi', { act: 'act3', summary: 'V goes back to their body, with only months left to live.', consequences: ['Panam route: The Star. Rogue or secret route: The Sun.'] }),
  o('mk_johnny', 'Johnny keeps the body', 'mikoshi', { act: 'act3', summary: 'V crosses the Blackwall with Alt. Johnny lives on.', consequences: ['Temperance ending.'] }),

  // ───────────── ENDINGS ─────────────
  e('end_devil', 'The Devil', {
    summary: 'Arasaka route. V wakes on an Arasaka space station and is offered a contract: store their engram in Mikoshi, or return to Earth with months to live.',
    tips: ['Takemura shows up if you saved him in Search and Destroy.'],
  }),
  e('end_star', 'The Star', {
    summary: 'V leaves Night City with Panam and the Aldecaldos, searching for a cure on the road.',
    tips: ['If you romanced Panam or Judy they come along.'],
  }),
  e('end_sun', 'The Sun', {
    summary: 'V becomes a legend of the Afterlife and accepts a heist job on the Crystal Palace orbital casino.',
    tips: ['Judy and Kerry relationships flavor the epilogue calls.'],
  }),
  e('end_temperance', 'Temperance', {
    summary: 'Johnny keeps the body, says his goodbyes, and leaves Night City. V goes beyond the Blackwall.',
  }),
  e('end_tower', 'The Tower', {
    summary: 'Phantom Liberty. The Relic is removed. V survives but loses the ability to run cyberware, and has to build an ordinary life.',
    tips: ['Only from From Her to Eternity: Songbird must end up with the NUSA.'],
  }),
  e('end_suicide', 'Rooftop ending', {
    summary: 'V takes their own life on the rooftop. Credits roll with messages from friends.',
  }),
];

export const EDGES = [
  ['lp_nomad', 'rescue'], ['lp_street', 'rescue'], ['lp_corpo', 'rescue'],
  ['rescue', 'pickup'],
  ['pk_royce', 'heist'], ['pk_stout', 'heist'],
  ['jk_family', 'playing'], ['jk_vik', 'playing'],

  ['playing', 'evelyn'], ['evelyn', 'voodoo'], ['vb_voodoo', 'transmission'], ['vb_netwatch', 'transmission'],
  ['playing', 'takemura'], ['takemura', 'search'],
  ['playing', 'nocturne_prep'], ['nocturne_prep', 'wartime'],
  ['transmission', 'nocturne'], ['tk_save', 'nocturne'], ['tk_leave', 'nocturne'], ['wartime', 'nocturne'],

  ['playing', 'chippin', 'side'], ['cg_spare', 'blistering', 'side'], ['cg_kill', 'blistering', 'side'],
  ['playing', 'tapeworm', 'side'],
  ['nocturne_prep', 'queen', 'side'],
  ['evelyn', 'judy', 'side'],
  ['playing', 'river', 'side'], ['playing', 'kerry', 'side'],
  ['playing', 'delamain', 'side'], ['playing', 'peralez', 'side'], ['playing', 'sinnerman', 'side'], ['playing', 'claire', 'side'],

  ['playing', 'pl_start', 'side'], ['pl_start', 'firestarter'],
  ['pl_reed', 'eternity'], ['pl_songbird', 'silence'], ['pl_betray', 'eternity'],
  ['eternity', 'end_tower'],

  // requirements feeding into the rooftop
  ['queen', 'r_panam', 'req'], ['chippin', 'r_rogue', 'req'],
  ['blistering', 'r_secret', 'req'], ['tapeworm', 'r_secret', 'req'],

  ['r_hanako', 'end_devil'],
  ['r_panam', 'mikoshi'], ['r_rogue', 'mikoshi'], ['r_secret', 'mikoshi'],
  ['mk_v', 'end_star'], ['mk_v', 'end_sun'], ['mk_johnny', 'end_temperance'],
  ['r_suicide', 'end_suicide'],
].map(([from, to, style]) => ({ from, to, style: style || 'main' }));

// Add the missing option node (kept here so the edge list above reads cleanly)
NODES.push(o('tk_leave', 'Leave him', 'search', {
  act: 'act2',
  summary: 'Get out without him.',
  consequences: ['Takemura dies. The Arasaka route still exists, without him.'],
}));

// Choice → option edges (generated)
for (const n of NODES) {
  if (n.choice) for (const opt of n.choice.options) EDGES.push({ from: n.id, to: opt, style: 'choice' });
}

export const BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n]));

// ───────────── ENDING RULES ─────────────
// Each requirement: { label, test(state) -> bool, hint }
const done = (st, id) => st.done.has(id);
const picked = (st, choice, opt) => st.picks[choice] === opt;

export const ENDINGS = [
  {
    id: 'end_devil', route: 'Call Hanako',
    reqs: [
      { label: 'Always available on the rooftop', test: () => true },
    ],
  },
  {
    id: 'end_star', route: 'Call Panam → V returns',
    reqs: [
      { label: 'Finish Queen of the Highway', node: 'queen', test: (st) => done(st, 'queen') },
      { label: 'Choose "V returns" in Mikoshi', node: 'mikoshi', test: (st) => !st.picks.mikoshi || picked(st, 'mikoshi', 'mk_v'), soft: true },
    ],
  },
  {
    id: 'end_sun', route: 'Let Johnny call Rogue (or go in alone) → V returns',
    reqs: [
      { label: 'Finish Chippin\' In', node: 'chippin', test: (st) => done(st, 'chippin') },
      { label: 'Choose "V returns" in Mikoshi', node: 'mikoshi', test: (st) => !st.picks.mikoshi || picked(st, 'mikoshi', 'mk_v'), soft: true },
    ],
  },
  {
    id: 'end_temperance', route: 'Panam or Rogue route → Johnny keeps the body',
    reqs: [
      { label: 'Finish Queen of the Highway or Chippin\' In', test: (st) => done(st, 'queen') || done(st, 'chippin') },
      { label: 'Choose "Johnny keeps the body" in Mikoshi', node: 'mikoshi', test: (st) => !st.picks.mikoshi || picked(st, 'mikoshi', 'mk_johnny'), soft: true },
    ],
  },
  {
    id: 'end_tower', route: 'Phantom Liberty → From Her to Eternity',
    reqs: [
      { label: 'Own Phantom Liberty and finish Firestarter', node: 'firestarter', test: (st) => done(st, 'firestarter') },
      { label: 'Songbird ends up with the NUSA', test: (st) => picked(st, 'firestarter', 'pl_reed') || picked(st, 'silence', 'pl_betray'), hint: 'Side with Reed, or hand her over in Leave in Silence.' },
      { label: 'Accept the offer before Point of No Return', node: 'eternity', test: (st) => done(st, 'eternity'), soft: true },
    ],
  },
  {
    id: 'end_suicide', route: 'Refuse everything on the rooftop',
    reqs: [{ label: 'Always available on the rooftop', test: () => true }],
  },
];

export const SECRET = {
  title: '(Don\'t Fear) The Reaper',
  summary: 'The secret route: V and Johnny storm Arasaka Tower alone. It leads to The Sun or Temperance.',
  reqs: [
    { label: 'Finish Chippin\' In', node: 'chippin', test: (st) => done(st, 'chippin') },
    { label: 'Finish Blistering Love', node: 'blistering', test: (st) => done(st, 'blistering') },
    { label: 'Finish every Tapeworm talk', node: 'tapeworm', test: (st) => done(st, 'tapeworm') },
    { label: 'Johnny relationship at 70% or more (be supportive in his quests)', manual: 'johnny70' },
    { label: 'On the rooftop, wait about 5 minutes without choosing', manual: 'waited' },
  ],
};
