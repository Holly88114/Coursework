let classID = window.location.toString().substring(window.location.toString().indexOf("=")+1, window.location.toString().indexOf("_"));

function pageLoad1() {
    listSubjects();
    getName();
    getStudents();
    userType();
}

function getName() {
    let formData = new FormData;
    formData.append('classID', classID);
    fetch("/class/get", {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(responseData => {
        if (responseData.hasOwnProperty('error')) {
            alert(responseData.error);
        } else {
            document.getElementById("title").innerHTML = "Welcome to " + responseData[0].name + "!";
        }
    });
}

function getStudents() {
    let studentsHTML = '<table id="table">' +
        '<tr>' +
        '<th>Student Id</th>' +
        '<th>Name</th>' +
        '<th>Email</th>' +
        '<th>Score</th>' +
        '<th>Active?</th>' +
        '</tr>';

    let formData = new FormData;
    formData.append('classID', classID);
    fetch('/enrollment/list', {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(classStudents => {
        for (let x = 0; x < classStudents.length; x++) {
            let student = classStudents[x];
            studentsHTML += `<tr id="table">` +
                `<td data-id='${student.studentID}'>${x+1}</td>` +
                `<td>${student.studentName}</td>` +
                `<td class="sensitive">${student.studentEmail}</td>` +
                `<td>${student.score}</td>` +
                `<td class="sensitive">${student.token}</td>` +
                `</tr>`;
        }
        studentsHTML += '</table>';
        document.getElementById("listDiv").innerHTML = studentsHTML;

    });
}
function userType() {
    let formData = new FormData;
    formData.append("token", document.cookie);
    fetch("/student/checkUser", {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(data => {
        console.log(data.user);
        if (data.hasOwnProperty('error')) {
            alert(data.error);
        } else {
            if (data.user !== "teacher") {
                hideData();
            }
        }
    });
}
function hideData() {
    let doc = document.getElementById("table").getElementsByClassName("sensitive");
    doc.style.visibility = "hidden";
}

