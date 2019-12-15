function pageLoad() {
    if (window.location.search === '?logout') {
        document.getElementById("content").innerHTML = '<h1>Logging out, please wait...</h1>';
        logout();
    } else {
        document.getElementById("loginButton").addEventListener("click", login);
    }

    function login(event) {
        event.preventDefault();
        const form = document.getElementById("loginForm");
        const formData = new FormData(form);

        if (document.getElementById("T").checked === true) {
            fetch("/teacher/login", {method: 'post', body: formData}
            ).then(response => response.json()
            ).then(responseData => {
                if (responseData.hasOwnProperty('error')) {
                    alert(responseData.error);
                } else {
                    Cookies.set("email", responseData.email);
                    Cookies.set("token", responseData.token);
                    window.location.href = "/client/class.html"
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

    function logout() {
        fetch("/user/logout", {method: 'post'}
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

