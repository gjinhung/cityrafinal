import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import ReviewCard from "./ReviewCard";
import { useParams } from "react-router-dom/";
import TourBooking from "./BookingCard";

export default function GuideSliderCard({ type }) {
    const { id } = useParams()
    const cities = useSelector((state) => state.cities)
    const tours = useSelector((state) => state.tours)
    const dates = useSelector((state) => state.dates)
    const users = useSelector((state) => state.users)
    let current_guide_tour_ids = users[id].tours_given_ids

    const getAvail = (tour_id) => {
        let avail_arr = tours[tour_id].availabilities
        let res = avail_arr.map((avail) =>
            dates[avail.date_id].date
        )
        return (res)
    }


    if (type === "Reviews") {
        return (
            <>

                <ReviewCard />
            </>
        )
    } else if (type !== "Tours") {
        let res = []
        let guide_tours = users[id].tours_given_ids
        guide_tours.forEach((tour_id) => {
            if (tours[tour_id].type === type) {
                res.push(tour_id)
            }
            current_guide_tour_ids = res
        })
    }
    if (!current_guide_tour_ids[0]) {
        return (
            <>
                {users[id].first_name} {users[id].language_name} currently does not offer any tours
            </>
        )
    }


    return (
        <>
            {current_guide_tour_ids.map((tour_id, idx) => {
                return (
                    <div key={idx}>
                        <div className="guide_card_container">
                            <div className="guide_card_left">
                                <i className="fa-solid fa-image"></i>
                            </div>
                            <div className="guide_card_right_container">
                                <div className="guide_card_right">
                                    <div>{tours[tour_id].title} ({cities[tours[tour_id].city_id].city})</div>
                                    <div>{tours[tour_id].about}</div>
                                    <div className="price_duration">
                                        <div>${tours[tour_id].price} USD</div>
                                        <div><i className="fa-regular fa-clock"></i> {tours[tour_id].duration} Hrs</div>
                                    </div>
                                </div>
                                <div className="guide_card_right_right">
                                    <div className="availability-container">
                                        <>
                                            Tour Dates:
                                        </>
                                        <div className="avail-date-container">
                                            {getAvail(tour_id).map((date, idx) =>
                                                <div key={idx}>
                                                    {date}
                                                </div>
                                            )}
                                        </div>

                                    </div>

                                </div>

                            </div>
                        </div >
                        <TourBooking
                            tour_id={tour_id}
                        />
                    </div>
                )
            })

            }
        </>
    )
}