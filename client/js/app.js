// DATA

var json = [
    {
        "name": "Grill Dehliz",
        "coord": [48.896499, 2.2353837]
    },
    {
        "name": "Vapiano",
        "coord": [48.8912656, 2.2357995]
    },
    {
        name: "Fries & Friends",
        coord: [48.8963646, 2.2404931]
    },
    {
        name: "KFC",
        coord: [48.8901914, 2.2408427]
    },
    {
        name: "Big Fernand",
        coord: [48.8942831, 2.2311567]
    },
    {
        name: "Mongoo",
        coord: [48.8957198, 2.2367614]
    },
    {
        name: "Monoprix",
        coord: [48.8966132, 2.2369309]
    },
    {
        name: "Bistrot du Fauxbourg",
        coord: [48.8957926, 2.2369127]
    },
];


// MAP

let mymap = L.map('mapid', {
    maxBounds: [
        [48.90647978628254, 2.2514247894287114],
        [48.8868715005368, 2.2220277786254887]
    ]
}).setView([48.896670, 2.236740], 15);

const iconElem = L.icon({
    iconSize: 50,
    iconUrl: "../assets/svg/Frame 1.svg",
});

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    minZoom: 15,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    detectRetina: true,
    accessToken: "pk.eyJ1IjoiaW5zZWNrZXIiLCJhIjoiY2tmanl6ZDQzMG01djMwcWhnN2wxbDFteSJ9.P382aH9Ji7TBADuQVmpdRA",
}).addTo(mymap);

const popup = document.querySelector('.popup')
const submitButton = document.getElementById('button');
const forName = document.getElementById('for_name');
const lastName = document.getElementById('last_name');
const userInfos = document.getElementById('userInfos')

console.log();

// SOCKET

const socket = io(window.location.href + ':8080');

if (localStorage.getItem('forename') && localStorage.getItem('lastname')) {
    connectClient();
}

function connectClient() {
    socket.emit('new_user', {
        first_name: localStorage.getItem('forename'),
        last_name: localStorage.getItem('lastname')
    });
    popup.classList.add('hide');
    userInfos.innerHTML = "Bienvenue, <span class='colorBlue'>" + localStorage.getItem('forename') + " " + localStorage.getItem('lastname') + "</span>";
}


submitButton.addEventListener('click', () => {
    if (forName.value === "" || lastName.value === "") {
        alert('Merci de remplir votre nom ainsi que votre prénom pour continuer.')
    } else {
        localStorage.setItem('forename', forName.value);
        localStorage.setItem('lastname', lastName.value);
        connectClient();
    };
});

let currentResto;
const restoContainer = document.getElementById('restoContainer');
const restoTitle = document.getElementById('title');
const restoList = document.getElementById('list');
const restoButton = document.getElementById('restoButton');

restoButton.addEventListener('click', () => {
    socket.emit('add_user', currentResto.index)
})

function onPinClick(e, index) {
    socket.emit('ask_data');
    currentResto = { name: e.name, index: index };
    restoContainer.classList.remove('offscreen');
    restoTitle.innerHTML = currentResto.name;
}

socket.on('data', (data) => {
    restoList.innerHTML = "Personne ne s'est inscrit dans ce restaurant pour le moment...";
    if (currentResto) {
        data[currentResto.index].list.map((item, index) => {
            if (index === 0) {
                restoList.innerHTML = `<li>${item.first_name} ${item.last_name}</li>`
            } else {
                restoList.innerHTML += `<li>${item.first_name} ${item.last_name}</li>`
            }
        });
    }

    tags.forEach((tag, index) => {
        // if (data[index].list.length > 0) {
        //     tag.innerHTML = data[index].list.length;
        // } else {
        //     this.style.display = "none";
        // }

        tag.innerHTML = data[index].list.length;
        tag.classList.remove('hide');

        if (data[index].list.length === 0) {
            tags[index].classList.add('hide');
        }
    })
})

setInterval(() => {
    socket.emit('ask_data');
}, 1000)

json.forEach((e, index) => {
    let marker = L.marker(e.coord, { icon: iconElem, alt: e.name }).addTo(mymap);

    marker.bindTooltip(e.name, {
        className: 'tooltipBox',
        direction: 'right',
        offset: [16, 0]
    }).addTo(mymap);

    L.tooltip({
        direction: "top",
        offset: [-18, 0],
        permanent: true,
        className: 'tag'
    })
        .setContent('0')
        .setLatLng(e.coord)
        .addTo(mymap);

    marker.addEventListener('click', () => onPinClick(e, index))
});

const tags = document.querySelectorAll('.tag');
