import React, {useState , useEffect} from 'react';
import "./introImage.css"

const IntroImage = () => {
    const [currentPage , setPage] = useState('IntroPage');


    let content;
    if(currentPage == 'IntroPage'){
        content = (
            <div className='Elements'>
                <h1 className='title'>Court Finder</h1>
                <p className='titleText'>Find basketball courts around you, and
                    interact with other hoopers about the courts and the area.
                </p>
                <h2 className='title2'>Get Started</h2>



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