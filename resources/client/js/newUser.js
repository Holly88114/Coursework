function pageLoad() {

    document.getElementById("submit").addEventListener("click", submit);
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

    function submit(event) {
        event.preventDefault();
        validate();

        const form = document.getElementById("newUserForm");
        const formData = new FormData(form);

        if (document.getElementById("T").checked === true) {
            fetch("/teacher/add", {method: 'post', body: formData}
            ).then(response => response.json()
            ).then(responseData => {
                if (responseData.hasOwnProperty('error')) {
                    alert(responseData.error);
                } else {
                    Cookies.set("email", responseData.email);
                    Cookies.set("token", responseData.token);
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
                    Cookies.set("email", responseData.email);
                    Cookies.set("token", responseData.token);
                    window.location.href = "/client/student.html"
                }
            });
        }
    }

    function validate() {
        let p1 = document.getElementById("password").value;
        let p2 = document.getElementById("repeatPassword").value;
        if (p1 !== p2) {
            alert("Passwords must match");
            window.location.href = "/client/newUser.html"
        } else {
            if (p1.length < 7) {
                alert("Password is too short, must exceed 7 characters");
                window.location.href = "/client/newUser.html"
            }
        }
        let email = document.getElementById("email").value;
        if (!email.includes("@")) {
            alert("Email is invalid");
            window.location.href = "/client/newUser.html"
        }
    }

    function cancel() {
        window.location.href = "/client/index.html";
    }


function selectOnlyThis(id) {
    if (id === "T") {
        document.getElementById("S").checked = false;
    } else {
        document.getElementById("T").checked = false;
    }
}