let subjectID = window.location.toString().substring(window.location.toString().indexOf("=")+1);
let lastCorrect = null;
let override = false;

function pageLoad1() {
    listSubjects();

    let formData = new FormData;
    formData.append('id', subjectID);
    fetch('/question/list', {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(questions => {

        document.getElementById("bigButton").addEventListener("click", checkInput);
        document.getElementById("smallButton").addEventListener("click", invertLast);
        let index = 0;
        let lastIndex = 0;
        let count = 0;
        let correct = 0;

        function checkInput() {
            let label = document.getElementById("bigButton").innerHTML;
            if (label === "Next") {
                if (lastCorrect !== null) {
                    addAnswerData(lastCorrect);
                }
                override = false;
                document.getElementById("smallButton").style.visibility = "hidden";
                getNextQuestion();
            } else if (label === "Answer") {
                checkAns();
            }
        }

        function getNextQuestion() {
            count++;
            if (count === 11) {
                document.getElementById("qaTitle").innerHTML = "Test Complete!" + '<br>' + correct + "/10 correct";
                if (correct > 6) {
                    document.getElementById("qaTitle").style.color = "green";
                    document.getElementById("systemAns").innerHTML = "Well Done!"
                } else {
                    document.getElementById("qaTitle").style.color = "red";
                    document.getElementById("systemAns").innerHTML = "More work needed";
                }
                document.getElementById("card").innerHTML = "";
                document.getElementById("bigButton").innerHTML = "Back to Profile";
                document.getElementById("userAns").innerHTML = "Try Again";
                document.getElementById("smallButton").style.visibility = "visible";
                document.getElementById("bigButton").addEventListener("click", home);
                document.getElementById("smallButton").addEventListener("click", tryAgain);
            } else {
                document.getElementById("systemAns").innerHTML = "";
                document.getElementById("userAns").value = "";
                document.getElementById("bigButton").innerHTML = "Answer";
                document.getElementById("userAns").style.visibility = "visible";
                let ln = questions.length;
                lastIndex = index;
                do {
                    index = Math.floor(Math.random() * ln);
                } while (index === lastIndex);
                showQuestion();
            }
        }

        function checkAns() {
            document.getElementById("smallButton").style.visibility = "visible";
            document.getElementById("bigButton").innerHTML = "Next";
            if (document.getElementById("userAns").value === questions[index].answer) {
                correctAns();
                lastCorrect = true;
            } else {
                showAnswer();
                lastCorrect = false;
            }
        }
        function correctAns() {
            correct++;
            document.getElementById("qaTitle").innerHTML = "Correct!";
            document.getElementById("qaTitle").style.color = "green";

        }

        function showAnswer() {
            document.getElementById("qaTitle").style.color = "red";
            document.getElementById("qaTitle").innerHTML = "Incorrect";
            document.getElementById("systemAns").innerHTML = "Correct Answer: " + questions[index].answer;
        }
        function showQuestion() {
            document.getElementById("qaTitle").style.color = "black";
            document.getElementById("qaTitle").innerHTML = "Question";
            document.getElementById("bigButton").innerHTML = "Answer";
            document.getElementById("card").innerHTML = questions[index].content;
        }

        function addAnswerData(ansCorrect) {
            let id = questions[index].id;
            let timesCorrect = questions[index].timesCorrect;
            let timesIncorrect = questions[index].timesIncorrect;

            if (ansCorrect) {
                timesCorrect++;
            } else {
                timesIncorrect++;
            }

            let answerData = new FormData;
            answerData.append("id", id);
            answerData.append("timesCorrect", timesCorrect);
            answerData.append("timesIncorrect", timesIncorrect);

            fetch('/question/updateProgress', {method: 'post', body: answerData}
            ).then(response => response.json()
            ).then(questions => {
                console.log("successful");
            });
        }

        function invertLast() {
            if (override === false) {
                lastCorrect = !lastCorrect;
                override = true;
                if (lastCorrect === true) {
                    correctAns();
                } else {
                    showAnswer();
                }
            }
        }
    });

}

function home() {
    window.location.href = "/client/student.html";
}
function tryAgain() {
    window.location.href = "/client/test.html?" + subjectID;
}
