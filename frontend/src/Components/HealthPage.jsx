// src/components/HealthPage.jsx
import React, { useState, useRef } from 'react';
import axios from 'axios';
import './HealthPage.css';

const HealthPage = () => {
    const [formData, setFormData] = useState({
        weight: '',
        height: '',
        age: '',
        gender: '',
        activityLevel: '',
        dietPreference: '',
        healthIssues: '',
    });
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const responseRef = useRef(null);

    const API_KEY = 'AIzaSyC-Mb6fH8gHNMP4iYSb6NBzym60jnD_lrc';
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const prompt = `Generate a personalized health and diet plan based on the following details in JSON format:
            {
                "dailyCalories": "Calculate daily calorie requirement",
                "mealPlan": {
                    "breakfast": ["List of breakfast items"],
                    "lunch": ["List of lunch items"],
                    "dinner": ["List of dinner items"],
                    "snacks": ["List of healthy snacks"]
                },
                "macronutrients": {
                    "protein": "grams per day",
                    "carbs": "grams per day",
                    "fats": "grams per day"
                },
                "hydration": "Daily water intake recommendation",
                "exerciseRoutine": ["List of recommended exercises"],
                "postureTips": ["List of posture improvement tips"]
            }

            User Details:
            Weight: ${formData.weight}
            Height: ${formData.height}
            Age: ${formData.age}
            Gender: ${formData.gender}
            Activity Level: ${formData.activityLevel}
            Diet Preference: ${formData.dietPreference}
            Health Issues: ${formData.healthIssues}`;

            console.log('Sending request to API...');
            const response = await axios.post(`${API_URL}?key=${API_KEY}`, {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            });

            console.log('Response received:', response.data);
            const responseText = response.data.candidates[0].content.parts[0].text;
            const jsonStart = responseText.indexOf('{');
            const jsonEnd = responseText.lastIndexOf('}') + 1;
            const jsonStr = responseText.slice(jsonStart, jsonEnd);
            const parsedResponse = JSON.parse(jsonStr);
            setResponse(parsedResponse);
        } catch (error) {
            console.error('Error:', error);
            setResponse(null);
        }
        setLoading(false);
    };

    return (
        <div className="health-page-wrapper">
            <div className="health-page">
                <div className="form-container">
                    <h1>Health Planner</h1>
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="number" 
                            name="weight" 
                            placeholder="Weight (kg)" 
                            value={formData.weight} 
                            onChange={handleChange} 
                            required 
                            min="1"
                            max="300"
                        />
                        <input 
                            type="number" 
                            name="height" 
                            placeholder="Height (cm)" 
                            value={formData.height} 
                            onChange={handleChange} 
                            required 
                            min="1"
                            max="300"
                        />
                        <input 
                            type="number" 
                            name="age" 
                            placeholder="Age" 
                            value={formData.age} 
                            onChange={handleChange} 
                            required 
                            min="1"
                            max="120"
                        />
                        <select name="gender" value={formData.gender} onChange={handleChange} required>
                            <option value="">Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} required>
                            <option value="">Activity Level</option>
                            <option value="sedentary">Sedentary</option>
                            <option value="lightly active">Lightly Active</option>
                            <option value="active">Active</option>
                            <option value="very active">Very Active</option>
                        </select>
                        <select name="dietPreference" value={formData.dietPreference} onChange={handleChange} required>
                            <option value="">Diet Preference</option>
                            <option value="vegetarian">Vegetarian</option>
                            <option value="non-veg">Non-Veg</option>
                            <option value="vegan">Vegan</option>
                            <option value="keto">Keto</option>
                        </select>
                        <input type="text" name="healthIssues" placeholder="Any Health Issues" value={formData.healthIssues} onChange={handleChange} />
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Generating Plan...' : 'Generate Health Plan'}
                        </button>
                    </form>
                </div>

                {response && (
                    <div className="response-container" ref={responseRef}>
                        <h2>Your Personalized Health Plan</h2>
                        
                        <div className="response-section">
                            <h3>Daily Calorie Requirement</h3>
                            <p>{response.dailyCalories}</p>
                        </div>

                        <div className="response-section">
                            <h3>Meal Plan</h3>
                            <div className="meal-plan">
                                <h4>Breakfast</h4>
                                <ul>
                                    {response.mealPlan.breakfast.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                                
                                <h4>Lunch</h4>
                                <ul>
                                    {response.mealPlan.lunch.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                                
                                <h4>Dinner</h4>
                                <ul>
                                    {response.mealPlan.dinner.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                                
                                <h4>Snacks</h4>
                                <ul>
                                    {response.mealPlan.snacks.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="response-section">
                            <h3>Macronutrients</h3>
                            <div className="macros">
                                <p>Protein: {response.macronutrients.protein}</p>
                                <p>Carbs: {response.macronutrients.carbs}</p>
                                <p>Fats: {response.macronutrients.fats}</p>
                            </div>
                        </div>

                        <div className="response-section">
                            <h3>Hydration</h3>
                            <p>{response.hydration}</p>
                        </div>

                        <div className="response-section">
                            <h3>Exercise Routine</h3>
                            <ul>
                                {response.exerciseRoutine.map((exercise, index) => (
                                    <li key={index}>{exercise}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="response-section">
                            <h3>Posture Tips</h3>
                            <ul>
                                {response.postureTips.map((tip, index) => (
                                    <li key={index}>{tip}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HealthPage;