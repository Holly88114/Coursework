let subjectID;
// declare the subjectID variable

function pageLoadQuiz() {
    if (window.location.toString().indexOf("#") === -1) {
        subjectID = window.location.toString().substring(window.location.toString().indexOf("=")+1);
    } else {
        subjectID = window.location.toString().substring(window.location.toString().indexOf("=")+1 , window.location.toString().indexOf("#"));
    }
    // assigns the subjectID variable dependant on the url
    listSubjects();
    // lists the users subjects for the side bar
    document.getElementById("logoutButton").addEventListener("click", logout);
    document.getElementById("nextButton").addEventListener("click", startQuiz);
    // sets the event listeners
}

let index = [];
// declare the index array

function startQuiz() {
    // function to start the quiz

    document.getElementById("nextButton").innerHTML = "Submit Quiz";
    // change the button text as the button now submits the quiz
    document.getElementById("nextButton").removeEventListener("click", startQuiz);
    // removes the event listener that starts the quiz as this is no longer needed
    document.getElementById("qaTitle").innerHTML = "";
    // sets the title blank
    let box = document.getElementById("card");
    // assigns box as the card element
    box.innerHTML = "";
    // clears box

    let formData = new FormData;
    formData.append('id', subjectID);
    // appends the id for the fetch statement
    fetch('/question/list', {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(questions => {
        if (questions.hasOwnProperty('error')) {
            alert(questions.error);
            // if the question data has an error property, print it
        } else {
            document.getElementById("nextButton").addEventListener("click", markQuiz);
            // sets the event listener to mark the quiz
            makeIndex(questions.length);
            // makes the index array

            for (let x = 0; x < 10; x++) {
                // loops 10 times to print the 10 questions
                let num = x+1;
                // num is the question number, one more than the index
                box.innerHTML += "Question " + num + ": " +`<br>`+ questions[index[x]].content;
                // prints Question (qu num) then the question content underneath
                box.innerHTML +=
                    `<br> <label><b>Answer: </b></label>
                <input type="text" placeholder="Enter Answer" name="answer" class="answers" required><br><br>`;
                // builds the text box for each question
            }

            function markQuiz() {
                // function to mark the quiz
                document.getElementById("nextButton").removeEventListener("click", markQuiz);
                // remove the event listener to mark the quiz as it is no longer needed
                window.scrollTo(0,0);
                // puts the focus at the top of the page
                let correct = 0;
                // set correct (the number of answers correct) as 0
                let answerArray = document.getElementsByClassName("answers");
                // set answerArray as the answers element

                for (let x = 0; x < 10; x++) {
                    // loops 10 times for the 10 questions
                    if (questions[index[x]].answer === answerArray[x].value) {
                        correct++;
                        // if the answer is correct, increment the correct variable
                        addAnswerData(true, index[x]);
                        // call the addAnswerData function with the parameters true (the answer was correct) and the index value
                    } else {
                        addAnswerData(false, index[x]);
                        // call the addAnswerData function with the parameters false (the answer was not correct) and the index value
                    }
                }

                addToScore(correct);
                // adds the amount of correct answers to the users score

                if (correct > 6) {
                    document.getElementById("qaTitle").innerHTML = correct + "/10 Well Done!";
                    document.getElementById("qaTitle").style.color = 'green';
                    // if the number of correct answers is more than 6, the title is green
                } else {
                    document.getElementById("qaTitle").innerHTML = correct + "/10 More work needed.";
                    document.getElementById("qaTitle").style.color = 'red';
                    // if the number of correct answers is less than 6, the title is red
                }
                addToChart(correct);
                // adds to the chart information in the scores table
            }

            function addAnswerData(ansCorrect, questionId) {
                // function to add the data of times correct and times incorrect
                let id = questions[questionId].id;
                // sets id as the question
                let timesCorrect = questions[questionId].timesCorrect;
                let timesIncorrect = questions[questionId].timesIncorrect;
                // sets the the times correct and times incorrect variables

                if (ansCorrect) {
                    timesCorrect++;
                    // if the question was answered correctly, times correct is incremented
                } else {
                    timesIncorrect++;
                    // otherwise, the question was incorrect and times incorrect is incremented
                }

                let answerData = new FormData;
                answerData.append("id", id);
                answerData.append("timesCorrect", timesCorrect);
                answerData.append("timesIncorrect", timesIncorrect);
                // appends the required variables to the form data

                fetch('/question/updateProgress', {method: 'post', body: answerData}
                ).then(response => response.json()
                ).then(responseData => {
                    if (responseData.hasOwnProperty('error')) {
                        alert(responseData.error);
                        // if the response data has an error property, print it
                    }
                });
            }
        }
    });
}

function makeIndex(length) {
    // function to make an array of the question id's
    let count = 0;
    let temp = 0;
    let match = false;
    // initialise the variables

    do {
        // loop until the amount of questions is 10
        temp = Math.floor(Math.random()*(length));
        // set a temporary index
        for (let y = 0; y < index.length ; y++) {
            // loop through the index array
            if (temp === index[y]) {
                match = true;
                // check if the index number already exists (don't want repeat questions)
            }
        }
        if (match === true) {
            match = false;
            // if the index already exists set match back to false
        } else {
            index[count] = temp;
            count++;
            // if a match isn't found, add the temporary index to the real indexes and increment count
        }
    } while (count !== 10);
}

function addToScore(correct) {
    // function to add to the user's score
    let score = 0;
    let formData1 = new FormData;
    formData1.append("token", document.cookie);
    // append the token to the form data

    fetch('/student/select', {method: 'post', body: formData1}
    // get the student's information from the database
    ).then(response => response.json()
    ).then(scoreData => {
        if (scoreData.hasOwnProperty('error')) {
            alert(scoreData.error);
            // if the score data has an error property, print it
        } else {
            score = parseInt(scoreData[0].score);
            score += correct;
            // set score as the score received from the database, then add the amount correct
            let formData2 = new FormData;
            formData2.append("token", document.cookie);
            formData2.append("score", score);
            fetch('/student/update', {method: 'post', body: formData2}
            // update the student's score in the database
            ).then(response => response.json()
            ).then(questions => {
                if (questions.hasOwnProperty('error')) {
                    alert(questions.error);
                    // if the score data has an error property, print it
                }
            });
        }
    });
}

function addToChart(correct) {
    // function to add the number correct to the data used to construct the table
    let rawScore;
    let formData1 = new FormData;
    formData1.append("token", document.cookie);
    // append the token to the form data

    fetch('/score/get', {method: 'post', body: formData1}
    // get the score data from the
    ).then(response => response.json()
    ).then(scoreData => {
        if (scoreData.hasOwnProperty('error')) {
            alert(scoreData.error);
            // if the score data has an error property, print it
        } else {
            for (let x = 0; x < scoreData.length; x++) {
                // loop through for the length of the score data
                if (scoreData[x].subjectID === subjectID) {
                    rawScore = scoreData[x].scores;
                    // if the score data is for the same subject, make it the variable rawScore
                }
            }
            let newScore;
            rawScore = rawScore.substring(0, 1) + rawScore.substring(3, 11);
            // this removes the first entry of the score as only 5 are stored
            if (correct === 10) {
                newScore = rawScore + correct;
                // if the number correct is 10 then a prefix of 0 is not needed to make it 2 digits
            } else {
                newScore = rawScore + "0" + correct;
                // the other scores need a 0 prefix to make it 2 digits
            }

            incrementScore(newScore);
            // calls incrementScore to add the new score to the database
        }
    });
}

function incrementScore(newScore) {

    let formData = new FormData;
    formData.append('token', document.cookie);
    formData.append('subjectID', subjectID);
    formData.append('score', newScore);
    // appends the required variables

    fetch("/score/update", {method: 'post', body: formData}
    // updates the scores table
    ).then(response => response.json()
    ).then(responseData => {
        if (responseData.hasOwnProperty('error')) {
            alert(responseData.error);
            // if the response data has an error, print it
        } else {
            document.getElementById("nextButton").innerHTML = "Return to Home";
            document.getElementById("nextButton").addEventListener("click", goHome);
            // change the button text to explain what is now does
            // adds the new event listener
        }
    });
}

function goHome() {
    window.location.href = "/client/student.html";
    // sends the user back to the student home page
}