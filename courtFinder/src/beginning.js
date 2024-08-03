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

    const [placesList, setPlacesList] = useState([]);
    const [resultsList , setResult] = useState([]);
    const [locationSource, setLocationSource] = useState('');
    const [numResults , setNumResults] = useState(0);


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
        
    
        try {
            // Update userLoc state
            const userLocation = { lat: latitude, lng: longitude };
            setUserLoc(userLocation);
            
    
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
                    setNumResults(results.length);
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
                            return {
                                name,
                                address,
                                distance: distance.toFixed(3)
                            };
                        }
                        //not data
                        return null;
                    }).filter(place => place !== null); //take out null locations
                    setPlacesList(placesInfo);

                    // Show the results in an alert
                    
                } else {
                    alert(`No places found: ${status}`);
                }
            };
    
            service.nearbySearch(request, callback);
            setPage('Map');
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
            script.src = "your google api key";
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
                
                setLocationSource('current location');
                initializeMap(latitude , longitude);
                


            } catch (error) {
                alert(`Error: ${error.message}`);
                return;
            }
            
            
            

        }
        else{
            
            //get longitude and lattitude mean
            try{
                
                const geocoder = new google.maps.Geocoder();
                alert(geocoder);
                geocoder.geocode({ address: addressText }, (results, status) => {
                    if (status === google.maps.GeocoderStatus.OK) {
                        // Extract latitude and longitude from the results
                        
                        const location = results[0].geometry.location;
                        const latitude = location.lat();
                        const longitude = location.lng();
        
                        // Call the callback function with the latitude and longitude
                    
                        setLocationSource(addressText);
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


    //useeffect to alert when responses have been found (when places have been found and it has changed)
    /*
    useEffect(() => {
        if(placesList.length > 0){
            //format placesList to allow us to alert it out
            const formatted_list = placesList.map(place =>{
                return `${place.name} - ${place.address} (Distance: ${place.distance} km)`;
            }).join("\n")
            alert(`Found ${placesList.length} courts:\n${formatted_list}`);
        }
    } , [placesList]);
    */



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
            <div className='map_page'>
                <h1 className='second_page_header'> {numResults} nearby Basketball Courts around {locationSource}</h1>
                <p className='simpleText'>click on any of the results to get information and reviews of the court</p>
                <div className='results-container'>
                    {placesList.map((place, index) => (
                        <button 
                            key = {index}
                            className='result-button'
                        >{place.name} - {place.address} (Distance: {place.distance} km)</button>
                    ))}
                </div>
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