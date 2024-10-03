import './textbox.css';

export const Textbox = ({
    label,
    placeholder,
    value,
    rows,
    onChange,
}: {
    label: string;
    placeholder: string;
    value: string;
    rows: number;
    onChange: (value: string) => void;
}) => {
    return (
        <div className="textbox">
            <label className="textbox_label">{label}</label>
            <textarea
                rows={rows}
                className="textbox_field"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

