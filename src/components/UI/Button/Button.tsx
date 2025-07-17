import React, {FC} from 'react';
import styles from './Button.module.scss'


interface IBtnProps {
    children: React.ReactNode;
}

const Button:FC<IBtnProps> = ({children, ...props}) => {
    return (
        <button className={styles.button} {...props} >
            {children}
        </button>
    );
};

export default Button;