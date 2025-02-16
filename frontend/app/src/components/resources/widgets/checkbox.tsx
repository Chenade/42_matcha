import './checkbox.css';

export const Checkbox = ({
    label,
    checked,
    onChange,
    disabled,
}: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled: boolean;
}) => {
    return (
        <div className="checkbox-container">
            <span className="checkbox-label">{label}</span>
            <label className="switch">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={disabled}
                />
                <span className="slider"></span>
            </label>
        </div>
    );
};
