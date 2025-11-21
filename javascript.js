const correctAnswer = "head over heels";

document.getElementById("checkBtn").addEventListener("click", function () {
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
