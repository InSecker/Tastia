const app = require('express')()
const http = require('http').createServer(app)
const express = require('express');
const { SocketAddress } = require('net');
const io = require('socket.io')(http);
const users = [];
const restos = [
    {
        list: [
            {
                first_name: 'Prameet',
                last_name: 'Manraj',
                id: 0
            },
            {
                first_name: 'Oscar',
                last_name: 'Woodhouse',
                id: 0
            },
        ]
    },
    {
        list: [
            {
                first_name: 'Balthazar',
                last_name: 'Papin',
                id: 0
            },
        ]
    },
    { list: [] },
    {
        list: [
            {
                first_name: 'Léonard',
                last_name: 'De Vinci',
                id: 0
            },
            {
                first_name: 'Cyprien',
                last_name: 'Thao',
                id: 0
            },
        ]
    },
    { list: [] },
    { list: [] },
    { list: [] },
    { list: [] },
]

app.use(express.static('client'));

io.on('connection', function (socket) {
    // SEND UNIQUE ID TO CLIENT
    socket.on('new_user', (user) => {
        users.push({ ...user, id: socket.id })
    })

    // ADD USER TO RESTAURANT RESERVATION
    socket.on('add_user', (index) => {
        let user = users.filter((user) => user.id === socket.id)

        if (!restos[index].list.some((user) => user.id === socket.id)) {

            for (let r = 0; r < restos.length; r++) {
                if (restos[r].list.length > 0) {
                    for (let i = 0; i < restos[r].list.length; i++) {
                        if (restos[r].list[i].id === socket.id) {
                            restos[r].list.splice(i, 1);
                        }
                    }
                }
            }

            restos[index].list.push(user[0])
            socket.emit('data', restos);
        }
    })

    socket.on('ask_data', () => {
        socket.emit('data', restos);
    })

    // socket.on('pull', () => {
    //     let data =
    //         socket.emit('data', () => {

    //         })
    // })
})

http.listen(8080, function () {
    console.log('listening on *:8080');
});
