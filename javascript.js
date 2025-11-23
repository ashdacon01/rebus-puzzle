
// ------------------------
// REBUS PUZZLE CHECK SYSTEM
// ------------------------
const correctAnswer = "head over heels";

document.getElementById("checkBtn")?.addEventListener("click", () => {
    const userAnswer = document.getElementById("answerInput").value.trim().toLowerCase();
    const result = document.getElementById("result");

    if (userAnswer === correctAnswer) {
        result.textContent = "✅ Correct!";
        result.style.color = "green";
    } else {
        result.textContent = "❌ Try again!";
        result.style.color = "red";
    }
});

// ----------------------------------
// GLOBAL QUIT FUNCTION
// ----------------------------------
function quitGame() {
    const box = document.createElement("div");
    box.className = "quit-popup";
    box.innerHTML = `
        <div class="quit-dialog">
            <p>Are you sure you want to quit?</p>
            <button id="yesQuit">Yes</button>
            <button id="noQuit">No</button>
        </div>
    `;
    document.body.appendChild(box);

    document.getElementById("yesQuit").onclick = () => {
        window.location.href = "index.html"; 
    };

    document.getElementById("noQuit").onclick = () => {
        box.remove();
    };
}

