import React, {useState , useEffect} from 'react';
import "./introImage.css"
import {getUserLocation} from './mapFunctions';
//api key

const IntroImage = () => {
    const [currentPage , setPage] = useState('IntroPage');
    const [currentLocation , setCurrent] = useState(false);
    const [addressText , setAddress] = useState('');
    const [distance , setDistance] = useState(0);
    //court selection
    const [selectedCourt, setSelectedCourt] = useState('None');
    const [longitude_inp , setLong] = useState('None');
    const [latitude_inp , setLat] = useState('None');
    const [userLoc , setUserLoc] = useState('None');

    const useCurrent = () => {
        setCurrent(true);
        setAddress('Current Location');
    }

    const changeAddress = (e) => {
        const {name , value} = e.target;
        setAddress(value);
    }

    const changeDistance = (e) => {
        const {name , value} = e.target;
        setDistance(value);
    }

    const handleBasketballType = (e) => {
        setSelectedCourt(e.target.value);
    }

    function haversineDistance(lat1, lon1, lat2, lon2) {
        // Radius of the Earth in kilometers
        const R = 6371;
    
        // Convert degrees to radians
        const lat1Rad = lat1 * (Math.PI / 180);
        const lon1Rad = lon1 * (Math.PI / 180);
        const lat2Rad = lat2 * (Math.PI / 180);
        const lon2Rad = lon2 * (Math.PI / 180);
    
        // Differences in coordinates
        const dLat = lat2Rad - lat1Rad;
        const dLon = lon2Rad - lon1Rad;
    
        // Haversine formula
        const a = Math.sin(dLat / 2) ** 2 +
                  Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                  Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
        // Distance in kilometers
        return R * c;
    }



    function createMarker(place) {
        //checking to make sure that the place has location, or else return
        if (!place.geometry || !place.geometry.location) return;

        // Puts a marker on the maps location
        const marker = new google.maps.Marker({
            map,
            position: place.geometry.location,
        });

        // Add an event listener to open an info window when the marker is clicked
        infowindow = new google.maps.InfoWindow();
        marker.addListener("click", () => {
            infowindow.setContent(place.name || "");
            infowindow.open(map, marker);
        });
    }

    

    const initializeMap = (latitude, longitude) => {
        setLat(latitude);
        setLong(longitude);
        alert("Beginning to initialize map");
    
        try {
            // Update userLoc state
            const userLocation = { lat: latitude, lng: longitude };
            setUserLoc(userLocation);
            alert(`User Location: Latitude: ${latitude}, Longitude: ${longitude}`);
    
            let keyword;
            if (selectedCourt === 'any') {
                keyword = "indoor or outdoor basketball courts";
            } else if (selectedCourt === 'indoor') {
                keyword = "indoor basketball courts";
            } else {
                keyword = "outdoor basketball courts";
            }
    
            const request = {
                location: userLocation,
                radius: String(distance * 1000), // Convert kilometers to meters
                keyword: keyword, // Looking for basketball courts
            };
    
            const service = new google.maps.places.PlacesService(document.createElement('div'));
    
            // Define callback inside initializeMap
            const callback = (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    let placesInfo = results.map(place => {
                        if (place.geometry && place.geometry.location) {
                            const placeLocation = place.geometry.location;
                            const name = place.name || "Unnamed place";
                            const address = place.vicinity || "No address available";
                            let userLat = latitude;
                            let userLng = longitude;
                            let placeLat = placeLocation.lat();
                            let placeLng = placeLocation.lng();
                            const distance = haversineDistance(userLat, userLng, placeLat, placeLng);
                            return `${name} - ${address} (Distance: ${distance.toFixed(2)} km)`;
                        }
                        return "Place without location data";
                    }).join("\n");
    
                    alert(`Found ${results.length} places:\n${placesInfo}`);
                } else {
                    alert(`No places found: ${status}`);
                }
            };
    
            service.nearbySearch(request, callback);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const loadGoogleMapsScript = () => {
        return new Promise((resolve, reject) => {
            if (document.getElementById('google-maps-script')) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyD_fO67awes0nJ9orpfk5VMkaH118EZfKU&libraries=places";
            script.id = 'google-maps-script';
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }



    //async perform tasks without blocking the main thread of execution
    const showMap = async () => {
        await loadGoogleMapsScript();
        if(currentLocation == true){
            alert('calculating current location');
            //find coordinates first
            //await pauses execution until execution of the function is settled (resolve or reject)
            //It needs to be written in a try catch to handle errors
            try {
                const { latitude, longitude } = await getUserLocation();
                alert(`Latitude: ${latitude}, Longitude: ${longitude}`);
                //make sure we have distance calculation 
                const distance_calculated = Math.round(distance);
                if(distance_calculated === 0){
                    alert("Distance in Kilometers is missing a value");
                    return;
                }
                //make sure selected court has been selected
                if(selectedCourt === 'None'){
                    alert("Please enter the court type");
                    return;
                }
                
                setPage('Map');
                initializeMap(latitude , longitude);
                


            } catch (error) {
                alert(`Error: ${error.message}`);
                return;
            }
            
            
            

        }
        else{
            alert("We are here");
            //get longitude and lattitude mean
            try{
                alert("HERE NOW");
                const geocoder = new google.maps.Geocoder();
                alert(geocoder);
                geocoder.geocode({ address: addressText }, (results, status) => {
                    if (status === google.maps.GeocoderStatus.OK) {
                        // Extract latitude and longitude from the results
                        alert("WE ARE HERE");
                        const location = results[0].geometry.location;
                        const latitude = location.lat();
                        const longitude = location.lng();
        
                        // Call the callback function with the latitude and longitude
                    
                        setPage('Map');
                        initializeMap(latitude , longitude);
                    } else {
                        alert("NOT SUCESS");
                        // Call the callback function with an error message
                    }
                });

            } catch (error) {
                alert(`Error: ${error.message}`);
                return;
            }
            
        }
    }




    let content;
    if(currentPage == 'IntroPage'){
        content = (
            <div className='Elements'>
                <h1 className='title'>Court Finder</h1>
                <p className='titleText'>Find basketball courts around you, and
                    interact <br></br> with other hoopers about the courts and the area.
                </p>
                <h2 className='title2'>Get Started Finding Courts</h2>
                <button className='currentLocation' onClick={useCurrent}>Use Current Location</button>
                <div className='form-group'>
                    <label for="address">Address: Address , City , State</label>
                    <input type="text" id="address" name="address" value={addressText} onChange={changeAddress}></input>
                </div>
                <div className='form-group'>
                    <label for = "distance">Distance in Km</label>
                    <input type="number" id = "distance" name = "distance" value={distance} onChange={changeDistance}></input>
                </div>
                <p className='typeCourt'>Type of Court</p>
                <div className='radio'>
                <input type="radio" id="AnyCourt" name="anycourt" value="any" onChange={handleBasketballType}></input>
                <label for="AnyCourt">Any Court</label>
  
                <input type="radio" id="indoor" name="anycourt" value="indoor" onChange={handleBasketballType}></input>
                <label for="indoor">Indoor Only</label>
  
                <input type="radio" id="outdoor" name="anycourt" value="outdoor" onChange={handleBasketballType}></input>
                <label for="outdoor">Outdoor Only</label>
                </div>
                <button className='submission' onClick={showMap}>Find Nearby Courts</button>
                <div className="map" key="map" style={{ height: '800px', width: '100%' }}></div>
                




            </div>
        )
    }
    else if(currentPage == 'Map'){
        content = (
            <div>
                <h1>At new page</h1>
            </div>
        )
    }
    return(
        <div>
            {content}
        </div>
    );
}

export default IntroImage;