function pageLoad() {
    document.getElementById("cancelButton").addEventListener("click", cancel);
    document.getElementById("submit").addEventListener("click", submit);
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
    const formData = new FormData(form);
    formData.append("token", document.cookie);
    formData.append("accessType", accessType());
    console.log(formData.get("token"));
    console.log(formData.get("accessType"));
    console.log(formData.get("name"));

    fetch("/subject/add", {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(responseData => {
        if (responseData.hasOwnProperty('error')) {
            alert(responseData.error);
        } else {
            alert("Subject Create Successful!");
            window.location.href = "/client/student.html";
         }
    });
}