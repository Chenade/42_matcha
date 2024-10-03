import React, { useState, useEffect } from 'react';
import './page-myprofile.css';
import { Input, Select, DatePicker, Checkbox, Button, Upload, Textbox, SearchInput } from '../widgets/widgets';

// Define types for the profile and pictures
interface Picture {
    ID: number;
    Path: string;
}

interface MultiSelectProps {
    ID: string;
    Name: string;
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
    ProfilePictureID: number;
    Pictures: Picture[];
    Interests?: MultiSelectProps[];
}

export const PageMyProfile = () => {
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [interests, setInterests] = useState<MultiSelectProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
        ProfilePictureID: 0,
        Pictures: [],
    });

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
                ProfilePictureID: data.ProfilePictureID || 0,
                Pictures: data.Pictures || [],
                Interests: data.Interests || [],
            };
            setProfile(fetchedProfile);
            setOriginalProfile(fetchedProfile);
            setLoading(false);
        } catch (error) {
            setError('Failed to load profile data.');
            setLoading(false);
        }
    };

    const [keyword, setKeyword] = useState('');
    const fetchInterests = async (value : string) => {
        setKeyword(value);

        if (value.length < 3) {
            setInterests([]);
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/interests?keyword=${keyword}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            var data = [{ ID: '0', Name: value }];
            const res = await response.json();
            if (res && res.length > 0) {
                data.push(...res);
            }
            setInterests(data);
        } catch (error) {
            console.error('Failed to load interests:', error);
        }
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    const [originalProfile, setOriginalProfile] = useState<Profile | null>(null);
    useEffect(() => {
        if (originalProfile && JSON.stringify(profile) !== JSON.stringify(originalProfile)) {
            setUnsavedChanges(true);
        } else {
            setUnsavedChanges(false);
        }
    }, [profile, originalProfile]);

    const handleSave = async () => {
        if (!unsavedChanges) {
            console.log('No changes to save.');
            return;
        }

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

    const addInterest = async (value: string) => {
        setKeyword('');
        setInterests([]);

        try {
            const response = await fetch(`http://localhost:3000/users/interests`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ name: value }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Interest added successfully:', data);
                fetchProfile();
            } else {
                console.error('Failed to add interest:', response.statusText);
            }
        } catch (error) {
            console.error('Error occurred while adding interest:', error);
        }
    }

    const deleteInterest = async (value: string) => {
        try {
            const response = await fetch(`http://localhost:3000/users/interests`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ Name : value }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Interest deleted successfully:', data);
                fetchProfile();
            } else {
                console.error('Failed to delete interest:', response.statusText);
            }
        } catch (error) {
            console.error('Error occurred while deleting interest:', error);
        }
    }

    const setAsProfilePicture = async (index: number) => {
        try {
            const response = await fetch(`http://localhost:3000/users/image/profile?imgId=${index}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Profile picture set successfully:', data);
                fetchProfile();
            } else {
                console.error('Failed to set profile picture:', response.statusText);
            }
        } catch (error) {
            console.error('Error occurred while setting profile picture:', error);
        }
    }

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p>{error}</p>;

    return (
    <div className="home-page flex flex-col lg:flex-row gap-4 mt-4">
        <div className="w-full lg:w-1/3">
            <div className="flex flex-row lg:flex-col items-start lg:items-center imgsList">
                {profile.Pictures && profile.Pictures.length > 0 ? (
                    profile.Pictures.map((picture, index) => (
                        <div key={index} className="img">
                            <img
                                className="thumbnail"
                                src={`http://localhost:3000/uploads/${picture.Path}`}
                                alt={`${picture.ID}`}
                            />
                            <div className="flex flex-wrap justify-center space-x-2">
                                <Button label="Delete" onClick={() => handleDeletePicture(picture.ID)} />
                                {profile.ProfilePictureID !== picture.ID ? (
                                    <Button label="Set as profile" onClick={() => setAsProfilePicture(picture.ID)} />
                                ) : (
                                    <Button label="Profile Picture" disabled={true} onClick={() => void 0} />
                                )}
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

        <div className="w-full lg:w-2/3 space-y-4 flex flex-col">
        {/* Username */}
            <div>
                <Input
                    label="Username"
                    placeholder="Enter your username"
                    value={profile.Username}
                    onChange={(value) => setProfile({ ...profile, Username: value })}
                />
            </div>

            <div className="flex flex-col md:flex-row">
                {/* First Name */}
                <div className="w-full">
                    <Input
                        label="First Name"
                        placeholder="Enter your first name"
                        value={profile.FirstName}
                        onChange={(value) => setProfile({ ...profile, FirstName: value })}
                    />
                </div>

                {/* Last Name */}
                <div className="w-full">
                    <Input
                        label="Last Name"
                        placeholder="Enter your last name"
                        value={profile.LastName}
                        onChange={(value) => setProfile({ ...profile, LastName: value })}
                    />
                </div>
            </div>

            {/* Email and Verified Checkbox */}
            <div className="flex space-x-4">
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
            <div>
                <Select
                    label="Gender"
                    value={profile.Gender}
                    options={['Female', 'Male', 'Other', 'unspecified']}
                    onChange={(value) => setProfile({ ...profile, Gender: value })}
                />
            </div>

            {/* Sexual Preference Select */}
            <div>
                <Select
                    label="Sexual Preference"
                    value={profile.SexualPreference}
                    options={['Homosexual', 'Heterosexual', 'Bisexual', 'Other', 'unspecified']}
                    onChange={(value) => setProfile({ ...profile, SexualPreference: value })}
                />
            </div>

            {/* Birthdate Picker */}
            <div className=" md:col-span-2">
                <DatePicker
                    label="Birthdate"
                    value={profile.BirthDate}
                    onChange={(value) => setProfile({ ...profile, BirthDate: value })}
                />
            </div>

            {/* Bio Input */}
            <div>
                <Textbox
                    label="Bio"
                    placeholder="Enter your Biography"
                    value={profile.Bio}
                    rows={5}
                    onChange={(value) => setProfile({ ...profile, Bio: value })}
                />
            </div>

            <SearchInput
                label="Interests"
                placeholder="Type more than 3 characters to contiune..."
                value={keyword}
                options={interests}
                onChange={(value) => fetchInterests(value)}
                onSelected={(value) => addInterest(value)}
            />

            <div className="w-full flex justify-start">
                {profile.Interests && profile.Interests.map((interest, index) => (
                    <div key={index} className="badge">
                        <span>{interest.Name}</span>
                        <button
                            className="badge-action"
                            onClick={() => deleteInterest(interest.Name)}
                        >x</button>
                    </div>
                ))}
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
