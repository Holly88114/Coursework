function pageLoadIndex() {
    if (window.location.search === '?logoutStudent') {
        console.log("logging out");
        logout(true);
    } else if (window.location.search === '?logoutTeacher') {
        console.log("logging out");
        logout(false);
    } else if (window.location.search === '?newUser') {
        buildPage();
    } else {
        document.getElementById("loginButton").addEventListener("click", login);
    }
}

function login(event) {
    event.preventDefault();
    const form = document.getElementById("loginForm");
    const formData = new FormData(form);

    if (document.getElementById("T").checked === true) {
        console.log("teacher");
        fetch("/teacher/login", {method: 'post', body: formData}
        ).then(response => response.json()
        ).then(responseData => {
            if (responseData.hasOwnProperty('error')) {
                alert(responseData.error);
            } else {
                Cookies.set("email", responseData.email);
                Cookies.set("token", responseData.token);
                window.location.href = "/client/teacher.html"
            }
        });
    } else if (document.getElementById("S").checked === true) {
        fetch("/student/login", {method: 'post', body: formData}
        ).then(response => response.json()
        ).then(responseData => {
            if (responseData.hasOwnProperty('error')) {
                alert(responseData.error);
            } else {
                Cookies.set("email", responseData.email);
                Cookies.set("token", responseData.token);
                window.location.href = "/client/student.html"
            }
        });
    }

}

function logout(user) {
    if (user) {
        fetch("/student/logout", {method: 'post'}
        ).then(response => response.json()
        ).then(responseData => {
            if (responseData.hasOwnProperty('error')) {
                alert(responseData.error);
            } else {
                Cookies.remove("username");
                Cookies.remove("token");
                window.location.href = '/client/index.html';
            }
        });
    } else {
        fetch("/teacher/logout", {method: 'post'}
        ).then(response => response.json()
        ).then(responseData => {
            if (responseData.hasOwnProperty('error')) {
                alert(responseData.error);
            } else {
                Cookies.remove("username");
                Cookies.remove("token");
                window.location.href = '/client/index.html';
            }
        });
    }
}

function selectOnlyThis(id) {
    if (id === "T") {
        document.getElementById("S").checked = false;
    } else {
        document.getElementById("T").checked = false;
    }
}

function buildPage() {
    document.getElementById("mainBody").innerHTML = "";
    document.getElementById("mainBody").innerHTML =
        `<br>
         <div class="smallBody">
            <h1>Create new User</h1>
         </div><br>
         <div class="smallBody">
            <h3>Welcome to the Website!</h3>

            <input type="checkbox" name="teacherUser" value="Teacher" id="T" onclick="selectOnlyThis(this.id)">Teacher<br>
            <input type="checkbox" name="studentUser" value="Student" id="S" onclick="selectOnlyThis(this.id)">Student<br>
            <br>
            <form id="newUserForm">
                <label><b>Name: </b></label>
                <input type="text" placeholder="Enter Name" name="name" id="name" required><br>

                <label><b>Email: </b></label> 
                <input type="text" placeholder="Enter Email" name="email" id="email" required><br>

                <label><b>Password: </b></label>
                <input type="password" placeholder="Enter Password" name="password" id="password" required><br>
            </form>
            <label><b>Repeat Password: </b></label>
            <input type="password" placeholder="Repeat Password" name="repeatPassword" id="repeatPassword" required>
            <p class="validation" id="match">Passwords must match.</p>
            <p class="validation" id="length">Password must exceed 7 characters.</p>

            <div class="container">
                <button type="submit" class="bigButton" id="submit">Create!</button>
                <button type="button" class="bigButton" id="cancelButton">Cancel</button>
            </div>
            <br>
         </div>
    <br>`;

    document.getElementById("submit").addEventListener("click", validate);
    document.getElementById("cancelButton").addEventListener("click", cancel);
    document.getElementById("password").addEventListener("input", text);
    document.getElementById("repeatPassword").addEventListener("input", text);
}

function text() {
    if (document.getElementById("password").value !== document.getElementById("repeatPassword").value) {
        document.getElementById("match").style.visibility = "visible";
    } else {
        document.getElementById("match").style.visibility = "hidden";
    }
    if (document.getElementById("password").value.length < 7) {
        document.getElementById("length").style.visibility = "visible";
    } else {
        document.getElementById("length").style.visibility = "hidden";
    }
}

function submit() {

    const form = document.getElementById("newUserForm");
    const formData = new FormData(form);

    if (document.getElementById("T").checked === true) {
        fetch("/teacher/add", {method: 'post', body: formData}
        ).then(response => response.json()
        ).then(responseData => {
            if (responseData.hasOwnProperty('error')) {
                alert(responseData.error);
            } else {
                window.location.href = "/client/index.html"
            }
        });
    } else if (document.getElementById("S").checked === true) {
        fetch("/student/add", {method: 'post', body: formData}
        ).then(response => response.json()
        ).then(responseData => {
            if (responseData.hasOwnProperty('error')) {
                alert(responseData.error);
            } else {
                window.location.href = "/client/index.html"
            }
        });
    }
}

function validate() {
    let p1 = document.getElementById("password").value;
    let p2 = document.getElementById("repeatPassword").value;

    let student = document.getElementById("S").checked;
    let teacher = document.getElementById("T").checked;

    let email = document.getElementById("email").value;

    if (p1 !== p2) {
        alert("Passwords must match");
    } else if (p1.length < 7) {
        alert("Password is too short, must exceed 7 characters");
    } else if (!email.includes("@")) {
        alert("Email is invalid");
    } else if (!student && !teacher) {
        alert("Must select a user type");
    } else {
        submit();
    }
}

function cancel() {
    window.location.href = "/client/index.html";
}
