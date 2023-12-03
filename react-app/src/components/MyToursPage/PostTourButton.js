import React from 'react'
import { useSelector } from 'react-redux'
import no_bookings from '../../images/add_tour_img.jpeg'
import { NavLink } from "react-router-dom/";


function PostTourButton() {
    const current_user = useSelector((state) => state.session.user)

    let showUpcoming

    if (!current_user.tours_given_ids.length) {
        showUpcoming = (
            <div className="no_tours_cont">
                <div className="no_tours_container">
                    <div className="left_no_tour">
                        <i className="fa-solid fa-mountain-city"></i>
                        <div className="no_booking_texts">
                            <h3 className="no_upcoming">
                                No tours posted...yet!
                            </h3>
                            <div className="no_upcoming_text">
                                Share a part of your city today!
                            </div>
                        </div>
                        <NavLink exact to="/mytours/new" className="tours-buttons">
                            Start Giving Tours
                        </NavLink>
                    </div>
                    <div className="right_no_tour">
                        <img src={no_bookings} className="no_booking_stock" alt="booking_stock"></img>

                    </div>
                </div>
            </div>
        )
    } else {
        showUpcoming = (
            <div className='post-tour-container'>
                <NavLink exact to="/mytours/new" className="tours-buttons">
                    POST A NEW TOUR
                </NavLink>
            </div>
        )
    }

    return (
        <div>
            {showUpcoming}
        </div>
    )
}

export default PostTourButton