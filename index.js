// Checking LocalStorage
document.addEventListener("DOMContentLoaded", () => {
  favSuwar = JSON.parse(localStorage.getItem("favorites")) || [];
  if (favSuwar.length > 0) {
    favDiv.innerHTML = "";
    favSuwar.forEach((surahName) => {
      let matchedSurah = suwar.find((s) => s.name === surahName);
      if (matchedSurah) {
        let div = document.createElement("div");
        let aud = document.createElement("audio");
        let source = document.createElement("source");
        let title = document.createElement("h2");
        title.textContent = matchedSurah.name;
        aud.controls = true;
        aud.appendChild(source);
        source.src = matchedSurah.file;
        source.setAttribute("type", "audio/mpeg");
        favDiv.appendChild(div);
        div.appendChild(aud);
        div.appendChild(title);
        div.setAttribute("data-name", `${matchedSurah.name}`);
        div.setAttribute("class", `favorites`);
        fav.classList.add("checked");
        fav.classList.remove("fa-regular");
        fav.classList.add("fa-solid");
        faVed = true;
      }
    });
  }
});

// BUTTON FOR THE QURAN PLAYER
const play = document.getElementById("play");
const preview = document.getElementById("preview");
const next = document.getElementById("next");
const progress = document.getElementById("progress");
const loop = document.getElementById("loop");
const shuffle = document.getElementById("shuffle");
const downloader = document.getElementById("download");
const yes = document.getElementById("yes");
const no = document.getElementById("no");
const favorite = document.getElementById("fav");
const heart = document.getElementById("heart");
const fav = document.getElementById("save");

// ELEMENT FOR THE QURAN PLAYER
let surah = new Audio();
let pOp = document.getElementById("playy");
let reciterName = document.getElementById("reciter");
let surahName = document.getElementById("surah");
let curTime = document.getElementById("currentTime");
let duRation = document.getElementById("endTime");
let confirm = document.getElementById("confirm-download");
let downloadedSurah = document.getElementById("downloaded-surah");
let favDiv = document.getElementById("favUserSuwar");

// AUDIO ELEMENT FOR THE CONDITIONS
let isReciting = false;
let isLooping = false;
let isShuffle = false;
let favShow = false;
let favSuwar = [];
let faVed = false;
let interval;
let shuflling = 0;
let loopIndex = 0;

// ALL AVAILABLE SUWAR
let suwar = [
  {
    name: "Al-Ahzab",
    reciter: "Badre Al-Turki",
    file: "suwar/ahzab.mp3",
  },
  {
    name: "Nuh",
    reciter: "Badre Al-Turki",
    file: "suwar/noah.mp3",
  },
  {
    name: "Qaf",
    reciter: "Nasser Al-Qatami",
    file: "suwar/qaf.mp3",
  },
  {
    name: "Al-Anbiyaa",
    reciter: "Mohamed El-Menshawi",
    file: "suwar/anbya.mp3",
  },
];

let surahIndex = 0;
surah.src = suwar[surahIndex].file;
play.addEventListener("click", () => {
  if (isReciting) {
    surah.pause();
    isReciting = false;
    pOp.classList.add("fa-play");
    pOp.classList.remove("fa-pause");
    clearInterval(interval);
  } else {
    isReciting = true;
    setInterval(updateTimeLine, 100);
    pOp.classList.add("fa-pause");
    pOp.classList.remove("fa-play");
    surah.play();
  }
});

// Next and Preview Button

next.addEventListener("click", () => {
  surahIndex = (surahIndex + 1) % suwar.length;
  surah.src = suwar[surahIndex].file;
  changeSurah();
});
preview.addEventListener("click", () => {
  surahIndex = (surahIndex - 1 + suwar.length) % suwar.length;
  surah.src = suwar[surahIndex].file;
  changeSurah();
});

surah.addEventListener("timeupdate", () => {
  let progressTime = (surah.currentTime / surah.duration) * 100;
  progress.value = progressTime;
});

surah.addEventListener("loadedmetadata", () => {
  let minute = Math.floor(surah.duration / 60)
    .toString()
    .padStart(2, "0");
  let seconds = Math.floor(surah.duration % 60)
    .toString()
    .padStart(2, "0");

  duRation.innerHTML = `${minute}:${seconds}`;
});

progress.addEventListener("input", () => {
  let seekTime = (progress.value / 100) * surah.duration;
  surah.currentTime = seekTime;
});

// CHange surah
function changeSurah() {
  if (favSuwar.includes(suwar[surahIndex].name)) {
    faVed = true;
    fav.classList.add("checked");
    fav.classList.add("fa-solid");
    fav.classList.remove("fa-regular");
  } else {
    faVed = false;
    fav.classList.remove("checked");
    fav.classList.remove("fa-solid");
    fav.classList.add("fa-regular");
  }
  reciterName.textContent = suwar[surahIndex].reciter;
  surahName.textContent = suwar[surahIndex].name;
  surah.src = suwar[surahIndex].file;
  surah.load();
  progress.value = 0;
  curTime.innerText = "00:00";
  duRation.innerText = "00:00";

  surah.play();
  isReciting = true;
  interval = setInterval(updateTimeLine, 100);
  pOp.classList.add("fa-pause");
  pOp.classList.remove("fa-play");
}

function updateTimeLine() {
  let minute = Math.floor(surah.currentTime / 60)
    .toString()
    .padStart(2, "0");
  let seconds = Math.floor(surah.currentTime % 60)
    .toString()
    .padStart(2, "0");

  curTime.innerHTML = `${minute}:${seconds}`;
}

// Loop condition
loop.addEventListener("click", () => {
  if (isLooping) {
    isLooping = false;
    loop.classList.remove("checked");
  } else {
    isShuffle = false;
    isLooping = true;
    loop.classList.add("checked");
    shuffle.classList.remove("checked");
  }
});

// Loop & shuffle
surah.addEventListener("ended", () => {
  if (isLooping) {
    loopIndex = surahIndex;
    surah.src = suwar[loopIndex].file;
    surah.currentTime = 0;
    surah.play();
  } else if (isShuffle) {
    surahIndex = (surahIndex + 1) % suwar.length;
    changeSurah();
  } else {
    surah.pause();
    pOp.classList.add("fa-play");
    pOp.classList.remove("fa-pause");
  }
});

shuffle.addEventListener("click", () => {
  if (isShuffle) {
    isShuffle = false;
    shuffle.classList.remove("checked");
  } else {
    isLooping = false;
    isShuffle = true;
    shuffle.classList.add("checked");
    loop.classList.remove("checked");
  }
});

//Download Button function

downloader.addEventListener("click", () => {
  pOp.classList.add("fa-play");
  pOp.classList.remove("fa-pause");
  surah.pause();
  confirm.classList.remove("none");
  confirm.classList.add("flex");
  downloadedSurah.innerHTML = `to Download Surat ${suwar[surahIndex].name}`;
  yes.onclick = async () => {
    try {
      let response = await fetch(suwar[surahIndex].file);
      let blob = await response.blob();
      let url = URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = url;
      a.download = `${suwar[surahIndex].name}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading file:", err);
    }
    confirm.classList.remove("flex");
    confirm.classList.add("none");
    pOp.classList.add("fa-pause");
    pOp.classList.remove("fa-play");
    surah.play();
  };
  no.onclick = () => {
    confirm.classList.remove("flex");
    confirm.classList.add("none");
    surah.play();
    pOp.classList.add("fa-pause");
    pOp.classList.remove("fa-play");
  };
});

//Styling the fav Button
favorite.addEventListener("click", () => {
  favShow = !favShow;

  if (favShow) {
    favDiv.classList.remove("closeIcons");
    favDiv.classList.remove("none");
    favDiv.classList.add("favIcons");
    favDiv.classList.add("flex");
    heart.classList.remove("fa-regular");
    heart.classList.add("fa-solid");
  } else {
    favDiv.classList.remove("favIcons");
    favDiv.classList.add("closeIcons");
    setTimeout(() => {
      favDiv.classList.add("none");
      favDiv.classList.remove("flex");
    }, 1000);
    heart.classList.add("fa-regular");
    heart.classList.remove("fa-solid");
  }
});

fav.addEventListener("click", () => {
  faVed = !faVed;
  if (favSuwar.length === 0) {
    favDiv.innerHTML = "";
  }
  if (faVed) {
    if (!favSuwar.includes(suwar[surahIndex].name)) {
      favSuwar.push(suwar[surahIndex].name);
      let div = document.createElement("div");
      let aud = document.createElement("audio");
      let source = document.createElement("source");
      let title = document.createElement("h2");
      title.textContent = suwar[surahIndex].name;
      aud.controls = true;
      aud.appendChild(source);
      source.src = suwar[surahIndex].file;
      source.setAttribute("type", "audio/mpeg");
      favDiv.appendChild(div);
      div.appendChild(aud);
      div.appendChild(title);
      div.setAttribute("data-name", `${suwar[surahIndex].name}`);
      div.setAttribute("class", `favorites`);
      fav.classList.add("checked");
      fav.classList.remove("fa-regular");
      fav.classList.add("fa-solid");
      window.localStorage.setItem("favorites", JSON.stringify(favSuwar));
    }
  } else {
    let aud = document.querySelector(
      `div[data-name=${suwar[surahIndex].name}]`
    );
    if (aud) {
      favDiv.removeChild(aud);
      favSuwar = favSuwar.filter((name) => name != suwar[surahIndex].name);
      fav.classList.remove("checked");
      fav.classList.remove("fa-solid");
      fav.classList.add("fa-regular");
      window.localStorage.setItem("favorites", JSON.stringify(favSuwar));
      favDiv.innerHTML = `      <h2 id="empty-h2">There's no favorite suwar yet</h2>
      <img src="/img/folder_1466623.png" alt="favImg" id="empty" />`;
    }
  }
});
