let subjectID;
let lastCorrect = null;
let override = false;

function pageLoadTest() {
    if (window.location.toString().indexOf("#") !== -1) {
        subjectID = window.location.toString().substring(window.location.toString().indexOf("=")+1, window.location.toString().indexOf("#"));
    } else {
        subjectID = window.location.toString().substring(window.location.toString().indexOf("=")+1);
    }
    listSubjects();

    let formData = new FormData;
    formData.append("id", subjectID);
    fetch('/question/list', {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(questions => {
        if (questions.hasOwnProperty('error')) {
            alert(questions.error);
        } else {

            document.getElementById("nextButton").addEventListener("click", checkInput);
            document.getElementById("override").addEventListener("click", invertLast);
            let index = 0;
            let lastIndex = 0;
            let count = 0;
            let correct = 0;

            function checkInput() {
                let label = document.getElementById("nextButton").innerHTML;
                if (label === "Next") {
                    if (lastCorrect !== null) {
                        addAnswerData(lastCorrect);
                    }
                    override = false;
                    document.getElementById("override").style.visibility = "hidden";
                    getNextQuestion();
                } else if (label === "Answer") {
                    checkAns();
                }
            }

            function getNextQuestion() {
                count++;
                if (count === 11) {
                    document.getElementById("userAns").style.visibility = "hidden";
                    document.getElementById("qaTitle").innerHTML = "Test Complete!" + '<br>' + correct + "/10 correct";
                    if (correct > 6) {
                        document.getElementById("qaTitle").style.color = "green";

                        document.getElementById("systemAns").innerHTML = "Well Done!"
                    } else {
                        document.getElementById("qaTitle").style.color = "red";
                        document.getElementById("systemAns").innerHTML = "More work needed";
                    }
                    addToScore(correct);
                    document.getElementById("card").innerHTML = "";
                    document.getElementById("nextButton").innerHTML = "Back to Profile";
                    document.getElementById("override").innerHTML = "Try Again";
                    document.getElementById("override").style.visibility = "visible";
                    document.getElementById("nextButton").addEventListener("click", home);
                    document.getElementById("override").addEventListener("click", tryAgain);
                } else {
                    document.getElementById("systemAns").innerHTML = "";
                    document.getElementById("userAns").value = "";
                    document.getElementById("nextButton").innerHTML = "Answer";
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
                document.getElementById("override").style.visibility = "visible";
                document.getElementById("nextButton").innerHTML = "Next";
                if (document.getElementById("userAns").value.toLowerCase() === questions[index].answer.toLowerCase()) {
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
                document.getElementById("nextButton").innerHTML = "Answer";
                document.getElementById("card").innerHTML = questions[index].content;
            }

            function addAnswerData(ansCorrect) {
                let id = questions[index].id;
                let timesCorrect = questions[index].timesCorrect;
                let timesIncorrect = questions[index].timesIncorrect;
                console.log("id=" + id);
                console.log("correct=" + timesCorrect);
                console.log("incorrect=" + timesIncorrect);

                if (ansCorrect) {
                    timesCorrect++;
                    questions[index].timesCorrect++
                } else {
                    timesIncorrect++;
                    questions[index].timesIncorrect++
                }

                let answerData = new FormData;
                answerData.append("id", id);
                answerData.append("timesCorrect", timesCorrect);
                answerData.append("timesIncorrect", timesIncorrect);

                fetch('/question/updateProgress', {method: 'post', body: answerData}
                ).then(response => response.json()
                ).then(responseData => {
                    if (responseData.hasOwnProperty('error')) {
                        alert(responseData.error);
                    }
                });

                console.log("correct=" + questions[index].timesCorrect);
                console.log("incorrect=" + questions[index].timesIncorrect);

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
        }
    });

}

function addToScore(correct) {
    let score = 0;
    let formData1 = new FormData;
    formData1.append("token", document.cookie);
    fetch('/student/select', {method: 'post', body: formData1}
    ).then(response => response.json()
    ).then(scoreData => {
        if (scoreData.hasOwnProperty('error')) {
            alert(scoreData.error);
        } else {
            score = parseInt(scoreData[0].score);
            score += correct;
            let formData2 = new FormData;
            formData2.append("token", document.cookie);
            formData2.append("score", score);
            fetch('/student/update', {method: 'post', body: formData2}
            ).then(response => response.json()
            ).then(questions => {
                if (questions.hasOwnProperty('error')) {
                    alert(questions.error);
                }
            });
        }
    });



}

function home() {
    window.location.href = "/client/student.html";
}
function tryAgain() {
    window.location.href = "/client/test.html?" + subjectID;
}
