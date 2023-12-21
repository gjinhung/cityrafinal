import React, { useContext, useState } from "react";

const NavScrollContext = React.createContext()

export function useNavScroll() {
    return useContext(NavScrollContext)
}

export function NavScrollProvider({ children }) {

    const [scrollTop, setScrollTop] = useState(0)

    return (
        <NavScrollContext.Provider value={{ scrollTop, setScrollTop }}>
            {children}
        </NavScrollContext.Provider>
    )
}