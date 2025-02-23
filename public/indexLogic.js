const API_URL = "http://localhost:8000/users";

async function loadUsers() {
    const res = await fetch(API_URL);
    const usuarios = await res.json();

    const tabla = document.getElementById("tabla-usuarios");
    tabla.innerHTML = "";

    usuarios.forEach(user => {
        tabla.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.nombre}</td>
                <td>${user.alicia}</td>
                <td>${user.rey_arturo}</td>
                <td>${user.medusa}</td>
                <td>${user.simbad}</td>
                <td>${user.dracula}</td>
                <td>${user.jekyll_hyde}</td>
                <td>${user.sherlock}</td>
                <td>${user.invisible}</td>
                <td>${user.caperucita}</td>
                <td>${user.beowulf}</td>
                <td>${user.aquiles}</td>
                <td>${user.bloody_mary}</td>
                <td>${user.sun_wukong}</td>
                <td>${user.yennenga}</td>
                <td>${user.houdini}</td>
                <td>${user.genio}</td>
                <td><button onclick="deleteUser(${user.id})">Eliminar</button></td>
            </tr>
        `;
    });
}

async function deleteUser(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadUsers();
}

loadUsers();
