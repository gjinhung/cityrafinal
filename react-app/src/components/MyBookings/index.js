import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
// import EditBookingModal from "../EditBookingModal";
// import DeleteBookingModal from "../DeleteBookingModal";
// import OpenModalButton from "../OpenModalButton";
import no_bookings from '../../images/add_tour_img.jpeg'
import './MyBookings.css'
import { NavLink } from "react-router-dom/cjs/react-router-dom";
import { getBookings } from "../../store/booking";


export default function MyBookings() {
    const dispatch = useDispatch()
    const bookings = useSelector((state) => state.bookings)
    let booking_ids = useSelector((state) => state.session.user.booking_ids)
    const cities = useSelector((state) => state.cities)
    const users = useSelector((state) => state.users)
    const tours = useSelector((state) => state.tours)
    const history = useHistory()
    const [loaded, setLoaded] = useState(false);



    useEffect(() => {
        dispatch(getBookings()).then(() => setLoaded(true))
    }, [dispatch])

    if (!loaded) {

        return (
            <div className="loading-style">
                <div className='loading-font'>
                    Loading...
                </div>
            </div>
        )
    } else {
        let pastBookings_ids = []
        let upcomingBooking_ids = []

        let normalizedBookingIds = Object.values(booking_ids)
        normalizedBookingIds.forEach((booking_id) => {
            if (bookings[booking_id] && bookings[booking_id].completed) {
                pastBookings_ids.push(booking_id)
            } else if (bookings[booking_id] && !bookings[booking_id].completed) {
                upcomingBooking_ids.push(booking_id)
            }
        })




        function convertDate(data) {

            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const date = new Date(data);

            const day = days[date.getDay()];
            const num = date.getDate()
            const month = months[date.getMonth()];
            const year = date.getFullYear();
            return `${day}, ${month} ${num}, ${year}`;

        }

        function first20(string) {
            if (string.length > 20) {
                return (`${string.slice(0, 20)}...`)
            }
            else {
                return string
            }

        }

        function first30(string) {
            if (string.length > 30) {
                return (`${string.slice(0, 30)}...`)
            }
            else {
                return string
            }
        }

        function goToBooking(e, id) {
            e.preventDefault()
            history.push(`/booking/${id}`)
        }

        function convertTime(time) {
            const hours = time.substring(0, 2);
            const minutes = time.substring(3, 5)
            // const milliseconds = time.substring(6, 8)

            const twelveHours = hours % 12;

            let amPm = (hours >= 12) ? "PM" : "AM"

            let formattedTime = twelveHours + ":" + minutes + ' ' + amPm

            return formattedTime
        }

        let showUpcoming

        if (!upcomingBooking_ids.length) {
            showUpcoming = (
                <div className="no_bookings_cont">
                    <div className="no_bookings_container">
                        <div className="left_no_booking">
                            <i className="fa-solid fa-mountain-city"></i>
                            <div className="no_booking_texts">
                                <h3 className="no_upcoming">
                                    No tours booked...yet!
                                </h3>
                                <div className="no_upcoming_text">
                                    Time to explore a new world with a trusted guide by your side
                                </div>
                            </div>
                            <NavLink exact to="/" className="tours-buttons">
                                Start Searching
                            </NavLink>
                        </div>
                        <div className="right_no_booking">
                            <img src={no_bookings} className="no_booking_stock" alt="booking_stock"></img>

                        </div>
                    </div>
                </div>
            )
        } else {
            showUpcoming = (
                upcomingBooking_ids.length && upcomingBooking_ids.map((booking_id, idx) => {
                    return (

                        <div className='booking_wrapper' key={idx}>

                            <div className="booking_image">
                                <img
                                    src={users[bookings[booking_id].guide_id].profile_pic}
                                    className='booking_guide_img'
                                    alt={booking_id}
                                    key={idx}
                                // onClick={() => history.push(`/guide/${bookings[booking_id].tour_guide_id}`)} 
                                />
                                {/* <div className="button-container">
                                <button
                                    className="tours-buttons"
                                    onClick={() => history.push(`/guide/${bookings[booking_id].tour_guide_id}`)}>
                                    View
                                </button>

                                <OpenModalButton
                                    buttonText="Update"
                                    modalComponent={
                                        <EditBookingModal booking={bookings[booking_id]} />
                                    }
                                    className={'tours-buttons'}
                                />
                                <OpenModalButton
                                    buttonText="Cancel Tour"
                                    modalComponent={
                                        <DeleteBookingModal booking_id={booking_id} />
                                    }
                                    className={'tours-buttons'}
                                />
                            </div> */}
                            </div>
                            <div className="text-container">
                                <div className="texts">
                                    <div className="booking_timeDate-container">
                                        <h4 className="booking_date" >
                                            {convertDate(bookings[booking_id].date)}
                                            <br />
                                            {convertTime(bookings[booking_id].time)}
                                        </h4>
                                    </div>
                                    <div className="booking_title">{first30(tours[bookings[booking_id].tour_id].title)} ({cities[tours[bookings[booking_id].guide_id].city_id].city})</div>
                                    <div className="booking_texts">Hosted by {users[bookings[booking_id].guide_id].first_name[0]}. {users[bookings[booking_id].guide_id].last_name}</div>
                                </div>
                                <div className="show_details_container">
                                    <NavLink exact to={`/booking/${booking_id}`} className="show_details_button">
                                        Show Details
                                    </NavLink>
                                </div>
                            </div>
                        </div >
                    )
                })
            )
        }

        let showPrev

        if (!pastBookings_ids.length) {
            showPrev = (
                <>
                </>
            )
        } else {
            showPrev = (
                pastBookings_ids.length && pastBookings_ids.map((booking_id, idx) => {
                    return (
                        <div key={idx}>
                            <div className="booking_scroll-container">
                                <div className='prev_booking_container' key={idx}
                                    onClick={(e) => goToBooking(e, booking_id)}
                                >
                                    <div className="prev_booking_left">
                                        <img
                                            src={users[bookings[booking_id].guide_id].profile_pic}
                                            className='prev_booking_img'
                                            alt={booking_id}
                                            key={idx}
                                        />
                                    </div>
                                    <div className="prev_booking_right">
                                        <div className="prev_booking_title">
                                            {first20(tours[bookings[booking_id].tour_id].title)}
                                        </div>
                                        <div className="prev_booking_hostedby">
                                            Hosted by {users[bookings[booking_id].guide_id].first_name[0]}. {users[bookings[booking_id].guide_id].last_name}
                                        </div>
                                        <div className="prev_booking_hostedby">
                                            {bookings[booking_id].date}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            )
        }



        return (
            <div className="booking_page_container">
                <div className="booking_page">

                    <h2>Upcoming Tours</h2>

                    <div className="booking_scroll-container">
                        {showUpcoming}
                    </div>
                    <h2>Previous Tours</h2>
                    <div className="prev_tours_container">
                        {showPrev}
                    </div>
                </div>
            </div >
        )
    }
}