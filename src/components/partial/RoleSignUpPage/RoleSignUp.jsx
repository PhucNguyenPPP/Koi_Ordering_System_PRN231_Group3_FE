import React from 'react';

const RoleSignUp = () => {
    return (
        <div
            style={{
                height: 'max-content',
                backgroundImage: "url('/image/KoiBackground.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                padding: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '40px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '400px',
                    height: '200px'
                }}
            >
                <a
                href='/signup-customer'
                    style={{
                        margin: '10px',
                        width: '250px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        backgroundColor: "#C71125",
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        color: 'white',
                        textAlign: 'center'
                    }}>
                    SIGN UP AS CUSTOMER
                </a>
                <a
                href='/signup-koi-farm'
                 style={{
                    margin: '10px',
                    width: '250px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    backgroundColor: "#eaa52e",
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}>
                    SIGN UP AS KOI FARM
                </a>
            </div>
        </div>
    );
};

export default RoleSignUp;
