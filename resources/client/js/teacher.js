function pageLoad() {
    getClasses();
    getUsername();
    document.getElementById("delButton").addEventListener("click", deleteTeacher);
    if (window.location.search === "?addClass") {
        addNewClass();
    }
}

function getClasses() {
    let classInfo = [];
    let formData = new FormData;

    formData.append('token', document.cookie);
    formData.append('userType', String("teacher"));
    fetch("/class/listSpecific", {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(responseData => {
        if (responseData.hasOwnProperty('error')) {
            alert(responseData.error);
        } else {
            let sideNav = document.getElementById("mySideNav");

            let homeLink = document.createElement('a');
            homeLink.setAttribute("href", "/client/teacher.html");
            homeLink.innerHTML = "Home";
            sideNav.appendChild(homeLink);
            for (let x = 0; x < responseData.length; x++) {
                let subjectLink = document.createElement('a');
                subjectLink.setAttribute("href", "/client/class.html?id=" + responseData[x].id + "_name&" + responseData[x].name);
                subjectLink.innerHTML = responseData[x].name;
                sideNav.appendChild(subjectLink);
                classInfo.push(responseData[x].id, responseData[x].name);
            }
            let subjectLink = document.createElement('a');
            subjectLink.setAttribute("href", "/client/teacher.html?addClass");
            subjectLink.innerHTML = "Create New Class...";
            sideNav.appendChild(subjectLink);

            getTableData(classInfo);

        }
    });
}

function getUsername() {
    let formData = new FormData;
    formData.append('token', document.cookie);
    fetch("/teacher/select", {method: 'post', body: formData}
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

function addNewClass() {
    let element = document.getElementById("chartHere");
    element.parentNode.removeChild(element);
    document.getElementById("addClassStuff").style.visibility = "visible";
    document.getElementById("addClassStuff").innerHTML =
    `<form id="newClassForm">
            <br>
            <label><b>Class Name: </b></label>
            <input type="text" placeholder="Class Name" name="name" id="name" required><br>
        </form>

        <div class="container">
            <br>
            <button type="submit" class="bigButton" id="submit">Create!</button>
            <button type="button" class="bigButton" id="cancelButton">Cancel</button>
            <br>
        </div>
        <br>`;
    document.getElementById("submit").addEventListener("click", submitAddClass);
    document.getElementById("cancelButton").addEventListener("click", cancelClass);
}

function submitAddClass() {
    const form = document.getElementById("newClassForm");
    const formData = new FormData(form);
    formData.append("token", document.cookie);
    fetch("/class/new", {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(responseData => {
        if (responseData.hasOwnProperty('error')) {
            alert(responseData.error);
        } else {
            document.getElementById("addClassStuff").style.visibility = "hidden";
            document.getElementById("submit").removeEventListener("click", submitAddClass);
            document.getElementById("confirmation").innerHTML =
                `<div class="smallBody"><h3>Class Successfully Added</h3><br><button type="button" class="bigButton" id="OKbutton">Ok</button><br><br></div>`;
            document.getElementById("OKbutton").addEventListener("click", ok);
        }
    });
}

function getTableData(classInfo) {
    let fullClassInfo = [];

    for (let x = 0; x < classInfo.length; x+=2) {

        let formData = new FormData;
        formData.append("classID", classInfo[x]);

        fetch("/enrollment/list", {method: 'post', body: formData}
        ).then(response => response.json()
        ).then(responseData => {
            if (responseData.hasOwnProperty('error')) {
                alert(responseData.error);
            } else {
                fullClassInfo.push(classInfo[x], classInfo[x+1], responseData.length);

                if (x === classInfo.length -2) {
                    loadTable(classInfo, fullClassInfo);
                }
            }
        });
    }
}

function loadTable(classInfo, fullClassInfo) {

    const canvas = document.getElementById('chartCanvas');
    const context = canvas.getContext('2d');
    let myChart = new Chart(context, {
        type: 'bar',
        data: {
            labels: [],
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

    console.log(fullClassInfo);
    console.log(fullClassInfo.length);
    console.log(fullClassInfo.length/3);
    for (let x = 0; x < fullClassInfo.length/3; x++) {

        let newDataset = {label: fullClassInfo[(x*3)+1],
            data: [fullClassInfo[(x*3)+2]],
            fill: false,
            backgroundColor: [colourArray[x % 5]],
            borderColor: colourArray[x % 5],
            order: 1};
        myChart.data.datasets.push(newDataset);
    }

    myChart.update();

}

function deleteTeacher() {
    let areYouSure;
    areYouSure = confirm("Are you sure? This is irreversible");
    if (areYouSure) {
        let formData = new FormData;
        formData.append("token", document.cookie);
        fetch("/teacher/delete", {method: 'post', body: formData}
        ).then(response => response.json()
        ).then(responseData => {
            if (responseData.hasOwnProperty('error')) {
                alert(responseData.error);
            } else {
                window.location.href = "/client/index.html";
            }
        });
    }
}


function openNav() {
    document.getElementById("mySideNav").style.width = "250px";
}
function closeNav() {
    document.getElementById("mySideNav").style.width = "0";
}
function logout() {
    window.location.href = "/client/index.html/?logoutTeacher";
}
function cancelClass() {
    document.getElementById("addClassStuff").style.visibility = "hidden";
    document.getElementById("submit").removeEventListener("click", submitAddClass);
    document.getElementById("confirmation").innerHTML =
        `<div class="smallBody"><h3>Add Class Cancelled</h3><br><button type="button" class="bigButton" id="OKbutton">Ok</button><br><br></div>`;
    document.getElementById("OKbutton").addEventListener("click", ok)
}
function ok() {
    window.location.href = "/client/teacher.html";
}