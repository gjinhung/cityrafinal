import React from 'react'
import OpenModalButton from '../OpenModalButton'
import UserImages from './UserImages'
import { useDispatch } from 'react-redux'
import { deleteImage } from '../../store/images'
import { getTours } from '../../store/tour'
import { useModal } from "../../context/Modal";

function DeleteImage({ tour_id, image_id }) {
    const dispatch = useDispatch()
    const { closeModal } = useModal();

    async function handleDeleteImage(e) {

        e.preventDefault()
        console.log(image_id)
        const data = await dispatch(deleteImage(image_id))
        if (data) {
            console.log(data)
        } else {
            await dispatch(getTours())
            await closeModal()
        }

    }

    return (
        <div className='add_image_modal_container'>
            <div className='add_image_title'>Delete Image</div>
            <div className='image_upload_wrapper'>
                <div className="upload_image_button" onClick={(e) => handleDeleteImage(e)}>
                    DELETE IMAGE
                </div>
                <div >
                    <OpenModalButton
                        buttonText={"CANCEL"}
                        modalComponent={<UserImages
                            tour_id={tour_id} />}
                        className='cancel_image_button'
                    />
                </div>
            </div>
        </div>
    )
}

export default DeleteImage