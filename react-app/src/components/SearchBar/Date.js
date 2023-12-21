import React, { useRef } from "react";
import { useState } from "react";
import { useSearch } from "../../context/SearchBar";
// import { useSelector } from "react-redux";

export default function DateSelection() {
    let menuRef = useRef()
    let dateRef = useRef('')
    // const [dayOfWk, setDayOfWk] = useState('');
    const [error, setError] = useState('')
    const { searchTerms, setSearch } = useSearch()
    const [date, setDate] = useState(searchTerms.date)
    // const normalized_dates = Object.values(dates)
    // normalized_dates.forEach((date) => {
    //     options.push(date.date)
    // })
    // options.sort()
    // const opt_arr = Array.from(options)
    // opt_arr.push("Any")

    // function handleDropDown() {
    //     setShow(!show)
    // }

    function handleSelected(e) {
        let obj = searchTerms
        if (!e || e.toLowerCase() === "any") {
            obj.date = ''
            let searchUpdate = { ...searchTerms, date: "" }
            setSearch(searchUpdate)
        } else {
            let searchUpdate = { ...searchTerms, date: e }
            setSearch(searchUpdate)
        }
        // setShow(false)
    }
    // const weekday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const handleChange = (e) => {
        dateRef.current = e
        setDate(e)
        let year = dateRef.current.substring(0, 4);
        let month = dateRef.current.substring(5, 7);
        let day = dateRef.current.substring(8, 10);
        // let newDate = new Date(`${year}-${month}-${day}`);
        let newDate = Date.UTC(year, month - 1, day)

        const now = new Date();
        const currentDate = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
        // let currentDate = new Date()

        if ((newDate - currentDate) <= 0) {
            setError("Past Dates are Invalid")
            handleSelected('any')
        } else {
            // setDayOfWk(weekday[newDate.getDay()])
            handleSelected(e)
            setError('')
        }
    };

    // function reset() {
    //     dateRef.current = ''
    // setDayOfWk('')
    // }

    return (
        <>
            <div ref={menuRef} className="date-button">
                <div className="search-title-cont">
                    <label className="search-title">SELECT A DATE *</label>
                    {error && <>
                        <div style={{ textDecoration: 'underline' }} className="search-title">{error}</div>
                    </>}
                </div>
                <div className="date-selection-container">
                    <input
                        type="date"
                        className="date-input"
                        value={date}
                        onChange={(e) => handleChange(e.target.value)}
                    />
                </div>

            </div >

        </>
    );
}