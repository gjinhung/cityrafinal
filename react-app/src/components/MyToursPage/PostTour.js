import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTours, newTour } from "../../store/tour";
import { getTypes } from "../../store/type";
import { getCities } from "../../store/city";
import { newAvailability } from "../../store/availability";
import { allUsers } from "../../store/users";
import { useHistory } from "react-router-dom/";
import { authenticate } from "../../store/session";

function PostTour({ loaded }) {
    const history = useHistory()
    const dispatch = useDispatch()
    const types = useSelector((state) => state.types)
    const normalizedTypes = Object.values(types)
    const [type, setType] = useState("Other")
    const cities = useSelector((state) => state.cities)
    const normalizedCities = Object.values(cities)
    const dates = useSelector((state) => state.dates)
    const [city, setCity] = useState("New York")
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState(0)
    const [duration, setDuration] = useState(0)
    const [about, setAbout] = useState('')
    const [errors, setErrors] = useState({});
    const [showType, setShowType] = useState(false)
    const [showCity, setShowCity] = useState(false)
    const [availabilities, setAvailabilities] = useState([])
    const [formDisabled, setFormDisabled] = useState(false)
    const weekday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    useEffect(() => {
        if (title.length < 10 || about.length < 20 || price <= 0 || price === "" || duration <= 0 || duration === "") {
            setFormDisabled(true)
        } else {

            if (Object.keys(errors).length) {
                console.log('there are errors')
                setFormDisabled(true)
            } else {
                console.log('there are no errors')
                setFormDisabled(false)
            }
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

        if (Object.keys(errors).length === 0) {

            let tour_data = {
                'type': type,
                'city': city,
                'title': title,
                'price': price,
                'duration': duration,
                'about': about
            }

            const data = await dispatch(newTour(tour_data))
            if (data.errors) {
                setErrors(data)
                console.log(data)
            } else {
                dispatch(authenticate()).then(() =>
                    dispatch(getTypes())).then(() =>
                        dispatch(getCities())).then(() =>
                            dispatch(getTours())).then(() =>
                                dispatch(allUsers())).then(() =>

                                    uniqueAvailArr.forEach((avail) => {
                                        const splitData = avail.split(' - ')
                                        let avail_data = {
                                            'date': dates[+splitData[1]].date,
                                            'time': splitData[0],
                                            'tour_id': data.id
                                        }
                                        console.log(avail_data)
                                        const availErrors = dispatch(newAvailability(data.id, avail_data))
                                        if (availErrors) {
                                            console.log('Adding Availabilities Errors, see console')
                                            console.log(availErrors)
                                        }
                                    })
                                ).then(() => history.push('/mytours'))
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

    function handleTitle(e) {
        setTitle(e)
        if (e.length < 10) {
            let titleUpdate = { ...errors }
            titleUpdate['title'] = "Titles needs a minimum of 10 characters"
            setErrors(titleUpdate)
        } else {
            let titleUpdate = { ...errors }
            delete titleUpdate['title']
            setErrors(titleUpdate)
        }
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

    if (!loaded) {
        return (
            <div className="loading-style">
                <div className='loading-font'>
                    Loading...
                </div>
            </div>
        )
    } else {
        return (
            <div className="new-tours-page-container">
                <div className="new-tours-page-small-container">

                    <form onSubmit={handleSubmit}>
                        <div>
                            <div>
                                <label className="tour_box_title">TITLE OF TOUR:  </label>
                                <input
                                    id="title"
                                    placeholder="Title of Tour"
                                    value={title}
                                    onChange={(e) => handleTitle(e.target.value)}
                                />
                                <div>
                                    {errors && errors['title'] ? <div style={{ color: "red" }}>{errors['title']}</div> : <div className="empty-space"> </div>}
                                </div>
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
                                <option value='Others'>Others</option>
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
                                <option value='Others'>Others</option>
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
                                        <button className='tour-linkbuttons' onClick={(e) => handleDeleteAvail(e, idx)}>Delete</button>

                                    </div>
                                )
                            })
                            }
                            <div className='tour-linkbuttons' onClick={handleAddAvail}> Add Availabilities</div>

                        </div>
                        <button disabled={formDisabled} className={'tours-buttons'} type="submit">POST TOUR</button>
                    </form >
                </div>
            </div>
        )
    }
}
export default PostTour