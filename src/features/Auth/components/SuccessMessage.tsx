import React from 'react';

const SuccessMessage: React.FC = () => {
    return (
        <div style={{
            padding: '10px',
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            borderRadius: '5px',
            maxWidth: '500px',
            maxHeight: '100px',
            margin: "auto",
            textAlign: 'center',
            fontFamily: 'Arial',
            position: 'fixed',
            top: '20px',
            right: '20%',
            left: '20%',
            zIndex: 1000,
        }}>
        Logged in successfully
        </div>
    );
};

export default SuccessMessage;
