import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useActiveTourDetails } from '../../context/ActiveTourDetails'
import Mountain from '../../images/Mountain.png'
import { useHistory } from 'react-router-dom/'
import { useSearch } from "../../context/SearchBar";
import Book_Tour from './Book_Tour'
import Images from '../MyToursPage/Images'
import OpenModalButton from '../OpenModalButton'

function SearchedTour({ tour_id }) {
    const tours = useSelector((state) => state.tours)
    const cities = useSelector((state) => state.cities)
    const dates = useSelector((state) => state.dates)
    const formattedDate = Object.values(dates)
    const { activeDetTour, setDetActiveTour } = useActiveTourDetails()
    const [showDets, setShowDets] = useState(false)
    const [updateDelete, setUpdateDelete] = useState(true)
    const users = useSelector((state) => state.users)
    const guide = users[tours[tour_id].guide_id]
    const history = useHistory()
    const { submitSearch } = useSearch()

    let previewImg = []
    let notPImg = []
    const images = tours[tour_id].images

    images.forEach((image) => {
        if (image.preview) {
            previewImg.push(image)
        } else {
            notPImg.push(image)
        }
    })
    let sortedImages = [...previewImg, ...notPImg]

    const { date } = submitSearch

    useEffect(() => {
        if (activeDetTour !== tour_id) {
            setShowDets(false)
        }
    }, [activeDetTour])

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

    const date_availabilities = (date) => {
        const weekday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        if (date) {

            let year = date.substring(0, 4);
            let month = date.substring(5, 7);
            let day = date.substring(8, 10);
            let newDate = new Date(`${year}-${month}-${day}`);

            let dayOfWeek = weekday[newDate.getDay()]

            let date_id
            formattedDate.forEach((date) => {
                if (date.date === dayOfWeek) {
                    date_id = date.id
                }
            })

            let tour_availabilites = tours[tour_id].availabilities
            let avail_times = []
            tour_availabilites.forEach((avail) => {
                if (+avail.date_id === +date_id) {
                    let obj = {}
                    const [hours, minutes] = avail.time.split(":");
                    let newHour = +hours + tours[tour_id].duration
                    if (+newHour > 24) {
                        newHour = +newHour - 12
                    }
                    let endTime = `${newHour}:${minutes}`
                    obj['startTime'] = avail.time
                    obj['endTime'] = endTime
                    avail_times.push(obj)
                } else {
                }
            })
            return avail_times
        } else {
            let tour_availabilites = tours[tour_id].availabilities
            let avail_times = []
            tour_availabilites.forEach((avail) => {

                let obj = {}
                const [hours, minutes] = avail.time.split(":");
                let newHour = +hours + tours[tour_id].duration
                if (+newHour > 24) {
                    newHour = +newHour - 12
                }
                let endTime = `${newHour}:${minutes}`
                obj['startTime'] = avail.time
                obj['endTime'] = endTime
                avail_times.push(obj)
            }
            )
            return avail_times
        }
    }


    const availabilities = (tour_id) => {
        let tour_avail = tours[tour_id].availabilities
        let res = {}
        let normalizedDates = Object.values(dates)
        normalizedDates.forEach((date) => {
            res[date.date] = []
        })
        tour_avail.forEach((avail) => {

            let formattedTime = convertTime(avail.time)
            // console.log(dates[avail.date_id])
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
                                <div className="search_avail_day">{day.slice(0, 3)}</div>
                                {res[`${day}`].length ? (

                                    res[`${day}`].map((time, idx) => {
                                        return (
                                            <div className="search_avail_times" key={idx}>
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

    return (
        <div className="search-container" >
            <div className="search-tour-subcontainer">
                <div className="tour_title">
                    {tours[tour_id].title}
                </div>
                <div className="search-left-right-container">
                    <div className="search-tour-info-left">
                        <div className="search_tour_main_details">
                            <div className='search_tour_main_image'>
                                <img
                                    src={sortedImages[0] ? sortedImages[0].url : Mountain}
                                    className='tour_image'
                                    alt={tour_id}
                                    key={tour_id}
                                />
                                {sortedImages.length ? (<div className="see-image-button">
                                    <OpenModalButton
                                        buttonText={<i className="fa-solid fa-image"></i>}
                                        modalComponent={<Images
                                            tour_id={tour_id} />}
                                        className='images_button'
                                    />
                                </div>) : (<></>)}
                            </div>
                            <div className="search_left_sub_container">
                                <div className="search_tour_details_box">
                                    <div className="tour_box_title">HOSTED BY: </div>
                                    <div className="tour_box_details">
                                        <div className='search_hostcontainer' onClick={(e) => history.push(`/guide/${guide.id}`)}>
                                            <img src={guide.profile_pic}
                                                className='search-userImg'
                                                alt={guide.id}
                                                key={guide.id}
                                            />
                                            <div className='search-hostinfo'>
                                                {`${guide.first_name} ${guide.last_name}`}
                                                <div>

                                                </div>
                                                <div className='search_hostrating' >
                                                    <i className="fa-solid fa-star"></i>
                                                    {` ${guide.rating}`}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="search_tour_details_box">
                                    <div className="tour_box_title">CITY: </div>
                                    <div className="tour_box_details">{cities[tours[tour_id].city_id].city}</div>

                                    {/* <div className="search_tour_details_box">{tours[tour_id].city_id}</div> */}
                                </div>
                                <div className="search_tour_details_box">
                                    <div className="tour_box_title">TYPE: </div>
                                    <div className="tour_box_details">{tours[tour_id].type}</div>
                                </div>
                                <div className="search_tour_details_box">
                                    <div className="tour_box_title">DURATION: </div>
                                    <div className="tour_box_details"><i className="fa-regular fa-clock"></i> {tours[tour_id].duration} Hrs</div>
                                </div>
                                <div className="show_more_button" onClick={(e) => handleShowDets(e)}>{!showDets ? ('+  SEE MORE DETAILS') : ('-  SEE LESS DETAILS')}</div>
                            </div>

                            {showDets &&
                                <div className={`tour_details_container`}>
                                    <div className="avail-container">{availabilities(tour_id)}</div>
                                    <div className="tour_details_box">
                                        <div className="tour_box_title">ABOUT: </div>
                                        <div className="search_tour_box_details">{tours[tour_id].about}</div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="search-tour-info-left">
                        <div className='choose_time_title'>
                            CHOOSE A TIME SLOT FROM BELOW
                        </div>
                        <div className='search_right_subcontainer'>
                            {date_availabilities(date).map((avail_time, idx) => {
                                return (
                                    <Book_Tour
                                        avail_time={avail_time}
                                        tour_id={tour_id}
                                        key={idx} />
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default SearchedTour