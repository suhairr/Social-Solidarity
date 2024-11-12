import ApiService from "./ApiService.js";

// Map setup
function initializeMap() {
    const map = L.map('map').setView([32.885353, 13.180161], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    return map;
}


// Updates the status element
function getStatus(element, status) {
    element.textContent = status ? 'نشـــط' : 'غير نشـــط';
    element.style.color = status ? 'green' : 'red';
}

// Sets the display and content of the followedBy element
function createFollowedByElement(item, element) {
    if (item.followedById) {
        element.style.display = 'block';
        element.textContent = `تتبع : ${item.followedBy.name}`;
    } else {
        element.style.display = 'none';
    }
}

// Creates the popup content for a given item
function createContent(item) {
    const template = document.getElementById('popup-template');
    const clone = template.content.cloneNode(true);

    // Element selection
    const popupName = clone.querySelector('.popup-name');
    const popupFollowedBy = clone.querySelector('.popup-followedby');
    const popupEmployee = clone.querySelector('.popup-employee');
    const popupGuests = clone.querySelector('.popup-guests');
    const popupStatus = clone.querySelector('.popup-status');
    const popupButton = clone.querySelector('.popup-button');

    // Set values
    popupName.textContent = item.name;
    createFollowedByElement(item, popupFollowedBy);
    popupEmployee.textContent = `النزلاء : 1000`;
    popupGuests.textContent = `العملاء : 1000`;
    getStatus(popupStatus, item.status);

    // Add event listener for the button to open Google Maps
    popupButton.addEventListener('click', () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`;
        window.open(url, '_blank');
    });

    return clone; // Return the DOM element instead of HTML
}

const customIcon = L.icon({
    iconUrl: 'Images\\location-pin.png', // Path to your custom pin image
    iconSize: [40, 40],              // Size of the icon [width, height]
    iconAnchor: [16, 32],            // Anchor point of the icon (for centering)
    popupAnchor: [0, -32]            // Where the popup opens relative to the icon anchor
});

var i = 0;
// Add markers to the map
function addMarkersToMap(map, data) {
    data.forEach(item => {
        if (i % 2 === 0) {
            const marker = L.marker([item.latitude, item.longitude], { icon: customIcon }).addTo(map);
            // Bind dynamic popup content
            marker.bindPopup(() => {
                return createContent(item);
            });

            marker.on('click', () => marker.openPopup());
        }
        else {
            const marker = L.marker([item.latitude, item.longitude]).addTo(map);
            // Bind dynamic popup content
            marker.bindPopup(() => {
                return createContent(item);
            });

            marker.on('click', () => marker.openPopup());
        }
        i++;
    });
}

// Main function to initialize the map and markers
async function main() {
    const map = initializeMap();

    // Fetch data from API
    try {
        const apiService = new ApiService('http://41.208.70.174/Api/api/Institution');
        const data = await apiService.getAll('getall');

        // Add markers to the map
        addMarkersToMap(map, data);
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Could not load map data. Please try again later.");
    }
}

main();
