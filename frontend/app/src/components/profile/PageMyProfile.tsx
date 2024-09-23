import React, { useState, useEffect } from 'react';
import './page-myprofile.css';
import { Input } from '../widgets/input';
import { Button } from '../widgets/button';
import { Checkbox } from '../widgets/checkbox';
import { Select } from '../widgets/select';
import { DatePicker } from '../widgets/datepicker';

export const PageMyProfile = () => {
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    localStorage.setItem('token', 'token');

    // State to hold profile data
    const [profile, setProfile] = useState({
        Username: '',
        FirstName: '',
        LastName: '',
        Email: '',
        IsEmailVerify: false,
        Gender: 'unspecified',
        SexualPreference: 'unspecified',
        BirthDate: '',
        Bio: ''
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch profile data from API on component mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:3000/users/profile',
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                const data = await response.json();
                setProfile({
                    Username: data.Username || '',
                    FirstName: data.FirstName || '',
                    LastName: data.LastName || '',
                    Email: data.Email || '',
                    IsEmailVerify: data.IsEmailVerify,
                    Gender: data.Gender || 'unspecified',
                    SexualPreference: data.SexualPreference || 'unspecified',
                    BirthDate: data.BirthDate || '',
                    Bio: data.Bio || ''
                });
                setLoading(false); // Set loading to false when data is fetched
            } catch (error) {
                setError('Failed to load profile data.');
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // Track form field changes
    useEffect(() => {
        setUnsavedChanges(true);
    }, [profile]);

    const handleSave = async () => {
        try {
           
            const response = await fetch('http://localhost:3000/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(profile),
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Profile saved successfully:', data);
                setUnsavedChanges(false);
            } else {
                console.error('Failed to save profile:', response.statusText);
            }
        } catch (error) {
            console.error('Error occurred while saving profile:', error);
        }
    };
    

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="home-page-container">
            <div className="home-page">
                <h1>My Profile</h1>
                <hr />
                <div>
                    <Input
                        label="Username"
                        placeholder="Enter your username"
                        value={profile.Username}
                        onChange={(value) => setProfile({ ...profile, Username: value })}
                    />
                </div>
                <div className='col-center'>
                    <Input
                        label="First Name"
                        placeholder="Enter your first name"
                        value={profile.FirstName}
                        onChange={(value) => setProfile({ ...profile, FirstName: value })}
                    />
                    <Input
                        label="Last Name"
                        placeholder="Enter your last name"
                        value={profile.LastName}
                        onChange={(value) => setProfile({ ...profile, LastName: value })}
                    />
                </div>
                <div className='col-center'>
                    <div style={{ width: '80%' }}>
                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            value={profile.Email}
                            onChange={(value) => setProfile({ ...profile, Email: value })}
                        />
                    </div>
                    <div style={{ width: '20%' }}>
                        <Checkbox
                            label="Verified"
                            checked={profile.IsEmailVerify}
                            onChange={(checked) => setProfile({ ...profile, IsEmailVerify: checked })}
                            disabled={true} // Disable if it can't be changed
                        />
                    </div>
                </div>
                <div className='col-center'>
                    <Select
                        label="Gender"
                        value={profile.Gender}
                        options={['Female', 'Male', 'Other', 'unspecified']}
                        onChange={(value) => setProfile({ ...profile, Gender: value })}
                    />
                    <Select
                        label="Sexual Preference"
                        value={profile.SexualPreference}
                        options={['Homosexual', 'Heterosexual', 'Bisexual', 'Other', 'unspecified']}
                        onChange={(value) => setProfile({ ...profile, SexualPreference: value })}
                    />
                </div>

                {/* DatePicker for Birthdate */}
                <div className="col-center">
                    <DatePicker
                        label="Birthdate"
                        value={profile.BirthDate}
                        onChange={(value) => setProfile({ ...profile, BirthDate: value })}
                    />
                </div>

                <div>
                    <Input
                        label="Bio"
                        placeholder="Enter your Biography"
                        value={profile.Bio}
                        onChange={(value) => setProfile({ ...profile, Bio: value })}
                    />
                </div>

                <div className='col-center'>
                    <Button label="Save" onClick={handleSave} />
                </div>

                {/* Display unsaved changes warning */}
                {unsavedChanges && <p className="warning-text">You have unsaved changes!</p>}
            </div>
        </div>
    );
};
