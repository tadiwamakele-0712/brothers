const tracks = [
  {
    title: "Never Easy",
    artist: "Joker Di Genius",
    file: "muzik/Joker Di Genius-Never Easy Master.mp3",
  },
  {
    title: "Father God",
    artist: "Joker Di Genius",
    file: "muzik/JOKER diGENIUS-FATHER GOD.mp3",
  },
  {
    title: "Zvikuzikanwa",
    artist: "Joker Di Genius",
    file: "muzik/Joker Di Genius-Zvikuzikanwa .mp3",
  },
  {
    title: "Ndichifa",
    artist: "Joker Di Genius x Honey Bee",
    file: "muzik/Joker Di Genius x Honey Bee_Ndichifa.wav",
  },
  {
    title: "Dance Around",
    artist: "Joker Di Genius x Honey Bee",
    file: "muzik/Joker Di Genius x Honey Bee-Dance around .mp3",
  },
  {
    title: "Electric Fish",
    artist: "Honey Bee ft. Joker Di Genius",
    file: "muzik/Honey Bee ft Joker Di_Electric fish .mp3",
  },
  {
    title: "Ndafunga",
    artist: "Honey Bee & Joker Di Genius",
    file: "muzik/Honey bee & joker-ndafunga.mp3",
  },
  {
    title: "Rolling",
    artist: "Honey Bee ft. Shellaz & Joker Di Genius",
    file: "muzik/Honey Bee ft Shellaz & Joker Di Genius - Rolling(Prod By KSG Di Don).mp3",
  },
  {
    title: "Gwan Talk",
    artist: "Joker Di Genius",
    file: "muzik/joker-di-genius_joker-d-genius-gwan-talk.mp3",
  },
  {
    title: "Money Friend",
    artist: "Joker Di Genius",
    file: "muzik/joker-di-genius_joker-di-genius-money-friend.mp3",
  },
  {
    title: "Nuh New Friend",
    artist: "Joker Di Genius",
    file: "muzik/joker-di-genius_joker-di-genius-nuh-new-friend.mp3",
  },
  {
    title: "Real Champion",
    artist: "Joker Di Genius",
    file: "muzik/joker-di-genius_joker-real-champion-champion-taks-riddim-pro-by-kutso-warrior-music (1).mp3",
  },
  {
    title: "Levels",
    artist: "Joker Di Genius ft. Mazhambe Jnr & King Mafaro",
    file: "muzik/joker-di-genius_joker-di-genius-ft-mazhambe-jnr-king-mafaro-madlevel-riddim-levels-chillspot-n-legendary-music-prod.mp3",
  },
  {
    title: "Gel Dem Want Me",
    artist: "Joker Di Genius",
    file: "muzik/joker-di-genius_joker-di-genius-gel-dem-want-me-prod-by-x-fecta.mp3",
  },
  {
    title: "Tiri Kutyisa",
    artist: "Joker Di Genius ft. H.T.F Da Shocca",
    file: "muzik/joker-di-genius_joker-di-genius-h-t-f-da-shocca-tiri-kutyisa__prod-by-trinnie-beatz-angeo-pablo-_zayaan-empire-records (1).mp3",
  },
  {
    title: "Usade Kundisaiza",
    artist: "Joker Di Genius",
    file: "muzik/joker-di-genius_joker-di-genius-usade-kundisaiza-password-riddim-prod-by-kutso (1).mp3",
  },
  {
    title: "Tichaitasei",
    artist: "Joker Di Genius",
    file: "muzik/joker-di-genius_petitions-riddim_jocker-di-genius_tichaitasei_prod-by-jeeperz-jmp-0774695719.mp3",
  },
  {
    title: "I Cry (Tribute to Di Apprentice)",
    artist: "Joker Di Genius",
    file: "muzik/joker-di-genius_jocker-di-genius-i-cry-tribute-to-di-apprentice.mp3",
  },
  {
    title: "Type Yako",
    artist: "Cella ft. Joker Di Genius",
    file: "muzik/joker-di-genius_cella_type-yako-feat-joker-di-genius-prod-by-x-fecta-for-soundmindz.mp3",
  },
  {
    title: "Number One",
    artist: "F.I.O ft. Joker Di Genius",
    file: "muzik/joker-di-genius_f_i_o_ft_joker_di_genius_number_one.mp3",
  },
  {
    title: "Handimire Ngoma",
    artist: "Softaz ft. Joker Di Genius & Ghetto Jnr",
    file: "muzik/joker-di-genius_softaz-ft-joker-di-genius-ghetto-jnr-handimire-ngoma-password-riddim-prod-by-kutso.mp3",
  },
];

const trackList = document.getElementById("track-list");
const audio = document.getElementById("audio-player");
const nowPlaying = document.getElementById("now-playing");
const npTitle = document.getElementById("np-title");
const npArtist = document.getElementById("np-artist");
const year = document.getElementById("year");
const navToggle = document.getElementById("nav-toggle");
const siteNav = document.getElementById("site-nav");

if (year) year.textContent = String(new Date().getFullYear());

let activeIndex = -1;

function renderTracks() {
  if (!trackList) return;
  trackList.innerHTML = tracks
    .map(
      (track, index) => `
      <button class="track" type="button" data-index="${index}" role="listitem" aria-label="Play ${track.title}">
        <span class="track-num">${String(index + 1).padStart(2, "0")}</span>
        <span class="track-meta">
          <strong>${track.title}</strong>
          <span>${track.artist}</span>
        </span>
        <span class="track-play">Play</span>
      </button>`
    )
    .join("");
}

function setActiveTrack(index) {
  const buttons = trackList?.querySelectorAll(".track") || [];
  buttons.forEach((btn, i) => {
    const isActive = i === index;
    btn.classList.toggle("is-active", isActive);
    const label = btn.querySelector(".track-play");
    if (label) label.textContent = isActive ? "Playing" : "Play";
  });
}

function playTrack(index) {
  const track = tracks[index];
  if (!track || !audio) return;

  activeIndex = index;
  audio.src = encodeURI(track.file);
  npTitle.textContent = track.title;
  npArtist.textContent = track.artist;
  nowPlaying.hidden = false;
  setActiveTrack(index);

  const playPromise = audio.play();
  if (playPromise) {
    playPromise.catch(() => {
      /* Autoplay may be blocked until user gesture completes; src is still set. */
    });
  }
}

trackList?.addEventListener("click", (event) => {
  const button = event.target.closest(".track");
  if (!button) return;
  const index = Number(button.dataset.index);
  if (Number.isNaN(index)) return;
  playTrack(index);
});

audio?.addEventListener("ended", () => {
  const next = activeIndex + 1;
  if (next < tracks.length) playTrack(next);
});

navToggle?.addEventListener("click", () => {
  const open = siteNav?.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open menu");
  });
});

const revealTargets = document.querySelectorAll(
  ".section-head, .about-grid, .track-list, .video-grid, .photo-grid, .career-grid, .press-feature, .reviews, .social-grid, .booking-panel"
);

revealTargets.forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

revealTargets.forEach((el) => observer.observe(el));

renderTracks();
