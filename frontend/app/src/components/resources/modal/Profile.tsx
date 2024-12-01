import React from 'react';
import './profile.css';
import './modal.css';
import { useNavigate } from 'react-router-dom';
import { Button, ImgSlideshow } from '../../resources/widgets/widgets';

interface Picture {
    ID: number;
    Path: string;
}

interface Interests {
    ID: number;
    Name: string;
}

interface OthersProfile {
    UserID: number;
    Online: boolean;
    LastOnline: string;
    Username: string;
    FirstName: string;
    LastName: string;
    Gender: string;
    SexualPreference: string;
    BirthDate: string;
    Bio: string;
    Fames: number;
    ProfilePic: Picture;
    Pictures: Picture[];
    Interests?: Interests[];
    Matched: boolean;
    Liked: boolean;
    Like: boolean;
}

export const Profile = ({
    profileData,
    openProfileModal,
    setOpenProfileModal,
    fetchProfileData,
}: {
    profileData: OthersProfile;
    openProfileModal: boolean;
    setOpenProfileModal: React.Dispatch<React.SetStateAction<boolean>>;
    fetchProfileData: (id: number) => void;
}) => {
    const navigate = useNavigate();
    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const ActionButton = (user_id: number, action: string) => {
        if (action === "")
            return;
        fetch(`http://localhost:3000/users/${user_id}/${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token') ?? "",
            },
            body: JSON.stringify({
                user_id: user_id,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data === "Matched")
                    console.log('Matched');
                fetchProfileData(user_id);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    return (
        <div className={`modal ${ openProfileModal ? 'open' : ''}`} id="profileModal">
            <div className='modal-content'>
                <span className="close" onClick={() => setOpenProfileModal(false)}>&times;</span>
                <div className="flex flex-col lg:flex-row mb-5">
                    { <ImgSlideshow
                        img={profileData.Pictures.map((picture: { Path: string; }) => 'http://localhost:3000/uploads/' + picture.Path)}
                    /> }
                    <div className="w-full profile">
                        <p className='username'>{profileData.Username}</p>
                        <p className='realname'>{profileData.FirstName}, {profileData.LastName}</p>
                        <hr className='my-1'></hr>
                        {profileData.Online ? <p className='online'>Online Now</p> : <p className=''><span>Last Active: </span> {profileData.LastOnline}</p>}
                        <hr className='my-1'></hr>
                        <p className='info'><span>Birthdate: </span> {profileData.BirthDate}</p>
                        <p className='info'><span>Gender: </span> {profileData.Gender}</p>
                        <p className='info'><span>Sexual Preference: </span> {profileData.SexualPreference}</p>
                        <p className='info'><span>Location: </span> Location</p>
                        <hr className='my-1'></hr>
                        <p className='bio'>{profileData.Bio}</p>
                        {profileData.Bio && <hr className='my-1'></hr>}
                        {/* <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p> */}
                        {profileData.Interests && profileData.Interests.length > 0 && (
                            <div className="flex flex-wrap">
                                {profileData.Interests.map((interest) => (
                                    <p key={interest.ID} className="badge">{interest.Name}</p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-wrap justify-center">
                    { profileData.Matched && <Button label="Chat" onClick={() => handleNavigation('chat')} />}
                    { profileData.Like && <Button label="Unlike" onClick={() => ActionButton(profileData.UserID, 'unlike')} />}
                    { !profileData.Like && <Button label="Like" onClick={() => ActionButton(profileData.UserID, 'like')} />}
                    <Button label="Report" onClick={() => ActionButton(profileData.UserID, 'report')} />
                </div>
            </div>
        </div>
    );
};
