import React, { useState, useEffect } from 'react';
import './page-list.css';
import { useOutletContext } from 'react-router-dom';

interface Interests {
    ID: number;
    Name: string;
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
    ProfilePictureID: number;
    Liked: boolean;
    Viewed: boolean;
    Interests: Interests[];
}

interface ContextType {
    setOpenProfileModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PageList: React.FC = () => {
    const { setOpenProfileModal } = useOutletContext<ContextType>();

    const [cardData, setCardData] = useState<CardData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
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
                setCardData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCardData();
    }, []);

    const openProfile = (id: number) => {
        setOpenProfileModal(true);
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-wrap justify-around px-3 py-3">
            {cardData.map((card) => (
                <div className="card" key={card.UserID} onClick={() => openProfile(card.UserID)}>
                    <div className="card-header">
                        {card.Liked && <span className="liked">Liked You</span>}
                        {card.Viewed && <span className="viewed">Viewed</span>}
                    </div>
                    <div className="card-body">
                        <div className="card-thumbnail">
                            <img src='https://via.placeholder.com/150' alt="thumbnail" />
                            {/* <img src={card.thumbnailUrl} alt="thumbnail" /> */}
                        </div>
                        <div className="card-title">
                            <h2>{card.Username}</h2>
                            <h4>Fames: {card.Fames}</h4>
                        </div>
                        <div className="card-interests">
                            {card.Interests && card.Interests.map((interest) => (
                                <span key={interest.ID}>{interest.Name}</span>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
