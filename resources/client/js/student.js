function pageLoadStudent() {
    if (window.location.search === "?addSubject") {
        pageSetup();
    } else {
        getUsername();
    }
    listSubjects();
    document.getElementById("logoutButton").addEventListener("click", logout);
    table();
}

function logout() {
    window.location.href = "/client/index.html/?logoutStudent"
}

function listSubjects() {
    let formData = new FormData;
    formData.append('token', document.cookie);
    fetch("/subject/listSpecific", {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(responseData => {
        if (responseData.hasOwnProperty('error')) {
            alert(responseData.error);
        } else {
            let sideNav = document.getElementById("mySideNav");
            let homeLink = document.createElement('a');
            homeLink.setAttribute("href", "/client/student.html");
            homeLink.innerHTML = "Home";
            sideNav.appendChild(homeLink);
            for (let x = 0; x < responseData.length; x++) {
                let subjectLink = document.createElement('a');
                subjectLink.setAttribute("href", "/client/subject.html?id=" + responseData[x].id + "_name&" + responseData[x].name);
                subjectLink.innerHTML = responseData[x].name;
                sideNav.appendChild(subjectLink);
            }
            let subjectLink = document.createElement('a');
            subjectLink.setAttribute("href", "/client/student.html?addSubject");
            subjectLink.innerHTML = "New Subject...";
            sideNav.appendChild(subjectLink);
            listClasses();
        }

    });
}
function listClasses() {
    let formData = new FormData;
    formData.append('token', document.cookie);
    formData.append('userType', "student");
    fetch("/class/listSpecific", {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(responseData => {
        if (responseData.hasOwnProperty('error')) {
            alert(responseData.error);
        } else {
            let sideNav = document.getElementById("mySideNav");
            for (let x = 0; x < responseData.length; x++) {
                let subjectLink = document.createElement('a');
                subjectLink.setAttribute("href", "/client/class.html?id=" + responseData[x].id + "_name&" + responseData[x].name);
                subjectLink.innerHTML = responseData[x].name;
                sideNav.appendChild(subjectLink);
            }
        }
    });
}

function getUsername() {
    let formData = new FormData;
    formData.append('token', document.cookie);
    fetch("/student/select", {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(responseData => {
        if (responseData.hasOwnProperty('error')) {
            alert(responseData.error);
        } else {
            let fullName = responseData[0].name;
            let name = "";
            if (fullName.indexOf(" ") === -1) {
                name = fullName;
            } else {
                name = fullName.substring(0, fullName.indexOf(" "));
            }
            document.getElementById("welcome").innerHTML = "Welcome " + name + "!";
        }
    });
}

function pageSetup() {
    document.getElementById("mainBody").innerHTML = "";
    document.getElementById("mainBody").innerHTML =
        `<br>
        <div class="smallBody">
            <h1>Create new Subject</h1>
         </div><br>
        <div class="smallBody"><br>
    <form id="newSubjectForm">
        <label><b>Subject Name: </b></label>
        <input type="text" placeholder="Subject Name" name="name" id="name" required><br>
    </form>
    <h3>Public?<br>(share your subject with others)</h3>
    <input type="checkbox" name="accessType" id="public" ><br>

    <div class="container">
        <br>
        <button type="submit" class="bigButton" id="submit">Create!</button>
        <button type="button" class="bigButton" id="cancelButton">Cancel</button>
    </div>
    <br>
    </div>
    <br>`;

    document.getElementById("cancelButton").addEventListener("click", cancel);
    document.getElementById("submit").addEventListener("click", submit);
}

function openNav() {
    document.getElementById("mySideNav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySideNav").style.width = "0";
}

function cancel() {
    window.location.href = "/client/student.html";
}

function accessType() {
    if (document.getElementById("public").checked) {
        return true;
    } else {
        return false;
    }
}

function submit(event) {
    event.preventDefault();

    const form = document.getElementById("newSubjectForm");
    const formData = new FormData(form);
    formData.append("token", document.cookie);
    formData.append("accessType", accessType());

    fetch("/subject/add", {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(responseData => {
        if (responseData.hasOwnProperty('error')) {
            alert(responseData.error);
        } else {
            window.location.href = "/client/student.html";
        }
    });
}

function table() {

    const canvas = document.getElementById('chartCanvas');
    const context = canvas.getContext('2d');

    let myChart = new Chart(context, {
        type: 'line',

        data: {
            labels: ['Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5'],
            datasets: [{
                label: 'Number of things',
                color: 'red',
                data: [90, 80, 100, 90, 90],
                fill: false,
                backgroundColor: ['red', 'red', 'red', 'red', 'red'],
                order: 1
            }, {
                label: 'Some other things',
                data: [60, 50, 70, 50, 70],
                fill: false,
                backgroundColor: ['blue', 'blue', 'blue', 'blue', 'blue'],
                order: 2
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            responsive: false
        }
    });
}

function tableValues() {
    let formData = new FormData;

    fetch("/class/listSpecific", {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(responseData => {
        if (responseData.hasOwnProperty('error')) {
            alert(responseData.error);
        } else {

        }
    });
}