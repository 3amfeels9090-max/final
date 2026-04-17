const messageBlocks = [
    "I hope this small effort of mine, though it can never match how amazing you are, was able to bring a smile to your face on your special day.",
    "People usually say \"I hope you get everything you wish for\" but...",
    "I'd rather say I truly believe you will achieve every goal you've set your mind to. You have that strength in you.",
    "I hope life gives you twice the happiness for every struggle you go through, and that you keep shining the way you always do.",
    "Please never stop singing - your voice is something truly beautiful.",
    "Wishing you a day full of love, laughter, and all the little moments that make life special. Happy Birthday \u{1F90D}"
];

const ENTER_DURATION = 1100;
const EXIT_DURATION = 950;
const HOLD_DURATION = 4700;

function wait(duration) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, duration);
    });
}

async function runLetterSequence() {
    const animatedMessage = document.getElementById("animatedMessage");
    const fullLetter = document.getElementById("fullLetter");

    if (!animatedMessage || !fullLetter) {
        return;
    }

    for (const block of messageBlocks) {
        animatedMessage.className = "animated-message";
        animatedMessage.textContent = block;
        await wait(40);

        animatedMessage.classList.add("active");
        await wait(ENTER_DURATION + HOLD_DURATION);

        animatedMessage.classList.remove("active");
        animatedMessage.classList.add("exit");
        await wait(EXIT_DURATION);
    }

    animatedMessage.textContent = "";
    animatedMessage.className = "animated-message";
    fullLetter.hidden = false;
    await wait(60);
    fullLetter.classList.add("visible");
}

function tryAutoplayAudio() {
    const audio = document.getElementById("finalAudio");

    if (!audio) {
        return;
    }

    audio.play().catch(() => {
        const resumeAudio = () => {
            audio.play().catch(() => {});
            window.removeEventListener("pointerdown", resumeAudio);
            window.removeEventListener("keydown", resumeAudio);
        };

        window.addEventListener("pointerdown", resumeAudio, { once: true });
        window.addEventListener("keydown", resumeAudio, { once: true });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    window.requestAnimationFrame(() => {
        document.body.classList.add("page-ready");
    });

    tryAutoplayAudio();
    runLetterSequence();
});
