function pageLoadIndex() {
    // function called on page load for the index page
    if (window.location.search === '?logoutStudent') {
        // if the url is followed by ?logoutStudent
        logout(true);
        // calls the logout function with the true condition (a student)
    } else if (window.location.search === '?logoutTeacher') {
        // if the url is followed by ?logoutTeacher
        logout(false);
        // calls the logout function with the false condition (a teacher)
    } else if (window.location.search === '?newUser') {
        // if the url is followed by ?newUser
        buildPage();
        // rebuild the page to create a new user
    } else {
        document.getElementById("loginButton").addEventListener("click", login);
        // set the event listener for the login button
    }
}

function login(event) {
    event.preventDefault();
    // prevent the default action of the event
    const form = document.getElementById("loginForm");
    const formData = new FormData(form);
    // create a new FormData with the information from the html login form

    if (document.getElementById("T").checked === true) {
        // checks if the user is a teacher
        fetch("/teacher/login", {method: 'post', body: formData}
        ).then(response => response.json()
        ).then(responseData => {
            if (responseData.hasOwnProperty('error')) {
                alert(responseData.error);
                // if the response data has an error property, print it
            } else {
                Cookies.set("email", responseData.email);
                Cookies.set("token", responseData.token);
                // set the cookies of the user that just logged in
                window.location.href = "/client/teacher.html";
                // send them to the teacher homepage
            }
        });
    } else if (document.getElementById("S").checked === true) {
        // checks if the user is a student
        fetch("/student/login", {method: 'post', body: formData}
        ).then(response => response.json()
        ).then(responseData => {
            if (responseData.hasOwnProperty('error')) {
                alert(responseData.error);
                // if the response data has an error property, print it
            } else {
                Cookies.set("email", responseData.email);
                Cookies.set("token", responseData.token);
                // set the cookies of the user that just logged in
                window.location.href = "/client/student.html";
                // send them to the student homepage
            }
        });
    }
}

function logout(user) {
    // function to log out a user
    if (user) {
        // if the user variable is true, the user is a student
        fetch("/student/logout", {method: 'post'}
        ).then(response => response.json()
        ).then(responseData => {
            if (responseData.hasOwnProperty('error')) {
                alert(responseData.error);
                // if the response data has an error property, print it
            } else {
                Cookies.remove("username");
                Cookies.remove("token");
                // remove the cookies for the user that wants to log out
                window.location.href = '/client/index.html';
                // send them to the log in screen
            }
        });
    } else {
        // if the user is not a student, they must be a teacher
        fetch("/teacher/logout", {method: 'post'}
        ).then(response => response.json()
        ).then(responseData => {
            if (responseData.hasOwnProperty('error')) {
                alert(responseData.error);
                // if the response data has an error property, print it
            } else {
                Cookies.remove("username");
                Cookies.remove("token");
                // remove the cookies of the user trying to log out
                window.location.href = '/client/index.html';
                // send them to the log in screen
            }
        });
    }
}

function selectOnlyThis(id) {
    // function to only allow one user type to be selected
    // this function is called when one of the checkboxes is ticked
    if (id === "T") {
        // the teacher box is checked
        document.getElementById("S").checked = false;
        // set the student box to be unchecked
    } else {
        // the student box is checked
        document.getElementById("T").checked = false;
        // set the teacher box to be unchecked
    }
}

function buildPage() {
    // function to rebuild the page when an new user is to be made
    document.getElementById("mainBody").innerHTML = "";
    // first clears the main body of the page
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
    // rebuilds the page

    document.getElementById("submit").addEventListener("click", validate);
    document.getElementById("cancelButton").addEventListener("click", cancel);
    document.getElementById("password").addEventListener("input", text);
    document.getElementById("repeatPassword").addEventListener("input", text);
    // setting all of the event listeners for the new elements
}

function text() {
    // called when the password test boxes are typed into, to validate the passwords are strong enough and match
    if (document.getElementById("password").value !== document.getElementById("repeatPassword").value) {
        document.getElementById("match").style.visibility = "visible";
        // if the two passwords don't match, make the match element visible
    } else {
        document.getElementById("match").style.visibility = "hidden";
        // if the two passwords match, make the match element hidden
    }
    // the match element notifies the user that the passwords don't match
    if (document.getElementById("password").value.length < 7) {
        document.getElementById("length").style.visibility = "visible";
        // if the password is too short, make the length element visible
    } else {
        document.getElementById("length").style.visibility = "hidden";
        // if the password is long enough, hide the length element
    }
    // the length element notifies the user that their password is too short
}

function submit() {
    // function to create the new user

    const form = document.getElementById("newUserForm");
    const formData = new FormData(form);
    // assign the formData with the contents of the new user form element

    if (document.getElementById("T").checked === true) {
        // the user wants to create a teacher account
        fetch("/teacher/add", {method: 'post', body: formData}
        ).then(response => response.json()
        ).then(responseData => {
            if (responseData.hasOwnProperty('error')) {
                alert(responseData.error);
                // if the response data has an error property, print it
            } else {
                window.location.href = "/client/index.html"
                // send the user to log in
            }
        });
    } else if (document.getElementById("S").checked === true) {
        // the user wants to create a student account
        fetch("/student/add", {method: 'post', body: formData}
        ).then(response => response.json()
        ).then(responseData => {
            if (responseData.hasOwnProperty('error')) {
                alert(responseData.error);
                // if the response data has an error property, print it
            } else {
                window.location.href = "/client/index.html"
                // send the user to log in
            }
        });
    }
}

function validate() {
    // function to ensure the correct data gets sent to the database
    // called when a user tries to create their new account

    let p1 = document.getElementById("password").value;
    let p2 = document.getElementById("repeatPassword").value;
    // assign the two password text box values

    let student = document.getElementById("S").checked;
    let teacher = document.getElementById("T").checked;
    // assign the check box values

    let email = document.getElementById("email").value;
    // assign the email value

    if (p1 !== p2) {
        alert("Passwords must match");
        // check if the passwords match
    } else if (p1.length < 7) {
        alert("Password is too short, must exceed 7 characters");
        // check if the passwords are 7 or more characters
    } else if (!email.includes("@")) {
        alert("Email is invalid");
        // check if the email contains an @ sign
    } else if (!student && !teacher) {
        alert("Must select a user type");
        // check that a user type has been selected
    } else {
        submit();
        // all of the conditions have been met, submit the form
    }
}

function cancel() {
    // cancels creating a new user
    window.location.href = "/client/index.html";
    // send them to the main index page
}
