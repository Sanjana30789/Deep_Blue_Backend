import React, { useEffect, useState } from 'react';

const LoadingSpinner = () => <div className='spinner'>Loading...</div>;

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [aboutMe, setAboutMe] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:5000/user', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });

                const userData = await response.json();
                if (response.ok) {
                    const loggedInUserId = localStorage.getItem('user_id');
                    const currentUser = userData.find(user => user._id === loggedInUserId);
                    setUser(currentUser);
                    setFormData({
                        name: currentUser.name,
                        email: currentUser.email,
                        chair_id: currentUser.chair_id,
                        age: currentUser.age || '',
                        dob: currentUser.dob || ''
                    });
                    setAboutMe(currentUser.aboutMe || '');
                } else {
                    console.error('Error fetching user:', userData.msg);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting:', formData);
        console.log('User ID:', user._id);
        const response = await fetch(`http://localhost:5000/user/${user._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const updatedUser = await response.json();
            console.log('Updated User:', updatedUser);
            setUser(updatedUser);
            setIsEditing(false);
        } else {
            console.error('Error updating user:', await response.json());
        }
    };

    return (
        <div className="profile">
            {user ? (
                <div>
                    <h2>Profile Information</h2>
                    <p><strong>Name:</strong> {isEditing ? <input name='name' value={formData.name} onChange={handleChange} /> : user.name}</p>
                    <p><strong>Email:</strong> {isEditing ? <input name='email' value={formData.email} onChange={handleChange} /> : user.email}</p>
                    <p><strong>Chair ID:</strong> {user.chair_id}</p>
                    <p><strong>About Me:</strong> {isEditing ? <textarea name='aboutMe' value={aboutMe} onChange={(e) => setAboutMe(e.target.value)} /> : aboutMe}</p>
                    {isEditing && (
                        <div>
                            <input name='age' placeholder='Age' value={formData.age} onChange={handleChange} />
                            <input name='dob' placeholder='Date of Birth' value={formData.dob} onChange={handleChange} />
                            <button onClick={handleSubmit}>Save</button>
                        </div>
                    )}
                    <button onClick={isEditing ? () => setIsEditing(false) : handleEditClick}>{isEditing ? 'Cancel' : 'Edit'}</button>
                </div>
            ) : (
                <LoadingSpinner />
            )}
        </div>
    );
};

export default UserProfile; 