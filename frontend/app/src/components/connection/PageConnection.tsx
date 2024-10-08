import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button, ImgSlideshow } from '../widgets/widgets';
import "./PageConnection.css";

interface Interests {
    ID: number;
    Name: string;
}

interface Picture {
    ID: number;
    Path: string;
}

interface OthersProfile {
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
}

export const PageConnection = () => {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const [openProfileModal, setOpenProfileModal] = React.useState(false);
    const [prorileData, setProfileData] = useState<OthersProfile>(
        {
            Online: false,
            LastOnline: '',
            Username: '',
            FirstName: '',
            LastName: '',
            Gender: '',
            SexualPreference: '',
            BirthDate: '',
            Bio: '',
            Fames: 0,
            ProfilePic: {
                ID: 0,
                Path: ''
            },
            Pictures: [],
            Interests: [],
        }

    );

    return (
        <div className="home-page">
            <div className='w-full flex flex-wrap justify-around pt-3'>
                <Button label="List" onClick={() => handleNavigation('')} />
                <Button label="Chat" onClick={() => handleNavigation('chat')} />
                <Button label="Date" onClick={() => handleNavigation('date')} />
            </div>
            <Outlet context={{ setOpenProfileModal, setProfileData }} />

            <div className={`modal ${openProfileModal ? 'open' : ''}`} id="profileModal">
                <div className='modal-content'>
                    <span className="close" onClick={() => setOpenProfileModal(false)}>&times;</span>
                    <div className="flex flex-col lg:flex-row mb-5">
                        <ImgSlideshow 
                            img={prorileData.Pictures.map(picture => 'http://localhost:3000/uploads/' + picture.Path)}
                        />
                        <div className="w-full profile">
                            <p className='username'>{prorileData.Username}</p>
                            <p className='realname'>{prorileData.FirstName}, {prorileData.LastName}</p>
                            <hr className='my-1'></hr>
                            {prorileData.Online ? <p className='online'>Online Now</p> : <p className=''><span>Last Active: </span> {prorileData.LastOnline}</p> }
                            <hr className='my-1'></hr>
                            <p className='info'><span>Birthdate: </span> {prorileData.BirthDate}</p>
                            <p className='info'><span>Gender: </span> {prorileData.Gender}</p>
                            <p className='info'><span>Sexual Preference: </span> {prorileData.SexualPreference}</p>
                            <p className='info'><span>Location: </span> Location</p>
                            <hr className='my-1'></hr>
                            <p className='bio'>{prorileData.Bio}</p>
                            {prorileData.Bio && <hr className='my-1'></hr>}
                            {/* <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p> */}
                            {prorileData.Interests && prorileData.Interests.length > 0 && (
                                <div className="flex flex-wrap">
                                    {prorileData.Interests.map((interest) => (
                                        <p key={interest.ID} className="badge">{interest.Name}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center">
                        <Button label="Like" onClick={() => handleNavigation('')} />
                        <Button label="Report" onClick={() => handleNavigation('')} />
                    </div>
                </div>
            </div>
        </div>
    );
};
