function generateQuiz() {

    var notes = document.getElementById("notes").value;
    var questionCount = document.getElementById("questionCount").value;
    var difficulty = document.getElementById("difficulty").value;
    var quiz = document.getElementById("quiz");

    if (notes.trim() === "") {
        quiz.innerHTML = "<p>Please enter your notes first.</p>";
        return;
    }

    quiz.innerHTML =
        "<div class='question'>" +
        "<h3>Quiz Preview</h3>" +
        "<p><strong>Notes received successfully!</strong></p>" +
        "<p>Questions requested: " + questionCount + "</p>" +
        "<p>Difficulty: " + difficulty + "</p>" +
        "<p>AI quiz generation will be connected in the next step.</p>" +
        "</div>";
}