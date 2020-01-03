let subjectID;

function pageLoadQuiz() {
    if (window.location.toString().indexOf("#") === -1) {
        subjectID = window.location.toString().substring(window.location.toString().indexOf("=")+1);
    } else {
        subjectID = window.location.toString().substring(window.location.toString().indexOf("=")+1 , window.location.toString().indexOf("#"));
    }
    listSubjects();
    document.getElementById("logoutButton").addEventListener("click", logout);
    document.getElementById("nextButton").addEventListener("click", startQuiz);
}

let index = [];

function startQuiz() {
    document.getElementById("nextButton").innerHTML = "Submit Quiz";
    document.getElementById("nextButton").removeEventListener("click", startQuiz);
    document.getElementById("qaTitle").innerHTML = "";
    let box = document.getElementById("card");
    box.innerHTML = "";

    let formData = new FormData;
    formData.append('id', subjectID);
    fetch('/question/list', {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(questions => {
        if (questions.hasOwnProperty('error')) {
            alert(questions.error);
        } else {
            document.getElementById("nextButton").addEventListener("click", markQuiz);
            makeIndex(questions.length);

            for (let x = 0; x < 10; x++) {
                let num = x+1;
                box.innerHTML += "Question " + num + ": " + questions[index[x]].content;
                box.innerHTML +=
                    `<br> <label><b>Answer: </b></label>
                <input type="text" placeholder="Enter Answer" name="answer" class="answers" required><br><br>`;
            }

            function markQuiz() {
                document.getElementById("nextButton").removeEventListener("click", markQuiz);
                window.scrollTo(0,0);
                let correct = 0;
                let answerArray = document.getElementsByClassName("answers");
                for (let x = 0; x < 10; x++) {
                    if (questions[index[x]].answer === answerArray[x].value) {
                        correct++;
                        addAnswerData(true, index[x]);
                    } else {
                        addAnswerData(false, index[x]);
                    }
                }
                addToScore(correct);
                if (correct > 6) {
                    document.getElementById("qaTitle").innerHTML = correct + "/10 Well Done!";
                    document.getElementById("qaTitle").style.color = 'green';
                } else {
                    document.getElementById("qaTitle").innerHTML = correct + "/10 More work needed.";
                    document.getElementById("qaTitle").style.color = 'red';
                }
                addToChart(correct);
            }

            function addAnswerData(ansCorrect, questionId) {
                let id = questions[questionId].id;
                let timesCorrect = questions[questionId].timesCorrect;
                let timesIncorrect = questions[questionId].timesIncorrect;

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
                ).then(responseData => {
                    if (responseData.hasOwnProperty('error')) {
                        alert(responseData.error);
                    }
                });
            }
        }
    });
}

function makeIndex(length) {
    let count = 0;
    let temp = 0;
    let match = false;
    do {
        temp = Math.floor(Math.random()*(length));
        for (let y = 0; y < index.length ; y++) {
            if (temp === index[y]) {
                match = true;
            }
        }
        if (match === true) {
            match = false;
        } else {
            index[count] = temp;
            count++;
        }
    } while (count !== 10);
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

function addToChart(correct) {
    let rawScore;
    let formData1 = new FormData;
    formData1.append("token", document.cookie);

    fetch('/score/get', {method: 'post', body: formData1}
    ).then(response => response.json()
    ).then(scoreData => {
        if (scoreData.hasOwnProperty('error')) {
            alert(scoreData.error);
        } else {
            for (let x = 0; x < scoreData.length; x++) {
                if (scoreData[x].subjectID === subjectID) {
                    rawScore = scoreData[x].scores;
                }
            }
            let newScore;
            console.log(rawScore);
            rawScore = rawScore.substring(0, 1) + rawScore.substring(3, 11);
            console.log(rawScore);
            if (correct === 10) {
                newScore = rawScore + correct;
            } else {
                newScore = rawScore + "0" + correct;
            }
            console.log(newScore);
            incrementScore(newScore);

        }
    });
}

function incrementScore(newScore) {

    console.log(newScore);
    let formData = new FormData;
    formData.append('token', document.cookie);
    formData.append('subjectID', subjectID);
    formData.append('score', newScore);
    console.log(formData.get("score"));

    fetch("/score/update", {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(responseData => {
        if (responseData.hasOwnProperty('error')) {
            alert(responseData.error);
        } else {
            document.getElementById("nextButton").innerHTML = "Return to Home";

            document.getElementById("nextButton").addEventListener("click", goHome);
        }
    });
}

function goHome() {
    window.location.href = "/client/student.html";
}