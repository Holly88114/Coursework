function pageLoad() {
    if (window.location.search === '?logout') {
        document.getElementById('content').innerHTML = '<h1>Logging out, please wait...</h1>';
        logout()
    } else {
        document.getElementById("loginButton").addEventListener("click", login);
    }



    function login(event) {
        event.preventDefault();
        const form = document.getElementById("loginForm");
        const formData = new FormData(form);

        fetch("/student/login", {method: 'post', body: formData}
        ).then(response => response.json()
        ).then(responseData => {
            if (responseData.hasOwnProperty('error')) {
                alert(responseData.error);
            } else {
                Cookies.set("username", responseData.username);
                Cookies.set("token", responseData.token);
            }
        });
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
