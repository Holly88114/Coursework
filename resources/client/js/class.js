function pageLoad() {

    let fruitsHTML = '<table>' +
        '<tr>' +
        '<th>Id</th>' +
        '<th>Name</th>' +
        '<th>Image</th>' +
        '<th>Colour</th>' +
        '<th>Size</th>' +
        '<th class="last">Options</th>' +
        '</tr>';

    fetch('/fruit/list', {method: 'get'}
    ).then(response => response.json()
    ).then(fruits => {
        for (let fruit of fruits) {

            fruitsHTML += `<tr>` +
                `<td>${fruit.id}</td>` +
                `<td>${fruit.name}</td>` +
                `<td><img src='/client/img/${fruit.image}' 
                    alt='Picture of ${fruit.name}' height='100px'></td>` +
                `<td><span class="fruitColour" 
                    style="background-color:${fruit.colour};"></span></td>` +
                `<td>${fruit.size}</td>` +
                `<td class="last">` +
                `<button class='editButton' data-id='${fruit.id}'>Edit</button>` +
                `<button class='deleteButton' data-id='${fruit.id}'>Delete</button>` +
                `</td>` +
                `</tr>`;

        }
        fruitsHTML += '</table>';

        document.getElementById("listDiv").innerHTML = fruitsHTML;

        let editButtons = document.getElementsByClassName("editButton");
        for (let button of editButtons) {
            button.addEventListener("click", editFruit);
        }

        let deleteButtons = document.getElementsByClassName("deleteButton");
        for (let button of deleteButtons) {
            button.addEventListener("click", deleteFruit);
        }
    });

    document.getElementById("saveButton").addEventListener("click", saveEditFruit);
    document.getElementById("cancelButton").addEventListener("click", cancelEditFruit);
}
