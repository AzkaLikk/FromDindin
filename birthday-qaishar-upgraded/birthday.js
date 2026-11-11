// =============================================
// PENGATURAN MUDAH — ubah bagian ini saja
// =============================================
const CONFIG = {
  nickname: "Qaishar",
  fullName: "Muhammad Qaishar Al Gibran",
  // Taruh lagu di folder music, lalu samakan nama file di bawah.
  // Contoh: "music/backsound.mp3" atau "music/lagu-favorit.ogg"
  musicFile: "music/backsound.mp3",
  musicVolume: 0.35
};

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector) => document.querySelector(selector);
  const opening = $("#opening");
  const bookScene = $("#book-scene");
  const website = $("#website");
  const begin = $("#begin");
  const book = $("#book");
  const music = $("#background-music");
  const musicToggle = $("#music-toggle");
  const musicLabel = $("#music-label");

  // Nama utama bisa diganti dari CONFIG di atas.
  $("#opening-name").textContent = CONFIG.fullName;
  $("#book-name").textContent = CONFIG.nickname;
  $("#profile-button").textContent = CONFIG.nickname;
  $("#profile-text").textContent = CONFIG.fullName;
  music.volume = Math.max(0, Math.min(1, CONFIG.musicVolume));

  // Jika nama file musik diubah di CONFIG, gunakan file tersebut.
  if (CONFIG.musicFile) {
    music.innerHTML = "";
    const source = document.createElement("source");
    source.src = CONFIG.musicFile;
    source.type = CONFIG.musicFile.toLowerCase().endsWith(".ogg") ? "audio/ogg" : "audio/mpeg";
    music.appendChild(source);
    music.load();
  }

  begin.addEventListener("click", () => {
    opening.style.display = "none";
    bookScene.classList.add("show");
    window.setTimeout(() => book.classList.add("open"), 180);
    // Browser perlu interaksi pengguna dulu untuk mengizinkan audio.
    tryPlayMusic();
    window.setTimeout(() => {
      bookScene.classList.remove("show");
      website.classList.add("visible");
      window.scrollTo({ top: 0, behavior: "instant" });
      revealObserver.observeAll?.();
    }, 1750);
  });

  async function tryPlayMusic() {
    try {
      await music.play();
      setMusicState(true);
    } catch (error) {
      setMusicState(false);
      musicLabel.textContent = "Play music";
    }
  }
  function setMusicState(playing) {
    musicToggle.classList.toggle("playing", playing);
    musicToggle.setAttribute("aria-pressed", String(playing));
    musicLabel.textContent = playing ? "Pause music" : "Play music";
  }
  musicToggle.addEventListener("click", async () => {
    if (music.paused) {
      try { await music.play(); setMusicState(true); }
      catch (error) {
        setMusicState(false);
        alert("Musik belum bisa diputar. Pastikan file lagu ada di folder music dan namanya sesuai pengaturan CONFIG di birthday.js.");
      }
    } else {
      music.pause();
      setMusicState(false);
    }
  });
  music.addEventListener("ended", () => setMusicState(false));
  music.addEventListener("pause", () => setMusicState(false));
  music.addEventListener("play", () => setMusicState(true));

  // Kotak hadiah
  const giftButton = $("#gift-button");
  const giftHint = $("#gift-hint");
  const birthdayCard = $("#birthday-card");
  const balloons = $("#balloons");
  giftButton.addEventListener("click", () => {
    const isOpen = giftButton.classList.toggle("open");
    giftButton.setAttribute("aria-expanded", String(isOpen));
    birthdayCard.classList.toggle("show", isOpen);
    giftHint.textContent = isOpen ? "Your little wish is here ✦" : "Tap the gift to open it ✦";
    if (isOpen) launchBalloons();
    else balloons.replaceChildren();
  });

  function launchBalloons() {
    balloons.replaceChildren();
    const colors = ["#e88ca0", "#e8c98d", "#8eb9d8", "#b69bd8", "#a7cda9"];
    for (let i = 0; i < 12; i++) {
      const balloon = document.createElement("span");
      balloon.className = "balloon";
      balloon.style.left = `${5 + Math.random() * 90}%`;
      balloon.style.background = colors[i % colors.length];
      balloon.style.animationDelay = `${Math.random() * 1.5}s`;
      balloons.appendChild(balloon);
    }
  }

  // Dialog profil dan foto besar
  const profileDialog = $("#profile-dialog");
  $("#profile-button").addEventListener("click", () => profileDialog.showModal());
  document.querySelectorAll("[data-close]").forEach(button => {
    button.addEventListener("click", () => {
      const dialog = document.getElementById(button.dataset.close);
      if (dialog?.open) dialog.close();
    });
  });
  [profileDialog, $("#photo-dialog")].forEach(dialog => {
    dialog.addEventListener("click", event => {
      if (event.target === dialog) dialog.close();
    });
  });
  const photoDialog = $("#photo-dialog");
  const largePhoto = $("#large-photo");
  document.querySelectorAll(".gallery-card").forEach(card => {
    card.addEventListener("click", () => {
      const image = card.querySelector("img");
      largePhoto.src = image.src;
      largePhoto.alt = image.alt;
      photoDialog.showModal();
    });
  });

  // Animasi saat bagian halaman masuk layar.
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));
});
