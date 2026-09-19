function generateQuiz() {

    var notes = document.getElementById("notes").value;
    var questionCount = document.getElementById("questionCount").value;
    var difficulty = document.getElementById("difficulty").value;
    var quiz = document.getElementById("quiz");

    if (notes.trim() === "") {
        quiz.innerHTML = "<p>Please enter your notes first.</p>";
        return;
    }

    quiz.innerHTML = "<p>Generating quiz...</p>";

    fetch("/generate-quiz", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            notes: notes,
            questionCount: questionCount,
            difficulty: difficulty
        })
    })
    .then(response => response.json())
    .then(data => {

        if (data.error) {
            quiz.innerHTML = "<p>" + data.error + "</p>";
            return;
        }

        if (!data.questions || data.questions.length === 0) {
            quiz.innerHTML = "<p>No questions were generated.</p>";
            return;
        }

        var html = "<h2>Generated Quiz</h2>";

        data.questions.forEach(function(item, index) {

            html +=
                "<div class='question'>" +
                "<h3>Question " + (index + 1) + "</h3>" +
                "<p><strong>" + item.question + "</strong></p>" +

                "<label><input type='radio' name='q" + index +
                "' value='" + item.options[0] + "'> " +
                item.options[0] + "</label><br><br>" +

                "<label><input type='radio' name='q" + index +
                "' value='" + item.options[1] + "'> " +
                item.options[1] + "</label><br><br>" +

                "<label><input type='radio' name='q" + index +
                "' value='" + item.options[2] + "'> " +
                item.options[2] + "</label><br><br>" +

                "<label><input type='radio' name='q" + index +
                "' value='" + item.options[3] + "'> " +
                item.options[3] + "</label>" +

                "</div>";
        });

        html += "<button onclick='checkAnswers()'>Submit Quiz</button>";

        quiz.innerHTML = html;

        window.generatedQuestions = data.questions;
    })
    .catch(error => {

        console.error(error);

        quiz.innerHTML =
            "<p>Unable to connect to the server.</p>";
    });
}


function checkAnswers() {

    var questions = window.generatedQuestions;
    var score = 0;

    questions.forEach(function(item, index) {

        var selected = document.querySelector(
            "input[name='q" + index + "']:checked"
        );

        if (selected && selected.value === item.answer) {
            score++;
        }
    });

    var result = document.createElement("div");

    result.innerHTML =
        "<h2>Quiz Result</h2>" +
        "<p>You scored <strong>" +
        score +
        " / " +
        questions.length +
        "</strong></p>";

    document.getElementById("quiz").appendChild(result);
}
function checkAnswers() {

    var questions = window.generatedQuestions;
    var score = 0;

    questions.forEach(function(item, index) {

        var questionBox = document.querySelectorAll(".question")[index];

        var selected = document.querySelector(
            "input[name='q" + index + "']:checked"
        );

        if (selected && selected.value === item.answer) {

            score++;

            questionBox.style.border = "3px solid #28a745";
            questionBox.style.backgroundColor = "#eaf7ed";

        } else {

            questionBox.style.border = "3px solid #dc3545";
            questionBox.style.backgroundColor = "#fdecec";

            var correctAnswer = document.createElement("p");

            correctAnswer.innerHTML =
                "<strong>Correct Answer:</strong> " +
                item.answer;

            correctAnswer.style.color = "#c82333";
            correctAnswer.style.marginTop = "15px";

            questionBox.appendChild(correctAnswer);
        }
    });

    var result = document.createElement("div");

    result.innerHTML =
        "<h2>Quiz Result</h2>" +
        "<p>Your Score: <strong>" +
        score +
        " / " +
        questions.length +
        "</strong></p>";

    result.style.backgroundColor = "#e8f4ff";
    result.style.border = "2px solid #007bff";
    result.style.padding = "20px";
    result.style.borderRadius = "10px";
    result.style.marginTop = "20px";
    result.style.textAlign = "center";

    document.getElementById("quiz").appendChild(result);
}