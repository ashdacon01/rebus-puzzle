// ------------------------
// REBUS PUZZLE CHECK SYSTEM
// ------------------------

// Example answers per puzzle image (you can expand this)
const puzzleAnswers = {
    "Brand": {
        easy: ["brand1answer", "brand2answer", "brand3answer"]
    },
    "Animals": {
        easy: ["animals1answer", "animals2answer"]
    },
    "Movie": {
        easy: ["movie1answer", "movie2answer"]
    },
    "Music": {
        easy: ["music1answer", "music2answer"]
    },
    "Idioms": {
        easy: ["idiom1answer", "idiom2answer"]
    },
    "Food": {
        easy: ["food1answer", "food2answer"]
    }
};

// Normalize function: trims, lowercases, collapses multiple spaces
const normalize = str => str.replace(/\s+/g, ' ').trim().toLowerCase();

// ------------------------
// PUZZLE PAGE LOGIC
// ------------------------
// ------------------------
// PUZZLE PAGE LOGIC
// ------------------------
document.addEventListener("DOMContentLoaded", () => {
    const puzzleImage = document.getElementById("puzzleImage");
    const hintBtn = document.getElementById("hintBtn");
    const hintText = document.getElementById("hintText");

    if (!puzzleImage || !hintBtn || !hintText) return;

    // Keep the same imagesArray you already defined in puzzle.html
    const imagesArray = [
        {img: "../images/brand_easy1.png", answer: "Apple"},
        {img: "../images/brand_easy2.png", answer: "Nike"},
        {img: "../images/brand_easy3.png", answer: "Disneyland"},
        {img: "../images/brand_easy4.png", answer: "Starbucks"},
        {img: "../images/brand_easy5.png", answer: "Firefox"},
        {img: "../images/brand_easy6.png", answer: "Twitter"},
        {img: "../images/brand_easy7.png", answer: "FedEx"},
        {img: "../images/brand_easy8.png", answer: "Sprite"},
        {img: "../images/brand_easy9.png", answer: "Python"},
        {img: "../images/brand_easy10.png", answer: "Oreo"}
    ];

    let currentIndex = 0;

    function showImage(index) {
        if (index < 0) index = 0;
        if (index >= imagesArray.length) index = imagesArray.length - 1;
        currentIndex = index;

        puzzleImage.src = imagesArray[currentIndex].img;

        // Reset hint
        hintText.style.display = "none";
        hintText.textContent = "";
        hintBtn.disabled = false;
    }

    // Navigation buttons
    document.getElementById("nextImg")?.addEventListener("click", () => showImage(currentIndex + 1));
    document.getElementById("prevImg")?.addEventListener("click", () => showImage(currentIndex - 1));

    // Hint button
    hintBtn.addEventListener("click", () => {
        hintText.style.display = "block";
        hintText.textContent = `Answer: ${imagesArray[currentIndex].answer}`;
        hintBtn.disabled = true;
    });

    // Show first image
    showImage(0);
});


// ------------------------
// CATEGORY SELECTION NAVIGATION
// ------------------------
const categoryButtons = document.querySelectorAll(".category-btn");
categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        const selectedCategory = button.getAttribute("data-category");
        document.body.classList.remove("show"); // fade out
        setTimeout(() => {
            window.location.href = `difficulty.html?category=${encodeURIComponent(selectedCategory)}`;
        }, 300);
    });
});

// ------------------------
// GLOBAL QUIT FUNCTION
// ------------------------
function quitGame() {
    if (document.querySelector(".quit-popup")) return; // avoid duplicates

    const box = document.createElement("div");
    box.className = "quit-popup";

    // Popup styling
    box.innerHTML = `
        <div class="quit-dialog">
            <p>Are you sure you want to quit?</p>
            <div class="quit-buttons">
                <button id="yesQuit">Yes</button>
                <button id="noQuit">No</button>
            </div>
        </div>
    `;

    document.body.appendChild(box);

    // YES button → fade out then go home
    document.getElementById("yesQuit").onclick = () => {
        document.body.classList.remove("show");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 300);
    };

    // NO button → closes popup
    document.getElementById("noQuit").onclick = () => {
        box.remove();
    };
}
