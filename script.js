document.addEventListener("DOMContentLoaded", () => {
    const music = document.getElementById("bgMusic");
    const playBtn = document.getElementById("playBtn");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const progressBar = document.getElementById("progressBar");
    const currentTimeEl = document.getElementById("currentTime");
    const remainingTimeEl = document.getElementById("remainingTime");
    const triggerBtn = document.getElementById("triggerBtn");
    const musicPlayer = document.getElementById("musicPlayer");
    const playingIcon = document.querySelector(".playing-icon");
    const coverImage = document.querySelector(".cover-image");
    const songTitle = document.querySelector(".song-title");
    const songIndexEl = document.getElementById("songIndex");

    const playIconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
    const pauseIconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

    const playlist = [
        { file: "audio.mp3", image: "image.png", title: "so easy" },
        { file: "audio2.mp3", image: "image2.png", title: "espresso" },
        { file: "audio3.mp3", image: "image3.png", title: "Tu Rang Sharbaton ka" },
        { file: "audio4.mp3", image: "image4.png", title: "Kesariya" },
        { file: "audio5.mp3", image: "image5.png", title: "Subhanallah" },
        { file: "audio6.mp3", image: "image6.png", title: "Agar Tum Saath Ho" }
    ];

    let currentSongIndex = 0;

    function updateSongMeta(index) {
        coverImage.src = playlist[index].image;
        songTitle.textContent = playlist[index].title;
        songIndexEl.textContent = `${index + 1} / ${playlist.length}`;
    }

    function updatePlayPauseButton(isPlaying) {
        if (isPlaying) {
            playBtn.innerHTML = pauseIconSvg;
            playBtn.classList.add("playing");
            playingIcon.classList.add("active");
        } else {
            playBtn.innerHTML = playIconSvg;
            playBtn.classList.remove("playing");
            playingIcon.classList.remove("active");
        }
    }

    function formatTime(time) {
        if (isNaN(time)) {
            return "0:00";
        }

        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }

    function updateProgressUI(current, duration) {
        if (!duration) {
            return;
        }

        const progressPercent = (current / duration) * 100;
        progressBar.value = current;
        progressBar.max = duration;
        progressBar.style.setProperty("--progress", `${progressPercent}%`);

        currentTimeEl.textContent = formatTime(current);
        remainingTimeEl.textContent = `-${formatTime(duration - current)}`;
    }

    function loadAndPlaySong(index) {
        music.src = playlist[index].file;
        updateSongMeta(index);
        music.load();
        music.play().then(() => {
            updatePlayPauseButton(true);
        }).catch((error) => console.log("Audio play failed:", error));
    }

    updateSongMeta(currentSongIndex);
    progressBar.style.setProperty("--progress", "0%");

    triggerBtn.addEventListener("click", () => {
        musicPlayer.classList.add("show");
        triggerBtn.style.display = "none";

        music.currentTime = 0;
        music.muted = false;

        music.play().then(() => {
            updatePlayPauseButton(true);
        }).catch((error) => console.log("Audio play failed:", error));
    });

    playBtn.addEventListener("click", () => {
        if (music.paused) {
            music.play().then(() => {
                updatePlayPauseButton(true);
            }).catch((error) => console.log("Audio play failed:", error));
        } else {
            music.pause();
            updatePlayPauseButton(false);
        }
    });

    nextBtn.addEventListener("click", () => {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadAndPlaySong(currentSongIndex);
    });

    prevBtn.addEventListener("click", () => {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        loadAndPlaySong(currentSongIndex);
    });

    music.addEventListener("timeupdate", () => {
        updateProgressUI(music.currentTime, music.duration);
    });

    progressBar.addEventListener("input", (event) => {
        const duration = music.duration;
        if (!duration) {
            return;
        }

        const value = Number(event.target.value);
        const progressPercent = (value / duration) * 100;
        progressBar.style.setProperty("--progress", `${progressPercent}%`);

        currentTimeEl.textContent = formatTime(value);
        remainingTimeEl.textContent = `-${formatTime(duration - value)}`;
    });

    progressBar.addEventListener("change", (event) => {
        music.currentTime = Number(event.target.value);
    });

    music.addEventListener("loadedmetadata", () => {
        progressBar.max = music.duration;
        remainingTimeEl.textContent = `-${formatTime(music.duration)}`;
    });

    music.addEventListener("ended", () => {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadAndPlaySong(currentSongIndex);
    });
});
