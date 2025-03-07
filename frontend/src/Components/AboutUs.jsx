import React from 'react';
import { motion } from 'framer-motion';
import './AboutUs.css';

const teamMembers = [
    { name: 'Sanjana Choubey', role: 'Project Lead & Developer' },
    { name: 'Sanjeev Desai', role: 'Hardware & IoT Specialist' },
    { name: 'Sanika Jadhav', role: 'Data Analyst & Researcher' },
    { name: 'Ashish Maurya', role: 'UX/UI Designer' }
];

const AboutUs = () => {
    return (
        <div className='about-us'>
            <motion.h1 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.8 }}
            >
                About Us
            </motion.h1>
            
            <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 1 }}
            >
                We are a passionate team working on an IoT-enabled smart chair to tackle sedentary behavior.
                Our innovative solution monitors posture, sitting time, and provides real-time alerts
                to promote a healthier lifestyle.
            </motion.p>
            
            <motion.h2 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                Meet Our Team
            </motion.h2>
            
            <div className='team-container'>
                {teamMembers.map((member, index) => (
                    <motion.div 
                        key={index} 
                        className='team-member' 
                        initial={{ opacity: 0, scale: 0.8 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                        <h3>{member.name}</h3>
                        <p>{member.role}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AboutUs;
