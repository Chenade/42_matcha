import './datepicker.css';

export const DatePicker = ({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) => {
    return (
        <div className="date">
            <label className="date_label">{label}</label>
            <input
                className="date_field"
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};