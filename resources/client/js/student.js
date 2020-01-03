function pageLoadStudent() {
    if (window.location.search === "?addSubject") {
        pageSetupAdd();
    } else {
        getUsername();
    }
    listSubjects();
    document.getElementById("logoutButton").addEventListener("click", logout);
    tableValues();
    leaderboard();
}

function logout() {
    window.location.href = "/client/index.html/?logoutStudent"
}

let subjectInfo = [];
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
                subjectInfo.push(responseData[x].id, responseData[x].name);
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
    const formData1 = new FormData(form);
    formData1.append("token", document.cookie);
    formData1.append("accessType", accessType());

    fetch("/subject/add", {method: 'post', body: formData1}
    ).then(response => response.json()
    ).then(responseData => {
        if (responseData.hasOwnProperty('error')) {
            alert(responseData.error);
        } else {
            window.location.href = "/client/student.html";
        }
    });
}

function table(scoreArray, responseData) {
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
            }, responsive: false
        }
    });

    let colourArray = ['red', 'blue', 'green', 'purple', 'orange'];


    for (let x = 0; x < scoreArray.length/5; x++) {
        let name;
        for (let y = 0; y < subjectInfo.length; y++) {

            if (subjectInfo[y] == responseData[x].subjectID) {
                name = subjectInfo[y+1];

            }
        }
        let newDataset = {label: name,
            data: [scoreArray[x*5], scoreArray[(x*5)+1], scoreArray[(x*5)+2], scoreArray[(x*5)+3], scoreArray[(x*5)+4]],
            fill: false,
            backgroundColor: [colourArray[x % 5], colourArray[x % 5], colourArray[x % 5], colourArray[x % 5], colourArray[x % 5]],
            borderColor: colourArray[x % 5],
            order: 1};
        myChart.data.datasets.push(newDataset);
    }
    myChart.update();


}

function tableValues() {
    let formData1 = new FormData;
    formData1.append("token", document.cookie);

    fetch("/score/get", {method: 'post', body: formData1}
    ).then(response => response.json()
    ).then(scoreData => {
        if (scoreData.hasOwnProperty('error')) {
            alert(scoreData.error);
        } else {
            let scoreArray = [];

            for (let x = 0; x < scoreData.length; x++) {
                let num1 = (scoreData[x].scores).substring(1, 3);
                let num2 = (scoreData[x].scores).substring(3, 5);
                let num3 = (scoreData[x].scores).substring(5, 7);
                let num4 = (scoreData[x].scores).substring(7, 9);
                let num5 = (scoreData[x].scores).substring(9, 11);
                scoreArray.push(num1, num2, num3, num4, num5);
            }
            table(scoreArray, scoreData);

        }
    });
}

function leaderboard() {
    fetch("/student/list", {method: 'get'}
    ).then(response => response.json()
    ).then(responseData => {
        if (responseData.hasOwnProperty('error')) {
            alert(responseData.error);
        } else {
            let array = responseData;

            for (let i = 0; i < array.length -1 ; i++) {
                for (let j = 1; j < array.length -i; j++) {
                    if (parseInt(array[j-1].score) < parseInt(array[j].score)) {
                        let temp = array[j-1];
                        array[j-1] = array[j];
                        array[j] = temp;
                    }
                }
            }

            document.getElementById("leaderboard").innerHTML = array.toString();

            let studentsHTML = '<table id="table">' +
                '<tr>' +
                '<th>Position</th>' +
                '<th>Student Name</th>' +
                '<th>Score</th>' +
                '</tr>';

                for (let x = 0; x < array.length; x++) {
                    let student = array[x];
                    studentsHTML += `<tr contenteditable="false">` +
                        `<td>${x+1}</td>` +
                        `<td>${student.name}</td>` +
                        `<td>${student.score}</td>` +
                        `</tr>`;
                }
            studentsHTML += '</table>';
                document.getElementById("leaderboard").innerHTML = studentsHTML;
        }
    });
}