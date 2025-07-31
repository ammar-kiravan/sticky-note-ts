import React, { useState, ChangeEvent } from 'react';

interface NumberInputProps {
    label: string;
    value?: number;
    minValue?: number;
    maxValue?: number;
    onChange: (value: number | undefined) => void;
}

const NumberInput: React.FC<NumberInputProps> = ({
                                                     label,
                                                     value,
                                                     minValue = 150, // Default min value
                                                     maxValue = 700, // Default max value
                                                     onChange,
                                                 }) => {
    const [error, setError] = useState<string | null>(null);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const numValue = parseFloat(inputValue);
        if (numValue < minValue) {
            setError(`Value cannot be less than ${minValue}`);
        } else if (numValue > maxValue) {
            setError(`Value cannot be greater than ${maxValue}`);
        } else {
            setError(null);
            onChange(numValue);
        }
    };

    return (
        <div style={{ marginBottom: '15px' }}>
            <label htmlFor={label} style={{ display: 'block', marginBottom: '5px' }}>
                {label}:
            </label>
            <input
                type="number"
                id={label}
                value={value === undefined ? '' : value} // Handle undefined for empty input
                onChange={handleChange}
                min={minValue}
                max={maxValue}
                style={{
                    padding: '8px',
                    borderRadius: '4px',
                    border: `1px solid ${error ? 'red' : '#ccc'}`,
                    width: '200px',
                }}
            />
            {error && <p style={{ color: 'red', fontSize: '0.8em', marginTop: '5px' }}>{error}</p>}
        </div>
    );
};

export default NumberInput;