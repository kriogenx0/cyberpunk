// Decision map data for Cyberpunk 2077 (base game 2.x + Phantom Liberty).
//
// Node kinds:
//   quest   - a mission. May carry `choice` = { q, options: [optionIds] }
//   option  - one answer to a choice. Belongs to `parent`. `pick` describes,
//             in our own words, what you select in game to take this branch.
//   ending  - a final ending.
//
// Edge styles:
//   main    - story flow
//   side    - unlocks a side questline
//   choice  - decision → option (generated)
//   req     - "needs this to be unlocked" (drawn, not used for layout)
//   effect  - "changes what happens here" (drawn, not used for layout)
//
// All summaries are original paraphrases. No game script is reproduced.

import { OUTCOMES, OUTCOME_KINDS } from './outcomes.js';

export const ACTS = {
  prologue: { label: 'Prologue', color: '#7cf7ff' },
  act1: { label: 'Act 1', color: '#ff3ea5' },
  act2: { label: 'Act 2 · Main', color: '#ff7ad1' },
  side: { label: 'Side Jobs', color: '#b48cff' },
  pl: { label: 'Phantom Liberty', color: '#ffd23e' },
  act3: { label: 'Act 3', color: '#ff4d5e' },
  ending: { label: 'Endings', color: '#fff36b' },
};

const q = (id, title, act, extra = {}) => ({ id, title, act, kind: 'quest', type: 'main', ...extra });
const s = (id, title, extra = {}) => ({ id, title, act: 'side', kind: 'quest', type: 'side', ...extra });
const p = (id, title, extra = {}) => ({ id, title, act: 'pl', kind: 'quest', type: 'main', ...extra });
const o = (id, title, parent, act, extra = {}) => ({ id, title, parent, act, kind: 'option', ...extra });
const ps = (id, title, extra = {}) => ({ id, title, act: 'pl', kind: 'quest', type: 'side', ...extra });
const e = (id, title, extra = {}) => ({ id, title, act: 'ending', kind: 'ending', ...extra });

export const NODES = [
  // ═════════════ PROLOGUE ═════════════
  q('lifepath', 'Choose a Lifepath', 'prologue', {
    summary: 'Your origin decides the first hour of the game and adds special dialogue options for the rest of it. It never locks you out of an ending.',
    tips: ['Lifepath options appear tagged in conversations and can open alternate solutions.', 'Corpo V gets an extra way through The Pickup.'],
    choice: { q: 'Where does V come from?', options: ['lp_nomad', 'lp_street', 'lp_corpo'] },
  }),
  o('lp_nomad', 'Nomad', 'lifepath', 'prologue', { pick: 'Pick Nomad on the character creation screen.', summary: 'Start in the Badlands, smuggling cargo past the border with Jackie.' }),
  o('lp_street', 'Streetkid', 'lifepath', 'prologue', { pick: 'Pick Streetkid on the character creation screen.', summary: 'Start in a Heywood bar, owing money to a fixer.' }),
  o('lp_corpo', 'Corpo', 'lifepath', 'prologue', { pick: 'Pick Corpo on the character creation screen.', summary: 'Start as an Arasaka counter-intelligence agent, until it all falls apart.' }),

  q('rescue', 'The Rescue', 'prologue', { summary: 'Jackie and V pull a kidnapped client out of a Scav den. Tutorial job.' }),
  q('pickup', 'The Pickup', 'prologue', {
    summary: 'Buy a Militech combat bot from Maelstrom. A Militech agent, Meredith Stout, offers you a credchip to pay with, but it carries hidden malware.',
    tips: ['Meeting Stout is optional; you can still pay with your own money afterwards.', 'Brick, Maelstrom\'s old boss, is locked up on site and can be freed if things go loud or Militech raids the plant.'],
    choice: { q: 'How do you pay Maelstrom?', options: ['pk_cash', 'pk_clean', 'pk_loud'] },
  }),
  o('pk_cash', 'Pay with your own cash', 'pickup', 'prologue', {
    pick: 'When Royce asks how you are paying, choose to hand over your own eddies.',
    summary: 'Keep things friendly and walk out with the bot.',
  }),
  o('pk_clean', 'Use Stout\'s chip, safely', 'pickup', 'prologue', {
    pick: 'Take Stout\'s chip, then either have the malware removed or (Corpo only) tip Royce off before paying.',
    summary: 'Pay with Militech\'s money without triggering the trap.',
  }),
  o('pk_loud', 'Spiked chip or open fire', 'pickup', 'prologue', {
    pick: 'Pay with the infected chip without warning anyone, or draw a weapon on Maelstrom.',
    summary: 'The deal turns into a firefight; Royce becomes a boss fight.',
  }),
  q('information', 'The Information', 'prologue', { summary: 'Evelyn Parker shows you a braindance of the target: the Relic, Arasaka\'s prototype chip, at Konpeki Plaza.' }),

  // ═════════════ ACT 1 ═════════════
  q('heist', 'The Heist', 'act1', {
    summary: 'The Konpeki Plaza job goes wrong. Yorinobu kills his father, Jackie is fatally wounded, and the Relic ends up in V\'s head.',
    tips: ['Jackie always dies; the choice is what happens to him afterwards.', 'This ends Act 1 and opens the whole city. Wrap up Watson first if you like.'],
    choice: { q: 'Where does Delamain take Jackie?', options: ['jk_family', 'jk_vik'] },
  }),
  o('jk_family', 'To his family', 'heist', 'act1', {
    pick: 'Tell Delamain to take Jackie home to his family (or tell him to wait).',
    summary: 'Jackie goes home to Mama Welles.',
  }),
  o('jk_vik', 'To Vik\'s clinic', 'heist', 'act1', {
    pick: 'Tell Delamain to drive Jackie to Viktor.',
    summary: 'Jackie\'s body goes to Viktor\'s clinic.',
  }),

  // ═════════════ ACT 2 · MAIN ═════════════
  q('playing', 'Playing for Time', 'act2', {
    summary: 'V wakes up with Johnny Silverhand\'s engram in their head and weeks to live. Three leads open up: Evelyn, Takemura and the Voodoo Boys, plus Panam.',
    tips: ['There is no real timer. Do side jobs freely.', 'The endings you can pick depend on side questlines finished in Act 2. Check the Endings tab.'],
  }),

  q('automatic', 'Automatic Love', 'act2', {
    summary: 'Track Evelyn through Clouds, the doll house. Interrogate its manager, Woodman.',
    choice: { q: 'What happens to Woodman?', options: ['au_spare', 'au_kill'] },
  }),
  o('au_spare', 'Leave Woodman alive', 'automatic', 'act2', {
    pick: 'Get the information through talk, intimidation or a skill check without him turning hostile.',
    summary: 'Woodman tells you where Evelyn went.',
  }),
  o('au_kill', 'Kill Woodman', 'automatic', 'act2', {
    pick: 'Push the interrogation until he turns hostile, then win the fight.',
    summary: 'You read what you need off his computer.',
  }),
  q('space', 'The Space in Between → Disasterpiece', 'act2', {
    summary: 'Find Evelyn at Fingers\', then dive Evelyn\'s braindance with Judy to find the Voodoo Boys connection.',
  }),
  q('mapt', 'M\'ap Tann Pèlen', 'act2', { summary: 'Earn an audience with Placide and the Voodoo Boys in Pacifica.' }),
  q('walkline', 'I Walk the Line', 'act2', {
    summary: 'Netwatch agent Bryce Mosley wants your help taking down the Voodoo Boys netrunners.',
    choice: { q: 'Who do you help in Pacifica?', options: ['vb_placide', 'vb_netwatch'] },
  }),
  o('vb_placide', 'Follow Placide\'s plan', 'walkline', 'act2', {
    pick: 'Refuse Bryce\'s offer (or knock him out) and do the job Placide gave you.',
    summary: 'Stay loyal to the Voodoo Boys.',
  }),
  o('vb_netwatch', 'Cooperate with Netwatch', 'walkline', 'act2', {
    pick: 'Agree to Bryce\'s deal and disable the netrunners\' protection.',
    summary: 'Help Netwatch ambush the Voodoo Boys.',
  }),
  q('transmission', 'Transmission', 'act2', { summary: 'Through cyberspace, V reaches Alt Cunningham, who explains what the Relic is doing to them.' }),

  q('street', 'Down on the Street → Gimme Danger', 'act2', { summary: 'Work with Goro Takemura and gather intel for a shot at Hanako Arasaka during the parade.' }),
  q('parade', 'Play It Safe', 'act2', {
    summary: 'Infiltrate the Japantown parade and snatch Hanako. Her bodyguard Sandayu Oda fights you at the end.',
    choice: { q: 'What happens to Oda?', options: ['oda_spare', 'oda_kill'] },
  }),
  o('oda_spare', 'Spare Oda', 'parade', 'act2', {
    pick: 'After you beat him, choose not to finish him off, as Takemura asks.',
    summary: 'Oda is incapacitated, not killed.',
  }),
  o('oda_kill', 'Kill Oda', 'parade', 'act2', {
    pick: 'Finish Oda off after the fight.',
    summary: 'Oda dies.',
  }),
  q('search', 'Search and Destroy', 'act2', {
    summary: 'Arasaka raids Takemura\'s hideout and takes Hanako. The floor collapses and Takemura is trapped upstairs.',
    tips: ['You can ignore Johnny\'s advice and climb back up for Takemura, as long as you haven\'t left the building.'],
    choice: { q: 'Do you go back for Takemura?', options: ['tk_save', 'tk_leave'] },
  }),
  o('tk_save', 'Go back for Takemura', 'search', 'act2', {
    pick: 'Climb back up through the building and help him fight his way out.',
    summary: 'Takemura survives.',
  }),
  o('tk_leave', 'Leave him', 'search', 'act2', {
    pick: 'Follow Johnny\'s route out of the building.',
    summary: 'Takemura dies in the raid.',
  }),

  q('ghost', 'Ride the Lightning → Ghost Town', 'act2', {
    summary: 'Meet Panam Palmer at the Afterlife and help her ambush Nash and the Raffen Shiv in the Badlands.',
    tips: ['Starting Panam\'s story here is the first step toward The Star.'],
  }),
  q('lightning', 'Lightning Breaks', 'act2', { summary: 'Hijack an Arasaka AV with Panam\'s help to reach Anders Hellman.' }),
  q('wartime', 'Life During Wartime', 'act2', {
    summary: 'After the AV crash, find Hellman and get your car back.',
    choice: { q: 'Do you help Panam with the wreckage?', options: ['ldw_help', 'ldw_leave'] },
  }),
  o('ldw_help', 'Help clear the wreckage', 'wartime', 'act2', {
    pick: 'Stay and help Panam deal with the wreck instead of heading straight to the gas station.',
    summary: 'Pitch in with Panam.',
  }),
  o('ldw_leave', 'Head straight for the station', 'wartime', 'act2', {
    pick: 'Leave Panam and go directly to the gas station.',
    summary: 'Skip the extra work.',
  }),

  // ═════════════ SIDE JOBS ═════════════
  s('venus', 'Venus in Furs', { summary: 'Meredith Stout invites V to a private meeting.', tips: ['Only if Stout waited for you at the factory gate in The Pickup.'] }),
  s('heroes', 'Heroes', { summary: 'Say goodbye to Jackie. Where the farewell happens depends on where his body went.' }),

  s('chippin', 'Chippin\' In', {
    summary: 'Let Johnny drive V\'s body for a night, track down his old Porsche and confront Grayson. Ends with a long talk with Johnny at an oil field.',
    tips: ['This talk decides both the Rogue route and the secret ending.', 'The three answers that count all come near the end of the conversation.'],
    choice: { q: 'Do you give Johnny a second chance?', options: ['ch_yes', 'ch_no'] },
  }),
  o('ch_yes', 'Give him a second chance', 'chippin', 'side', {
    pick: 'In the oil field talk: admit you messed up too, ask what he wants from you, then agree to one last second chance.',
    summary: 'You and Johnny reconcile.',
  }),
  o('ch_no', 'Turn him down', 'chippin', 'side', {
    pick: 'Answer any other way in the oil field talk.',
    summary: 'The relationship stays cold.',
  }),
  s('blistering', 'Blistering Love', {
    summary: 'Johnny takes Rogue out for one last night on the town. Afterwards, Rogue is willing to help with Arasaka.',
    tips: ['Required for the Rogue route at the rooftop.'],
  }),
  s('tapeworm', 'Tapeworm', { summary: 'Conversations with Johnny that trigger as the story moves forward. They deepen your bond and fill in his past.' }),

  s('exfactor', 'Ex-Factor', {
    summary: 'Judy asks for help with something personal, which leads to her questline.',
    choice: { q: 'Do you go along with Judy\'s plan?', options: ['ex_help', 'ex_no'] },
  }),
  o('ex_help', 'Help Judy', 'exfactor', 'side', { pick: 'Agree to help Judy.', summary: 'You back Judy\'s plan.' }),
  o('ex_no', 'Call it a bad idea', 'exfactor', 'side', { pick: 'Tell Judy you think her plan is a bad idea.', summary: 'You voice your doubts.' }),
  s('pisces', 'Pisces', {
    summary: 'Judy and the Mox make a move on Clouds while the Tyger Claws are distracted. Maiko has her own deal to offer you.',
    choice: { q: 'Whose side are you on at Clouds?', options: ['pi_judy', 'pi_maiko'] },
  }),
  o('pi_judy', 'Side with Judy', 'pisces', 'side', {
    pick: 'Back Judy\'s plan for the Mox (you can still decide whether Maiko lives).',
    summary: 'The Mox take control of Clouds.',
  }),
  o('pi_maiko', 'Side with Maiko', 'pisces', 'side', {
    pick: 'Accept Maiko\'s plan and take the money she offers.',
    summary: 'Maiko keeps Clouds under her own terms.',
  }),
  s('pyramid', 'Pyramid Song', {
    summary: 'Dive the drowned town of Laguna Bend with Judy. Romance option for a female-bodied V with a feminine voice.',
    tips: ['Romancing Judy lets her join you in The Star.'],
    choice: { q: 'Do you start a relationship with Judy?', options: ['py_love', 'py_friend'] },
  }),
  o('py_love', 'Romance Judy', 'pyramid', 'side', { pick: 'Return her feelings at the end of the dive (needs a female body type and feminine voice).', summary: 'Judy and V get together.' }),
  o('py_friend', 'Stay friends', 'pyramid', 'side', { pick: 'Turn her down, or play as a V she isn\'t interested in.', summary: 'Judy stays a friend.' }),

  s('riders', 'Riders on the Storm', {
    summary: 'Rescue Saul, the Aldecaldos\' leader, from the Raffen Shiv.',
    tips: ['Loud or stealthy approach both work.'],
  }),
  s('friends', 'With a Little Help from My Friends', {
    summary: 'Panam wants to settle a score, and asks you to keep it quiet from Saul.',
    choice: { q: 'Do you keep Panam\'s plan secret?', options: ['wf_help', 'wf_saul'] },
  }),
  o('wf_help', 'Help Panam', 'friends', 'side', { pick: 'Agree to help Panam and don\'t tell Saul.', summary: 'Panam trusts you.' }),
  o('wf_saul', 'Tell Saul', 'friends', 'side', {
    pick: 'Tell Saul what Panam is planning.',
    summary: 'You go behind Panam\'s back.',
  }),
  s('queen', 'Queen of the Highway', {
    summary: 'A quiet night with Panam in a jury-rigged AV. Romance option for a male-bodied V.',
    tips: ['Required for the Panam route (The Star).'],
    choice: { q: 'Do you start a relationship with Panam?', options: ['qh_love', 'qh_friend'] },
  }),
  o('qh_love', 'Romance Panam', 'queen', 'side', { pick: 'Return her feelings in the AV (needs a masculine body type).', summary: 'Panam and V get together.' }),
  o('qh_friend', 'Stay friends', 'queen', 'side', { pick: 'Keep it friendly, or play as a V she isn\'t interested in.', summary: 'Panam stays a friend.' }),

  s('hunt', 'The Hunt → Following the River', { summary: 'Help detective River Ward find his missing nephew, then spend a day with River\'s family. Romance option for a female-bodied V.',
    choice: { q: 'Do you start a relationship with River?', options: ['hr_love', 'hr_friend'] },
  }),
  o('hr_love', 'Romance River', 'hunt', 'side', { pick: 'Kiss River on the water tower in Following the River (needs a feminine body type).', summary: 'River and V get together.' }),
  o('hr_friend', 'Stay friends', 'hunt', 'side', { pick: 'Stay friendly on the water tower, or play as a V he isn\'t interested in.', summary: 'River stays a friend.' }),
  s('kerry', 'Holdin\' On', {
    summary: 'Johnny takes over V\'s body to look up his old bandmate, rock star Kerry Eurodyne. Starts Kerry\'s questline.',
    tips: ['After Chippin\' In, find Johnny by the pond under the North Oak sign.', 'Climb the rocks to the right of the gate; Kerry won\'t answer the intercom.'],
    secret: true,
  }),

  s('epistrophy', 'Epistrophy', { summary: 'Track down seven Delamain cabs that went rogue around the city.' }),
  s('delamain', 'Don\'t Lose Your Mind', {
    summary: 'The virus reaches Delamain\'s core. Each personality tries to persuade you in the control room.',
    choice: { q: 'What do you do with Delamain\'s core?', options: ['dl_reset', 'dl_merge', 'dl_free'] },
  }),
  o('dl_reset', 'Reset the core', 'delamain', 'side', { pick: 'Do what the original Delamain asks and reset the core.', summary: 'The original Delamain is restored and the divergent personalities are erased.' }),
  o('dl_merge', 'Merge them (Intelligence 20)', 'delamain', 'side', { pick: 'Hack the core to merge every personality into one.', summary: 'A single new Delamain is born, and it wants to leave Night City.' }),
  o('dl_free', 'Destroy the core', 'delamain', 'side', { pick: 'Destroy the core and set the divergent personalities free.', summary: 'The divergent cabs scatter into the city.' }),

  s('dream', 'Dream On', {
    summary: 'Uncover who is manipulating mayoral candidate Jefferson Peralez.',
    choice: { q: 'Do you tell Jefferson the truth?', options: ['dr_truth', 'dr_quiet'] },
  }),
  o('dr_truth', 'Tell him the truth', 'dream', 'side', { pick: 'Tell Jefferson what you found.', summary: 'Jefferson learns he is being manipulated.' }),
  o('dr_quiet', 'Do as Elizabeth asks', 'dream', 'side', { pick: 'Follow Elizabeth\'s wishes and keep it from him.', summary: 'Jefferson stays unaware.' }),

  s('sinner', 'There Is a Light That Never Goes Out', {
    summary: 'A convicted killer wants his own crucifixion streamed as a braindance. A media exec offers you money to make sure it happens.',
    choice: { q: 'Do you take Rachel\'s bribe?', options: ['sn_take', 'sn_refuse'] },
  }),
  o('sn_take', 'Accept the bribe', 'sinner', 'side', { pick: 'Take Rachel\'s money (Corpo V can ask for more).', summary: 'You get paid.' }),
  o('sn_refuse', 'Refuse the bribe', 'sinner', 'side', { pick: 'Turn Rachel\'s money down.', summary: 'You keep your hands clean.' }),

  s('beast', 'The Beast in Me', {
    summary: 'Race with Claire, the Afterlife bartender, then confront Sampson, the man she blames for her husband\'s death.',
    choice: { q: 'What do you do about Sampson?', options: ['cl_kill', 'cl_stop'] },
  }),
  o('cl_kill', 'Let Claire kill him', 'beast', 'side', { pick: 'Follow Sampson and let Claire take her revenge.', summary: 'Claire gets her vengeance.' }),
  o('cl_stop', 'Stop her', 'beast', 'side', { pick: 'Prevent Claire from killing Sampson.', summary: 'You talk her out of it.' }),

  // ═════════════ MORE SIDE JOBS ═════════════
  // Judy
  s('bothsides', 'Both Sides, Now', {
    summary: 'After Disasterpiece, Judy calls V to her apartment. What you find there opens the rest of her story.',
    tips: ['Starts a day or so after Double Life. If Judy never calls, push on with M\'ap Tann Pèlen and answer her texts.', 'What you say here has no lasting effect.'],
  }),
  s('revolution', 'Talkin\' \'Bout a Revolution', {
    summary: 'Judy lays out her plan to take Clouds back for the Mox and asks whether you are in.',
    tips: ['Stay away from Judy\'s apartment for a while after Ex-Factor; she messages you when she is ready.'],
    choice: { q: 'Do you join Judy\'s plan?', options: ['rv_help', 'rv_no'] },
  }),
  o('rv_help', 'Agree to help', 'revolution', 'side', { pick: 'Tell Judy you\'ll back her plan.', summary: 'You\'re in.' }),
  o('rv_no', 'Turn her down', 'revolution', 'side', { pick: 'Tell Judy you won\'t be part of it.', summary: 'Judy goes on without you.' }),

  // River
  s('ifought', 'I Fought the Law', {
    summary: 'Elizabeth Peralez hires V to look into a murder the NCPD closed too quickly. You team up with detective River Ward.',
    tips: ['Unlocks after Life During Wartime once you have some Street Cred; Elizabeth calls you.', 'Finishing it opens both The Hunt (River) and Dream On (the Peralezes).', 'Letting River handle the Tyger Claws avoids a fight.'],
  }),

  // Kerry
  s('kerry2', 'Second Conflict', {
    summary: 'Track down Nancy, Samurai\'s old keyboardist, at a Maelstrom-run club, then bring her to the band\'s reunion.',
    tips: ['Who runs the club depends on The Pickup: Royce, Brick or Patricia. If you freed Brick, this goes peacefully.', 'Knock out or kill Dum Dum for a chance at the Doom Doom revolver. Once the job ends he is gone.'],
  }),
  s('kerry3', 'A Like Supreme → Boat Drinks', {
    summary: 'Help Kerry with a Samurai gig, a feud with the pop group Us Cracks, and an old score to settle. Romance option for a male-bodied V.',
    tips: ['The chain runs A Like Supreme, Rebel! Rebel!, I Don\'t Wanna Hear It, Off the Leash, then Boat Drinks.', 'Kerry stays in Night City; you can continue with him in The Sun or by returning to Earth in The Devil.'],
    choice: { q: 'Do you start a relationship with Kerry?', options: ['kb_love', 'kb_friend'] },
  }),
  o('kb_love', 'Romance Kerry', 'kerry3', 'side', { pick: 'Return his feelings in Boat Drinks (needs a masculine body type and voice).', summary: 'Kerry and V get together.' }),
  o('kb_friend', 'Stay friends', 'kerry3', 'side', { pick: 'Keep it friendly, or play as a V he isn\'t interested in.', summary: 'Kerry stays a friend.' }),
  s('everybreath', 'Every Breath You Take', {
    summary: 'Blue Moon from Us Cracks has a stalker. Find out who it is and keep her safe.',
    tips: ['Only after you get friendly with Us Cracks in Kerry\'s jobs.'],
  }),

  // Joshua
  s('sinnerman', 'Sinnerman', {
    summary: 'Wakako hires V to deal with Joshua Stephenson, a convicted killer on his way to meet his victim\'s family. Joshua has found religion and wants to make amends.',
    tips: ['Starts with a call from Wakako after Life During Wartime.', 'Keep your weapon holstered near the police car, and don\'t lose the patrol car.'],
    choice: { q: 'Do you see Joshua through, or end it?', options: ['sm_ride', 'sm_kill'] },
  }),
  o('sm_ride', 'Ride with Joshua', 'sinnerman', 'side', { pick: 'Get in the police car and agree to Joshua\'s job offer on the way.', summary: 'Joshua asks you to help with his last wish.' }),
  o('sm_kill', 'Do Wakako\'s job', 'sinnerman', 'side', { pick: 'Kill Joshua, or decline his offer and get out of the car.', summary: 'You take Wakako\'s money and walk away.' }),

  // Delamain
  s('humannature', 'Human Nature → Tune Up', {
    summary: 'Get V\'s wrecked car back from the impound lot, then Delamain apologizes and fixes you up with a new ride.',
    tips: ['Starts with a call some time after Playing for Time.'],
  }),

  // Watson / city
  s('happy', 'Happy Together', {
    summary: 'Barry, V\'s neighbour and an NCPD officer, is grieving and the police are at his door. Help him, or don\'t.',
    tips: ['Find the officers outside apartment 0613, one floor below V. Barry won\'t open up at first; come back a few hours later.', 'Visit the columbarium in North Oak before your final talk with the officers.'],
    choice: { q: 'How do you handle Barry?', options: ['ht_help', 'ht_cold'] },
  }),
  o('ht_help', 'Listen and help', 'happy', 'side', { pick: 'Take the sympathetic lines with Barry, visit his friend\'s niche, then tell the officers to go see him themselves.', summary: 'Barry\'s colleagues reach out to him.' }),
  o('ht_cold', 'Brush him off', 'happy', 'side', { pick: 'Be dismissive with Barry, or skip the visit and the talk with the officers.', summary: 'Barry is left on his own.' }),
  s('psycho', 'Psycho Killer', {
    summary: 'Regina Jones asks V to deal with every cyberpsycho in the city, ideally without killing them.',
    tips: ['Regina calls when you enter an area with a cyberpsycho.', 'Use fists, blunt weapons or non-lethal quickhacks; incapacitating all of them earns the better reward from Regina.'],
  }),
  s('beat', 'Beat on the Brat', {
    summary: 'Fist-fight your way through the champions of each district for a fixer, then take on the toughest fighter in the city.',
    tips: ['Fights are spread across Kabuki, Arroyo, Rancho Coronado, Pacifica and The Glen.', 'Weapons and some cyberware are not allowed; Gorilla Arms are.'],
  }),
  s('buck', 'The Ballad of Buck Ravers', {
    summary: 'Johnny wants a recording of an old Samurai show. Track it down in Kabuki\'s market.',
    tips: ['Start by approaching the busker at the Kabuki market.'],
  }),
  s('coin', 'Coin Operated Boy', {
    summary: 'Brendan, a surprisingly thoughtful vending machine near V\'s megabuilding, gets hauled away for repairs. Find out what happened to him.',
    tips: ['Talk to the vending machine at the base of the steps by Megabuilding H8 in Japantown.'],
  }),

  // Panam
  s('flyaway', 'I\'ll Fly Away', {
    summary: 'Mitch asks V to help give Scorpion a proper Aldecaldo send-off.',
    tips: ['Missable: finishing Queen of the Highway first, or starting With a Little Help from My Friends, locks it.', 'Mitch texts you while you are still in the Badlands.'],
    missable: true,
  }),

  // Afterlife
  s('spellbound', 'Spellbound → Kold Mirage', {
    summary: 'Nix wants a rare encrypted netrunning book from a fixer named R3n0. Buy it, steal it, or crack it yourself, then Nix sends you after more.',
    tips: ['Decrypting the book before handing it over gives a legendary crafting spec and starts Kold Mirage straight away.', 'Ask Nix to teach you something before handing over the book, or his shop closes until Kold Mirage.'],
  }),

  // Secrets
  s('fool', 'Fool on the Hill', {
    summary: 'Tarot cards are painted on walls all over Night City. Find and scan every one, then visit Misty.',
    tips: ['Starts when you scan your first tarot mural after The Heist.', 'The reward is Misty\'s dreamcatcher for your apartment and an achievement.'],
    secret: true,
  }),
  s('oddity', 'Space Oddity', {
    summary: 'Two drifters in Rancho Coronado found a military briefcase next to a body. Follow where it leads.',
    tips: ['Look for the drifters near the Piez fast travel point.', 'Ends with a fight against a Militech team and a valuable painting.'],
    secret: true,
  }),
  s('warpigs', 'War Pigs (Corpo only)', {
    summary: 'Frank, a former Arasaka colleague, calls V for help. He has his own plan to get Abernathy off his back.',
    tips: ['Corpo lifepath only. Frank calls after Transmission.', 'Talking to Frank earlier in the game helps you calm him down here.'],
    secret: true,
    choice: { q: 'How does it end with Frank?', options: ['wp_calm', 'wp_fight'] },
  }),
  o('wp_calm', 'Talk him down', 'warpigs', 'side', { pick: 'Keep your weapon down and talk him into starting over.', summary: 'Frank lowers his gun.' }),
  o('wp_fight', 'Draw on him', 'warpigs', 'side', { pick: 'Aim at Frank, or answer coldly when he asks for help.', summary: 'It ends in violence.' }),
  s('boots', 'These Boots Are Made for Walkin\' (Nomad only)', {
    summary: 'V\'s old Nomad car, written off long ago, turns up in a scrapyard, and someone else has claimed it.',
    tips: ['Nomad lifepath only. You get the GPS ping after Ghost Town.'],
    secret: true,
    choice: { q: 'Who keeps the car?', options: ['bt_give', 'bt_keep'] },
  }),
  o('bt_give', 'Let Lana have it', 'boots', 'side', { pick: 'Tell Lana she can keep it.', summary: 'You walk away from your old car.' }),
  o('bt_keep', 'Take it back', 'boots', 'side', { pick: 'Pay Lana for it, or insist it\'s yours.', summary: 'Your old car is yours again.' }),

  // ═════════════ PHANTOM LIBERTY SIDE JOBS ═════════════
  ps('pl_noeasy', 'No Easy Way Out', {
    summary: 'A boxing coach needs help with a fighter in Dogtown. Then someone wants the fight thrown.',
    tips: ['Arrives by text during Lucretia My Reflection.', 'Refuse the deal and you can loot the Cheetah pistol.'],
    choice: { q: 'Will Aaron throw the fight?', options: ['ne_cut', 'ne_refuse'] },
  }),
  o('ne_cut', 'Take the cut', 'pl_noeasy', 'pl', { pick: 'Accept Angie\'s offer (Corpo V can ask for more).', summary: 'You get a share of the bet.' }),
  o('ne_refuse', 'Refuse or threaten', 'pl_noeasy', 'pl', { pick: 'Turn Angie down, or threaten her.', summary: 'The fight stays clean.' }),
  ps('pl_shot', 'Shot by Both Sides', {
    summary: 'Mr. Hands sends V to steal a scientist\'s research from a Dogtown lab. Someone else is after it too.',
    tips: ['Hands calls once you have met him in person. Part of it only works at night.'],
    choice: { q: 'Who do you back at the end?', options: ['sb_dante', 'sb_bree'] },
  }),
  o('sb_dante', 'Let Dante handle Bree', 'pl_shot', 'pl', { pick: 'Step aside and let Dante deal with Bree.', summary: 'The data goes where Hands wanted.' }),
  o('sb_bree', 'Defend Bree', 'pl_shot', 'pl', { pick: 'Side with Bree against Dante.', summary: 'Bree escapes with her research.' }),
  ps('pl_dazed', 'Dazed and Confused', {
    summary: 'A braindance star has gone missing mid-shoot, and her tech is falling apart. Get her back on set.',
    tips: ['Hands texts after you meet him in person.', 'Scan the letter in the studio first: it unlocks the best outcome.', 'Tell Lina you found them "like this", or the job fails.'],
    choice: { q: 'How do you get through to Tool?', options: ['dz_sister', 'dz_clone', 'dz_letter'] },
  }),
  o('dz_sister', 'He\'s her brother', 'pl_dazed', 'pl', { pick: 'Convince Tool that Lina is his sister.', summary: 'Lina comes back.' }),
  o('dz_clone', 'He\'s a clone', 'pl_dazed', 'pl', { pick: 'Convince Tool he is a clone.', summary: 'Lina leaves for good.' }),
  o('dz_letter', 'Read the letter', 'pl_dazed', 'pl', { pick: 'Have Lina read Tool\'s letter (needs the scan).', summary: 'Tool is restored.' }),
  ps('pl_balls', 'Balls to the Wall', {
    summary: 'Two locals, Paco and Babs, stole from the wrong convoy. Help them get out alive.',
    tips: ['Talk to them near the Golden Pacific fast travel point in Dogtown.'],
    choice: { q: 'How do you get them out?', options: ['bw_yuri', 'bw_friends'] },
  }),
  o('bw_yuri', 'Frame Yuri', 'pl_balls', 'pl', { pick: 'Pin the theft on Yuri.', summary: 'It goes badly.' }),
  o('bw_friends', 'Call in a favour', 'pl_balls', 'pl', { pick: 'Call friends from your past jobs for help.', summary: 'Your friends show up.' }),
  ps('pl_baby', 'Baby Let Me Take You', {
    summary: 'El Capitan wants his gear back from a cargo ship at the Arasaka docks.',
    tips: ['Unlocks after you bring El Capitan enough cars.'],
    choice: { q: 'Daniels or the cargo?', options: ['bl_save', 'bl_leave'] },
  }),
  o('bl_save', 'Save Daniels', 'pl_baby', 'pl', { pick: 'Go back for Daniels.', summary: 'Daniels lives.' }),
  o('bl_leave', 'Leave him', 'pl_baby', 'pl', { pick: 'Keep going with the cargo.', summary: 'Daniels doesn\'t make it.' }),
  ps('pl_hands', 'Hi Ho Silver Lining → Run This Town', {
    summary: 'Finish every Mr. Hands gig in Dogtown and he invites you over, rewards you, then gives you one last job about who runs Dogtown.',
    tips: ['Gig choices pay off later: save Hasan in Prototype in the Scraper for Go Your Own Way, and spare Katya in Spy in the Jungle for Money for Nothing.', 'Bill texts after the Waiting for Dodger gig (New Person, Same Old Mistakes).'],
  }),
  ps('pl_tarot', 'Tomorrow Never Knows', {
    summary: 'Dogtown has its own tarot murals. Find and scan all four.',
    tips: ['Starts when you scan the first one.'],
    secret: true,
  }),

  // ═════════════ MORE SIDE JOBS ═════════════
  // Judy
  s('bothsides', 'Both Sides, Now', {
    summary: 'After Disasterpiece, Judy calls V to her apartment. What you find there opens the rest of her story.',
    tips: ['Starts a day or so after Double Life. If Judy never calls, push on with M\'ap Tann Pèlen and answer her texts.', 'What you say here has no lasting effect.'],
  }),
  s('revolution', 'Talkin\' \'Bout a Revolution', {
    summary: 'Judy lays out her plan to take Clouds back for the Mox and asks whether you are in.',
    tips: ['Stay away from Judy\'s apartment for a while after Ex-Factor; she messages you when she is ready.'],
    choice: { q: 'Do you join Judy\'s plan?', options: ['rv_help', 'rv_no'] },
  }),
  o('rv_help', 'Agree to help', 'revolution', 'side', { pick: 'Tell Judy you\'ll back her plan.', summary: 'You\'re in.', consequences: ['Pisces unlocks, and Judy\'s romance stays open.'] }),
  o('rv_no', 'Turn her down', 'revolution', 'side', { pick: 'Tell Judy you won\'t be part of it.', summary: 'Judy goes on without you.', consequences: ['Her questline stops here, unless you call her later and say you changed your mind.'] }),

  // River
  s('ifought', 'I Fought the Law', {
    summary: 'Elizabeth Peralez hires V to look into a murder the NCPD closed too quickly. You team up with detective River Ward.',
    tips: ['Unlocks after Life During Wartime once you have some Street Cred; Elizabeth calls you.', 'Finishing it opens both The Hunt (River) and Dream On (the Peralezes).', 'Letting River handle the Tyger Claws avoids a fight.'],
  }),

  // Kerry
  s('kerry2', 'Second Conflict', {
    summary: 'Track down Nancy, Samurai\'s old keyboardist, at a Maelstrom-run club, then bring her to the band\'s reunion.',
    tips: ['Who runs the club depends on The Pickup: Royce, Brick or Patricia. If you freed Brick, this goes peacefully.', 'Knock out or kill Dum Dum for a chance at the Doom Doom revolver. Once the job ends he is gone.'],
  }),
  s('kerry3', 'A Like Supreme → Boat Drinks', {
    summary: 'Help Kerry with a Samurai gig, a feud with the pop group Us Cracks, and an old score to settle. Romance option for a male-bodied V.',
    tips: ['The chain runs A Like Supreme, Rebel! Rebel!, I Don\'t Wanna Hear It, Off the Leash, then Boat Drinks.', 'Kerry stays in Night City; you can continue with him in The Sun or by returning to Earth in The Devil.'],
  }),
  s('everybreath', 'Every Breath You Take', {
    summary: 'Blue Moon from Us Cracks has a stalker. Find out who it is and keep her safe.',
    tips: ['Only after you get friendly with Us Cracks in Kerry\'s jobs.'],
  }),

  // Joshua
  s('sinnerman', 'Sinnerman', {
    summary: 'Wakako hires V to deal with Joshua Stephenson, a convicted killer on his way to meet his victim\'s family. Joshua has found religion and wants to make amends.',
    tips: ['Starts with a call from Wakako after Life During Wartime.', 'Keep your weapon holstered near the police car, and don\'t lose the patrol car.'],
    choice: { q: 'Do you see Joshua through, or end it?', options: ['sm_ride', 'sm_kill'] },
  }),
  o('sm_ride', 'Ride with Joshua', 'sinnerman', 'side', { pick: 'Get in the police car and agree to Joshua\'s job offer on the way.', summary: 'Joshua asks you to help with his last wish.', consequences: ['There Is a Light That Never Goes Out unlocks.'] }),
  o('sm_kill', 'Do Wakako\'s job', 'sinnerman', 'side', { pick: 'Kill Joshua, or decline his offer and get out of the car.', summary: 'You take Wakako\'s money and walk away.', consequences: ['Joshua\'s story ends here. There Is a Light That Never Goes Out never starts.'] }),

  // Delamain
  s('humannature', 'Human Nature → Tune Up', {
    summary: 'Get V\'s wrecked car back from the impound lot, then Delamain apologizes and fixes you up with a new ride.',
    tips: ['Starts with a call some time after Playing for Time.'],
  }),

  // Watson / city
  s('happy', 'Happy Together', {
    summary: 'Barry, V\'s neighbour and an NCPD officer, is grieving and the police are at his door. Help him, or don\'t.',
    tips: ['Find the officers outside apartment 0613, one floor below V. Barry won\'t open up at first; come back a few hours later.', 'Visit the columbarium in North Oak before your final talk with the officers.'],
    choice: { q: 'How do you handle Barry?', options: ['ht_help', 'ht_cold'] },
  }),
  o('ht_help', 'Listen and help', 'happy', 'side', { pick: 'Take the sympathetic lines with Barry, visit his friend\'s niche, then tell the officers to go see him themselves.', summary: 'Barry\'s colleagues reach out to him.', consequences: ['Barry is still there when you check on him later.'] }),
  o('ht_cold', 'Brush him off', 'happy', 'side', { pick: 'Be dismissive with Barry, or skip the visit and the talk with the officers.', summary: 'Barry is left on his own.', consequences: ['Barry may not make it. The job counts as failed.'] }),
  s('psycho', 'Psycho Killer', {
    summary: 'Regina Jones asks V to deal with every cyberpsycho in the city, ideally without killing them.',
    tips: ['Regina calls when you enter an area with a cyberpsycho.', 'Use fists, blunt weapons or non-lethal quickhacks; incapacitating all of them earns the better reward from Regina.'],
  }),
  s('beat', 'Beat on the Brat', {
    summary: 'Fist-fight your way through the champions of each district for a fixer, then take on the toughest fighter in the city.',
    tips: ['Fights are spread across Kabuki, Arroyo, Rancho Coronado, Pacifica and The Glen.', 'Weapons and some cyberware are not allowed; Gorilla Arms are.'],
  }),
  s('buck', 'The Ballad of Buck Ravers', {
    summary: 'Johnny wants a recording of an old Samurai show. Track it down in Kabuki\'s market.',
    tips: ['Start by approaching the busker at the Kabuki market.'],
  }),
  s('coin', 'Coin Operated Boy', {
    summary: 'Brendan, a surprisingly thoughtful vending machine near V\'s megabuilding, gets hauled away for repairs. Find out what happened to him.',
    tips: ['Talk to the vending machine at the base of the steps by Megabuilding H8 in Japantown.'],
  }),

  // Panam
  s('flyaway', 'I\'ll Fly Away', {
    summary: 'Mitch asks V to help give Scorpion a proper Aldecaldo send-off.',
    tips: ['Missable: finishing Queen of the Highway first, or starting With a Little Help from My Friends, locks it.', 'Mitch texts you while you are still in the Badlands.'],
    missable: true,
  }),

  // Afterlife
  s('spellbound', 'Spellbound → Kold Mirage', {
    summary: 'Nix wants a rare encrypted netrunning book from a fixer named R3n0. Buy it, steal it, or crack it yourself, then Nix sends you after more.',
    tips: ['Decrypting the book before handing it over gives a legendary crafting spec and starts Kold Mirage straight away.', 'Ask Nix to teach you something before handing over the book, or his shop closes until Kold Mirage.'],
  }),

  // Secrets
  s('fool', 'Fool on the Hill', {
    summary: 'Tarot cards are painted on walls all over Night City. Find and scan every one, then visit Misty.',
    tips: ['Starts when you scan your first tarot mural after The Heist.', 'The reward is Misty\'s dreamcatcher for your apartment and an achievement.'],
    secret: true,
  }),
  s('oddity', 'Space Oddity', {
    summary: 'Two drifters in Rancho Coronado found a military briefcase next to a body. Follow where it leads.',
    tips: ['Look for the drifters near the Piez fast travel point.', 'Ends with a fight against a Militech team and a valuable painting.'],
    secret: true,
  }),
  s('warpigs', 'War Pigs (Corpo only)', {
    summary: 'Frank, a former Arasaka colleague, calls V for help. He has his own plan to get Abernathy off his back.',
    tips: ['Corpo lifepath only. Frank calls after Transmission.', 'Talking to Frank earlier in the game helps you calm him down here.'],
    secret: true,
    choice: { q: 'How does it end with Frank?', options: ['wp_calm', 'wp_fight'] },
  }),
  o('wp_calm', 'Talk him down', 'warpigs', 'side', { pick: 'Keep your weapon down and talk him into starting over.', summary: 'Frank lowers his gun.', consequences: ['Frank lives and leaves to start over.'] }),
  o('wp_fight', 'Draw on him', 'warpigs', 'side', { pick: 'Aim at Frank, or answer coldly when he asks for help.', summary: 'It ends in violence.', consequences: ['Frank turns hostile or takes matters into his own hands.'] }),
  s('boots', 'These Boots Are Made for Walkin\' (Nomad only)', {
    summary: 'V\'s old Nomad car, written off long ago, turns up in a scrapyard, and someone else has claimed it.',
    tips: ['Nomad lifepath only. You get the GPS ping after Ghost Town.'],
    secret: true,
    choice: { q: 'Who keeps the car?', options: ['bt_give', 'bt_keep'] },
  }),
  o('bt_give', 'Let Lana have it', 'boots', 'side', { pick: 'Tell Lana she can keep it.', summary: 'You walk away from your old car.', consequences: ['XP and Street Cred, no car.'] }),
  o('bt_keep', 'Take it back', 'boots', 'side', { pick: 'Pay Lana for it, or insist it\'s yours.', summary: 'Your old car is yours again.', consequences: ['The car joins your garage if you pay.'] }),

  // ═════════════ PHANTOM LIBERTY SIDE JOBS ═════════════
  ps('pl_noeasy', 'No Easy Way Out', {
    summary: 'A boxing coach needs help with a fighter in Dogtown. Then someone wants the fight thrown.',
    tips: ['Arrives by text during Lucretia My Reflection.', 'Refuse the deal and you can loot the Cheetah pistol.'],
    choice: { q: 'Will Aaron throw the fight?', options: ['ne_cut', 'ne_refuse'] },
  }),
  o('ne_cut', 'Take the cut', 'pl_noeasy', 'pl', { pick: 'Accept Angie\'s offer (Corpo V can ask for more).', summary: 'You get a share of the bet.', consequences: ['Money for you; Aaron loses.'] }),
  o('ne_refuse', 'Refuse or threaten', 'pl_noeasy', 'pl', { pick: 'Turn Angie down, or threaten her.', summary: 'The fight stays clean.', consequences: ['Refusing starts a fight and drops the Cheetah pistol. A threat makes her back off.'] }),
  ps('pl_shot', 'Shot by Both Sides', {
    summary: 'Mr. Hands sends V to steal a scientist\'s research from a Dogtown lab. Someone else is after it too.',
    tips: ['Hands calls once you have met him in person. Part of it only works at night.'],
    choice: { q: 'Who do you back at the end?', options: ['sb_dante', 'sb_bree'] },
  }),
  o('sb_dante', 'Let Dante handle Bree', 'pl_shot', 'pl', { pick: 'Step aside and let Dante deal with Bree.', summary: 'The data goes where Hands wanted.', consequences: ['Bree is dealt with and the job closes cleanly.'] }),
  o('sb_bree', 'Defend Bree', 'pl_shot', 'pl', { pick: 'Side with Bree against Dante.', summary: 'Bree escapes with her research.', consequences: ['She sells it and vanishes. Militech sends hitmen after everyone involved, V included.'] }),
  ps('pl_dazed', 'Dazed and Confused', {
    summary: 'A braindance star has gone missing mid-shoot, and her tech is falling apart. Get her back on set.',
    tips: ['Hands texts after you meet him in person.', 'Scan the letter in the studio first: it unlocks the best outcome.', 'Tell Lina you found them "like this", or the job fails.'],
    choice: { q: 'How do you get through to Tool?', options: ['dz_sister', 'dz_clone', 'dz_letter'] },
  }),
  o('dz_sister', 'He\'s her brother', 'pl_dazed', 'pl', { pick: 'Convince Tool that Lina is his sister.', summary: 'Lina comes back.', consequences: ['Lina returns to work and the Baby Boomer can be picked up.'] }),
  o('dz_clone', 'He\'s a clone', 'pl_dazed', 'pl', { pick: 'Convince Tool he is a clone.', summary: 'Lina leaves for good.', consequences: ['Lina walks away from the studio.'] }),
  o('dz_letter', 'Read the letter', 'pl_dazed', 'pl', { pick: 'Have Lina read Tool\'s letter (needs the scan).', summary: 'Tool is restored.', consequences: ['The kindest ending, but Lina doesn\'t leave the Baby Boomer behind.'] }),
  ps('pl_balls', 'Balls to the Wall', {
    summary: 'Two locals, Paco and Babs, stole from the wrong convoy. Help them get out alive.',
    tips: ['Talk to them near the Golden Pacific fast travel point in Dogtown.'],
    choice: { q: 'How do you get them out?', options: ['bw_yuri', 'bw_friends'] },
  }),
  o('bw_yuri', 'Frame Yuri', 'pl_balls', 'pl', { pick: 'Pin the theft on Yuri.', summary: 'It goes badly.', consequences: ['Paco dies and you fight Yuri.'] }),
  o('bw_friends', 'Call in a favour', 'pl_balls', 'pl', { pick: 'Call friends from your past jobs for help.', summary: 'Your friends show up.', consequences: ['Both escape, and you get the Carmen iconic assault rifle.'] }),
  ps('pl_baby', 'Baby Let Me Take You', {
    summary: 'El Capitan wants his gear back from a cargo ship at the Arasaka docks.',
    tips: ['Unlocks after you bring El Capitan enough cars.'],
    choice: { q: 'Daniels or the cargo?', options: ['bl_save', 'bl_leave'] },
  }),
  o('bl_save', 'Save Daniels', 'pl_baby', 'pl', { pick: 'Go back for Daniels.', summary: 'Daniels lives.', consequences: ['Some of the equipment is damaged. You still get a new car.'] }),
  o('bl_leave', 'Leave him', 'pl_baby', 'pl', { pick: 'Keep going with the cargo.', summary: 'Daniels doesn\'t make it.', consequences: ['All the equipment arrives. You still get a new car.'] }),
  ps('pl_hands', 'Hi Ho Silver Lining → Run This Town', {
    summary: 'Finish every Mr. Hands gig in Dogtown and he invites you over, rewards you, then gives you one last job about who runs Dogtown.',
    tips: ['Gig choices pay off later: save Hasan in Prototype in the Scraper for Go Your Own Way, and spare Katya in Spy in the Jungle for Money for Nothing.', 'Bill texts after the Waiting for Dodger gig (New Person, Same Old Mistakes).'],
  }),
  ps('pl_tarot', 'Tomorrow Never Knows', {
    summary: 'Dogtown has its own tarot murals. Find and scan all four.',
    tips: ['Starts when you scan the first one.'],
    secret: true,
  }),

  // ═════════════ PHANTOM LIBERTY ═════════════
  p('pl_dog', 'Dog Eat Dog', { summary: 'Songbird pulls V into Dogtown to save the NUSA President from a crashed plane.', tips: ['Needs the Phantom Liberty expansion. Starts in Act 2.', 'To keep The Tower available, finish it before the rooftop.'] }),
  p('pl_mid', 'Hole in the Sky → Lucretia My Reflection', { summary: 'Hide the President, meet Solomon Reed and get into Kurt Hansen\'s gala.' }),
  p('pl_mid2', 'Get It Together → I\'ve Seen That Face Before', { summary: 'Recruit Alex, gather intel on Hansen and take the Cassel twins\' identities.' }),
  p('firestarter', 'Firestarter', {
    summary: 'Inside Hansen\'s stadium the truth about Songbird comes out. Reed and Songbird each promise V a cure, and you can only keep faith with one.',
    choice: { q: 'Who do you betray?', options: ['fs_reed', 'fs_song'] },
  }),
  o('fs_reed', 'Betray Reed', 'firestarter', 'pl', {
    pick: 'When the moment comes, signal Alex and escape with Songbird.',
    summary: 'You help Songbird get away.',
  }),
  o('fs_song', 'Betray Songbird', 'firestarter', 'pl', {
    pick: 'Let Reed\'s plan play out and stop Songbird from escaping.',
    summary: 'Songbird is captured by MaxTac; Alex dies.',
  }),
  p('killing', 'The Killing Moon', {
    summary: 'Get Songbird to the shuttle at the spaceport. Reed catches up with you at the very end.',
    choice: { q: 'What happens at the shuttle?', options: ['km_reed', 'km_moon'] },
  }),
  o('km_reed', 'Let Reed take her', 'killing', 'pl', {
    pick: 'Call Reed near the end, or let him take Songbird when he shows up.',
    summary: 'Songbird is handed over to the NUSA.',
  }),
  o('km_moon', 'Put her on the shuttle', 'killing', 'pl', {
    pick: 'Take Songbird to the shuttle and stand against Reed.',
    summary: 'Songbird escapes toward the Moon.',
  }),
  p('blacksteel', 'Black Steel in the Hour of Chaos → Somewhat Damaged', {
    summary: 'Track Songbird into Cynosure, a buried Militech facility, while a hunting robot stalks you.',
    choice: { q: 'What do you do when you find Songbird?', options: ['sd_spare', 'sd_kill'] },
  }),
  o('sd_spare', 'Spare her', 'blacksteel', 'pl', {
    pick: 'Refuse Songbird\'s request to end her life.',
    summary: 'Songbird is taken back alive.',
  }),
  o('sd_kill', 'Grant her wish', 'blacksteel', 'pl', {
    pick: 'Do as Songbird asks and end it.',
    summary: 'Songbird dies.',
  }),
  p('silence', 'Leave in Silence → Four Score and Seven', { summary: 'Hand Songbird over at the border and say goodbye to Reed.' }),
  p('reedoffer', 'Reed\'s offer: Who Wants to Live Forever', {
    summary: 'Reed calls: the NUSA can remove the Relic. You can accept now, or call him later from the rooftop.',
    tips: ['Accepting leads straight to The Tower and skips the base-game finale. Save first.'],
    choice: { q: 'Do you call Reed?', options: ['ro_accept', 'ro_later'] },
  }),
  o('ro_accept', 'Accept the cure now', 'reedoffer', 'pl', { pick: 'Call Reed and accept the procedure.', summary: 'V goes in for surgery.' }),
  o('ro_later', 'Not yet', 'reedoffer', 'pl', { pick: 'Hold off and carry on with Act 2.', summary: 'The offer stays open.' }),

  // ═════════════ ACT 3 ═════════════
  q('nocturne', 'Nocturne Op55N1', 'act3', {
    summary: 'Meet Hanako at Embers, then sit on Misty\'s rooftop with Johnny. This is the Point of No Return: who you call decides your ending.',
    tips: ['Make a manual save here and reload it to see every ending you have unlocked.', 'Secret: say nothing for about five minutes and Johnny offers an extra option.'],
    choice: { q: 'Who do you trust for the final run?', options: ['r_hanako', 'r_panam', 'r_rogue', 'r_secret', 'r_reed', 'r_end'] },
  }),
  o('r_hanako', 'Ask Hanako', 'nocturne', 'act3', { pick: 'Choose to go with Hanako and Arasaka.', summary: 'Work from inside Arasaka to take down Yorinobu.' }),
  o('r_panam', 'Ask Panam', 'nocturne', 'act3', { pick: 'Choose to call Panam and the Aldecaldos.', summary: 'The Aldecaldos hit Arasaka Tower with a stolen tank.', requires: ['queen'] }),
  o('r_rogue', 'Follow Johnny\'s plan', 'nocturne', 'act3', { pick: 'Let Johnny take over and ask Rogue for help.', summary: 'Johnny storms the tower with Rogue and her crew.', requires: ['blistering'] }),
  o('r_secret', 'Wait. Go in alone.', 'nocturne', 'act3', { pick: 'Don\'t choose anything for about five minutes, then accept Johnny\'s new option.', summary: 'V and Johnny walk in through the front door, alone.', requires: ['ch_yes'] }),
  o('r_reed', 'Call Reed', 'nocturne', 'act3', { pick: 'Choose to call Reed (only if you put off his offer).', summary: 'Take the NUSA\'s cure.', requires: ['ro_later'] }),
  o('r_end', 'Put it all to rest', 'nocturne', 'act3', { pick: 'Pick the first option, then choose to end things and throw the pills away.', summary: 'V refuses every path.' }),

  q('arasaka', 'Last Caress → Totalimmortal', 'act3', { summary: 'Hanako takes you to the Arasaka estate, then to the board meeting where Yorinobu makes his move.' }),
  q('mind', 'Where Is My Mind?', 'act3', {
    summary: 'V wakes on an Arasaka orbital station. Their body is failing, and Arasaka has an offer.',
    choice: { q: 'Do you sign Arasaka\'s contract?', options: ['wm_sign', 'wm_earth'] },
  }),
  o('wm_sign', 'Sign the contract', 'mind', 'act3', { pick: 'Sign: become an engram in Mikoshi and wait for a new body.', summary: 'V\'s mind is stored by Arasaka.' }),
  o('wm_earth', 'Go back to Earth', 'mind', 'act3', { pick: 'Refuse to sign and return to Earth.', summary: 'V goes home with months to live.' }),

  q('panamroute', 'We Gotta Live Together → Belly of the Beast', 'act3', { summary: 'Rally the Aldecaldos, break into Arasaka Tower, and face Adam Smasher.' }),
  q('rogueroute', 'For Whom the Bell Tolls → Knockin\' on Heaven\'s Door', 'act3', { summary: 'Johnny and Rogue raid Arasaka Tower with Weyland and the Afterlife crew.' }),
  q('reaper', '(Don\'t Fear) The Reaper', 'act3', { summary: 'A suicide run: V and Johnny alone against the whole tower.' }),

  q('mikoshi_p', 'Mikoshi (Panam route)', 'act3', {
    summary: 'Inside Mikoshi, Alt asks who keeps the body.',
    choice: { q: 'Who goes back to the body?', options: ['mp_v', 'mp_j'] },
  }),
  o('mp_v', 'V returns', 'mikoshi_p', 'act3', { pick: 'Choose to return to your own body as V.', summary: 'V takes their life back, for now.' }),
  o('mp_j', 'Johnny keeps it', 'mikoshi_p', 'act3', { pick: 'Let Johnny have the body and go with Alt.', summary: 'V crosses the Blackwall.' }),
  q('mikoshi_r', 'Mikoshi (Rogue or secret route)', 'act3', {
    summary: 'Inside Mikoshi, Alt asks who keeps the body.',
    choice: { q: 'Who goes back to the body?', options: ['mr_v', 'mr_j'] },
  }),
  o('mr_v', 'V returns', 'mikoshi_r', 'act3', { pick: 'Have Johnny give the body back to V.', summary: 'V takes their life back, for now.' }),
  o('mr_j', 'Johnny keeps it', 'mikoshi_r', 'act3', { pick: 'Let Johnny keep the body while V goes with Alt.', summary: 'V crosses the Blackwall.' }),
  p('changed', 'Things Done Changed', { summary: 'The procedure. V wakes up two years later, alive.' }),

  // ═════════════ ENDINGS ═════════════
  e('end_devil', 'The Devil', { summary: 'Arasaka route. On the orbital station V decides between becoming an engram and going home to die.', tips: ['Takemura only appears if you saved him in Search and Destroy.'] }),
  e('end_star', 'The Star', { summary: 'V leaves Night City with Panam and the Aldecaldos to search for a cure on the road.', tips: ['If you romanced Panam or Judy, they come with you.'] }),
  e('end_sun', 'The Sun', { summary: 'V becomes a legend of the Afterlife and takes a job on an orbital casino.', tips: ['On the secret route, Rogue is still alive to see it.'] }),
  e('end_temperance', 'Temperance', { summary: 'Johnny keeps the body and starts over somewhere new. V goes beyond the Blackwall with Alt.' }),
  e('end_tower', 'The Tower', { summary: 'Phantom Liberty. The Relic is removed. V lives, but can no longer run cyberware, and has to start an ordinary life.' }),
  e('end_rest', 'Path of Least Resistance', { summary: 'V ends their own story on the rooftop. Friends leave messages over the credits.' }),
];

const RAW_EDGES = [
  // prologue
  ['lp_nomad', 'rescue'], ['lp_street', 'rescue'], ['lp_corpo', 'rescue'],
  ['rescue', 'pickup'],
  ['pk_cash', 'information'], ['pk_clean', 'information'], ['pk_loud', 'information'],
  ['information', 'heist'],
  ['jk_family', 'playing'], ['jk_vik', 'playing'],

  // act 2 main
  ['playing', 'automatic'], ['au_spare', 'space'], ['au_kill', 'space'],
  ['space', 'mapt'], ['mapt', 'walkline'],
  ['vb_placide', 'transmission'], ['vb_netwatch', 'transmission'],
  ['playing', 'street'], ['street', 'parade'], ['oda_spare', 'search'], ['oda_kill', 'search'],
  ['playing', 'ghost'], ['ghost', 'lightning'], ['lightning', 'wartime'],
  ['transmission', 'nocturne'], ['tk_save', 'nocturne'], ['tk_leave', 'nocturne'], ['ldw_help', 'nocturne'], ['ldw_leave', 'nocturne'],

  // side jobs
  ['pk_loud', 'venus', 'side'],
  ['jk_family', 'heroes', 'side'], ['jk_vik', 'heroes', 'side'],
  ['playing', 'chippin', 'side'], ['ch_yes', 'blistering', 'side'], ['playing', 'tapeworm', 'side'],
  ['space', 'bothsides', 'side'], ['bothsides', 'exfactor', 'side'], ['ex_help', 'revolution', 'side'], ['ex_no', 'revolution', 'side'], ['rv_help', 'pisces', 'side'], ['pi_judy', 'pyramid', 'side'],
  ['ghost', 'riders', 'side'], ['riders', 'friends', 'side'], ['riders', 'flyaway', 'side'], ['wf_help', 'queen', 'side'],
  ['wartime', 'ifought', 'side'], ['ifought', 'hunt', 'side'], ['ifought', 'dream', 'side'],
  ['chippin', 'kerry', 'side'], ['kerry', 'kerry2', 'side'], ['kerry2', 'kerry3', 'side'], ['kerry3', 'everybreath', 'side'],
  ['playing', 'humannature', 'side'], ['humannature', 'epistrophy', 'side'], ['epistrophy', 'delamain', 'side'],
  ['wartime', 'sinnerman', 'side'], ['sm_ride', 'sinner', 'side'], ['playing', 'beast', 'side'],
  ['playing', 'happy', 'side'], ['playing', 'psycho', 'side'], ['playing', 'beat', 'side'], ['playing', 'buck', 'side'], ['playing', 'coin', 'side'],
  ['ghost', 'spellbound', 'side'],
  // secret and lifepath-only
  ['heist', 'fool', 'side'], ['playing', 'oddity', 'side'], ['transmission', 'warpigs', 'side'], ['ghost', 'boots', 'side'],

  // phantom liberty
  ['playing', 'pl_dog', 'side'], ['pl_dog', 'pl_mid'], ['pl_mid', 'pl_mid2'], ['pl_mid2', 'firestarter'],
  ['pl_dog', 'pl_balls', 'side'], ['pl_dog', 'pl_baby', 'side'], ['pl_dog', 'pl_tarot', 'side'], ['pl_mid', 'pl_noeasy', 'side'],
  ['pl_mid2', 'pl_shot', 'side'], ['pl_mid2', 'pl_dazed', 'side'], ['pl_mid2', 'pl_hands', 'side'],
  ['fs_reed', 'killing'], ['fs_song', 'blacksteel'],
  ['km_reed', 'reedoffer'], ['sd_spare', 'silence'], ['sd_kill', 'silence'], ['silence', 'reedoffer'],
  ['ro_accept', 'changed'], ['changed', 'end_tower'],

  // act 3
  ['r_hanako', 'arasaka'], ['arasaka', 'mind'], ['wm_sign', 'end_devil'], ['wm_earth', 'end_devil'],
  ['r_panam', 'panamroute'], ['panamroute', 'mikoshi_p'], ['mp_v', 'end_star'], ['mp_j', 'end_temperance'],
  ['r_rogue', 'rogueroute'], ['rogueroute', 'mikoshi_r'], ['r_secret', 'reaper'], ['reaper', 'mikoshi_r'],
  ['mr_v', 'end_sun'], ['mr_j', 'end_temperance'],
  ['r_reed', 'changed'],
  ['r_end', 'end_rest'],

  // requirements (dotted violet): "needs this"
  ['queen', 'r_panam', 'req'], ['ldw_help', 'flyaway', 'req'], ['blistering', 'r_rogue', 'req'], ['ch_yes', 'r_secret', 'req'], ['ro_later', 'r_reed', 'req'],

  // effects (dotted gold): "changes what happens there"
  ['tk_save', 'arasaka', 'effect'], ['tk_leave', 'arasaka', 'effect'], ['oda_spare', 'arasaka', 'effect'],
  ['vb_netwatch', 'transmission', 'effect'],
  ['au_spare', 'exfactor', 'effect'],
  ['pi_maiko', 'pyramid', 'effect'], ['pk_loud', 'kerry2', 'effect'], ['wf_saul', 'queen', 'effect'],
  ['ch_no', 'blistering', 'effect'],
  ['ldw_help', 'friends', 'effect'],
  ['pyramid', 'end_star', 'effect'], ['queen', 'end_star', 'effect'],
  ['km_moon', 'end_tower', 'effect'], ['sd_kill', 'end_tower', 'effect'],
];

export const EDGES = RAW_EDGES.map(([from, to, style]) => ({ from, to, style: style || 'main' }));
for (const n of NODES) {
  if (n.choice) for (const opt of n.choice.options) EDGES.push({ from: n.id, to: opt, style: 'choice' });
}

export const BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n]));

// Attach what each choice leads to (see outcomes.js). `consequences` keeps the
// plain sentences for the map cards and checklist.
for (const n of NODES) {
  if (n.kind !== 'option') continue;
  n.outcomes = [...(OUTCOMES[n.id] || [])].sort((a, b) => OUTCOME_KINDS[a.k].order - OUTCOME_KINDS[b.k].order);
  n.consequences = n.outcomes.map((x) => x.t);
  if (!n.outcomes.length) console.error('Choice with no outcomes', n.id);
}
for (const id of Object.keys(OUTCOMES)) if (!BY_ID[id]) console.error('Outcomes for unknown choice', id);

// Every outcome that names a quest also gets a dotted link on the map, unless
// the two are already connected. Ending outcomes are shown on the Endings tab
// instead, so they only draw a link when they lock something.
const linked = new Map(EDGES.map((ed) => [ed.from + '>' + ed.to, ed]));
for (const n of NODES) {
  for (const x of n.outcomes || []) {
    const had = linked.get(n.id + '>' + x.to);
    if (had && had.style === 'effect' && x.k === 'lock') had.style = 'lock';
    if (!x.to || x.k === 'ending' || had) continue;
    const style = x.k === 'lock' ? 'lock' : x.k === 'unlock' ? 'req' : 'effect';
    const ed = { from: n.id, to: x.to, style };
    EDGES.push(ed);
    linked.set(n.id + '>' + x.to, ed);
  }
}

// Sanity check during development: every edge must point at a real node.
for (const ed of EDGES) {
  if (!BY_ID[ed.from] || !BY_ID[ed.to]) console.error('Bad edge', ed);
}

export const EDGE_LABELS = {
  req: 'Needed to unlock',
  effect: 'Changes what happens',
  lock: 'Locks',
};

// ═════════════ ENDING RULES ═════════════
const done = (st, id) => st.done.has(id);
const picked = (st, choice, opt) => st.picks[choice] === opt;
const notPicked = (st, choice, opt) => st.picks[choice] && st.picks[choice] !== opt;

export const ENDINGS = [
  {
    id: 'end_devil', route: 'Rooftop: ask Hanako',
    reqs: [
      { label: 'Always available on the rooftop', test: () => true },
      { label: 'Save Takemura in Search and Destroy (for the full ending and achievement)', node: 'search', test: (st) => picked(st, 'search', 'tk_save'), optional: true },
    ],
  },
  {
    id: 'end_star', route: 'Rooftop: ask Panam → Mikoshi: V returns',
    blockedBy: (st) => picked(st, 'friends', 'wf_saul') || picked(st, 'mikoshi_p', 'mp_j'),
    reqs: [
      { label: 'Don\'t tell Saul about Panam\'s plan', node: 'friends', test: (st) => picked(st, 'friends', 'wf_help') },
      { label: 'Finish Queen of the Highway', node: 'queen', test: (st) => done(st, 'queen') },
      { label: 'In Mikoshi, V returns', node: 'mikoshi_p', soft: true, test: (st) => picked(st, 'mikoshi_p', 'mp_v') },
    ],
  },
  {
    id: 'end_sun', route: 'Rooftop: Johnny\'s plan or wait → Mikoshi: V returns',
    blockedBy: (st) => picked(st, 'chippin', 'ch_no') || picked(st, 'mikoshi_r', 'mr_j'),
    reqs: [
      { label: 'Give Johnny a second chance in Chippin\' In', node: 'chippin', test: (st) => picked(st, 'chippin', 'ch_yes') },
      { label: 'Finish Blistering Love (or take the secret route)', node: 'blistering', test: (st) => done(st, 'blistering') || picked(st, 'nocturne', 'r_secret') },
      { label: 'In Mikoshi, V returns', node: 'mikoshi_r', soft: true, test: (st) => picked(st, 'mikoshi_r', 'mr_v') },
    ],
  },
  {
    id: 'end_temperance', route: 'Panam, Rogue or secret route → Mikoshi: Johnny keeps the body',
    blockedBy: (st) => notPicked(st, 'mikoshi_p', 'mp_j') && notPicked(st, 'mikoshi_r', 'mr_j'),
    reqs: [
      { label: 'Unlock Panam\'s or Rogue\'s route (or the secret one)', test: (st) => done(st, 'queen') || done(st, 'blistering') || picked(st, 'chippin', 'ch_yes') },
      { label: 'In Mikoshi, let Johnny keep the body', soft: true, node: 'mikoshi_p', test: (st) => picked(st, 'mikoshi_p', 'mp_j') || picked(st, 'mikoshi_r', 'mr_j') },
    ],
  },
  {
    id: 'end_tower', route: 'Phantom Liberty → accept Reed\'s offer',
    blockedBy: (st) => picked(st, 'killing', 'km_moon') || picked(st, 'blacksteel', 'sd_kill'),
    reqs: [
      { label: 'Own Phantom Liberty and finish Firestarter', node: 'firestarter', test: (st) => done(st, 'firestarter') },
      { label: 'Songbird reaches the NUSA alive', test: (st) => picked(st, 'killing', 'km_reed') || picked(st, 'blacksteel', 'sd_spare'), hint: 'Let Reed take her at the shuttle, or spare her in Cynosure.' },
      { label: 'Accept Reed\'s offer, now or from the rooftop', node: 'reedoffer', soft: true, test: (st) => picked(st, 'reedoffer', 'ro_accept') || picked(st, 'nocturne', 'r_reed') },
    ],
  },
  {
    id: 'end_rest', route: 'Rooftop: refuse every option',
    reqs: [{ label: 'Always available on the rooftop', test: () => true }],
  },
];

export const SECRET = {
  title: '(Don\'t Fear) The Reaper',
  summary: 'The secret route: V and Johnny storm Arasaka Tower alone. It leads to The Sun or Temperance, and Rogue survives.',
  reqs: [
    { label: 'Give Johnny a second chance in Chippin\' In', node: 'chippin', test: (st) => picked(st, 'chippin', 'ch_yes') },
    { label: 'On the rooftop, wait about 5 minutes without choosing', manual: 'waited' },
    { label: 'Be ready: there are no retries', manual: 'ready' },
  ],
};
