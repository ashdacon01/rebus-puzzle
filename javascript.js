// ------------------------
// REBUS PUZZLE CHECK SYSTEM
// ------------------------
const correctAnswer = "head over heels";

// Normalize function: trims, lowercases, and collapses multiple spaces
const normalize = str => str.replace(/\s+/g, ' ').trim().toLowerCase();

document.getElementById("checkBtn")?.addEventListener("click", () => {
    const userAnswer = document.getElementById("answerInput").value;
    const result = document.getElementById("result");

    if (normalize(userAnswer) === normalize(correctAnswer)) {
        result.textContent = "✅ Correct!";
        result.style.color = "green";
    } else {
        result.textContent = "❌ Try again!";
        result.style.color = "red";
        document.getElementById("answerInput").focus();
    }
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



// ----------------------------------
// GLOBAL QUIT FUNCTION
// ----------------------------------
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
