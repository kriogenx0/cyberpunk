// Optional objectives inside missions and what doing (or skipping) them changes.
// impact: 'story' (changes later quests/characters), 'loot' (gear or money), 'none' (no lasting effect)
// Written in our own words.

export const OPTIONALS = {
  pickup: [
    { id: 'pk_meet', task: 'Meet Militech agent Meredith Stout', impact: 'story',
      effect: 'Opens the credchip options for paying Maelstrom. If Maelstrom later turns hostile, Stout waits at the gate, which leads to Venus in Furs. Skip her and you can only pay with your own money or fight.' },
    { id: 'pk_virus', task: 'Remove the virus from Stout\'s chip (Corpo)', impact: 'story',
      effect: 'Lets you pay with Militech\'s money without triggering the trap. Maelstrom stays calm, then Militech raids the plant.' },
    { id: 'pk_brick', task: 'Free Brick from his cell', impact: 'story',
      effect: 'Only matters if Royce dies: Brick takes Maelstrom back and stays friendly. If Royce lives, Brick never comes up again.' },
  ],
  heist: [
    { id: 'hs_cut', task: 'Push Dex for a bigger cut', impact: 'loot',
      effect: 'Raise your share from 30% to 35% or 40% with the right arguments. Only affects the money.' },
    { id: 'hs_av', task: 'Check Saburo\'s AV on the landing pad', impact: 'loot',
      effect: 'The Satori katana is inside. Skip it and it\'s gone.' },
    { id: 'hs_kongou', task: 'Search Yorinobu\'s bedroom', impact: 'loot',
      effect: 'The Kongou pistol sits at the foot of the bed. Missable, though Herold Lowe sells it later with Phantom Liberty.' },
  ],
  automatic: [
    { id: 'al_vip', task: 'Get a VIP card or talk your way upstairs', impact: 'none',
      effect: 'Just a quieter route through Clouds. No lasting effect.' },
  ],
  space: [
    { id: 'dp_scavs', task: 'Clear the scavengers yourself (or wait for Judy\'s distraction)', impact: 'none',
      effect: 'Either way works. No lasting effect.' },
  ],
  ghost: [
    { id: 'gt_nash', task: 'Help Panam take out Nash', impact: 'loot',
      effect: 'You get Nash\'s Widow Maker rifle now. If you hold back, he survives and drops it later in Queen of the Highway.' },
  ],
  search: [
    { id: 'sd_take', task: 'Try to save Takemura', impact: 'story',
      effect: 'The single biggest optional objective in the game. See the decision: it decides whether Takemura lives for the Arasaka ending.' },
  ],
  wartime: [
    { id: 'ldw_drone', task: 'Scout with the drone before going in', impact: 'none',
      effect: 'Marks enemies and survivors. Convenience only.' },
  ],
  friends: [
    { id: 'wf_tell', task: 'Tell Saul about Panam\'s plan', impact: 'story',
      effect: 'A hidden betrayal. It ends things with Panam and locks Queen of the Highway, and with it The Star.' },
  ],
  hunt: [
    { id: 'ht_clues', task: 'Gather every clue before choosing the farm', impact: 'none',
      effect: 'With enough clues River names the right farm. Guess wrong and you just make an extra trip first.' },
  ],
  tapeworm: [
    { id: 'tw_pills', task: 'Skip the omega blockers and talk to Johnny', impact: 'story',
      effect: 'Taking the blockers mutes Johnny for a while. Talking to him instead is how you get to know him, which feeds into the relationship the Rogue and secret routes rely on.' },
  ],
  killing: [
    { id: 'km_case', task: 'Pick up the suitcase from Songbird\'s contact', impact: 'none',
      effect: 'Gives you a disguise and an easier, quieter route into the spaceport.' },
  ],
  nocturne: [
    { id: 'nc_wait', task: 'Wait on the rooftop without choosing', impact: 'story',
      effect: 'After about five minutes Johnny offers the secret route, if you gave him a second chance in Chippin\' In.' },
  ],
};
