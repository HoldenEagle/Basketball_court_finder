
export function getUserLocation() {
    //promis is a promise that this function will be completed. 
    //either pending , (not completed) , fullfilled (has a result) , or rejected (promise has reson for failure)
    return new Promise((resolve, reject) => {
        //determines if browser supports it
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    //success callback
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    reject(error);
                }
            );
        } else {
            reject(new Error("Geolocation is not supported by this browser."));
        }
    });
}

function showPosition(position) {
    // Get coordinates from the position object
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    alert(`Latitude: ${lat}, Longitude: ${lon}`);
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}