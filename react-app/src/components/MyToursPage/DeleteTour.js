import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteAvailabilities } from '../../store/availability'
import { deleteTour, getTours } from '../../store/tour'
import { authenticate } from '../../store/session'
import { allUsers } from '../../store/users'
import { deleteImage } from '../../store/images'

function DeleteTour({ tour_id }) {
    const tours = useSelector((state) => state.tours)
    const tour = tours[tour_id]
    const dispatch = useDispatch()

    function handleDelete(e) {
        e.preventDefault()

        dispatch(deleteAvailabilities(tour_id)).then(() =>
            tour.images.forEach((image) => {
                dispatch(deleteImage(image.id))
            })).then(() =>
                dispatch(deleteTour(tour_id)).then(() =>
                    dispatch(authenticate())).then(() =>
                        dispatch(getTours())).then(() =>
                            dispatch(allUsers()))
            )

    }
    return (
        <div className='delete-tour-container'>
            <div className='delete-tour-button' onClick={(e) => handleDelete(e)}>Confirm Delete</div>
        </div>
    )
}

export default DeleteTour