import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './AboutUs.css';

const teamMembers = [
    { 
        name: 'Sanjana Choubey', 
        role: 'Project Lead & Developer', 
        bio: 'Experienced developer with expertise in React and IoT integration. Passionate about creating technology that improves everyday life.',
        skills: ['React', 'Node.js', 'MongoDB', 'System Design']
    },
    { 
        name: 'Sanjeev Desai', 
        role: 'Hardware & IoT Specialist',
        bio: 'Hardware engineer specializing in sensor technology and IoT systems. Creates robust electronic solutions for complex problems.',
        skills: ['Arduino', 'ESP32', 'Sensors', 'Circuit Design']
    },
    { 
        name: 'Ashish Maurya', 
        role: 'Data Analyst | AI & UX/UI Designer',
        bio: 'Combines data insights with beautiful design. Creates intuitive interfaces that effectively communicate complex information.',
        skills: ['Data Visualization', 'Python', 'UI/UX' , 'AI Integration']
    },
    { 
        name: 'Sanika Jadhav', 
        role: 'ML Model & Researcher',
        bio: 'Data scientist focused on creating ML models for pattern recognition in posture data. Published researcher in behavioral analytics.',
        skills: ['Python', 'TensorFlow', 'Animations', 'Research Methods'] 
    }
];

const projectMilestones = [
    { year: '2023', event: 'Project inception and initial research' },
    { year: '2024 Q1', event: 'Prototype development and sensor integration' },
    { year: '2024 Q2', event: 'Machine learning model training for posture recognition' },
    { year: '2024 Q3', event: 'Mobile application development and IoT connectivity' },
    { year: '2024 Q4', event: 'User testing and product refinement' }
];

const AboutUs = () => {
    const [activeTab, setActiveTab] = useState('story');
    const [expandedMember, setExpandedMember] = useState(null);
    
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };
    
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };
    
    const pulseAnimation = {
        pulse: {
            scale: [1, 1.05, 1],
            transition: { repeat: Infinity, repeatType: "reverse", duration: 1.5 }
        }
    };
    
    return (
        <div className="about-us-wrapper">
            <motion.div 
                className="about-us"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="hero-section">
                    <motion.h1 
                        initial={{ opacity: 0, y: -30 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.8 }}
                        className="main-title"
                    >
                        ABOUT <span className="highlight">US</span>
                    </motion.h1>
                    
                    <motion.div 
                        className="tagline"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        Transforming the way you sit. For good.
                    </motion.div>
                    
                    <motion.div 
                        className="thank-you-message"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        style={{ backgroundColor: "#f7f9fc", padding: "15px", borderRadius: "8px", color: "#555" }}
                    >
                        <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: "8px" }}>• Thank you, <strong>Team DeepBlue</strong>, for providing this wonderful opportunity.</li>
                            <li style={{ marginBottom: "8px" }}>• Special thanks to <strong>Devika</strong> for her coordination and support.</li>
                            <li>• Heartfelt gratitude to the <strong>judges</strong> for listening to our solution.</li>
                        </ul>
                    </motion.div>
                </div>
                
                <div className="about-tabs">
                    <button 
                        className={`tab-button ${activeTab === 'story' ? 'active' : ''}`}
                        onClick={() => setActiveTab('story')}
                    >
                        Our Story
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'team' ? 'active' : ''}`}
                        onClick={() => setActiveTab('team')}
                    >
                        Our Team
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'journey' ? 'active' : ''}`}
                        onClick={() => setActiveTab('journey')}
                    >
                        Our Journey
                    </button>
                </div>
                
                {activeTab === 'story' && (
                    <motion.div 
                        className="tab-content"
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                    >
                        <div className="story-section">
                            <motion.div 
                                className="story-image"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="image-placeholder">
                                    <motion.div 
                                        className="smart-chair-icon"
                                        animate="pulse"
                                        variants={pulseAnimation}
                                    >
                                        🪑
                                    </motion.div>
                                </div>
                            </motion.div>
                            
                            <div className="story-content">
                                <motion.h2 
                                    variants={fadeInUp}
                                    className="section-title"
                                >
                                    Our Mission
                                </motion.h2>
                                
                                <motion.p variants={fadeInUp}>
                                    We are a passionate team of engineers and designers working to combat the health risks of prolonged sitting through innovative technology.
                                </motion.p>
                                
                                <motion.p variants={fadeInUp}>
                                    Our IoT-enabled smart chair monitors posture, tracks sitting time, and provides real-time feedback to promote better sitting habits and overall health.
                                </motion.p>
                                
                                <motion.div 
                                    className="feature-grid"
                                    variants={staggerContainer}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <motion.div className="feature" variants={fadeInUp}>
                                        <div className="feature-icon">⚡</div>
                                        <div className="feature-text">Real-time posture monitoring</div>
                                    </motion.div>
                                    
                                    <motion.div className="feature" variants={fadeInUp}>
                                        <div className="feature-icon">📈</div>
                                        <div className="feature-text">Sitting habit analytics</div>
                                    </motion.div>
                                    
                                    <motion.div className="feature" variants={fadeInUp}>
                                        <div className="feature-icon">🔔</div>
                                        <div className="feature-text">Customizable alerts</div>
                                    </motion.div>
                                    
                                    <motion.div className="feature" variants={fadeInUp}>
                                        <div className="feature-icon">🤖</div>
                                        <div className="feature-text">ML-powered insights</div>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
                
                {activeTab === 'team' && (
                    <motion.div 
                        className="tab-content"
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                    >
                        <motion.h2 
                            className="section-title centered"
                            variants={fadeInUp}
                        >
                            Meet Our Team
                        </motion.h2>
                        
                        <motion.p className="team-intro" variants={fadeInUp}>
                            Our diverse team brings together expertise in hardware, software, AI, and design to create a revolutionary product.
                        </motion.p>
                        
                        <motion.div 
                            className="team-container"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            {teamMembers.map((member, index) => (
                                <motion.div 
                                    key={index}
                                    className={`team-member ${expandedMember === index ? 'expanded' : ''}`}
                                    variants={fadeInUp}
                                    whileHover={{ 
                                        y: -5,
                                        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)' 
                                    }}
                                    onClick={() => setExpandedMember(expandedMember === index ? null : index)}
                                >
                                    <div className="member-avatar">
                                        <div className="avatar-placeholder">
                                            {member.name.charAt(0)}
                                        </div>
                                    </div>
                                    <h3 className="member-name">{member.name}</h3>
                                    <p className="member-role">{member.role}</p>
                                    
                                    {expandedMember === index && (
                                        <motion.div 
                                            className="member-details"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <p className="member-bio">{member.bio}</p>
                                            <div className="member-skills">
                                                {member.skills.map((skill, idx) => (
                                                    <span key={idx} className="skill-tag">{skill}</span>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    <div className="expand-prompt">
                                        {expandedMember === index ? 'Click to collapse' : 'Click to expand'}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
                
                {activeTab === 'journey' && (
                    <motion.div 
                        className="tab-content"
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                    >
                        <motion.h2 
                            className="section-title centered"
                            variants={fadeInUp}
                        >
                            Our Journey
                        </motion.h2>
                        
                        <motion.p className="journey-intro" variants={fadeInUp}>
                            From concept to product, follow our path to creating the smart chair of the future.
                        </motion.p>
                        
                        <motion.div 
                            className="timeline"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            {projectMilestones.map((milestone, index) => (
                                <motion.div 
                                    key={index} 
                                    className="timeline-item"
                                    variants={fadeInUp}
                                >
                                    <div className="timeline-marker"></div>
                                    <div className="timeline-content">
                                        <div className="timeline-year">{milestone.year}</div>
                                        <div className="timeline-event">{milestone.event}</div>
                                    </div>
                                </motion.div>
                            ))}
                            
                            <motion.div 
                                className="timeline-item future"
                                variants={fadeInUp}
                            >
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                    <div className="timeline-year">2025</div>
                                    <div className="timeline-event">Product launch and beyond</div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
                
                <motion.div 
                    className="cta-section"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    <h2>Ready to transform your sitting experience?</h2>
                    <button className="cta-button">Learn More About Our Product</button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default AboutUs;