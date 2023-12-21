import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import './BookingPage.css'
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/";
import { getOneTourDateAvail } from "../../store/availability";
import TimeOption from "../Times";
import { allUsers } from "../../store/users";
import { deleteBooking, editBooking, getBookings } from "../../store/booking";
import { authenticate } from "../../store/session";
// import MapContainer from "../MapContainer"


export default function BookingPage() {
    const dispatch = useDispatch()
    const { id } = useParams()
    const history = useHistory()
    let dateRef = useRef()
    const bookings = useSelector((state) => state.bookings)
    const users = useSelector((state) => state.users)
    const dates = useSelector((state) => state.dates)
    const normalizedDates = Object.values(dates)
    const [showUpdate, setShowUpdate] = useState(false)
    const [bookingDate, setBookingDate] = useState(bookings[id] ? bookings[id].date : '')
    const [bookingTime, setBookingTime] = useState(bookings[id] ? bookings[id].time : '')
    const [error, setError] = useState('')
    const [avail_times, setAvailTimes] = useState([])
    const [showTimes, setShowTimes] = useState(false)
    const [formDisabled, setFormDisabled] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [showDelete, setShowDelete] = useState(false)

    useEffect(() => {
        if (!bookings[id]) {
            history.push('/')
        }
        if (!bookingDate || !bookingTime) {
            setFormDisabled(true)
        } else {
            setFormDisabled(false)
        }
    }, [dispatch, bookingDate, bookingTime, bookings, id, history])


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

    const goBack = () => {
        history.goBack();
    };

    const weekday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    let show = (
        <>
            {!error && !avail_times.length && (
                <div className="noAvail">
                    No Availabilities - Please select another day
                </div>
            )

            }
        </>
    )

    const simpleDate = (data) => {
        const booking_date = new Date(data);
        const formattedDate = booking_date.toISOString().slice(0, 10);
        return formattedDate
    }

    const handleChange = async (e) => {
        // 2023-11-22
        setShowTimes(true)
        setAvailTimes([])
        dateRef.current = e
        if (e === simpleDate(bookings[id].date)) {
            setBookingTime(bookings[id].time)
        } else {
            setBookingTime('')
        }
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
        }
        else {
            setError('')
            await dispatch(getOneTourDateAvail(bookings[id].tour_id, date_id)).then((data) => {
                if (data.errors) {
                    setError(data.errors)
                } else {
                    let normalizedAvail = Object.values(data.availabilities)
                    normalizedAvail.forEach((avail) => {
                        setAvailTimes((prevAvail) => [...prevAvail, avail.time])

                    })

                }
            })
        }

    };

    const handleCancel = (e) => {
        setShowTimes(false)
        setBookingDate(bookings[id].date)
        setBookingTime(bookings[id].time)
        setShowUpdate(false)
        setShowDelete(false)
        setAvailTimes([])
    }

    const handleEdit = (e) => {
        setShowSuccess(false)
        setShowDelete(false)
        const date = new Date(bookings[id].date);
        const formattedDate = date.toISOString().slice(0, 10);
        handleChange(formattedDate)
        setShowUpdate(!showUpdate)
        if (showUpdate) {
            handleCancel(e)
        }
    }

    const handleTime = (e, times) => {
        setBookingTime(times)
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        setError('');


        await dispatch(deleteBooking(id)).then((data) => {
            if (data.error) {
                setError('Error Deleting - See Console')
            } else {
                history.push('/mybookings')
            }
        }
        )
    }

    const confirmDelete = () => {
        setShowUpdate(false)
        setShowSuccess(false)
        setShowDelete(!showDelete)
    }


    const handleUpdate = async (e) => {
        e.preventDefault();
        setError()
        let booking_data = {
            'date': bookingDate,
            'time': bookingTime,
            'guide_id': bookings[id].guide_id
        }

        await dispatch(editBooking(id, booking_data)).then((data) => {
            if (data.errors) {
                console.log(data.errors)
                setError('Error Updating - See Console')
            } else {
                dispatch(getBookings()).then(() =>
                    dispatch(allUsers())).then(() =>
                        dispatch(authenticate())).then(() =>
                            setShowUpdate(false)).then(() =>
                                setShowSuccess(true))

            }
        })

    }

    return (
        bookings[id] ? (
            < div className="booking_details_container" >
                <div className="booking_details_left">
                    <div className="booking_card">
                        <i className="fa-solid fa-arrow-left" onClick={goBack}></i>
                        <div className="booking_card_title">
                            {bookings[id].tour_title}
                        </div>
                        <div className="booking_card_subtitle">
                            Tour Guided By {users[bookings[id].guide_id].first_name} {users[bookings[id].guide_id].last_name}
                        </div>
                        <img
                            src={users[bookings[id].guide_id].profile_pic}
                            className='booking_details_img'
                            alt={id}
                            key={id}
                        />
                        <div className="booking_details_date">
                            {bookings[id].date}
                        </div>
                        <div className="booking_details_sub">
                            {formattedTime(bookings[id].time)}
                        </div>
                        <div className="booking_details_sub">
                            Duration: {bookings[id].tour_duration} Hours
                        </div>
                    </div>
                    {!bookings[id].completed &&
                        (
                            <div className="booking_card">
                                <div className="booking_card_title">
                                    Update Reservation
                                </div>
                                <div className="booking_update_button_container">
                                    <div className="booking_edit_button" onClick={(e) => handleEdit(e)}>
                                        Edit Booking
                                    </div>
                                    <div className="booking_cdelete_button" onClick={(e) => confirmDelete(e)}>
                                        Cancel Booking
                                    </div>
                                </div>

                            </div>
                        )}

                    {showDelete && (
                        <div className="booking_card">
                            <form onSubmit={handleDelete}>
                                <div className="booking_card_title">
                                    Click Below to Confirm Cancellation
                                </div>
                                <div className="booking_delete_button_container">
                                    <div>
                                        <button
                                            type="submit"
                                            className="booking_delete_button"
                                        >Confirm Cancel</button>
                                    </div>
                                    < br />
                                    <div onClick={(e) => handleCancel(e)} className="booking_keep_button">
                                        Keep Booking
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    {showUpdate && (
                        <div className="booking_card">
                            <form onSubmit={handleUpdate}>
                                <div className="booking-date-selection-container">
                                    <input
                                        type="date"
                                        className="booking_date_input"
                                        value={bookingDate}
                                        onChange={(e) => handleChange(e.target.value)}
                                    />
                                </div>

                                {showTimes && show}

                                <div className="times_container">
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
                                <div className="noAvail">

                                    {error}
                                </div>
                                <div className="booking_update_button_container">
                                    <div>
                                        <button
                                            type="submit"
                                            className="booking_update_buttons"
                                            disabled={formDisabled}
                                        >Update</button>
                                    </div>
                                    <div onClick={(e) => handleCancel(e)} className="booking_update_buttons">
                                        Cancel
                                    </div>
                                </div>

                            </form>
                        </div>
                    )

                    }

                    {showSuccess &&
                        <div className="booking_card">
                            <div className="noAvail">
                                Booking Successfully Updated!
                            </div>
                        </div>

                    }

                    <div className="booking_card">
                        <div className="booking_card_title">
                            Payment Details
                        </div>
                        <div className="booking_details_cost">
                            Total Cost
                        </div>
                        <div className="booking_details_sub">
                            ${bookings[id].tour_price} USD
                        </div>
                    </div>
                </div>
                <div className="booking_details_right">
                    {/* <MapContainer tour={business} businessId={business.id} /> */}
                </div>
            </div >
        ) : (
            <>
                Booking does not exist
            </>
        )


    )
}