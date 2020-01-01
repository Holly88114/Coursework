function pageLoad() {
    getClasses();
    getUsername();
    if (window.location.search === "?addClass") {
        addNewClass();
    }
}

function getClasses() {
    let formData = new FormData;
    formData.append('token', document.cookie);
    formData.append('userType', "teacher");
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
            }
            let subjectLink = document.createElement('a');
            subjectLink.setAttribute("href", "/client/teacher.html?addClass");
            subjectLink.innerHTML = "Create New Class...";
            sideNav.appendChild(subjectLink);
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
    document.getElementById("addClassStuff").style.visibility = "visible";
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
            window.location.href = "/client/teacher.html";
        }
    });
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
    window.location.href = "/client/teacher.html";
}