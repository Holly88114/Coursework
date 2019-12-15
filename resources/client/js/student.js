function pageLoad() {
    getUsername();
}

function listSubjects() {
    let formData = new FormData;
    formData.append('token', document.cookie);
    fetch("/subject/list", {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(responseData => {
        if (responseData.hasOwnProperty('error')) {
            alert(responseData.error);
        } else {
            let fullName = responseData[0].name;
            let name="";
            name = fullName.substring(0, fullName.indexOf(" "));
            document.getElementById("welcome").innerHTML = "Welcome " + name + "!";
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
            let name="";
            name = fullName.substring(0, fullName.indexOf(" "));
            document.getElementById("welcome").innerHTML = "Welcome " + name + "!";
        }
    });
}

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}