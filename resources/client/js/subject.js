let subjectID = window.location.toString().substring(window.location.toString().indexOf("=")+1, window.location.toString().indexOf("_"));
function pageLoadSubject() {
    let url = window.location.toString();
    let name = url.substring(url.indexOf("&")+1);

    document.getElementById("logoutButton").addEventListener("click", logout);
    document.getElementById("addQ").addEventListener("click", addQuestion);
    document.getElementById("deleteSub").addEventListener("click", deleteSub);
    document.title = name;
    document.getElementById("title").innerHTML = "Welcome to " + name + "!";
    listSubjects();
    listQuestions(subjectID);
}

function listQuestions(id) {
    let questionsHTML = '<table id="table">' +
        '<tr>' +
        '<th>Question Number</th>' +
        '<th>Content</th>' +
        '<th>Answer</th>' +
        '<th>Times Correct</th>' +
        '<th>Times Incorrect</th>' +
        '<th class="last">Options</th>' +
        '</tr>';

    let formData = new FormData;
    formData.append('id', id);
    fetch('/question/list', {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(questions => {
        for (let x = 0; x < questions.length; x++) {
            let question = questions[x];
            questionsHTML += `<tr contenteditable="false">` +
                `<td data-id='${question.id}'>${x+1}</td>` +
                `<td contenteditable="true">${question.content}</td>` +
                `<td contenteditable="true">${question.answer}</td>` +
                `<td>${question.timesCorrect}</td>` +
                `<td>${question.timesIncorrect}</td>` +
                `<td class="last">` +
                `<button class='editButton' data-id='${question.id}'>Submit Edit</button>` +
                `<button class='deleteButton' data-id='${question.id}'>Delete</button>` +
                `</td>` +
                `</tr>`;
        }
        questionsHTML += '</table>';
        document.getElementById("listDiv").innerHTML = questionsHTML;
        let editButtons = document.getElementsByClassName("editButton");
        for (let button of editButtons) {
            button.addEventListener("click", submitEdit);
        }
        let deleteButtons = document.getElementsByClassName("deleteButton");
        for (let button of deleteButtons) {
            button.addEventListener("click", deleteQuestion);
        }
    });
}

function submitEdit(event) {
    let table = document.getElementById("table");
    const id = event.target.getAttribute("data-id");
    let content = "";
    let answer = "";

    for (let x = 1; x < table.rows.length; x++) {
        if ((table.rows[x].cells[0].getAttribute("data-id")) === id) {
            content = (table.rows[x].cells[1].innerHTML).trim();
            answer = (table.rows[x].cells[2].innerHTML).trim();
        }
    }

    let formData = new FormData;
    formData.append('id', id);
    formData.append('content', content);
    formData.append('answer', answer);

    fetch("/question/update", {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(responseData => {
        if (responseData.hasOwnProperty('error')) {
            alert(responseData.error);
        }
    });
}

function deleteQuestion(event) {
    const id = event.target.getAttribute("data-id");

    let formData = new FormData;
    formData.append('id', id);

    fetch("/question/delete", {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(responseData => {
        if (responseData.hasOwnProperty('error')) {
            alert(responseData.error);
        } else {
            listQuestions(subjectID);
        }
    });
}

function addQuestion() {
    document.getElementById("addQ").hidden = true;
    let table = document.getElementById("table");
    let row = table.insertRow(table.rows.length);
    let id = row.insertCell(0);
    let content = row.insertCell(1);
    let answer = row.insertCell(2);
    let correct = row.insertCell(3);
    let incorrect = row.insertCell(4);
    let options = row.insertCell(5);

    id.innerHTML = "--";
    content.innerHTML = "content";
    answer.innerHTML = "answer";
    correct.innerHTML = "0";
    incorrect.innerHTML = "0";
    options.innerHTML = `<button class='editButton' data-id='' onclick="submitQuestion()">Submit New</button>` +
        `<button class='deleteButton' data-id='' onclick="cancelAdd()">Cancel</button>`;
    content.contentEditable = "true";
    answer.contentEditable = "true";

}

function submitQuestion() {
    let table = document.getElementById("table");
    let content = "";
    let answer = "";

    for (let x = 1; x < table.rows.length; x++) {
        if ((table.rows[x].cells[0].innerHTML) === "--") {
            content = (table.rows[x].cells[1].innerHTML).trim();
            answer = (table.rows[x].cells[2].innerHTML).trim();
        }
    }

    let formData = new FormData;
    formData.append("subjectID", subjectID);
    formData.append("content", content);
    formData.append("answer", answer);
    fetch("/question/add", {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(responseData => {
        if (responseData.hasOwnProperty('error')) {
            alert(responseData.error);
        } else {
            listQuestions(subjectID);
            document.getElementById("addQ").hidden = false;
        }
    });
}

function cancelAdd() {
    let table = document.getElementById("table");
    table.deleteRow(table.rows.length-1);
    document.getElementById("addQ").hidden = false;
}

function deleteSub() {
    let areYouSure;
    areYouSure = confirm("Are you sure? This is irreversible");
    if (areYouSure) {
        let formData = new FormData;
        formData.append("id", subjectID);
        fetch("/subject/delete", {method: 'post', body: formData}
        ).then(response => response.json()
        ).then(responseData => {
            if (responseData.hasOwnProperty('error')) {
                alert(responseData.error);
            } else {
                window.location.href = "/client/student.html";
            }
        });
    }
}

function flashcard() {
    window.location.href = "/client/flashcard.html?id=" + subjectID;
}
function test() {
    window.location.href = "/client/test.html?id=" + subjectID;
}
function quiz() {
    let table = document.getElementById("table");
    if (table.rows.length > 10) {
        window.location.href = "/client/quiz.html?id=" + subjectID;
    } else {
        alert("You need more than 10 questions to start a quiz");
    }
}


