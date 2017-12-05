var infoWindow;
var map;
var pos;
var poly;
var polygonCoords = [];
var polyMarkers = [];

//FIND USER
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 20
    });
    infoWindow = new google.maps.InfoWindow;

    //GEOLOCATION
    if (navigator.geolocation) {
        getPos();
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
    map.addListener('click', addMarker);
    map.addListener('click', addToCompute);
    map.addListener('click', getArea);
};

$("#button").on("click", function() {
    getPos();
    addMarker();
    addToCompute();
});

//FUNCTIONS
function addMarker() {
    var path = poly.getPath();
        console.log(pos);
    path.push(new google.maps.LatLng(pos));
    // Add a new marker at the new plotted point on the polyline.
    var marker = new google.maps.Marker({
        position: (new google.maps.LatLng(pos)),
        title: '#' + path.getLength(),
        map: map
    });
};

function addToCompute() {
    polygonCoords = poly.getPath();
    polygonCoords.push(new google.maps.LatLng(pos));
};

function getArea() {
    var area = google.maps.geometry.spherical.computeArea(polygonCoords);
    console.log(Math.floor(area));
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
};

function getPos() {
    navigator.geolocation.getCurrentPosition(function(position) {
        pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        polyMarkers.push(pos);

        //Pushes geolocation coords to polygonCoords array in area readable format
        polygonCoords.push(new google.maps.LatLng(pos.lat, pos.lng));

        //Shows map over geolocation coordinates
        infoWindow.setPosition(pos);
        infoWindow.setContent('Start');
        infoWindow.open(map);
        map.setCenter(pos);

        getArea();

        poly = new google.maps.Polygon({
            paths: polyMarkers,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        });
        poly.setMap(map);
    },

    function() {
        handleLocationError(true, infoWindow, map.getCenter());
    });
}

