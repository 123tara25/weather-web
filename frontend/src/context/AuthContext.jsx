import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem('skycast-user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('skycast-user', JSON.stringify(userData));
        setIsLoginOpen(false);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('skycast-user');
    };

    const openLogin = () => setIsLoginOpen(true);
    const closeLogin = () => setIsLoginOpen(false);

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoginOpen, openLogin, closeLogin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
