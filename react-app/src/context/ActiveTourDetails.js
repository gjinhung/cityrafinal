import React, { useContext, useState } from "react";

const ActiveTourDetailsContext = React.createContext()

export function useActiveTourDetails() {
    return useContext(ActiveTourDetailsContext)
}

export function ActiveTourDetailsProvider({ children }) {
    const [activeDetTour, setDetActiveTour] = useState(0);

    return (
        <ActiveTourDetailsContext.Provider value={{ activeDetTour, setDetActiveTour }}>
            {children}
        </ActiveTourDetailsContext.Provider>
    )
}