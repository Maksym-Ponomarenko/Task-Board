import styles from './Input.module.scss';
import React, {FC} from "react";

interface InputProps {
    label: string;
    id: string;
    placeholder?: string;
    required?: boolean;
    type?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    width?: string;
}

const Input: FC<InputProps> = ({id, label, required = false, placeholder = '', value, onChange, type = 'text', width='100%'}) => {
    return (
        <div className={styles.formGroup}>
            <label htmlFor={id} className={styles.label}>
                {label}
                {required && <span className={styles.required}>*</span>}
            </label>
            <input
                type={type}
                id={id}
                className={styles.input}
                placeholder={placeholder}
                required={required}
                value={value}
                onChange={onChange}
                style={{width: width}}
            />
        </div>
    );
};

export default Input;
