import './button.css';

export const Button = ({
    label,
    onClick,
    disabled,
}: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
}) => {
    return (
        <button className="button" onClick={onClick} {...(disabled ? { disabled: true } : {})}>
            {label}
        </button>
    );
};
