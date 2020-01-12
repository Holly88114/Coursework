let subjectID;
// assigns the subjectID from the website url

function pageLoadFlash() {
    // function called on page load for the flashcards page

    if (window.location.toString().indexOf("#") === -1) {
        subjectID = window.location.toString().substring(window.location.toString().indexOf("=")+1);
    } else {
        subjectID = window.location.toString().substring(window.location.toString().indexOf("=")+1 , window.location.toString().indexOf("#"));
    }
    // assigns the subjectID variable dependant on the url

    listSubjects();
    // lists the users subejcts for the side bar

    let formData = new FormData;
    formData.append('id', subjectID);
    // append the id to the form data
    fetch('/question/list', {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(questions => {
        if (questions.hasOwnProperty('error')) {
            alert(questions.error);
            // if the question data has an error property, print it
        } else {
            document.getElementById("answerButton").addEventListener("click", check);
            document.getElementById("nextButton").addEventListener("click", getNextQuestion);
            // set the event listeners to show the answer and get the next question
            let index = 0;
            // index of the current question
            let lastIndex = 0;
            // index of the previous question
            let count = 0;
            // amount of cards seen
            // declare all of the variables

            function getNextQuestion() {
                // function to get the next question
                count++;
                // increments the count of the number of cards seen
                if (count % 10 === 0) {
                    // checks if the count is a multiple of 10
                    document.getElementById("qaTitle").innerHTML = count + " Questions Answered" + '<br>' + "Click Next to Continue";
                    document.getElementById("card").innerHTML = "";
                    // shows the user how many cards they have seen
                } else {
                    // shows the user the next question
                    let ln = questions.length;
                    // assign ln as the length of the question data
                    do {
                        index = Math.floor(Math.random() * ln);
                    } while (index === lastIndex);
                    // loops until the next question will be different from the last question
                    lastIndex = index;
                    // sets the last index to the current index before the current index is changed
                    showQuestion();
                    // shows the question
                }
            }

            function showAnswer() {
                // function to show the answer to the user
                document.getElementById("qaTitle").innerHTML = "Answer";
                // changes the title to 'answer'
                document.getElementById("answerButton").innerHTML = "Question";
                // changes the button text so the user can click to go back to the question
                document.getElementById("card").innerHTML = questions[index].answer;
                // adds the answer text to the 'card' div
            }
            function showQuestion() {
                // function to show the question
                document.getElementById("qaTitle").innerHTML = "Question";
                // changes the title to 'question'
                document.getElementById("answerButton").innerHTML = "Answer";
                // changes the button text so the user can click to see the answer
                document.getElementById("card").innerHTML = questions[index].content;
                // adds the question to the 'card' div
            }

            function check() {
                // function to check if the user wants to see the question or the answer
                if (document.getElementById("answerButton").innerHTML === "Answer") {
                    // if the button text is answer:
                    showAnswer();
                } else {
                    // otherwise the button text will be question so:
                    showQuestion();
                }
            }
        }
    });
}