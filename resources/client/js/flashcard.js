let subjectID = window.location.toString().substring(window.location.toString().indexOf("=")+1);

function pageLoad1() {
    listSubjects();

    let formData = new FormData;
    formData.append('id', subjectID);
    fetch('/question/list', {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(questions => {

        document.getElementById("answerButton").addEventListener("click", check);
        document.getElementById("nextButton").addEventListener("click", getNextQuestion);
        let index = 0;
        let lastIndex = 0;
        let count = 0;

        function getNextQuestion() {
            count++;
            if (count % 10 === 0) {
                document.getElementById("qaTitle").innerHTML = count + " Questions Answered" + '<br>' + "Click Next to Continue";
                document.getElementById("card").innerHTML = "";
            } else {
                let ln = questions.length;
                lastIndex = index;
                do {
                    index = Math.floor(Math.random() * ln);
                } while (index === lastIndex);
                showQuestion();
            }
        }

        function check() {
            if (document.getElementById("answerButton").innerHTML === "Answer") {
                showAnswer();
            } else {
                showQuestion();
            }
        }

        function showAnswer() {
            document.getElementById("qaTitle").innerHTML = "Answer";
            document.getElementById("answerButton").innerHTML = "Question";
            document.getElementById("card").innerHTML = questions[index].answer;
        }
        function showQuestion() {
            document.getElementById("qaTitle").innerHTML = "Question";
            document.getElementById("answerButton").innerHTML = "Answer";
            document.getElementById("card").innerHTML = questions[index].content;
        }

    });
}



















