import './input.css';

export const Input = ({
    label,
    placeholder,
    value,
    onChange,
}: {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}) => {
    return (
        <div className="input">
            <label className="input_label">{label}</label>
            <input
                className="input_field"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

