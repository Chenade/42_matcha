import './searchInput.css';

interface searchInputProps {
    ID: string;
    Name: string;
}

export const SearchInput = ({
    label,
    placeholder,
    value,
    options,
    onChange,
    onSelected,
}: {
    label: string;
    value: string;
    placeholder: string;
    options: searchInputProps[];
    onChange: (value: string) => void;
    onSelected: (value: string) => void;
}) => {
    return (
        <div className="searchInput">
            <label className="input_label">{label}</label>
            <input
                className="input_field"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}

            />
            {
                options.length > 0 ? <div className="suggestion">
                    {options.map((option) => (
                        <div
                            key={option.ID}
                            className="option"
                            onClick={() => onSelected(option.Name)}
                        >
                            {option.Name}
                        </div>
                    ))}
                </div> : null
            }
        </div>
    );
}