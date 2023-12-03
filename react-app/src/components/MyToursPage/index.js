import React, { useState } from "react";
import { useSelector } from "react-redux";

import TourCard from "./TourCard";
import './MyToursPage.css'
import PostTourButton from "./PostTourButton";

export default function MyToursPage({ loaded }) {
    const user_tours = useSelector((state) => state.session.user.tours_given_ids)

    if (!loaded) {
        return (
            <div className="loading-style">
                <div className='loading-font'>
                    Loading....
                </div>
            </div>
        )
    } else {
        return (
            <div className="my-tours-page-container">
                <div className="my-tours-page-small-container">
                    <div>
                        <PostTourButton />
                    </div>
                    {user_tours.map((tour_id, idx) => {
                        return (
                            <TourCard
                                tour_id={tour_id}
                                key={idx}
                            />
                        )
                    }
                    )
                    }
                </div>
            </div>
        )
    }
}