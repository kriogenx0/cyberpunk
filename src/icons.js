// Original line-art weapon class icons (64×32 viewBox, stroked with currentColor).

export const WEAPON_CLASSES = {
  pistol: {
    label: 'Pistols',
    d: 'M6 9H42V15H23L20 26H11L14 15H6Z M23 15Q25 20 21 21 M42 11H46',
  },
  revolver: {
    label: 'Revolvers',
    d: 'M4 10H42V14H4Z M19 8H31V18H19Z M22 13H28 M19 18L15 27H9L13 16 M42 12H46',
  },
  smg: {
    label: 'SMGs',
    d: 'M8 9H48V15H35V25H30V15H23L21 23H15L17 15H8Z M8 12H2V18 M48 12H53',
  },
  ar: {
    label: 'Assault Rifles',
    d: 'M2 11L13 9H52V14H38V23H33V14H25L22 22H16L18 15L2 17Z M52 11.5H62 M28 9V6H40V9',
  },
  lmg: {
    label: 'LMGs',
    d: 'M2 11L13 9H52V14H25L22 22H16L18 15L2 17Z M52 11.5H62 M30 14H42V24H30Z M56 14L52 26 M56 14L60 26',
  },
  shotgun: {
    label: 'Shotguns',
    d: 'M2 13L14 11H60V15H22L18 22H12L15 16L2 18Z M32 15H46V19H32Z',
  },
  sniper: {
    label: 'Sniper & Precision',
    d: 'M2 15L13 13H62V16H25L22 23H16L18 17L2 20Z M26 6H42V11H26Z M30 11V13 M38 11V13',
  },
  katana: {
    label: 'Blades',
    d: 'M17 22Q38 17 61 4 M17 22L15 24 M13 18L19 27 M3 28L14 24',
  },
  knife: {
    label: 'Knives',
    d: 'M6 18H24V23H6Z M24 17H52Q47 25 24 23Z M28 20H44',
  },
  blunt: {
    label: 'Blunt',
    d: 'M4 26L8 29L57 12L53 5Z M10 24L14 27',
  },
  hammer: {
    label: 'Hammers',
    d: 'M10 29L39 9 M33 2L52 13L47 19L28 8Z',
  },
};

const TYPE_TO_CLASS = {
  Pistol: 'pistol',
  Revolver: 'revolver',
  'Submachine Gun': 'smg',
  'Assault Rifle': 'ar',
  'Light Machine Gun': 'lmg',
  Shotgun: 'shotgun',
  'Double-Barrel Shotgun': 'shotgun',
  'Sniper Rifle': 'sniper',
  'Precision Rifle': 'sniper',
  Katana: 'katana',
  Sword: 'katana',
  Machete: 'katana',
  Chainsword: 'katana',
  Knife: 'knife',
  Axe: 'knife',
  'One-Handed Club': 'blunt',
  'Two-Handed Club': 'blunt',
  Hammer: 'hammer',
};

export function weaponClass(type) {
  return TYPE_TO_CLASS[type] || 'blunt';
}

export function weaponIcon(cls, extraClass = '') {
  const c = WEAPON_CLASSES[cls];
  return `<svg class="wicon ${extraClass}" viewBox="0 0 64 32" aria-hidden="true"><path d="${c.d}"/></svg>`;
}
