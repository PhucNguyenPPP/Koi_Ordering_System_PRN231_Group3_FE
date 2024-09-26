import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function HomeSlider() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    const images = [
        '/image/Slider1.jpg',
        '/image/Slider2.jpg',
        '/image/Slider3.jpg'
    ];

    return (
        <div>
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index}>
                        <img src={image} alt={`Slide ${index + 1}`} className='w-full h-72'  />
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default HomeSlider;
