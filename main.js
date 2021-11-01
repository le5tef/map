ymaps.ready(load);

function load() {
    fetch('./russia.geo.json')
        .then((response) => {
            const data = response.json();
            return data;
        })
        .then((data) => {
            init(data.features[0].geometry.coordinates);
            return data;

        });
};

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    let R = 6371; // Радиус земли в километрах
    let dLat = deg2rad(lat2 - lat1);
    let dLon = deg2rad(lon2 - lon1);
    let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Расстояние в километрах
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function init(polygons) {
    var myMap = new ymaps.Map("map", {
        center: [61.698720, 99.502777],
        zoom: 3,
    }, {
        searchControlProvider: 'yandex#search'
    });

    // Задаем переменную в которой будет стакать периметр каждого полигона
    let distance = 0;
    for (let k of polygons) {
        // Задаем переменную в которой будем хранить координату предыдущей точки текущего полигона
        let prev = null;
        for (let n of k[0]) {
            if (prev != null) {
                distance += getDistanceFromLatLonInKm(prev[1], prev[0], n[1], n[0]);
            }
            prev = n
        }
        // Меняем координаты у каждой точки
        let polygon = k[0].map((x) => ([x[1], x[0]]));

        var myGeoObject = new ymaps.GeoObject({
            // Геометрия геообъекта.
            geometry: {
                type: "Polygon",
                coordinates: [polygon],
            },
        }, {
            // Описываем опции геообъекта
            strokeColor: '#0000FF',
            opacity: 0.5,
            strokeWidth: 5,
            strokeStyle: 'shortdash'
        })
        myMap.geoObjects.add(myGeoObject);
    }
    document.getElementById("distance").textContent = "Периметр: " + distance + " км.";
}
