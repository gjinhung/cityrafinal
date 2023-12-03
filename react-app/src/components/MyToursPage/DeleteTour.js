import React from 'react'
import { useDispatch } from 'react-redux'
import { deleteAvailabilities } from '../../store/availability'
import { deleteTour, getTours } from '../../store/tour'
import { authenticate } from '../../store/session'

function DeleteTour({ tour_id }) {
    const dispatch = useDispatch()

    function handleDelete(e) {
        e.preventDefault()

        dispatch(deleteAvailabilities(tour_id)).then(() =>
            dispatch(deleteTour(tour_id)).then(() =>
                dispatch(getTours())).then(() =>
                    dispatch(authenticate()))
        )

    }
    return (
        <div className='delete-tour-container'>
            <div className='delete-tour-button' onClick={(e) => handleDelete(e)}>Confirm Delete</div>
        </div>
    )
}

export default DeleteTour