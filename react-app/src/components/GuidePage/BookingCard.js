import React, { useEffect, useRef, useState } from "react";
import './GuidePage.css'
import { useDispatch, useSelector } from "react-redux";
import { getOneTourDateAvail } from "../../store/availability";
import TimeOption from "../Times";
import { getBookings, newBooking } from "../../store/booking";
import { allUsers } from "../../store/users";
import { authenticate } from "../../store/session";
import { useActiveTour } from "../../context/ActiveTours";
import { useHistory } from "react-router-dom/";

export default function TourBooking({ tour_id }) {
    const { activeTour, setActiveTour } = useActiveTour()
    const booking_date = new Date();
    const formattedDate = booking_date.toISOString().slice(0, 10);
    const dateRef = useRef('')
    const dispatch = useDispatch()
    const current_user = useSelector((state) => state.session.user)
    const tours = useSelector((state) => state.tours)
    const [formDisabled, setFormDisabled] = useState(false)
    const [showBooking, setShowBooking] = useState(false)
    const [showTimes, setShowTimes] = useState(false)
    const [bookingTime, setBookingTime] = useState('')
    const [bookingDate, setBookingDate] = useState(formattedDate)
    const [avail_times, setAvailTimes] = useState([])
    const [error, setError] = useState('')
    const dates = useSelector((state) => state.dates)
    const normalizedDates = Object.values(dates)
    const history = useHistory()

    const weekday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        let booking_data = {
            'date': bookingDate,
            'time': bookingTime,
            'guide_id': tours[tour_id].guide_id
        }

        await dispatch(newBooking(booking_data, tour_id)).then((data) => {
            console.log(data)
            if (data.error) {
                setError('Error Creating Booking - See Console')
                console.log(data)
            } else {
                dispatch(getBookings()).then(() =>
                    dispatch(allUsers())).then(() =>
                        dispatch(authenticate())).then(() =>
                            setShowBooking(false)).then(() =>
                                history.push('/mybookings'))
            }
        })
    }

    useEffect(() => {

        if (activeTour !== tour_id) {
            handleCancel()
        }
        if (!bookingDate || !bookingTime) {
            setFormDisabled(true)
        } else {
            setFormDisabled(false)
        }
    }, [bookingDate, bookingTime, activeTour, tour_id])


    const handleChange = async (e) => {

        setAvailTimes([])
        setShowTimes(true)
        dateRef.current = e
        setBookingTime('')
        setBookingDate(e)

        let year = dateRef.current.substring(0, 4);
        let month = dateRef.current.substring(5, 7);
        let day = dateRef.current.substring(8, 10);
        let newDate = new Date(`${year}-${month}-${day}`).getTime()

        let today = new Date()
        const formattedDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        let yr = formattedDate.substring(0, 4);
        let mm = formattedDate.substring(5, 7);
        let dd = formattedDate.substring(8, 10);
        let newToday = new Date(`${yr}-${mm}-${dd}`).getTime()
        let newDay = new Date(`${year}-${month}-${day}`).getDay()
        let date_id
        normalizedDates.forEach((date) => {
            if (date.date === weekday[newDay]) {
                date_id = date.id
            }
        })

        if ((newDate - newToday) < 0) {
            setError("Please select a future date")
        } else if ((newDate - newToday) === 0) {
            setError(
                "Tours must be booked at least 1 day in advance"
            )
        } else {
            setError('')
            await dispatch(getOneTourDateAvail(tour_id, date_id)).then((data) => {
                if (data.errors) {
                    setError(data.errors)
                } else {
                    let normalizedAvail = Object.values(data.availabilities)
                    if (!normalizedAvail.length) {
                        setError('No Availabilities - Please select another day')
                    }
                    normalizedAvail.forEach((avail) => {
                        setAvailTimes((prevAvail) => [...prevAvail, avail.time])
                    })

                }
            })

        }
    }

    const handleTime = (e, times) => {
        setBookingTime(times)
    }

    const handleCancel = (e) => {
        setShowTimes(false)
        setBookingDate(formattedDate)
        setBookingTime('')
        setShowBooking(false)
        setAvailTimes([])
    }

    const showBookingOptions = (e) => {
        setActiveTour(tour_id)
        setShowBooking(!showBooking)
        setShowTimes(false)
        setBookingDate(formattedDate)
        setBookingTime('')
        setAvailTimes([])
    }

    return (
        <>
            <div className="book-now-button-container">
                {current_user && +current_user.id !== +tours[tour_id].guide_id && < button className="book-now-button" onClick={(e) => showBookingOptions(e)}>
                    BOOK NOW
                </button >}
            </div>
            {
                showBooking && (
                    <>
                        <form onSubmit={handleSubmit}>
                            <div className="select_date_container">
                                <div className="select_date_text">Select a Date:</div>

                                <input
                                    type="date"
                                    className="booking_date_input"
                                    value={bookingDate}
                                    onChange={(e) => handleChange(e.target.value)}
                                />
                            </div>
                            <div className="noAvail">
                                {error}
                            </div>
                            {showTimes && !error && (
                                <>
                                    <div className="booking_times_container">
                                        {avail_times.map((times, idx) => {
                                            return (
                                                <TimeOption
                                                    key={idx}
                                                    handleTime={handleTime}
                                                    bookingTime={bookingTime}
                                                    date={bookingDate}
                                                    time={times}
                                                />
                                            )
                                        })}
                                    </div>
                                    <div className="booking_tour_cancel_container">
                                        <button
                                            type="submit"
                                            className="booking_submit_buttons"
                                            disabled={formDisabled}
                                        >Book Tour</button>
                                        <div onClick={(e) => handleCancel(e)} className="booking_update_buttons">
                                            Cancel
                                        </div>
                                    </div>

                                </>
                            )}
                        </form>
                    </>
                )
            }

        </>
    )
}