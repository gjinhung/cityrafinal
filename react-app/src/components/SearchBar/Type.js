import React from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useSearch } from "../../context/SearchBar";

export default function TypeSelection() {
    // const [show, setShow] = useState(false)
    const [selectedType, setSelectType] = useState('')
    const options = []
    const types = useSelector((state) => state.types)
    const { searchTerms, setSearch } = useSearch()

    const normalized_types = Object.values(types)
    normalized_types.forEach((type) => {
        options.push(type.type)
    })
    options.sort()
    const opt_arr = Array.from(options)
    opt_arr.push("Any")

    function handleSelected(e) {
        let obj = searchTerms
        if (e.toLowerCase() === "any") {
            obj.type = ''
        } else { obj.type = e }
        setSelectType(e)
        setSearch(obj)
        // setShow(false)
    }

    return (
        <>
            <div className="search-selection">
                <label className="search-title">TYPE OF TOUR</label>
                <div className="date-selection-container">
                    <select
                        id='type'
                        name='type'
                        className="date-input"
                        defaultValue={selectedType}
                        onChange={(e) => handleSelected(e.target.value)}>
                        <option></option>
                        {normalized_types.map((type, idx) => {
                            return (
                                <option key={idx} value={type.type}> {type.type}</option>
                            )
                        })}
                        <option key="any" value="Any">Any</option>
                    </select>
                </div>
            </div>
        </>
    );

}