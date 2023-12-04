import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useActiveTour } from "../../context/ActiveTours";

import './GuidePage.css'
import { NavLink } from "react-router-dom/";
import GuideSliderCard from "./GuideCard";

export default function GuidePage({ loaded }) {
    const { setActiveTour } = useActiveTour()
    const { id } = useParams()
    const users = useSelector((state) => state.users)
    const tours = useSelector((state) => state.tours)
    const bookings = useSelector((state) => state.bookings)
    const user = users[id]
    const guide = users[id]
    const languages = useSelector((state) => state.languages)
    const current_user = useSelector((state) => state.session.user)
    const [showType, setShowType] = useState('Tours')




    const toursTypeArray = () => {
        let res = ['Tours']
        users[id].tours_given_ids.map((tour_id) => {
            if (!res.includes(tours[tour_id].type)) {
                res.push(tours[tour_id].type)
            }
        })
        res.push('Reviews')
        return res
    }


    if (!loaded) {
        return (
            <div className="loading-style">
                <div className='loading-font'>
                    Loading...
                </div>
            </div>
        )
    } else {
        const ratingStars = (rating) => {
            let numStars = Math.floor(rating)
            let remainder = rating - numStars
            let starArr = []
            for (let i = 1; i <= 5; i++) {
                if (i <= numStars) {
                    starArr.push('fa-solid fa-star')
                } else {
                    starArr.push('fa-regular fa-star')
                }
            }
            if (remainder >= .5) {
                starArr[numStars] = ("fa-solid fa-star-half-stroke")
            }
            return starArr
        }

        function completedTours() {
            let count = 0
            let booking_ids = users[id].booking_ids
            booking_ids.forEach((booking_id) => {
                if (bookings[booking_id].completed) {
                    count++
                }
            })
            return count
        }


        return (
            <div className="guide-page">
                <div className="left-side">
                    <div className="user-info">
                        <div className="guide_details-container">
                            <div className="container">
                                <img src={guide.profile_pic}
                                    className='userImg'
                                    alt={guide.id}
                                    key={guide.id}
                                />
                                {/* {(+current_user.id === +id) &&
                                    <NavLink exact to="/dashboard" className="edit_profile_button">
                                        Edit Profile
                                    </NavLink>} */}
                            </div>
                            <div className="guide-info-container">
                                <div className="users_name"> {user.first_name} {user.last_name}</div>
                                <div className="stars_container">
                                    {ratingStars(user.rating).map((starType, idx) => {
                                        return (
                                            <div key={idx} className="guide-rating"><i className={starType}></i></div>
                                        )
                                    })}
                                    ({user.rating})
                                </div>
                                <div>
                                    {`(${completedTours()} ${completedTours() === 1 ? 'tour' : "tours"} given)`}
                                </div>
                                <div> <i className="fa-solid fa-language"></i> Languages I speak:</div>
                                {user.language_ids.map((language_id, idx) => {
                                    return (<li key={idx}>{languages[language_id].language}</li>)
                                })}
                            </div>
                        </div >

                        <div className="type-slider-container" >
                            {
                                (toursTypeArray()).map((type, idx) => {
                                    return (
                                        <div key={idx} className="type-selector" onClick={(e) => {
                                            setShowType(type)
                                            setActiveTour(0)
                                        }}>
                                            {type}
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <hr />
                        {
                            <GuideSliderCard
                                type={showType}
                            />
                        }

                    </div>
                </div>
                {/* <div className="right-side">
                    <>
                        <PostBooking />
                    </>
                </div> */}

            </div >
        )
    }
}