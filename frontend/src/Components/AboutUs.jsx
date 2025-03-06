import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
    return (
        <div className='about-us'>
            <h1>About Us</h1>
            <p>Welcome to our project! We are dedicated to providing the best solutions for our users.</p>
            <h2>Project Overview</h2>
            <p>This project aims to revolutionize the way users interact with technology, making it more accessible and user-friendly.</p>
            <h2>Meet Our Leader</h2>
            <p><strong>Sanajan</strong> is the visionary behind this project, leading our team with passion and expertise.</p>
            <p>With a background in software development and a keen eye for design, Sanajan ensures that our project meets the highest standards.</p>
            <img src='path_to_image.jpg' alt='Sanajan' className='leader-image' />
        </div>
    );
};

export default AboutUs; 