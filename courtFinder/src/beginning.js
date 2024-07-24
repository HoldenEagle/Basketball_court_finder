import React, {useState , useEffect} from 'react';
import "./introImage.css"

const IntroImage = () => {
    const [currentPage , setPage] = useState('IntroPage');
    const [currentLocation , setCurrent] = useState(false);
    const [addressText , setAddress] = useState('');
    const [distance , setDistance] = useState(0);

    const useCurrent = () => {
        setCurrent(true);
    }

    const changeAddress = (e) => {
        const {name , value} = e.target;
        setAddress(value);
    }

    const changeDistance = (e) => {
        const {name , value} = e.target;
        setDistance(value);
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
                <input type="radio" id="AnyCourt" name="anycourt" value="any"></input>
                <label for="AnyCourt">Any Court</label>
  
                <input type="radio" id="indoor" name="anycourt" value="indoor"></input>
                <label for="indoor">Indoor Only</label>
  
                <input type="radio" id="outdoor" name="anycourt" value="outdoor"></input>
                <label for="outdoor">Outdoor Only</label>
                </div>
                <button className='submission'>Find Nearby Courts</button>




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