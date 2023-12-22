import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";

const SearchContext = React.createContext()

export function useSearch() {
    return useContext(SearchContext)
}

export function SearchProvider({ children }) {
    const tours = useSelector((state) => state.tours)
    let search = {}
    search.date = ''
    search.city = ''
    search.language = ''
    search.type = ''
    const [searchTerms, setSearch] = useState(search);

    const [submitSearch, setSubmit] = useState(search)
    let allTours = Object.values(tours)
    const allIds = []
    console.log(allTours)
    // allTours.forEach((tour) => {
    //     console.log(tour)
    // })
    const [searchedTours, setSearchedTours] = useState(allTours)
    return (
        <SearchContext.Provider value={{ searchTerms, setSearch, submitSearch, setSubmit, searchedTours, setSearchedTours }}>
            {children}
        </SearchContext.Provider>
    )
}