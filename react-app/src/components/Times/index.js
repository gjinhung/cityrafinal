import React, { useEffect, useState } from "react"
import './Times.css'
import { useParams } from "react-router-dom/"
import { useSelector } from "react-redux"

export default function TimeOption({ time, handleTime, date, bookingTime }) {
    const [selected, setSelected] = useState(false)
    const { id } = useParams()
    const bookings = useSelector((state) => state.bookings)
    const booking_date = new Date(bookings[id].date);
    const formattedDate = booking_date.toISOString().slice(0, 10);


    useEffect(() => {
        if (bookingTime === time && formattedDate === date) {
            setSelected(true)
        }
    }, [setSelected, bookingTime, time, formattedDate, date])

    function formattedTime(str_time) {
        let convertedTime = str_time.split(":")
        let amPm = "AM";
        let hr = +convertedTime[0]
        let min = convertedTime[1]
        if (hr > 12) {
            hr = hr - 12
            amPm = 'PM'
        }
        let formattedTime = `${hr}:${min} ${amPm}`;
        return formattedTime
    }

    function handleClicked(e) {
        setSelected(!selected)
        if (selected) {
            time = ''
        }
        handleTime(e, time)
    }

    return (
        <div className={`time_${selected}`} onClick={(e) => handleClicked(e)}>
            {formattedTime(time)}
        </div >
    )
}