function pageLoadStudent() {
    if (window.location.search === "?addSubject") {
        pageSetupAdd();
    } else {
        getUsername();
    }
    listSubjects();
    document.getElementById("logoutButton").addEventListener("click", logout);
    tableValues();
    //leaderboard();
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
            let createLink = document.createElement('a');
            createLink.setAttribute("href", "/client/student.html?addSubject");
            createLink.innerHTML = "Create Subject...";
            sideNav.appendChild(createLink);
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

function pageSetupAdd() {
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

/*label: 'Number of things',
    data: [scoreArray[0,0], scoreArray[0,1], scoreArray[0,2], scoreArray[0,3], scoreArray[0,4]],
    fill: false,
    backgroundColor: ['red', 'red', 'red', 'red', 'red'],
    order: 1*/

function table(scoreArray) {

    const canvas = document.getElementById('chartCanvas');
    const context = canvas.getContext('2d');

    let myChart = new Chart(context, {
        type: 'line',
        data: {
            labels: ['Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5'],

            datasets: []

        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        suggestedMax: 10
                    }
                }]
            },
            responsive: false
        }
    });

    for (let x = 0; x < scoreArray.length/5; x++) {

        let newDataset = {label: 'Number of things',
            data: [scoreArray[x*5], scoreArray[(x*5)+1], scoreArray[(x*5)+2], scoreArray[(x*5)+3], scoreArray[(x*5)+4]],
            fill: false,
            backgroundColor: ['red', 'red', 'red', 'red', 'red'],
            order: 1};
        myChart.data.datasets.push(newDataset);
    }

    myChart.update();

}

function tableValues() {
    let formData = new FormData;
    formData.append("token", document.cookie);

    fetch("/score/get", {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(responseData => {
        if (responseData.hasOwnProperty('error')) {
            alert(responseData.error);
        } else {
            let scoreArray = [];
            for (let x = 0; x < responseData.length; x++) {
                let num1 = (responseData[x].scores).substring(1, 3);
                let num2 = (responseData[x].scores).substring(3, 5);
                let num3 = (responseData[x].scores).substring(5, 7);
                let num4 = (responseData[x].scores).substring(7, 9);
                let num5 = (responseData[x].scores).substring(9, 11);
                scoreArray.push(num1, num2, num3, num4, num5);
            }
            table(scoreArray);

        }
    });
}

function leaderboard() {
    fetch("/class/listSpecific", {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(responseData => {
        if (responseData.hasOwnProperty('error')) {
            alert(responseData.error);
        } else {

        }
    });
}

