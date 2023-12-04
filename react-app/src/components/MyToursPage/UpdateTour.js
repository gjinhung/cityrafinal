import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editTour, getTours } from "../../store/tour";
import { getTypes } from "../../store/type";
import { getCities } from "../../store/city";
import { deleteAvailabilities, newAvailability } from "../../store/availability";
import { allUsers } from "../../store/users";

export default function TourUpdateComponent({ tour_id }) {
    const dispatch = useDispatch()
    const tours = useSelector((state) => state.tours)
    const tour = tours[tour_id]
    console.log(tour.availabilities)
    const types = useSelector((state) => state.types)
    const normalizedTypes = Object.values(types)
    const [type, setType] = useState(tour.type)
    const cities = useSelector((state) => state.cities)
    const normalizedCities = Object.values(cities)
    const dates = useSelector((state) => state.dates)
    const [city, setCity] = useState(cities[tour.city_id].city)
    const [title, setTitle] = useState(tour.title)
    const [price, setPrice] = useState(tour.price)
    const [duration, setDuration] = useState(tour.duration)
    const [about, setAbout] = useState(tour.about)
    const [errors, setErrors] = useState({});
    const [showType, setShowType] = useState(false)
    const [showCity, setShowCity] = useState(false)
    const [availabilities, setAvailabilities] = useState(tour.availabilities)
    const [formDisabled, setFormDisabled] = useState(false)
    const weekday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    console.log(availabilities)
    useEffect(() => {
        if (Object.keys(errors).length) {
            setFormDisabled(true)
        } else {
            setFormDisabled(false)
        }

    }, [dispatch, errors])

    const handleSubmit = async (e) => {
        e.preventDefault()
        let availArr = []
        availabilities.forEach((data) => {
            let newData = `${data.time} - ${data.date_id}`
            availArr.push(newData)
        })
        const uniqueAvail = new Set(availArr)
        const uniqueAvailArr = Array.from(uniqueAvail);
        console.log(uniqueAvailArr)

        if (Object.keys(errors).length === 0) {

            let tour_data = {
                'type': type,
                'city': city,
                'title': title,
                'price': price,
                'duration': duration,
                'about': about
            }

            const data = await dispatch(editTour(tour_id, tour_data))
            if (data) {
                setErrors(data)
                console.log(data)
            } else {
                await dispatch(getTypes())
                await dispatch(getCities())
                await dispatch(getTours())
                await dispatch(allUsers())
                await dispatch(deleteAvailabilities(tour_id)).then((data) => {
                    if (data) {
                        console.log('Delete Availabilities Errors, see console')
                        console.log(data)
                    }
                }).then(() => {
                    console.log('availabilities deleted')
                    uniqueAvailArr.forEach((avail) => {
                        const splitData = avail.split(' - ')
                        let avail_data = {
                            'date': dates[+splitData[1]].date,
                            'time': splitData[0],
                            'tour_id': tour_id
                        }
                        console.log(avail_data)
                        const availErrors = dispatch(newAvailability(tour_id, avail_data))
                        if (availErrors) {
                            console.log('Adding Availabilities Errors, see console')
                            console.log(availErrors)
                        }
                    })
                })

            }


        }

    }

    function setTime(e, idx) {
        let avail = [...availabilities]
        avail[idx].time = e.target.value
        setAvailabilities(avail)
    }


    function setDate(e, idx) {
        let avail = [...availabilities]
        let date_id
        let normalizedDates = Object.values(dates)
        normalizedDates.forEach((date_obj) => {
            if (date_obj.date === e.target.value) {
                date_id = date_obj.id
            }
        })
        avail[idx].date_id = date_id
        setAvailabilities(avail)
    }

    function handleAbout(e) {
        setAbout(e)
        if (e.length < 20) {
            let aboutUpdate = { ...errors }
            aboutUpdate['about'] = "Description needs a minimum of 20 characters"
            setErrors(aboutUpdate)
        } else {
            let aboutUpdate = { ...errors }
            delete aboutUpdate['about']
            setErrors(aboutUpdate)
        }
    }

    function handlePrice(e) {
        const result = e.target.value.replace(/\D/g, '');
        setPrice(result);
        if (result <= 0 || result === "") {
            let priceUpdate = { ...errors }
            priceUpdate['price'] = "Price Required"
            setErrors(priceUpdate)
        } else {
            let priceUpdate = { ...errors }
            delete priceUpdate['price']
            setErrors(priceUpdate)
        }
    };

    function handleDuration(e) {
        const result = e.target.value.replace(/\D/g, '');
        setDuration(result);
        if (result <= 0 || result === "") {
            let priceUpdate = { ...errors }
            priceUpdate['duration'] = "Duration Required"
            setErrors(priceUpdate)
        } else {
            let priceUpdate = { ...errors }
            delete priceUpdate['duration']
            setErrors(priceUpdate)
        }
    };

    function handleAddAvail() {
        let monday
        let normalizedDates = Object.values(dates)
        normalizedDates.forEach((date_obj) => {
            if (date_obj.date === "Monday") {
                monday = date_obj.id
            }
        })

        let newAvail = {
            date_id: monday,
            time: '',
            tour_id: 3
        }

        setAvailabilities([...availabilities, newAvail])
        console.log(availabilities)
    }


    function handleDeleteAvail(e, idx) {
        e.preventDefault()
        let avail = [...availabilities]
        avail.splice(idx, 1)
        setAvailabilities(avail)
        console.log(availabilities)
    }

    function handleOtherType(e) {
        if (e.target.value === "Others") {
            setType('')
            setShowType(true)
        } else {
            setShowType(false)
            setType(e.target.value)
        }

    }

    function handleOtherCity(e) {
        if (e.target.value === "Others") {
            setCity('')
            setShowCity(true)
        } else {
            setShowCity(false)
            setCity(e.target.value)
        }
    }


    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <div>
                        <label className="tour_box_title">TITLE OF TOUR:  </label>
                        <input
                            id="title"
                            placeholder="Title of Tour"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        {errors && errors['title'] ? <div style={{ color: "red" }}>{errors['price']}</div> : <div className="empty-space"> </div>}

                    </div>
                    <label className="tour_box_title">TYPE OF TOUR: </label>
                    <select
                        className="tour-type"
                        name='type'
                        defaultValue={type}
                        onChange={(e) => handleOtherType(e)}>
                        {normalizedTypes.map((type, idx) => {
                            return (
                                <option key={idx} value={type.type}> {type.type}</option>
                            )
                        })}
                        <option value='Others'>Add New Type</option>
                    </select>
                    {showType && (
                        <>
                            <input
                                className="tour-type"
                                placeholder="Type of Tour"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            />
                        </>
                    )}
                    {errors && errors['type'] ? <div style={{ color: "red" }}>{errors['price']}</div> : <div className="empty-space"> </div>}

                </div>
                <div>
                    <label className="tour_box_title">CITY OF TOUR: </label>

                    <select
                        id='city'
                        className="tour-city"
                        defaultValue={city}
                        onChange={(e) => handleOtherCity(e)}>
                        {normalizedCities.map((city, idx) => {
                            return (
                                <option key={idx} value={city.city}> {city.city}</option>
                            )
                        })}
                        <option value='Others'>Add New City</option>
                    </select>
                    {showCity && (
                        <>
                            <input
                                className="tour-city"
                                placeholder="City of Tour"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </>
                    )}
                    {errors && errors['city'] ? <div style={{ color: "red" }}>{errors['price']}</div> : <div className="empty-space"> </div>}
                </div>
                <div className="price_duration_container">
                    <div className="dur_price_container">
                        <label className="tour_box_title">PRICE OF TOUR: </label>
                        <div className="sameline">
                            <i className="fa-solid fa-dollar-sign"></i>
                            <input
                                id='price'
                                type="text"
                                placeholder="Price of Tour"
                                value={price}
                                onChange={(e) => handlePrice(e)}
                            />
                        </div>
                        <div>
                            {errors && errors['price'] ? <div style={{ color: "red" }}>{errors['price']}</div> : <div className="empty-space"> </div>}
                        </div>

                    </div>
                    <div className="dur_price_container">
                        <label className="tour_box_title">DURATION OF TOUR (HRS): </label>
                        <div className="sameline">
                            <i className="fa-regular fa-clock fa-clock-tour"></i>
                            <input
                                type="text"
                                placeholder="Duration of Tour"
                                value={duration}
                                onChange={(e) => handleDuration(e)}
                            />
                        </div>
                        <div>
                            {errors && errors['duration'] ? <div style={{ color: "red" }}>{errors['duration']}</div> : <div className="empty-space"> </div>}
                        </div>
                    </div>
                </div>
                <div className='about-container'>
                    <label className="tour_box_title">ABOUT THE TOUR: </label>

                    <textarea
                        style={{ resize: "none" }}
                        id='about'
                        name="text"
                        rows={5}
                        cols={40}
                        placeholder="Leave a description about your tour..."
                        value={about}
                        onChange={(e) => handleAbout(e.target.value)}
                    >
                    </textarea>
                    <div>
                        {errors && errors.about ? <div style={{ color: "red" }}>{errors.about}</div> : <div className="empty-space"> </div>}
                    </div>

                </div>
                < div className="avail-container">
                    <label className="tour_box_title">AVAILABILITIES: </label>
                    {availabilities.map((avail, idx) => {
                        return (
                            <div key={idx} className="avail-slots">
                                <select
                                    className="tour_date"
                                    id='date'
                                    name='date'
                                    value={dates[avail.date_id].date}
                                    onChange={(e) => setDate(e, idx)}>
                                    {weekday.map((day, idx) => {
                                        return (
                                            <option key={idx} value={day}> {day}</option>
                                        )
                                    })}
                                </select>
                                <input
                                    className="select-time"
                                    type="time"
                                    value={avail.time}
                                    onChange={(e) => setTime(e, idx)
                                    }
                                />
                                <button className='linkbuttons' onClick={(e) => handleDeleteAvail(e, idx)}>Delete</button>

                            </div>
                        )
                    })
                    }
                    <div className='linkbuttons' onClick={handleAddAvail}> Add Availabilities</div>

                </div>
                <button disabled={formDisabled} className={'tours-buttons'} type="submit">Update Tour</button>
            </form >
        </>
    )
}