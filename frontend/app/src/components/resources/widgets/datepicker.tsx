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
    const formattedDate = value ? new Date(value).toISOString().split('T')[0] : '';

    return (
        <div className="date">
            <label className="date_label">{label}</label>
            <input
                className="date_field"
                type="date"
                value={formattedDate}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};
