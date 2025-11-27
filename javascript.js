// ------------------------
// PARTICLES
// ------------------------
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const particles = [];
for (let i = 0; i < 120; i++) {
    particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: 1 + Math.random() * 3, d: Math.random() * 1 });
}
function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
        ctx.fill();
        p.y += 0.2 + p.d;
        if (p.y > canvas.height) p.y = 0;
    });
    requestAnimationFrame(drawParticles);
}
drawParticles();

// ------------------------
// GET QUERY PARAM
// ------------------------
function getQueryParam(param) {
    return new URLSearchParams(window.location.search).get(param);
}

// ------------------------
// QUIT / BACK
// ------------------------
function quitGame() {
    if (document.querySelector(".quit-popup")) return;
    const box = document.createElement("div");
    box.className = "quit-popup";
    box.innerHTML = `<div class="quit-dialog">
        <p>Are you sure you want to quit?</p>
        <div class="quit-buttons">
            <button id="yesQuit">Yes</button>
            <button id="noQuit">No</button>
        </div>
    </div>`;
    document.body.appendChild(box);
    document.getElementById("yesQuit").onclick = () => { document.querySelector(".puzzle-page").classList.remove("show"); setTimeout(() => window.location.href = "categories.html", 300); };
    document.getElementById("noQuit").onclick = () => box.remove();
}
function transitionBack() {
    document.querySelector(".puzzle-page").classList.remove("show");
    setTimeout(() => window.location.href = "categories.html", 300);
}

// ------------------------
// FULLSCREEN BUTTON
// ------------------------
const fullscreenBtn = document.getElementById("fullscreenBtn");
fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});
document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) fullscreenBtn.style.display = "none";
    else fullscreenBtn.style.display = "block";
});

// ------------------------
// CONFETTI
// ------------------------
function triggerConfetti() {
    const canvas = document.createElement("canvas");
    canvas.id = "confettiCanvas";
    canvas.style.position = "absolute"; canvas.style.top = 0; canvas.style.left = 0;
    canvas.style.width = "100%"; canvas.style.height = "100%";
    canvas.style.pointerEvents = "none"; canvas.style.zIndex = 10;
    const answerPopup = document.getElementById("answerPopup");
    answerPopup.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const pieces = [];
    for (let i = 0; i < 150; i++) {
        pieces.push({ x: Math.random() * canvas.clientWidth, y: Math.random() * -50, size: 5 + Math.random() * 8, speed: 2 + Math.random() * 4 });
    }
    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(p => {
            p.y += p.speed;
            ctx.fillStyle = `hsl(${Math.random() * 360},100%,50%)`;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        });
        requestAnimationFrame(update);
    }
    canvas.width = answerPopup.clientWidth;
    canvas.height = answerPopup.clientHeight;
    update();
    setTimeout(() => canvas.remove(), 2500);
}

// ------------------------
// PLAY MORE POPUP
// ------------------------
function showMediumPopup() {
    document.getElementById("playMorePopup").style.display = "flex";
}

// ------------------------
// READY POPUP + INIT
// ------------------------
document.addEventListener("DOMContentLoaded", () => {
    const readyPopup = document.getElementById("readyPopup");
    const startBtn = document.getElementById("startGameBtn");
    const quitReadyBtn = document.getElementById("quitReadyBtn");
    const puzzlePage = document.querySelector(".puzzle-page");

    startBtn.addEventListener("click", () => {
        readyPopup.style.display = "none";
        puzzlePage.classList.add("show");

        // read category correctly here
        let category = getQueryParam("category");
        if (!category) category = "Brand Logos"; // default
        initGame(category);
    });

    quitReadyBtn.addEventListener("click", () => { window.location.href = "categories.html"; });
});

// ------------------------
// PUZZLE GAME LOGIC
// ------------------------
function initGame(category) {
    document.getElementById("puzzleTitle").textContent = category;

    const puzzleSets = {
        "Brand Logos": [
            { img: "images/brand_apple.png", answer: "Apple" },
            { img: "images/brand_disneyland.png", answer: "Disneyland" },
            { img: "images/brand_fedex.png", answer: "FedEx" }
        ],
        "Animals": [
            { img: "images/bee.png", answer: "Bee" },
            { img: "images/dog.png", answer: "Dog" },
            { img: "images/cat.png", answer: "Cat" }
        ]
        // add other categories exactly matching query names...
    };

    const imagesArray = puzzleSets[category];
    if (!imagesArray) {
        alert("Category not found!");
        return;
    }

    let currentIndex = 0;
    let score = 0;
    let hintPressed = false;

    const puzzleImage = document.getElementById("puzzleImage");
    const hintBtn = document.getElementById("hintBtn");
    const answerPopup = document.getElementById("answerPopup");
    const scoreBox = document.getElementById("scoreBox");

    const nextBtn = document.getElementById("nextImg");
    const prevBtn = document.getElementById("prevImg");
    const correctBtn = document.getElementById("correctBtn");
    const wrongBtn = document.getElementById("wrongBtn");

    const correctSound = new Audio("sounds/correct.mp3");
    const wrongSound = new Audio("sounds/wrong.mp3");
    const finishSound = new Audio("sounds/finishes.mp3");

    function showImage(index) {
        if (index < 0) index = 0;
        if (index >= imagesArray.length) index = imagesArray.length - 1;
        currentIndex = index;
        puzzleImage.src = imagesArray[currentIndex].img;
        hintBtn.disabled = false;
        hintPressed = false;
        nextBtn.disabled = true;
    }

    nextBtn.addEventListener("click", () => showImage(currentIndex + 1));
    prevBtn.addEventListener("click", () => showImage(currentIndex - 1));

    correctBtn.addEventListener("click", () => {
        score++;
        scoreBox.textContent = "Score: " + score;
        nextBtn.disabled = false;
        hintPressed = true;
        if (currentIndex === imagesArray.length - 1) {
            answerPopup.style.display = "flex";
            answerPopup.textContent = `✔Correct!`;
            triggerConfetti();
            finishSound.play();
            setTimeout(() => { answerPopup.style.display = "none"; showMediumPopup(); }, 1800);
        } else {
            answerPopup.style.display = "flex";
            answerPopup.textContent = `✔Correct!`;
            correctSound.play();
        }
    });

    wrongBtn.addEventListener("click", () => {
        answerPopup.style.display = "flex";
        answerPopup.textContent = `✖ Wrong!\nTry again.`;
        wrongSound.play();
    });

    hintBtn.addEventListener("click", () => {
        hintBtn.disabled = true;
        hintPressed = true;
        nextBtn.disabled = false;

        answerPopup.style.display = "flex";
        answerPopup.textContent = `Answer: ${imagesArray[currentIndex].answer}`;

        if (currentIndex === imagesArray.length - 1) {
            triggerConfetti();
            finishSound.play();
            setTimeout(() => { answerPopup.style.display = "none"; showMediumPopup(); }, 5000);
        }
    });

    answerPopup.addEventListener("click", () => { answerPopup.style.display = "none"; });

    showImage(0);
}
