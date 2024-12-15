import './button.css';

export const Button = ({
    label,
    onClick,
    disabled,
    level,
}: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    level?: string;
}) => {
    return (
        <button className={`button ${level}`} onClick={onClick} {...(disabled ? { disabled: true } : {})}>
            {label}
        </button>
    );
};
