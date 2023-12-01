import React, { useContext, useState } from "react";

const ActiveTourContext = React.createContext()

export function useActiveTour() {
    return useContext(ActiveTourContext)
}

export function ActiveTourProvider({ children }) {
    const [activeTour, setActiveTour] = useState(0);

    return (
        <ActiveTourContext.Provider value={{ activeTour, setActiveTour }}>
            {children}
        </ActiveTourContext.Provider>
    )
}