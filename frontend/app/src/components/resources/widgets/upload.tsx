import React, { useRef } from 'react';
import './upload.css';
import './button.css';

export const Upload = ({
    label,
    type,
    onChange,
}: {
    label: string;
    type: string;
    onChange: (file: File) => void;
}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="upload">
            <input
                ref={fileInputRef}
                type="file"
                accept={type}
                onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        onChange(e.target.files[0]);
                    }
                }}
                style={{ display: 'none' }}
            />
            <button className="button" type="button" onClick={handleButtonClick}>
                {label}
            </button>
        </div>
    );
};
