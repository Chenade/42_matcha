import React, { useState, useEffect } from 'react';
import './page-list.css';
import { useOutletContext } from 'react-router-dom';
import { Button } from '../../widgets/widgets';


interface Interests {
    ID: number;
    Name: string;
}

interface Connections {
    Matched: CardData[];
    Liked: CardData[];
    Viewed: CardData[];
}

interface CardData {
    UserID: number;
    Username: string;
    FirstName: string;
    LastName: string;
    Location: string;
    Fames: number;
    Status: string;
    LastTimeOnline: string;
    Gender: string;
    SexualPreference: string;
    Bio: string;
    ProfilePic: string;
    Liked: boolean;
    Viewed: boolean;
    Matched: boolean;
    Interests: Interests[];
}

interface ContextType {
    setOpenProfileModal: React.Dispatch<React.SetStateAction<boolean>>;
    setProfileData: React.Dispatch<React.SetStateAction<{}>>;
}

export const PageList: React.FC = () => {
    const { setOpenProfileModal } = useOutletContext<ContextType>();
    const { setProfileData } = useOutletContext<ContextType>();

    const [cardData, setCardData] = useState<Connections>({
        Matched: [],
        Liked: [],
        Viewed: [],
    } as Connections);
    const [loading, setLoading] = useState<boolean>(true);
    const [connectionType] = useState<string[]>(['Matched', 'Liked', 'Viewed']);


    const fetchCardData = async () => {
        try {
            const response = await fetch('http://localhost:3000/users/connections', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            cardData.Liked = [];
            cardData.Viewed = [];
            cardData.Matched = [];
            for (const el in data) {
                if (data[el].Matched) {
                    cardData.Matched.push(data[el]);
                }
                else if (data[el].Liked) {
                    cardData.Liked.push(data[el]);
                }
                else {
                    cardData.Viewed.push(data[el]);
                }
            }
            // setCardData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const togglelist = (category: string) => () => {
        const categoryBox = document.querySelector(`.category-box[data-category='${category}']`);
        if (categoryBox) {
            categoryBox.classList.toggle('view');
        }
    }

    const openProfile = (id: number) => {
        // fetch data from /users/profile/:usrId
        const fetchProfileData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/users/profile/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await response.json();


                const fetchedProfile = {
                    UserID: data.UserID || 0,
                    Online: data.Online || false,
                    LastOnline: new Date(data.LastTimeOnline).toLocaleString() || '',
                    Username: data.Username || '',
                    FirstName: data.FirstName || '',
                    LastName: data.LastName || '',
                    Gender: data.Gender || 'unspecified',
                    SexualPreference: data.SexualPreference || 'unspecified',
                    BirthDate: data.BirthDate || '',
                    Bio: data.Bio || '',
                    Fames: data.Fames || 0,
                    ProfilePic: {
                        ID: 0,
                        Path: 'https://via.placeholder.com/350'
                    },
                    Pictures: data.Pictures || [],
                    Interests: data.Interests || [],
                    Matched: data.Matched || false,
                };


                data.Pictures && data.Pictures.forEach((picture: any) => {
                    if (data.ProfilePictureID === picture.ID) {
                        fetchedProfile.ProfilePic = picture;
                    }
                });

                setProfileData(fetchedProfile);
                console.log('Profile data:', data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchProfileData();
        setOpenProfileModal(true);
    }

    useEffect(() => {
        fetchCardData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='pt-3'>
            {connectionType.map((type) => {
                const viewClass = cardData[type as keyof Connections].length > 0 ? "view" : "empty";
                return (
                    <div className={`category-box ${viewClass}`}
                        data-category={type.toLowerCase()} key={type}>
                        <div className='category-title'>
                            <h1>{type} You</h1>
                            {/* <Button className='close' label="close" onClick={() => {  }} /> */}
                            <button className='empty'>-</button>
                            <button className='close' onClick={togglelist(type.toLowerCase())}>Close</button>
                            <button className='open' onClick={togglelist(type.toLowerCase())}>Open</button>
                        </div>
                        <div className='category-content'>
                            {cardData[type as keyof Connections].map((card) => (
                                <div className='card' key={card.UserID} onClick={() => openProfile(card.UserID)}>
                                    <div className='card-header'>
                                        {/* {card.Liked && <span className='liked'>Liked You</span>} */}
                                        {/* {card.Viewed && <span className='viewed'>Viewed</span>} */}
                                    </div>
                                    <div className='card-body'>
                                        <div className='card-thumbnail'>
                                            <img src={'http://localhost:3000/uploads/' + card.ProfilePic} alt='thumbnail' />
                                        </div>
                                        <div className='card-title'>
                                            <h2>{card.Username}</h2>
                                            <h4>Fames: {card.Fames}</h4>
                                        </div>
                                        <div className='card-interests'>
                                            {card.Interests && card.Interests.map((interest) => (
                                                <span key={interest.ID}>{interest.Name}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    );
};
