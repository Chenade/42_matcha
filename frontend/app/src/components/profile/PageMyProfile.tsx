import React, { useState, useEffect } from 'react';
import './page-myprofile.css';
import { Input } from '../widgets/input';
import { Button } from '../widgets/button';
import { Checkbox } from '../widgets/checkbox';
import { Select } from '../widgets/select';
import { DatePicker } from '../widgets/datepicker';
import { Upload } from '../widgets/upload';

// Define types for the profile and pictures
interface Picture {
    ID: number;
    Path: string;
}

interface Profile {
    Username: string;
    FirstName: string;
    LastName: string;
    Email: string;
    IsEmailVerify: boolean;
    Gender: string;
    SexualPreference: string;
    BirthDate: string;
    Bio: string;
    Pictures: Picture[];
}

export const PageMyProfile = () => {
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    // State to hold profile data with type Profile
    const [profile, setProfile] = useState<Profile>({
        Username: '',
        FirstName: '',
        LastName: '',
        Email: '',
        IsEmailVerify: false,
        Gender: 'unspecified',
        SexualPreference: 'unspecified',
        BirthDate: '',
        Bio: '',
        Pictures: [],
    });

    // New state to store the original profile after fetch
    const [originalProfile, setOriginalProfile] = useState<Profile | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchProfile = async () => {
        try {
            const response = await fetch('http://localhost:3000/users/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            const fetchedProfile = {
                Username: data.Username || '',
                FirstName: data.FirstName || '',
                LastName: data.LastName || '',
                Email: data.Email || '',
                IsEmailVerify: data.IsEmailVerify,
                Gender: data.Gender || 'unspecified',
                SexualPreference: data.SexualPreference || 'unspecified',
                BirthDate: data.BirthDate || '',
                Bio: data.Bio || '',
                Pictures: data.Pictures || [],
            };
            setProfile(fetchedProfile);
            setOriginalProfile(fetchedProfile); // Store the original profile after fetch
            setLoading(false);
        } catch (error) {
            setError('Failed to load profile data.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        // Compare the current profile with the originalProfile
        if (originalProfile && JSON.stringify(profile) !== JSON.stringify(originalProfile)) {
            setUnsavedChanges(true);
        } else {
            setUnsavedChanges(false);
        }
    }, [profile, originalProfile]);

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
                setOriginalProfile(profile); // Update originalProfile after saving
                setUnsavedChanges(false);
            } else {
                console.error('Failed to save profile:', response.statusText);
            }
        } catch (error) {
            console.error('Error occurred while saving profile:', error);
        }
    };

    const handleUploadPicture = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('http://localhost:3000/users/image', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Picture uploaded successfully:', data);
                fetchProfile();
            } else {
                console.error('Failed to upload picture:', response.statusText);
            }
        } catch (error) {
            console.error('Error occurred while uploading picture:', error);
        }
    };

    const handleDeletePicture = async (index: number) => {
        try {
            const response = await fetch(`http://localhost:3000/users/image?imgId=${index}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Picture deleted successfully:', data);
                fetchProfile();
            } else {
                console.error('Failed to delete picture:', response.statusText);
            }
        } catch (error) {
            console.error('Error occurred while deleting picture:', error);
        }
    };

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p>{error}</p>;

    return (
    <div className="home-page flex flex-col lg:flex-row gap-4 mt-4">
        <div className="w-full lg:w-1/3">
            <div className="flex flex-row lg:flex-col items-center imgsList">
                {profile.Pictures && profile.Pictures.length > 0 ? (
                    profile.Pictures.map((picture, index) => (
                        <div key={index} className="flex flex-col items-center space-x-4 mb-4">
                            <img
                                className="thumbnail"
                                src={`http://localhost:3000/images/${picture.Path}`}
                                alt={`Picture ${picture.ID}`}
                            />
                            <div className="flex space-x-2">
                                <Button label="Set as profile" onClick={() => console.log('Set as profile', index)} />
                                <Button label="Delete" onClick={() => handleDeletePicture(picture.ID)} />
                            </div>
                        </div>
                    ))
                ) : (
                    ""
                )}
            </div>
            <hr className="w-full my-4" />
            <div className="flex justify-center">
                {profile.Pictures.length < 5 && (
                    <Upload
                        label="Upload Image"
                        type="image/*"
                        onChange={handleUploadPicture}
                    />
                )}
            </div>
        </div>

        <div className="w-full lg:w-2/3 space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username */}
            <div className="col-span-1 md:col-span-2">
                <Input
                    label="Username"
                    placeholder="Enter your username"
                    value={profile.Username}
                    onChange={(value) => setProfile({ ...profile, Username: value })}
                />
            </div>

            {/* First Name */}
            <div className="col-span-1">
                <Input
                    label="First Name"
                    placeholder="Enter your first name"
                    value={profile.FirstName}
                    onChange={(value) => setProfile({ ...profile, FirstName: value })}
                />
            </div>

            {/* Last Name */}
            <div className="col-span-1">
                <Input
                    label="Last Name"
                    placeholder="Enter your last name"
                    value={profile.LastName}
                    onChange={(value) => setProfile({ ...profile, LastName: value })}
                />
            </div>

            {/* Email and Verified Checkbox */}
            <div className="col-span-1 md:col-span-2 flex items-center space-x-4">
                <Input
                    label="Email"
                    placeholder="Enter your email"
                    value={profile.Email}
                    onChange={(value) => setProfile({ ...profile, Email: value })}
                />
                <Checkbox
                    label="Verified"
                    checked={profile.IsEmailVerify}
                    onChange={(checked) => setProfile({ ...profile, IsEmailVerify: checked })}
                    disabled={true}
                />
            </div>

            {/* Gender Select */}
            <div className="col-span-1">
                <Select
                    label="Gender"
                    value={profile.Gender}
                    options={['Female', 'Male', 'Other', 'unspecified']}
                    onChange={(value) => setProfile({ ...profile, Gender: value })}
                />
            </div>

            {/* Sexual Preference Select */}
            <div className="col-span-1">
                <Select
                    label="Sexual Preference"
                    value={profile.SexualPreference}
                    options={['Homosexual', 'Heterosexual', 'Bisexual', 'Other', 'unspecified']}
                    onChange={(value) => setProfile({ ...profile, SexualPreference: value })}
                />
            </div>

            {/* Birthdate Picker */}
            <div className="col-span-1 md:col-span-2">
                <DatePicker
                    label="Birthdate"
                    value={profile.BirthDate}
                    onChange={(value) => setProfile({ ...profile, BirthDate: value })}
                />
            </div>

            {/* Bio Input */}
            <div className="col-span-1 md:col-span-2">
                <Input
                    label="Bio"
                    placeholder="Enter your Biography"
                    value={profile.Bio}
                    onChange={(value) => setProfile({ ...profile, Bio: value })}
                />
            </div>

            {/* Unsaved Changes Warning */}
            <div className="col-span-1 md:col-span-2 flex justify-center mt-0">
                {unsavedChanges && (
                    <p className="text-red-500 mt-4">You have unsaved changes!</p>
                )}
            </div>

            {/* Save Button */}
            <div className="col-span-1 md:col-span-2 flex justify-center">
                <Button label="Save" onClick={handleSave} />
            </div>
        </div>
    </div>
    );
};
