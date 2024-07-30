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

    //if the search was successful, put a marker down on the results 
    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (let i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
        }
    }

    const initializeMap = (latitude , longitude) => {
        alert("Beginning to initialize map");
        try{
            let map;
            let service;
            let infowindow;

            const userLocation = new google.maps.LatLng(latitude, longitude);
            const mapElement = document.querySelector(".map");
            if (!mapElement){
                alert("Can't find map element");
                return;
            }
            // Initialize the map centered at userLocation with a zoom. Put in the html element with id of map
            map = new google.maps.Map(document.querySelector(".map"), {
                center: userLocation,
                zoom: 10,
            });
            let radius2 = distance * 1000;
            let key;
            if (selectedCourt === 'any'){
                key = 'Indoor basketball courts and outdoor basketball courts';
            }
            else if (selectedCourt === 'indoor'){
                key = 'Indoor basketball courts';
            }
            else if(selectedCourt === 'outdoor'){
                key = 'Outdoor basketball courts';
            }
            else{
                key = 'basketball courts';
            }


            const request = {
                location: userLocation,
                radius: '5000', // 10 kilometers
                keyword: key, //looking for basketball courts
            };
            //placeServices instance, used to search for places and get place details
            service = new google.maps.places.PlacesService(map);
            //near by search with the passed in request and returns a callback function with the results
            service.nearbySearch(request, callback);
        }catch (error) {
            alert(`Error: ${error.message}`);
            return;
        }
    }

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
        if(currentLocation){
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
                await loadGoogleMapsScript();
                setPage('Map');
                initializeMap(latitude , longitude);
                


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
                    <label for="address">Address</label>
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
                <div className="map" key="map" style={{ height: '800px', width: '100%' }}></div>
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