let blueLights = []; 
let map, directionsService, directionsRenderer;
let userMarker; 
let currentUserPos = null; // Stores the live position for the "Find" logic

window.initMap = initMap;

async function initMap() {
    try {
        const response = await fetch('locations.json');
        blueLights = await response.json();
    } catch (error) {
        console.error("Could not load locations.json:", error);
    }

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();

    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 17,
      center: { lat: 40.4277, lng: -86.9135 },
      styles: [ { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] } ]
    });

    directionsRenderer.setMap(map);

    // 1. ADD EMERGENCY BOX MARKERS
    blueLights.forEach(light => {
      new google.maps.Marker({
        position: { lat: Number(light.latitude), lng: Number(light.longitude) },
        map: map,
        title: light.name,
        icon: { url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png" }
      });
    });

    // 2. START LIVE TRACKING
    trackLiveLocation();

    document.getElementById("find-btn").addEventListener("click", findNearest);
}

function trackLiveLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition((position) => {
            currentUserPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            if (!userMarker) {
                userMarker = new google.maps.Marker({
                    position: currentUserPos,
                    map: map,
                    title: "Your Location",
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: "#4285F4",
                        fillOpacity: 1,
                        strokeColor: "white",
                        strokeWeight: 2
                    }
                });
            } else {
                userMarker.setPosition(currentUserPos);
            }
        }, (err) => console.error(err), { enableHighAccuracy: true });
    }
}

function findNearest() {
    if (!currentUserPos) {
        alert("Detecting your location...");
        return;
    }

    let closest = null;
    let shortestDistance = Infinity;

    // 1. Calculate the closest OUTDOOR point
    blueLights.forEach(light => {
        const dist = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(currentUserPos.lat, currentUserPos.lng),
            new google.maps.LatLng(light.latitude, light.longitude)
        );

        if (dist < shortestDistance) {
            shortestDistance = dist;
            closest = light;
        }
    });

    if (closest) {
        directionsService.route({
            origin: currentUserPos,
            destination: { lat: closest.latitude, lng: closest.longitude },
            travelMode: google.maps.TravelMode.WALKING,
        }, (response, status) => {
            if (status === "OK") {
                directionsRenderer.setDirections(response);
                
                // 2. Extract distance and time from Google's response
                const leg = response.routes[0].legs[0];
                const duration = leg.duration.text; // e.g., "3 mins"
                const distance = leg.distance.text; // e.g., "0.2 mi"
                
                // 3. Update the Sidebar UI instead of an alert
                const sidebar = document.getElementById("sidebar");
                sidebar.innerHTML = `
                    <h3>${closest.name}</h3>
                    <div class="time-text">${duration}</div>
                    <div class="dist-text">Fastest route via ${leg.steps[0].instructions.replace(/<\/?[^>]+(>|$)/g, "")}</div>
                    <hr>
                    <p style="font-size: 14px;">This is an <strong>${closest.type}</strong>. Emergency services will be notified upon activation.</p>
                `;
            } else {
                console.error("Directions request failed: " + status);
            }
        });
    }
}