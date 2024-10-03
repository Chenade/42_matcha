import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '../widgets/widgets';
import "./PageConnection.css";

import { PageList } from './list/PageList';

export const PageConnection = () => {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const [openProfileModal, setOpenProfileModal] = React.useState(false);

    return (
        <div className="home-page">
            <div className='w-full flex flex-wrap justify-around pt-3'>
                <Button label="List" onClick={() => handleNavigation('')} />
                <Button label="Chat" onClick={() => handleNavigation('chat')} />
                <Button label="Date" onClick={() => handleNavigation('date')} />
            </div>
            <Outlet context={{ setOpenProfileModal }} />

            <div className={`modal ${openProfileModal ? 'open' : ''}`} id="profileModal">
                <div className='modal-content'>
                    <span className="close" onClick={() => setOpenProfileModal(false)}>&times;</span>
                    <div className="flex flex-col lg:flex-row mb-5">
                        <div className="w-full flex justify-center items-center px-3 mb-3 lg:mb-0">
                            <img src='https://via.placeholder.com/350' alt="thumbnail" style={{ maxWidth: '100%', maxHeight: '350px' }} />
                        </div>
                        <div className="w-full profile">
                            <p className='username'>Username</p>
                            <p className='realname'>First name, Last name</p>
                            <hr className='my-1'></hr>
                            <p>Last Active</p>
                            <hr className='my-1'></hr>
                            <p className='info'><span>Birthdate: </span></p>
                            <p className='info'><span>Gender: </span></p>
                            <p className='info'><span>Sexual Preference: </span></p>
                            <p className='info'><span>Location: </span></p>
                            <hr className='my-1'></hr>
                            <p className='bio'>Bio</p>
                            {/* <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p> */}
                            <div className="flex flex-wrap">
                                <p className="badge">Interest 1</p>
                                <p className="badge">Interest 2</p>
                                <p className="badge">Interest 3</p>
                                <p className="badge">Interest 4</p>
                                <p className="badge">Interest 5</p>
                            </div>
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
