import React, {useEffect, useRef, useState} from "react";
import styles from "./Select.module.scss";

export interface Option {
    id: number;
    name: string;
}

interface SelectProps {
    defaultText: string;
    optionsList: Option[];
    onChange: (selected: Option) => void;
    id: string,
    label: string;
}

const Select: React.FC<SelectProps> = ({defaultText, optionsList, onChange, id, label}) => {
    const [selectedText, setSelectedText] = useState(defaultText);
    const [showOptions, setShowOptions] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowOptions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleToggle = () => {
        setShowOptions((prev) => !prev);
    };

    const handleSelect = (option: Option) => {
        setSelectedText(option.name);
        setShowOptions(false);
        onChange(option);
    };

    return (
        <>
            <label className={styles.label}  htmlFor={id}>
                {label}
                <span className={styles.required}>*</span>
            </label>
            <div id={id} className={styles.customSelectContainer} ref={containerRef}>
                <div
                    className={`${styles.selectedText} ${showOptions ? styles.active : ""}`}
                    onClick={handleToggle}
                >
                    {selectedText}
                </div>
                {showOptions && (
                    <ul className={styles.selectOptions}>
                        {optionsList.map((option) => (
                            <li
                                className={styles.customSelectOption}
                                key={option.id}
                                onClick={() => handleSelect(option)}
                            >
                                {option.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

        </>
    );
};

export default Select;
