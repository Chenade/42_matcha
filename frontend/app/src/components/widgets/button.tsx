import './button.css';

export const Button = ({
    label,
    onClick,
    disabled,
    className,
}: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
}) => {
    return (
        <button className={`button ${className}`} onClick={onClick} {...(disabled ? { disabled: true } : {})}>
            {label}
        </button>
    );
};
