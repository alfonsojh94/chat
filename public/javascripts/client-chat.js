const socket = io();

const btnEnviar = document.getElementById('btnEnviar');
const inputNombre = document.getElementById('inputNombre');
const inputMensaje = document.getElementById('inputMensaje');
const mensajes = document.getElementById('mensajes');
const numUsuarios = document.getElementById('numUsuarios')

btnEnviar.addEventListener('click', (e) => {
    const body = {
        nombre: inputNombre.value,
        mensaje: inputMensaje.value,
        socketId: socket.id
    }
    socket.emit('mensaje_chat', body);

});

socket.on('mensaje_chat', (body) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong> ${body.nombre} : </strong> ${body.mensaje}`;

    if (body.socketId === socket.id) {
        li.classList.add('propietario');
    }

    mensajes.appendChild(li);

    const main = document.querySelector('.main')
    main.scrollTo(0, main.scrollHeight);

})

socket.on('usuarios_chat', (clientsCount) => {
    numUsuarios.innerText = clientsCount
})