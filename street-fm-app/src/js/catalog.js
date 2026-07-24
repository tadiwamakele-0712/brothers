export const ARTIST = 'Joker Di Genius';

export const TRACKS = [
  { id: 'ndafunga', file: 'honey-bee-joker-ndafunga.mp3', title: 'Ndafunga', artist: 'Honey Bee & Joker Di Genius', genre: 'Zimdancehall' },
  { id: 'electric-fish', file: 'honey-bee-ft-joker-di_electric-fish.mp3', title: 'Electric Fish', artist: 'Honey Bee ft Joker Di Genius', genre: 'Zimdancehall' },
  { id: 'rolling', file: 'honey-bee-ft-shellaz-joker-di-genius---rolling-prod-by-ksg-d.mp3', title: 'Rolling', artist: 'Honey Bee ft Shellaz & Joker Di Genius', genre: 'Zimdancehall' },
  { id: 'dance-around', file: 'joker-di-genius-x-honey-bee-dance-around.mp3', title: 'Dance Around', artist: 'Joker Di Genius x Honey Bee', genre: 'Zimdancehall' },
  { id: 'ndichifa', file: 'joker-di-genius-x-honey-bee_ndichifa.wav', title: 'Ndichifa', artist: 'Joker Di Genius x Honey Bee', genre: 'Zimdancehall' },
  { id: 'never-easy', file: 'joker-di-genius-never-easy-master.mp3', title: 'Never Easy', artist: 'Joker Di Genius', genre: 'Zimdancehall' },
  { id: 'zvikuzikanwa', file: 'joker-di-genius-zvikuzikanwa.mp3', title: 'Zvikuzikanwa', artist: 'Joker Di Genius', genre: 'Zimdancehall' },
  { id: 'father-god', file: 'joker-digenius-father-god.mp3', title: 'Father God', artist: 'Joker Di Genius', genre: 'Gospel / Dancehall' },
  { id: 'type-yako', file: 'joker-di-genius_cella_type-yako-feat-joker-di-genius-prod-by.mp3', title: 'Type Yako', artist: 'Cella feat Joker Di Genius', genre: 'Zimdancehall' },
  { id: 'number-one', file: 'joker-di-genius_f_i_o_ft_joker_di_genius_number_one.mp3', title: 'Number One', artist: 'F.I.O ft Joker Di Genius', genre: 'Zimdancehall' },
  { id: 'i-cry', file: 'joker-di-genius_jocker-di-genius-i-cry-tribute-to-di-apprent.mp3', title: 'I Cry (Tribute)', artist: 'Joker Di Genius', genre: 'Tribute' },
  { id: 'gwan-talk', file: 'joker-di-genius_joker-d-genius-gwan-talk.mp3', title: 'Gwan Talk', artist: 'Joker Di Genius', genre: 'Zimdancehall' },
  { id: 'levels', file: 'joker-di-genius_joker-di-genius-ft-mazhambe-jnr-king-mafaro-.mp3', title: 'Levels', artist: 'Joker Di Genius ft Mazhambe Jnr & King Mafaro', genre: 'Zimdancehall' },
  { id: 'gel-dem', file: 'joker-di-genius_joker-di-genius-gel-dem-want-me-prod-by-x-fe.mp3', title: 'Gel Dem Want Me', artist: 'Joker Di Genius', genre: 'Zimdancehall' },
  { id: 'tiri-kutyisa', file: 'joker-di-genius_joker-di-genius-h-t-f-da-shocca-tiri-kutyisa.mp3', title: 'Tiri Kutyisa', artist: 'Joker Di Genius ft H.T.F Da Shocca', genre: 'Zimdancehall' },
  { id: 'money-friend', file: 'joker-di-genius_joker-di-genius-money-friend.mp3', title: 'Money Friend', artist: 'Joker Di Genius', genre: 'Zimdancehall' },
  { id: 'nuh-new-friend', file: 'joker-di-genius_joker-di-genius-nuh-new-friend.mp3', title: 'Nuh New Friend', artist: 'Joker Di Genius', genre: 'Zimdancehall' },
  { id: 'usade-kundisaiza', file: 'joker-di-genius_joker-di-genius-usade-kundisaiza-password-ri.mp3', title: 'Usade Kundisaiza', artist: 'Joker Di Genius', genre: 'Password Riddim' },
  { id: 'real-champion', file: 'joker-di-genius_joker-real-champion-champion-taks-riddim-pro.mp3', title: 'Real Champion', artist: 'Joker Di Genius', genre: 'Champion Taks Riddim' },
  { id: 'tichaitasei', file: 'joker-di-genius_petitions-riddim_jocker-di-genius_tichaitase.mp3', title: 'Tichaitasei', artist: 'Joker Di Genius', genre: 'Petitions Riddim' },
  { id: 'handimire-ngoma', file: 'joker-di-genius_softaz-ft-joker-di-genius-ghetto-jnr-handimi.mp3', title: 'Handimire Ngoma', artist: 'Softaz ft Joker Di Genius & Ghetto Jnr', genre: 'Password Riddim' },
].map((t) => ({
  ...t,
  src: `./public/music/${t.file}`,
  cover: './public/logo.jpeg',
}));

export const VIDEOS = [
  {
    id: 'v1',
    title: 'Street FM Live Session',
    artist: 'Joker Di Genius',
    thumb: './public/logo.jpeg',
    src: 'https://www.youtube.com/embed/jfKfPfyJRdk',
    kind: 'embed',
    blurb: 'Live vibes — swap embeds in Admin.',
  },
  {
    id: 'v2',
    title: 'Behind the Riddim',
    artist: 'Street FM Studio',
    thumb: './public/logo.jpeg',
    src: 'https://www.youtube.com/embed/5qap5aO4i9A',
    kind: 'embed',
    blurb: 'Studio energy and freestyle heat.',
  },
];

export const PRODUCTS = [
  { id: 'p1', name: 'Street FM Tee', price: 25, category: 'merch', image: './public/logo.jpeg', blurb: 'Orange banner tee — street certified.' },
  { id: 'p2', name: 'Vinyl Sticker Pack', price: 8, category: 'merch', image: './public/logo.jpeg', blurb: 'Equalizer skyline stickers for your ride.' },
  { id: 'p3', name: 'Never Easy (Digital)', price: 1.5, category: 'music', trackId: 'never-easy', image: './public/logo.jpeg', blurb: 'Instant download of Never Easy.' },
  { id: 'p4', name: 'Father God (Digital)', price: 1.5, category: 'music', trackId: 'father-god', image: './public/logo.jpeg', blurb: 'Gospel heat — digital single.' },
  { id: 'p5', name: 'Street FM Cap', price: 18, category: 'merch', image: './public/logo.jpeg', blurb: 'Black cap with gold vinyl mark.' },
  { id: 'p6', name: 'Full Catalog Bundle', price: 12, category: 'music', image: './public/logo.jpeg', blurb: 'All Street FM joker-music tracks.' },
];

export const EMOJIS = ['🔥', '❤️', '💃', '🙌', '🎧', '🇯🇲', '🇿🇼', '👑', '💥', '😂'];

export const SFX = [
  { id: 'airhorn', label: 'Airhorn', kind: 'airhorn' },
  { id: 'drop', label: 'Bass Drop', kind: 'drop' },
  { id: 'siren', label: 'Siren', kind: 'siren' },
  { id: 'clap', label: 'Clap', kind: 'clap' },
  { id: 'whoosh', label: 'Whoosh', kind: 'whoosh' },
  { id: 'riser', label: 'Riser', kind: 'riser' },
];
