import React, { useState, useEffect, useRef } from "react";
import "./ExercisePage.css";

// Import different GIFs
import stretchingGif from "../assets/stretching.gif";
import stretching5Gif from "../assets/stretching5.gif";
import stretching6Gif from "../assets/stretching6.gif";
import stretching4Gif from "../assets/stretching4.gif";
import yoga7Gif from "../assets/yoga7.gif";
import yoga1Gif from "../assets/yoga1.gif";
import yoga3Gif from "../assets/yoga3.gif";
import yoga6Gif from "../assets/yoga6.gif";
import strength1Gif from "../assets/strength1.gif";
import strength2Gif from "../assets/strength2.gif";
import strength4Gif from "../assets/strength4.gif";
import strength5Gif from "../assets/strength5.gif";

// Slideshow GIFs
import slideshow01 from "../assets/slideshow01.gif";
import slideshow02 from "../assets/slideshow02.gif";

const slideshowImages = [slideshow01, slideshow02];

const exercises = [
  {
    category: "Stretching",
    description: "Improve flexibility and reduce muscle tension with these stretching exercises.",
    videos: [
      { 
        gif: stretchingGif, 
        title: "Full Body Stretch",
        duration: "10 min",
        difficulty: "Beginner",
        link: "https://youtu.be/link1" 
      },
      { 
        gif: stretching5Gif, 
        title: "Morning Stretch Routine",
        duration: "15 min",
        difficulty: "Intermediate",
        link: "https://youtu.be/link2" 
      },
      { 
        gif: stretching6Gif, 
        title: "Hip Flexor Stretch",
        duration: "8 min",
        difficulty: "Beginner",
        link: "https://youtu.be/link3" 
      },
      { 
        gif: stretchingGif, 
        title: "Advanced Stretching",
        duration: "20 min",
        difficulty: "Advanced",
        link: "https://youtu.be/link4" 
      },
    ],
  },
  {
    category: "Yoga",
    description: "Find your balance and inner peace with these yoga sequences.",
    videos: [
      { 
        gif: yoga1Gif, 
        title: "Morning Yoga Flow",
        duration: "20 min",
        difficulty: "Beginner",
        link: "https://youtu.be/yoga1" 
      },
      { 
        gif: yoga3Gif, 
        title: "Power Yoga",
        duration: "30 min",
        difficulty: "Intermediate",
        link: "https://youtu.be/yoga2" 
      },
      { 
        gif: yoga7Gif, 
        title: "Restorative Yoga",
        duration: "25 min",
        difficulty: "Beginner",
        link: "https://youtu.be/yoga3" 
      },
      { 
        gif: yoga6Gif, 
        title: "Advanced Poses",
        duration: "40 min",
        difficulty: "Advanced",
        link: "https://youtu.be/yoga4" 
      },
    ],
  },
  {
    category: "Strength",
    description: "Build muscle and improve overall fitness with these strength training exercises.",
    videos: [
      { 
        gif: strength5Gif, 
        title: "Core Workout",
        duration: "15 min",
        difficulty: "Intermediate",
        link: "https://youtu.be/strength1" 
      },
      { 
        gif: strength4Gif, 
        title: "HIIT Training",
        duration: "25 min",
        difficulty: "Advanced",
        link: "https://youtu.be/strength2" 
      },
      { 
        gif: strength2Gif, 
        title: "Bodyweight Exercises",
        duration: "20 min",
        difficulty: "Beginner",
        link: "https://youtu.be/strength3" 
      },
      { 
        gif: strength1Gif, 
        title: "Full Body Strength",
        duration: "30 min",
        difficulty: "Intermediate",
        link: "https://youtu.be/strength4" 
      },
    ],
  },
];

const ExercisePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const headerRef = useRef(null);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100) {
        setIsNavVisible(true);
      } else {
        setIsNavVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Slideshow timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Toggle favorites
  const toggleFavorite = (videoTitle) => {
    if (favorites.includes(videoTitle)) {
      setFavorites(favorites.filter(title => title !== videoTitle));
    } else {
      setFavorites([...favorites, videoTitle]);
    }
  };

  // Open video details modal
  const openModal = (video) => {
    setSelectedVideo(video);
    setModalOpen(true);
  };

  // Filter exercises based on active category and search term
  const filteredExercises = activeCategory === "all" 
    ? exercises 
    : exercises.filter(exercise => exercise.category.toLowerCase() === activeCategory.toLowerCase());

  const searchFilteredExercises = searchTerm 
    ? filteredExercises.map(category => ({
        ...category,
        videos: category.videos.filter(video => 
          video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.difficulty.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.videos.length > 0)
    : filteredExercises;

  // Scroll to specific section
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="exercise-page">
      {/* Sticky Navigation */}
      <nav className={`sticky-nav ${isNavVisible ? 'visible' : ''}`}>
        <div className="nav-container">
          <h1 className="nav-title">FitFlow</h1>
          <div className="nav-buttons">
            <button 
              onClick={() => setActiveCategory("all")} 
              className={`nav-button ${activeCategory === "all" ? "active" : ""}`}
            >
              All
            </button>
            {exercises.map((exercise, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveCategory(exercise.category.toLowerCase())}
                className={`nav-button ${activeCategory === exercise.category.toLowerCase() ? "active" : ""}`}
              >
                {exercise.category}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section" ref={headerRef}>
        <div className="hero-content">
          <h1 className="hero-title fade-in">Find Your Perfect Workout</h1>
          <p className="hero-description fade-in-delay">
            Discover stretching, yoga, and strength training exercises to improve your flexibility, balance, and overall fitness.
          </p>
          
          {/* Search Bar */}
          <div className="search-container fade-in-delay-2">
            <input
              type="text"
              placeholder="Search exercises..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="search-clear-button"
                onClick={() => setSearchTerm("")}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Quick Navigation Menu */}
      <div className="quick-nav">
        <div className="quick-nav-container">
          {exercises.map((exercise, idx) => (
            <button
              key={idx}
              className="quick-nav-button"
              onClick={() => scrollToSection(exercise.category.toLowerCase())}
            >
              {exercise.category}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Slideshow */}
      <div className="featured-section fade-in">
        <h2 className="section-title">Featured Workouts</h2>
        <div className="slideshow-container">
          <div className="slideshow-content">
            <img 
              src={slideshowImages[currentSlide]} 
              alt="Featured workout" 
              className="slideshow-image fade-in"
            />
          
            <div className="slideshow-overlay">
              <div className="slideshow-text">
                <h3 className="slideshow-title">Featured Workout {currentSlide + 1}</h3>
                <p className="slideshow-description">Experience the best exercises for your daily routine</p>
                <button className="slideshow-button">
                  ▶ Watch Now
                </button>
              </div>
            </div>
          
            <button 
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slideshowImages.length) % slideshowImages.length)}
              className="slideshow-arrow slideshow-arrow-left"
            >
              &#10094;
            </button>
            <button 
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slideshowImages.length)}
              className="slideshow-arrow slideshow-arrow-right"
            >
              &#10095;
            </button>
          
            <div className="slideshow-dots">
              {slideshowImages.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`slideshow-dot ${currentSlide === idx ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Sections */}
      {searchFilteredExercises.map((exercise, index) => (
        <section 
          key={index} 
          id={exercise.category.toLowerCase()}
          className={`exercise-section ${index % 2 === 0 ? 'section-light' : 'section-white'}`}
        >
          <div className="section-container">
            <div className="section-header fade-in">
              <h2 className="section-title">{exercise.category}</h2>
              <p className="section-description">{exercise.description}</p>
            </div>
            
            <div className="video-grid">
              {exercise.videos.map((video, idx) => (
                <div 
                  key={idx} 
                  className="video-card fade-in-up"
                  style={{ animationDelay: `${0.1 * idx}s` }}
                >
                  <div className="video-image-container">
                    <img 
                      src={video.gif} 
                      alt={video.title} 
                      className="video-image"
                    />
                    <div className="video-overlay">
                      <button 
                        onClick={() => window.open(video.link, '_blank')}
                        className="video-play-button"
                      >
                        ▶
                      </button>
                    </div>
                    <div className="video-favorite">
                      <button 
                        onClick={() => toggleFavorite(video.title)}
                        className={`favorite-button ${favorites.includes(video.title) ? 'active' : ''}`}
                      >
                        ♥
                      </button>
                    </div>
                    <div className="video-duration">
                      {video.duration}
                    </div>
                    <div className="video-difficulty">
                      {video.difficulty}
                    </div>
                  </div>
                  <div className="video-content">
                    <h3 className="video-title">{video.title}</h3>
                    <div className="video-actions">
                      <button 
                        onClick={() => openModal(video)}
                        className="video-action-button"
                      >
                        ⓘ Details
                      </button>
                      <button className="video-action-button">
                        📅 Schedule
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Modal */}
      {modalOpen && selectedVideo && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-header">
              <img src={selectedVideo.gif} alt={selectedVideo.title} className="modal-image" />
              <button 
                onClick={() => setModalOpen(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>
            <div className="modal-content">
              <div className="modal-title-container">
                <h3 className="modal-title">{selectedVideo.title}</h3>
                <div className="modal-badges">
                  <span className="modal-badge modal-badge-blue">
                    {selectedVideo.duration}
                  </span>
                  <span className="modal-badge modal-badge-gray">
                    {selectedVideo.difficulty}
                  </span>
                </div>
              </div>
              <p className="modal-description">
                This {selectedVideo.duration} workout is designed for {selectedVideo.difficulty.toLowerCase()} level 
                fitness enthusiasts. Follow along to improve your technique and get the most out of your exercise routine.
              </p>
              <div className="modal-actions">
                <button 
                  onClick={() => window.open(selectedVideo.link, '_blank')}
                  className="modal-button modal-button-primary"
                >
                  ▶ Watch Now
                </button>
                <button 
                  onClick={() => toggleFavorite(selectedVideo.title)}
                  className={`modal-button modal-button-secondary ${
                    favorites.includes(selectedVideo.title) ? 'modal-button-favorite' : ''
                  }`}
                >
                  ♥ {favorites.includes(selectedVideo.title) ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      <button
        className={`back-to-top ${isNavVisible ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>
    </div>
  );
};

export default ExercisePage;