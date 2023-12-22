import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getBookings, newBooking } from '../../store/booking'
import { allUsers } from '../../store/users'
import { authenticate } from '../../store/session'
import { useHistory } from 'react-router-dom/'
import { useSearch } from '../../context/SearchBar'


function Book_Tour({ avail_time, tour_id }) {
    const dispatch = useDispatch()
    const { searchTerms } = useSearch()
    const [error, setError] = useState('')
    const tours = useSelector((state) => state.tours)
    const history = useHistory()
    const current_user = useSelector((state) => state.session.user)


    const handleSubmit = async (e) => {
        const { date } = searchTerms



        e.preventDefault()
        setError('')

        let booking_data = {
            'date': date,
            'time': avail_time.startTime,
            'guide_id': tours[tour_id].guide_id
        }

        await dispatch(newBooking(booking_data, tour_id)).then((data) => {
            console.log(data)
            if (data.error) {
                setError('Error Creating Booking - See Console')
                console.log(data)
            } else {
                dispatch(getBookings()).then(() =>
                    dispatch(allUsers())).then(() =>
                        dispatch(authenticate())).then(() =>
                            history.push('/mybookings'))
            }
        })
    }

    function convertTime(time) {
        const hours = time.substring(0, 2);
        const minutes = time.substring(3, 5)
        const twelveHours = hours % 12;
        let amPm = (hours >= 12) ? "PM" : "AM"
        let formattedTime = twelveHours + ":" + minutes + ' ' + amPm
        return formattedTime
    }

    return (
        <div className='search_time_slot'>
            <div className='search_time_slot_left'>
                <div>
                    <div className='search_time_slot_startEnd'>
                        START TIME
                    </div>
                    <div className='search_time_slot_time'>
                        {convertTime(avail_time.startTime)}
                    </div>

                </div>
                {/* <div className='search_time_slot_remaining'>
                    REMAINING SPOTS:
                </div> */}
                <div className='search_time_slot_ptitle'>
                    PRICE
                </div>
                <div className='search_time_slot_price'>
                    $ {tours[tour_id].price} USD
                </div>
            </div>
            <div className='search_time_slot_right'>
                <div className='booking_button'
                    onClick={(e) => current_user ? handleSubmit(e) : history.push("/slider")}>BOOK</div>

                {error && <div> {error} </div>}

            </div>
        </div >
    )
}

export default Book_Tour