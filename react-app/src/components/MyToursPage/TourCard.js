import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useActiveTourDetails } from "../../context/ActiveTourDetails";
import './MyToursPage.css'
import Mountain from '../../images/Mountain.png'
import TourUpdateComponent from "./UpdateTour";
import DeleteTour from "./DeleteTour";
import OpenModalButton from "../OpenModalButton";
import AddImage from "./AddImage";
import UserImages from "./UserImages";

export default function TourCard({ tour_id }) {
    const tours = useSelector((state) => state.tours)
    const cities = useSelector((state) => state.cities)
    const [imgIdx, setImgIdx] = useState(0)
    const dates = useSelector((state) => state.dates)
    const { activeDetTour, setDetActiveTour } = useActiveTourDetails()
    const [showDets, setShowDets] = useState(false)
    const [updateDelete, setUpdateDelete] = useState(true)

    let previewImg = []
    let notPImg = []
    let tour = tours[tour_id]
    let images = tour.images
    if (images.length) {
        images.forEach((image) => {
            if (image.preview) {
                previewImg = [image]
            } else {
                notPImg.push(image)
            }
        })
    }

    let sortedImages = [...previewImg, ...notPImg]

    const left = () => {
        // console.log('left')
        if (imgIdx === 0) {
            setImgIdx(sortedImages.length - 1)
        } else {
            setImgIdx(prev => prev - 1)
        }
    }

    const right = () => {
        // console.log("right")
        if (imgIdx === sortedImages.length - 1) {
            setImgIdx(0)
        } else {
            setImgIdx(prev => prev + 1)
        }
    }



    useEffect(() => {
        if (activeDetTour !== tour_id) {
            setShowDets(false)
        }
    }, [activeDetTour, tour_id])

    function selectDelete(e) {
        setUpdateDelete(false)
    }

    function selectUpdate(e) {
        setUpdateDelete(true)
    }


    function handleShowDets(e) {
        setShowDets(!showDets)
        setDetActiveTour(tour_id)
    }

    function convertTime(time) {
        const hours = time.substring(0, 2);
        const minutes = time.substring(3, 5)
        const twelveHours = hours % 12;
        let amPm = (hours >= 12) ? "PM" : "AM"
        let formattedTime = twelveHours + ":" + minutes + ' ' + amPm
        return formattedTime
    }

    const availablilties = (tour_id) => {
        let tour_avail = tours[tour_id].availabilities
        let res = {}
        let normalizedDates = Object.values(dates)
        normalizedDates.forEach((date) => {
            res[date.date] = []
        })
        tour_avail.forEach((avail) => {

            let formattedTime = convertTime(avail.time)
            res[dates[avail.date_id].date].push(formattedTime)
        })
        let normalizedResKey = ['Sunday', "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]


        return (
            <>
                <div className="tour_box_title">AVAILABILITIES:</div>
                <div className="avail_container">
                    {normalizedResKey.map((day, idx) => {
                        return (
                            <div className="avail_day_container" key={idx}>
                                <div className="avail_day">{day.slice(0, 3)}</div>
                                {res[`${day}`].length ? (

                                    res[`${day}`].map((time, idx) => {
                                        return (
                                            <div className="avail_times" key={idx}>
                                                {time}
                                            </div>
                                        )
                                    })

                                ) : (
                                    <div className="avail_times">
                                        -
                                    </div>
                                )
                                }

                            </div>
                        )
                    })}


                </div>
            </>
        )
    }
    if (tours[tour_id]) {
        return (
            <div className="tour-container" >
                <div className="tour-subcontainer">
                    <div className="tour_title">
                        {tours[tour_id].title}
                    </div>
                    <div className="left-right-container">
                        <div className="tour-info-left">
                            <div className="tour_main_details">
                                <div className="tour_image_container">
                                    <img
                                        src={sortedImages.length ? sortedImages[imgIdx].url : Mountain}
                                        className='tour_image'
                                        alt={tour_id}
                                        key={tour_id}
                                    />
                                    {sortedImages.length ? <>
                                        <div onClick={(e) => left()} className="my_tour_left" ><i className="fa-solid fa-chevron-left"></i></div>
                                        <div onClick={(e) => right()} className="my_tour_right"><i className="fa-solid fa-chevron-right"></i></div>
                                    </> : <></>
                                    }
                                    <div className="edit-image-button">
                                        <OpenModalButton
                                            buttonText={"+"}
                                            modalComponent={<UserImages
                                                tour_id={tour_id} />}
                                            className='plus_button'
                                        />
                                    </div>
                                </div>
                                <div className="left_sub_container">
                                    <div className="tour_details_box">
                                        <div className="tour_box_title">TYPE: </div>
                                        <div className="tour_box_details">{tours[tour_id].type}</div>
                                    </div>
                                    <div className="tour_details_box">
                                        <div className="tour_box_title">DURATION: </div>
                                        <div className="tour_box_details"><i className="fa-regular fa-clock"></i> {tours[tour_id].duration} Hrs</div>
                                    </div>
                                    <div className="tour_details_box">
                                        <div className="tour_box_title">PRICE: </div>
                                        <div className="tour_box_details">$ {tours[tour_id].price} USD</div>
                                    </div>
                                    <div className="tour_details_box">
                                        <div className="tour_box_title">CITY: </div>
                                        <div className="tour_box_details">{cities[tours[tour_id].city_id].city}</div>

                                        {/* <div className="tour_box_details">{tours[tour_id].city_id}</div> */}
                                    </div>
                                    <div className="show_more_button" onClick={(e) => handleShowDets(e)}>{!showDets ? ('+  SEE MORE DETAILS') : ('-  SEE LESS DETAILS')}</div>
                                </div>

                                {showDets &&
                                    <div className={`tour_details_container`}>
                                        <div className="avail-container">{availablilties(tour_id)}</div>
                                        <div className="tour_details_box">
                                            <div className="tour_box_title">ABOUT: </div>
                                            <div className="tour_box_details">{tours[tour_id].about}</div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="tour_info-right">
                            <div className="tour-options">
                                <div onClick={(e) => selectUpdate()} className={`options_title_${updateDelete}`}>UPDATE TOUR</div>
                                <div onClick={(e) => selectDelete()} className={`options_title_${!updateDelete}`}>DELETE TOUR</div>
                            </div>
                            <div className="tour_components">
                                {updateDelete ? (
                                    <>
                                        <TourUpdateComponent
                                            tour_id={tour_id}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <DeleteTour
                                            tour_id={tour_id}
                                        />
                                    </>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        )
    } else {
        return (<>
        </>)
    }
}