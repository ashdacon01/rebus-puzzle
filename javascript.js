// ------------------------
// PARTICLES
// ------------------------
const canvas = document.getElementById("particleCanvas"); // Get particle canvas element
const ctx = canvas.getContext("2d"); // Get 2D drawing context
canvas.width = window.innerWidth; // Set canvas width to window width
canvas.height = window.innerHeight; // Set canvas height to window height
const particles = []; // Array to hold particle objects
for (let i = 0; i < 120; i++) { // Create 120 particles
    particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: 1 + Math.random() * 3, d: Math.random() * 1 }); // Random position, radius, density
}
function drawParticles() { // Function to render particles
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    ctx.fillStyle = "rgba(255,255,255,0.3)"; // Set particle color
    particles.forEach(p => { // For each particle
        ctx.beginPath(); // Start drawing path
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true); // Draw circle
        ctx.fill(); // Fill circle
        p.y += 0.2 + p.d; // Move particle down
        if (p.y > canvas.height) p.y = 0; // Reset to top if off bottom
    });
    requestAnimationFrame(drawParticles); // Loop animation
}
drawParticles(); // Start drawing particles

// ------------------------
// GET QUERY PARAM
// ------------------------
function getQueryParam(param) { // Get query parameter from URL
    return new URLSearchParams(window.location.search).get(param); // Return value
}

// ------------------------
// QUIT / BACK
// ------------------------
function quitGame() { // Function to show quit confirmation
    if (document.querySelector(".quit-popup")) return; // If popup exists, do nothing
    const box = document.createElement("div"); // Create popup div
    box.className = "quit-popup"; // Assign class
    box.innerHTML = `<div class="quit-dialog">
        <p>Are you sure you want to quit?</p>
        <div class="quit-buttons">
            <button id="yesQuit">Yes</button>
            <button id="noQuit">No</button>
        </div>
    </div>`; // Set inner HTML
    document.body.appendChild(box); // Add to body
    document.getElementById("yesQuit").onclick = () => { document.querySelector(".puzzle-page").classList.remove("show"); setTimeout(() => window.location.href = "categories.html", 300); }; // Yes button action
    document.getElementById("noQuit").onclick = () => box.remove(); // No button action
}
function transitionBack() { // Transition back function
    document.querySelector(".puzzle-page").classList.remove("show"); // Hide puzzle page
    setTimeout(() => window.location.href = "categories.html", 300); // Redirect after delay
}

// ------------------------
// FULLSCREEN BUTTON
// ------------------------
const fullscreenBtn = document.getElementById("fullscreenBtn"); // Get fullscreen button element
fullscreenBtn.addEventListener("click", () => { // On click toggle fullscreen
    if (!document.fullscreenElement) { // If not fullscreen
        document.documentElement.requestFullscreen(); // Enter fullscreen
    } else {
        document.exitFullscreen(); // Exit fullscreen
    }
});
document.addEventListener("fullscreenchange", () => { // Hide/show button based on fullscreen state
    if (document.fullscreenElement) fullscreenBtn.style.display = "none"; // Hide in fullscreen
    else fullscreenBtn.style.display = "block"; // Show otherwise
});

// ------------------------
// CONFETTI
// ------------------------
function triggerConfetti() { // Function to launch confetti
    const canvas = document.createElement("canvas"); // Create canvas
    canvas.id = "confettiCanvas"; // Assign ID
    canvas.style.position = "absolute"; canvas.style.top = 0; canvas.style.left = 0; // Position canvas
    canvas.style.width = "100%"; canvas.style.height = "100%"; // Full size
    canvas.style.pointerEvents = "none"; canvas.style.zIndex = 10; // Click-through and above content
    const answerPopup = document.getElementById("answerPopup"); // Get popup element
    answerPopup.appendChild(canvas); // Append canvas to popup
    const ctx = canvas.getContext("2d"); // Get 2D context
    const pieces = []; // Array for confetti pieces
    for (let i = 0; i < 150; i++) { // Generate 150 confetti
        pieces.push({ x: Math.random() * canvas.clientWidth, y: Math.random() * -50, size: 5 + Math.random() * 8, speed: 2 + Math.random() * 4 }); // Random position, size, speed
    }
    function update() { // Animation loop
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        pieces.forEach(p => { // For each piece
            p.y += p.speed; // Move down
            ctx.fillStyle = `hsl(${Math.random() * 360},100%,50%)`; // Random color
            ctx.fillRect(p.x, p.y, p.size, p.size); // Draw square
        });
        requestAnimationFrame(update); // Loop
    }
    canvas.width = answerPopup.clientWidth; // Match width to popup
    canvas.height = answerPopup.clientHeight; // Match height to popup
    update(); // Start animation
    setTimeout(() => canvas.remove(), 2500); // Remove after 2.5s
}

// ------------------------
// PLAY MORE POPUP
// ------------------------
function showMediumPopup() { // Show "play more" popup
    document.getElementById("playMorePopup").style.display = "flex"; // Display flex
}

// ------------------------
// READY POPUP + INIT
// ------------------------
document.addEventListener("DOMContentLoaded", () => { // On page load
    const readyPopup = document.getElementById("readyPopup"); // Get ready popup element
    const startBtn = document.getElementById("startGameBtn"); // Get start button
    const quitReadyBtn = document.getElementById("quitReadyBtn"); // Get quit button
    const puzzlePage = document.querySelector(".puzzle-page"); // Get puzzle page element

    startBtn.addEventListener("click", () => { // Start game button click
        readyPopup.style.display = "none"; // Hide ready popup
        puzzlePage.classList.add("show"); // Show puzzle page

        // read category correctly here
        let category = getQueryParam("category"); // Get category from URL
        if (!category) category = "Brand Logos"; // default category
        initGame(category); // Initialize game
    });

    quitReadyBtn.addEventListener("click", () => { window.location.href = "categories.html"; }); // Quit button action
});

// ------------------------
// PUZZLE GAME LOGIC
// ------------------------
function initGame(category) { // Main game initialization
    document.getElementById("puzzleTitle").textContent = category; // Set category title

    const puzzleSets = { // Define puzzle sets
        "Brand Logos": [
            { img: "images/brand_apple.png", answer: "Apple" }, // Puzzle 1
            { img: "images/brand_disneyland.png", answer: "Disneyland" }, // Puzzle 2
            { img: "images/brand_fedex.png", answer: "FedEx" } // Puzzle 3
        ]
        // add other categories exactly matching query names...
    };

    const imagesArray = puzzleSets[category]; // Get array for selected category
    if (!imagesArray) { // If category not found
        alert("Category not found!"); // Show alert
        return; // Stop function
    }

    let currentIndex = 0; // Current puzzle index
    let score = 0; // Player score
    let hintPressed = false; // Hint state

    const puzzleImage = document.getElementById("puzzleImage"); // Get puzzle image element
    const hintBtn = document.getElementById("hintBtn"); // Get hint button
    const answerPopup = document.getElementById("answerPopup"); // Get answer popup
    const scoreBox = document.getElementById("scoreBox"); // Get score box

    const nextBtn = document.getElementById("nextImg"); // Next button
    const prevBtn = document.getElementById("prevImg"); // Previous button
    const correctBtn = document.getElementById("correctBtn"); // Correct button
    const wrongBtn = document.getElementById("wrongBtn"); // Wrong button

    const correctSound = new Audio("sounds/correct.mp3"); // Correct sound
    const wrongSound = new Audio("sounds/wrong.mp3"); // Wrong sound
    const finishSound = new Audio("sounds/finishes.mp3"); // Finish sound

    function showImage(index) { // Display puzzle image
        if (index < 0) index = 0; // Clamp lower bound
        if (index >= imagesArray.length) index = imagesArray.length - 1; // Clamp upper bound
        currentIndex = index; // Update index
        puzzleImage.src = imagesArray[currentIndex].img; // Set image src
        hintBtn.disabled = false; // Enable hint button
        hintPressed = false; // Reset hint
        nextBtn.disabled = true; // Disable next until correct or hint
    }

    nextBtn.addEventListener("click", () => showImage(currentIndex + 1)); // Next button action
    prevBtn.addEventListener("click", () => showImage(currentIndex - 1)); // Previous button action

    correctBtn.addEventListener("click", () => { // Correct button click
        score++; // Increment score
        scoreBox.textContent = "Score: " + score; // Update score display
        nextBtn.disabled = false; // Enable next button
        hintPressed = true; // Mark hint pressed
        if (currentIndex === imagesArray.length - 1) { // Last puzzle
            answerPopup.style.display = "flex"; // Show popup
            answerPopup.textContent = `✔Correct!`; // Display text
            triggerConfetti(); // Launch confetti
            finishSound.play(); // Play finish sound
            setTimeout(() => { answerPopup.style.display = "none"; showMediumPopup(); }, 1800); // Show play more popup
        } else { // Not last puzzle
            answerPopup.style.display = "flex"; // Show popup
            answerPopup.textContent = `✔Correct!`; // Display text
            correctSound.play(); // Play sound
        }
    });

    wrongBtn.addEventListener("click", () => { // Wrong button click
        answerPopup.style.display = "flex"; // Show popup
        answerPopup.textContent = `✖ Wrong!\nTry again.`; // Show message
        wrongSound.play(); // Play sound
    });

    hintBtn.addEventListener("click", () => { // Hint button click
        hintBtn.disabled = true; // Disable hint
        hintPressed = true; // Mark hint pressed
        nextBtn.disabled = false; // Enable next

        answerPopup.style.display = "flex"; // Show popup
        answerPopup.textContent = `Answer: ${imagesArray[currentIndex].answer}`; // Display answer

        if (currentIndex === imagesArray.length - 1) { // Last puzzle
            triggerConfetti(); // Confetti
            finishSound.play(); // Finish sound
            setTimeout(() => { answerPopup.style.display = "none"; showMediumPopup(); }, 5000); // Show play more popup
        }
    });

    answerPopup.addEventListener("click", () => { answerPopup.style.display = "none"; }); // Hide popup on click

    showImage(0); // Show first puzzle
}
