import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({
                                           onClick,
                                       }) => {

    return (
        <button
            onClick={onClick}
        >
            Add note
        </button>
    );
};

export default Button;