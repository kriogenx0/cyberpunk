// What every choice leads to, split by type so the map and panels can show it clearly.
//
// Each option id maps to a list of outcomes:
//   unlock  - opens a quest, route or option            (to: node it opens)
//   lock    - closes a quest, route, romance or ending  (to: node it closes)
//   char    - a character lives, dies, leaves or changes how they feel about V
//   romance - starts or rules out a romance
//   ending  - an effect on which endings you can reach
//   item    - gear, cars, money or other rewards
//   call    - phone calls, messages or epilogue mentions later on
//   change  - changes how a later quest plays out      (to: the quest it changes)
//
// Ending and iconic-weapon outcomes are also worked out automatically from the
// ending rules and the Iconics data, so they don't need repeating here.
// All text is written in our own words.

const U = (t, to) => ({ k: 'unlock', t, to });
const X = (t, to) => ({ k: 'lock', t, to });
const C = (t, to) => ({ k: 'char', t, to });
const R = (t, to) => ({ k: 'romance', t, to });
const E = (t, to) => ({ k: 'ending', t, to });
const I = (t, to) => ({ k: 'item', t, to });
const P = (t, to) => ({ k: 'call', t, to });
const H = (t, to) => ({ k: 'change', t, to });

export const OUTCOME_KINDS = {
  unlock: { label: 'Unlocks', icon: '▲', order: 0 },
  lock: { label: 'Locks', icon: '✕', order: 1 },
  ending: { label: 'Endings', icon: '◆', order: 2 },
  romance: { label: 'Romance', icon: '♥', order: 3 },
  char: { label: 'Characters', icon: '●', order: 4 },
  item: { label: 'Rewards & gear', icon: '⚔', order: 5 },
  call: { label: 'Calls & epilogue', icon: '☎', order: 6 },
  change: { label: 'Changes later', icon: '↻', order: 7 },
};

export const OUTCOMES = {
  // ── Prologue
  lp_nomad: [
    H('Nomad dialogue options appear all game, and help most with the Aldecaldos and Panam.', 'ghost'),
    U('Opens the Nomad-only job These Boots Are Made for Walkin\'.', 'boots'),
    E('Never locks any ending.'),
  ],
  lp_street: [
    H('Streetkid dialogue options appear all game, and help most with gangs and fixers.'),
    E('Never locks any ending.'),
  ],
  lp_corpo: [
    H('Corpo dialogue options appear all game, and help most with executives and Arasaka.'),
    H('Adds a way to warn Royce about the spiked chip in The Pickup.', 'pickup'),
    U('Opens the Corpo-only job War Pigs.', 'warpigs'),
    E('Never locks any ending.'),
  ],

  pk_cash: [
    C('Royce lives and stays on good terms with V.'),
    C('If you never met Stout, Dum Dum walks you out peacefully and turns up again later.'),
    H('Royce still runs Maelstrom when you visit their club in Second Conflict.', 'kerry2'),
  ],
  pk_clean: [
    C('Militech storms the factory. Royce dies in the raid.'),
    C('You can free Brick on the way out, and he takes Maelstrom back.'),
    H('Brick (if freed) or Patricia runs the club in Second Conflict, and it can go peacefully.', 'kerry2'),
  ],
  pk_loud: [
    C('The deal turns into a firefight and Royce becomes a boss fight. He can die.'),
    U('If you met Stout, she waits for you at the gate, which leads to Venus in Furs.', 'venus'),
    H('Who runs the club in Second Conflict depends on who survived.', 'kerry2'),
  ],

  // ── Act 1
  jk_family: [
    H('Heroes becomes an ofrenda for Jackie at El Coyote Cojo, with his family and friends.', 'heroes'),
  ],
  jk_vik: [
    H('Heroes plays out with Misty instead of at the family ofrenda.', 'heroes'),
    C('Arasaka raids the clinic and takes the body, which you learn about in Playing for Time.'),
    P('Later scenes refer back to what Arasaka did with him.'),
  ],

  // ── Act 2 main
  au_spare: [
    C('Woodman lives.'),
    H('In Ex-Factor, Judy can ask you to help deal with Woodman for good.', 'exfactor'),
  ],
  au_kill: [
    C('Woodman dies.'),
    H('Ex-Factor plays out without the Woodman request.', 'exfactor'),
  ],
  vb_placide: [
    C('The Voodoo Boys stay neutral towards V.'),
    H('Brigitte connects you to Alt in Transmission.', 'transmission'),
  ],
  vb_netwatch: [
    C('Brigitte\'s crew is wiped out and the Voodoo Boys turn hostile in Pacifica.'),
    H('Transmission plays out differently, but you still reach Alt.', 'transmission'),
  ],
  oda_spare: [
    C('Oda lives, beaten but not killed.'),
    H('Oda can fight beside you in Totalimmortal on the Arasaka route.', 'arasaka'),
  ],
  oda_kill: [
    C('Oda dies, and Takemura is unhappy with you.'),
    H('Oda is absent from the Arasaka finale.', 'arasaka'),
  ],
  tk_save: [
    C('Takemura survives.'),
    H('He leads the Arasaka route at the end.', 'arasaka'),
    E('Needed for the full version of The Devil and its achievement.', 'end_devil'),
  ],
  tk_leave: [
    C('Takemura dies.'),
    H('On the Arasaka route there\'s no Arasaka backup and no Oda. Hellman stands in for Takemura at the end.', 'arasaka'),
    E('The Devil achievement can\'t unlock.', 'end_devil'),
  ],
  ldw_help: [
    U('Unlocks the Aldecaldo side job I\'ll Fly Away.', 'flyaway'),
    C('Mitch and the Aldecaldos appreciate the help.'),
  ],
  ldw_leave: [
    X('I\'ll Fly Away never unlocks.', 'flyaway'),
  ],

  // ── Johnny
  ch_yes: [
    C('V and Johnny reconcile.'),
    U('Unlocks Blistering Love, and with it the Rogue route.', 'blistering'),
    U('Required for the secret ending (Don\'t Fear) The Reaper.', 'r_secret'),
  ],
  ch_no: [
    C('The relationship with Johnny stays cold.'),
    X('Blistering Love won\'t happen.', 'blistering'),
    X('No Rogue route and no secret route on the rooftop.', 'r_rogue'),
  ],

  // ── Judy
  ex_help: [
    U('Her questline continues to Talkin\' \'Bout a Revolution and Pisces.', 'revolution'),
    C('Judy trusts V more.'),
  ],
  ex_no: [
    C('Judy is put out, but you can usually still continue her story.'),
    H('Talkin\' \'Bout a Revolution still arrives later.', 'revolution'),
  ],
  rv_help: [
    U('Pisces unlocks.', 'pisces'),
    R('Judy\'s romance stays open.', 'pyramid'),
  ],
  rv_no: [
    X('Her questline stops here, unless you call her later and say you changed your mind.', 'pisces'),
    R('No romance with Judy while it\'s on hold.', 'pyramid'),
  ],
  pi_judy: [
    U('Pyramid Song unlocks.', 'pyramid'),
    C('The Mox take control of Clouds, and Judy stays close to V.'),
    R('Keeps the Judy romance open.', 'pyramid'),
  ],
  pi_maiko: [
    C('Judy feels betrayed. Maiko keeps Clouds.'),
    X('If you take Maiko\'s money, Pyramid Song is locked.', 'pyramid'),
    R('Taking the money also rules out the Judy romance.', 'pyramid'),
  ],
  py_love: [
    R('Judy becomes V\'s partner.'),
    E('She joins V when they leave with the Aldecaldos in The Star.', 'end_star'),
    P('She keeps in touch through texts and calls, and appears at the end of the story.'),
  ],
  py_friend: [
    R('Judy stays a close friend. No romance.'),
    P('She still keeps in touch as a friend.'),
  ],

  // ── Panam
  wf_help: [
    U('Queen of the Highway unlocks.', 'queen'),
    C('Panam trusts V.'),
    E('Keeps the Panam route open, and with it The Star.', 'end_star'),
  ],
  wf_saul: [
    C('Panam\'s relationship with V breaks.'),
    X('Queen of the Highway is locked.', 'queen'),
    R('No romance with Panam.', 'queen'),
    X('This shuts the door on the Panam route and The Star.', 'end_star'),
  ],
  qh_love: [
    R('Panam becomes V\'s partner.'),
    E('She is at V\'s side when you leave with the Aldecaldos in The Star.', 'end_star'),
    P('She keeps in touch through texts and calls.'),
  ],
  qh_friend: [
    R('Panam stays a close friend. No romance.'),
    E('The Panam route and The Star stay open either way.', 'r_panam'),
  ],

  // ── River
  hr_love: [
    R('River becomes V\'s partner.'),
    P('He keeps in touch through texts and calls, and how it ends with him depends on the ending you pick.'),
  ],
  hr_friend: [
    R('River stays a friend. No romance.'),
  ],

  // ── Kerry
  kb_love: [
    R('Kerry becomes V\'s partner.'),
    E('Kerry stays in Night City; you can carry on with him in The Sun, or by returning to Earth in The Devil.', 'end_sun'),
  ],
  kb_friend: [
    R('Kerry stays a friend. No romance.'),
  ],

  // ── Delamain
  dl_reset: [
    C('The original Delamain is restored and the divergent personalities are erased.'),
    H('Delamain Corp goes back to business as usual.'),
  ],
  dl_merge: [
    C('All the personalities become one new Delamain, which leaves Night City.'),
    I('You get a cab of your own as a parting gift.'),
  ],
  dl_free: [
    C('The divergent cabs scatter into the city and the original Delamain is gone.'),
    I('One cab, Excelsior, stays behind with you.'),
  ],

  // ── River / Peralez
  dr_truth: [
    C('Jefferson learns he is being manipulated. The couple\'s trust in each other suffers.'),
  ],
  dr_quiet: [
    C('Jefferson stays unaware, and his campaign goes on under outside influence.'),
  ],

  // ── Joshua
  sm_ride: [
    U('There Is a Light That Never Goes Out unlocks.', 'sinner'),
    C('Joshua gets to see his plan through.'),
  ],
  sm_kill: [
    C('Joshua\'s story ends here.'),
    X('There Is a Light That Never Goes Out never starts.', 'sinner'),
  ],
  sn_take: [
    I('Rachel pays you (Corpo V can ask for more).'),
    H('The crucifixion and the braindance go ahead.'),
  ],
  sn_refuse: [
    H('You can still stay or leave for the crucifixion itself.'),
  ],

  // ── Smaller side jobs
  cl_kill: [C('Sampson dies and Claire gets her revenge.')],
  cl_stop: [C('Sampson lives. Claire is left to move on.')],
  ht_help: [C('Barry is still there when you check on him later.')],
  ht_cold: [C('Barry may not make it.'), H('The job counts as failed.')],
  wp_calm: [C('Frank lives and leaves to start over.')],
  wp_fight: [C('Frank turns hostile or takes matters into his own hands.')],
  bt_give: [I('XP and Street Cred, but no car.'), C('Lana keeps the car.')],
  bt_keep: [I('The car joins your garage if you pay for it.')],

  // ── Phantom Liberty side jobs
  ne_cut: [I('A cut of the winnings for you.'), C('Aaron loses the fight.')],
  ne_refuse: [I('Refusing starts a fight, and you can loot the Cheetah pistol.'), C('A threat instead makes her back off.')],
  sb_dante: [C('Bree is dealt with and the job closes cleanly.')],
  sb_bree: [C('Bree sells the goods and vanishes.'), P('Militech sends hitmen after everyone involved, V included.')],
  dz_sister: [C('Lina goes back to work.'), I('You can pick up the Baby Boomer car.')],
  dz_clone: [C('Lina walks away from the studio.')],
  dz_letter: [C('The kindest ending for Lina.'), X('You don\'t get the Baby Boomer car.')],
  bw_yuri: [C('Paco dies and you fight Yuri.')],
  bw_friends: [C('Both of them get out alive.'), I('You get the Carmen iconic assault rifle.')],
  bl_save: [C('Daniels survives.'), I('Some of the equipment is damaged. You still get a new car.')],
  bl_leave: [C('Daniels is left behind.'), I('All the equipment arrives. You still get a new car.')],

  // ── Phantom Liberty main
  fs_reed: [
    U('Leads to The Killing Moon and the spaceport.', 'killing'),
    C('Reed becomes V\'s enemy.'),
    X('Black Steel in the Hour of Chaos and Cynosure are skipped.', 'blacksteel'),
  ],
  fs_song: [
    U('Leads to Black Steel in the Hour of Chaos and Cynosure.', 'blacksteel'),
    C('Songbird learns V turned on her.'),
    X('The Killing Moon and the spaceport are skipped.', 'killing'),
  ],
  km_reed: [
    C('Reed takes Songbird back to the NUSA.'),
    U('Through Pain to Heaven follows, and Reed later offers V a cure.', 'reedoffer'),
    E('Keeps The Tower open.', 'end_tower'),
  ],
  km_moon: [
    C('Songbird escapes on the shuttle.'),
    X('No cure from the NUSA: The Tower is locked.', 'end_tower'),
    P('She sends you a farewell later in From Her to Eternity.'),
  ],
  sd_spare: [
    C('Songbird lives and goes to the NUSA.'),
    I('Myers rewards you properly in Leave in Silence.', 'silence'),
    U('Reed later offers V a cure.', 'reedoffer'),
    E('Keeps The Tower open.', 'end_tower'),
  ],
  sd_kill: [
    C('Songbird dies.'),
    I('Only a token reward from Myers.', 'silence'),
    X('No cure offer: The Tower is locked.', 'end_tower'),
  ],
  ro_accept: [
    U('Things Done Changed starts right away, then The Tower.', 'changed'),
    E('The game ends on The Tower. Any other ending is off the table for this playthrough.', 'end_tower'),
  ],
  ro_later: [
    U('On the rooftop, a "call Reed" option is added.', 'r_reed'),
    E('You can still finish the main story and pick The Tower or any other ending there.'),
  ],

  // ── Act 3
  r_hanako: [
    U('Leads to Last Caress and Totalimmortal.', 'arasaka'),
    E('Leads to The Devil.', 'end_devil'),
  ],
  r_panam: [
    U('The Aldecaldos hit Arasaka Tower with a stolen tank.', 'panamroute'),
    E('Leads to The Star or Temperance.', 'end_star'),
  ],
  r_rogue: [
    U('Johnny and Rogue raid Arasaka Tower.', 'rogueroute'),
    C('Rogue doesn\'t survive this route.'),
    E('Leads to The Sun or Temperance.', 'end_sun'),
  ],
  r_secret: [
    U('V and Johnny storm the tower alone.', 'reaper'),
    C('Rogue survives.'),
    H('No retries: dying ends the game.'),
    E('Leads to The Sun or Temperance.', 'end_sun'),
  ],
  r_reed: [
    U('Things Done Changed, then The Tower.', 'changed'),
    E('Leads to The Tower.', 'end_tower'),
  ],
  r_end: [
    E('The game ends right here.', 'end_rest'),
  ],
  wm_sign: [E('The Devil: V stays with Arasaka and their mind is stored away.', 'end_devil')],
  wm_earth: [E('The Devil: V goes back to Earth with months to live.', 'end_devil')],
  mp_v: [E('Changes, then All Along the Watchtower: The Star.', 'end_star')],
  mp_j: [E('New Dawn Fades: Temperance. V stays behind in the net.', 'end_temperance')],
  mr_v: [E('Changes, then Path of Glory: The Sun.', 'end_sun')],
  mr_j: [E('New Dawn Fades: Temperance. V stays behind in the net.', 'end_temperance')],
};
