function pageLoad() {
    document.getElementById("logoutButton").addEventListener("click", logout);
    getUsername();
    listSubjects();
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
            subjectLink.setAttribute("href", "/client/newSubject.html");
            subjectLink.innerHTML = "New Subject...";
            sideNav.appendChild(subjectLink);
            listClasses();
        }

    });
}
function listClasses() {
    let formData = new FormData;
    formData.append('token', document.cookie);
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
            let subjectLink = document.createElement('a');
            subjectLink.setAttribute("href", "/client/newClass.html)");
            subjectLink.innerHTML = "Find New Class...";
            sideNav.appendChild(subjectLink);
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

function openNav() {
    document.getElementById("mySideNav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySideNav").style.width = "0";
}