let classID = window.location.toString().substring(window.location.toString().indexOf("=")+1, window.location.toString().indexOf("_"));
// gets the classID from the website url

let teacher = false;
// declaration of the teacher variable, initially set to false

function pageLoadClass() {
    userType();
    // establish how the page is to be set up
    getName();
    // get the name of the class
    document.getElementById("logoutButton").addEventListener("click", classLogout);
    // add an event listener for the logout button
}

function userType() {
    // function to determine whether the user is a student or a teacher
    let formData = new FormData;
    formData.append("token", document.cookie);
    fetch("/student/checkUser", {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(data => {
        if (data.hasOwnProperty('error')) {
            alert(data.error);
            // if the response data has an error property, print it
        } else {
            if (data.user === "teacher") {
                teacher = true;
                // if the user is a teacher, the teacher variable is set to true
            }
            initialise();
            // set up the page
        }
    });
}

function initialise() {
    // initialises the page dependent on whether the user is a teacher or a student
    if (!teacher) {
        listSubjects();
        // list the user's subjects for the side bar
        getStudents();
        // get the other students from the class
        document.getElementById("addStudent").style.visibility = "hidden";
        // hide the content that is meant for teachers only
    } else if (teacher) {
        getClasses();
        // get the other classes of the teacher for the side bar
        getStudents();
        // gets all of the students from the class
        showClassEdit();
        // builds content that is hidden from student users
    }
}

function getName() {
// function to get the name of the class
    let formData = new FormData;
    formData.append('classID', classID);
    // appends the relevant information to the formData
    fetch("/class/get", {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(responseData => {
        if (responseData.hasOwnProperty('error')) {
            alert(responseData.error);
            // if the response data has an error property, print it
        } else {
            document.getElementById("title").innerHTML = "Welcome to " + responseData[0].name + "!";
            // change the title of the page to "Welcome to (subject name)!"
        }
    });
}

function getStudents() {
    // function to print the students in a class in a table
    let studentsHTML =
        // back tick characters (``) are html
        `<table id="table">` +
        `<tr>` +
        `<th>Student Id</th>` +
        `<th>Name</th>` +
        `<th>Score</th>`;

    if (teacher) {
        studentsHTML +=
            `<th>Email</th>` +
            `<th>Active?</th>`
        // in the user is a teacher there are extra columns with the more sensitive data
    }

    studentsHTML += '</tr>';
    // builds the initial columns for the data

    let formData = new FormData;
    formData.append('classID', classID);
    // appends the required data
    fetch('/enrollment/list', {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(classStudents => {
        for (let x = 0; x < classStudents.length; x++) {
            // loop for the amount of students in the class
            let student = classStudents[x];
            // assign a temporary student variable as the xth student in the class
            studentsHTML += `<tr id="table">` +
                `<td data-id='${student.studentID}'>${x+1}</td>` +
                `<td>${student.studentName}</td>` +
                `<td>${student.score}</td>`;
            // adds the basic student data
            if (teacher === true) {
                studentsHTML +=
                    `<td>${student.studentEmail}</td>` +
                    `<td>${student.token}</td>`;
                // adds the more sensitive data, if the user accessing the page is a teacher
            }
            studentsHTML += `</tr>`;
        }
        studentsHTML += '</table>';
        // adds the end tag for the table
        document.getElementById("listDiv").innerHTML = studentsHTML;
        // add the table to the html element
    });
}


function classLogout() {
    // the logout function
    if (!teacher) {
        window.location.href = "/client/index.html/?logoutStudent";
        // if the user is a student, the user will be sent to the student logout
    } else if (teacher) {
        window.location.href = "/client/index.html/?logoutTeacher"
        // if the user is a teacher, the user will be sent to the teacher logout
    }

}
function addStudent() {
    // changes the page layout to add a student

    document.getElementById("studentEmail").style.visibility = "visible";
    document.getElementById("cancel").style.visibility = "visible";
    // change the text box and the cancel button to visible

    document.getElementById("addStudent").addEventListener("click", submitAdd);
    document.getElementById("cancel").addEventListener("click", cancelAdd);
    // add the above's event listeners

    document.getElementById("addStudent").innerHTML = "Add Student";
    // change the button text to 'add student'
}

function submitAdd() {
    // function to add the student to the class

    let email = document.getElementById("studentEmail").value;
    // assign the email variable
    let formData1 = new FormData;
    formData1.append("email", email);
    // append the email variable to the formData
    fetch("/student/search", {method: 'post', body: formData1}
    ).then(response => response.json()
    ).then(studentData => {
        if (studentData.hasOwnProperty('error')) {
            alert(studentData.error);
            // if the student data has an error property, print it
        } else {
            if (studentData[0].id === -1) {
                // if the id recieved back is -1, the user doesn't exist
                document.getElementById("studentEmail").style.color = "red";
                document.getElementById("studentEmail").value = "email not found";
                // alters the page to alert the user that the email was not found
            } else {
                let exists = false;
                // used to see if the student is already in the class
                let table = document.getElementById("table");
                for (let x = 1; x < table.rows.length; x++) {
                    if ((table.rows[x].cells[0].getAttribute("data-id")).toString() === studentData[0].id.toString()) {
                        // if the user id is already in the table, the user is already in the class
                        exists = true;
                        // set the flag to true
                    }
                }
                if (exists === false) {
                    // if the user isn't in the class,  add them
                    let formData2 = new FormData;
                    formData2.append("studentID", studentData[0].id);
                    formData2.append("classID", classID);
                    // append the student id and the class id to the form data
                    fetch("/enrollment/add", {method: 'post', body: formData2}
                    ).then(response => response.json()
                    ).then(enrollData => {
                        if (enrollData.hasOwnProperty('error')) {
                            alert(enrollData.error);
                            // if enroll data has an error property, print it
                        } else {
                            getStudents();
                            // rebuild the table as the new student will need to be added
                            cancelAdd();
                            // change the page layout back
                        }
                    });
                } else {
                    document.getElementById("studentEmail").value = "Student is already in class";
                    document.getElementById("studentEmail").style.color = "red";
                    // if the user is in the class, change the page style
                }
            }
        }
    });

}

function showClassEdit() {
    document.getElementById("teacherContent").innerHTML +=
        `<input type="text" placeholder="Enter student's Email" name="email" id="studentEmail"><br><br>
        <button type="button" class="bigButton" id="addStudent">Find new Student</button><br><br>
        <button type="button" class="bigButton" id="cancel">cancel</button><br><br>
        <button type="button" class="bigButton" id="deleteClass">Delete Class</button><br><br>`;
    // building the elements needed to add a student
    document.getElementById("deleteClass").addEventListener("click", deleteClass);
    document.getElementById("addStudent").addEventListener("click", addStudent);
    // adding the event listeners for the new elements
}

function deleteClass() {
    // function to delete the class
    let areYouSure;
    // declare the areYouSure variable
    areYouSure = confirm("Are you sure? This is irreversible");
    // an alert box is printed to ensure the user meant to delete the class
    if (areYouSure) {
        // if the user clicked yes on the alert box
        let formData = new FormData;
        formData.append("classID", classID);
        // append the classID to the form data
        fetch("/class/delete", {method: 'post', body: formData}
        ).then(response => response.json()
        ).then(responseData => {
            if (responseData.hasOwnProperty('error')) {
                alert(responseData.error);
                // if the response data has an error property, print it
            } else {
                window.location.href = "/client/teacher.html";
                // if the delete is successful, return the teacher to their homepage
            }
        });
    }
}

function cancelAdd() {
    // function to reverse the addStudent function's effects on the page
    document.getElementById("cancel").style.visibility = "hidden";
    document.getElementById("studentEmail").style.visibility = "hidden";
    // change the styles to hidden
    document.getElementById("studentEmail").value = "";
    document.getElementById("addStudent").innerHTML = "Find new Student";
    // change the text on the button back
    document.getElementById("addStudent").removeEventListener("click", submitAdd);
    // remove the event listener to the button
}
