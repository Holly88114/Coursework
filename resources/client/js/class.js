let classID = window.location.toString().substring(window.location.toString().indexOf("=")+1, window.location.toString().indexOf("_"));
let teacher = false;
function pageLoadClass() {
    userType();
    getName();
    document.getElementById("logoutButton").addEventListener("click", classLogout);
}

function initialise() {
    if (!teacher) {
        listSubjects();
        getStudents();
        document.getElementById("addStudent").style.visibility = "hidden";
    } else if (teacher) {
        getClasses();
        getStudents();
        showDeleteButton();
        document.getElementById("addStudent").addEventListener("click", addStudent);
    } else {
        initialise();
    }
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
        '<th>Score</th>';

        if (teacher) {
            studentsHTML += '<th>Email</th>' +
                '<th>Active?</th>'
        }
    studentsHTML += '</tr>';

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
                `<td>${student.score}</td>`;
            if (teacher === true) {
                studentsHTML += `<td>${student.studentEmail}</td>` + `<td>${student.token}</td>`;
            }
                studentsHTML += `</tr>`;
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
        //console.log(data.user);
        if (data.hasOwnProperty('error')) {
            alert(data.error);
        } else {
            if (data.user === "teacher") {
                teacher = true;
            }
            initialise();
        }
    });
}

function classLogout() {
    if (teacher === false) {
        window.location.href = "/client/index.html/?logoutStudent";
    } else if (teacher === true) {
        window.location.href = "/client/index.html/?logoutTeacher"
    }

}
function addStudent() {
    document.getElementById("studentEmail").style.visibility = "visible";
    document.getElementById("addStudent").innerHTML = "Add Student";
    document.getElementById("cancel").style.visibility = "visible";
    document.getElementById("addStudent").addEventListener("click", submitAdd);
    document.getElementById("cancel").addEventListener("click", cancelAdd)
}

function submitAdd() {
    let email = document.getElementById("studentEmail").value;
    let formData1 = new FormData;
    formData1.append("email", email);
    fetch("/student/search", {method: 'post', body: formData1}
    ).then(response => response.json()
    ).then(studentData => {
        if (studentData.hasOwnProperty('error')) {
            alert(studentData.error);
        } else {
            if (studentData[0].id === -1) {
                document.getElementById("studentEmail").style.color = "red";
                document.getElementById("studentEmail").value = "email not found";
            } else {
                let exists = false;
                let table = document.getElementById("table");
                for (let x = 1; x < table.rows.length; x++) {
                    if ((table.rows[x].cells[0].getAttribute("data-id")).toString() === studentData[0].id.toString()) {
                        exists = true;
                    }
                }
                if (exists === false) {
                    let formData2 = new FormData;
                    formData2.append("studentID", studentData[0].id);
                    formData2.append("classID", classID);
                    fetch("/enrollment/add", {method: 'post', body: formData2}
                    ).then(response => response.json()
                    ).then(enrollData => {
                        if (enrollData.hasOwnProperty('error')) {
                            alert(enrollData.error);
                        } else {
                            getStudents();
                            cancelAdd();
                        }
                    });
                } else {
                    document.getElementById("studentEmail").value = "Student is already in class";
                    document.getElementById("studentEmail").style.color = "red";
                }
            }
        }
    });

}

function showDeleteButton() {
    document.getElementById("teacherContent").innerHTML +=
        `<button type="button" class="bigButton" id="deleteClass">Delete Class</button><br><br>`;
    document.getElementById("deleteClass").addEventListener("click", deleteClass);
}

function deleteClass() {
    let areYouSure;
    areYouSure = confirm("Are you sure? This is irreversible");
    if (areYouSure) {
        let formData = new FormData;
        formData.append("classID", classID);
        fetch("/class/delete", {method: 'post', body: formData}
        ).then(response => response.json()
        ).then(responseData => {
            if (responseData.hasOwnProperty('error')) {
                alert(responseData.error);
            } else {
                window.location.href = "/client/teacher.html";
            }
        });
    }
}

function cancelAdd() {
    document.getElementById("cancel").style.visibility = "hidden";
    document.getElementById("studentEmail").style.visibility = "hidden";
    document.getElementById("studentEmail").value = "";
    document.getElementById("addStudent").innerHTML = "Find new Student";
    document.getElementById("addStudent").removeEventListener("click", submitAdd);
}
