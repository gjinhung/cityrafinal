import React, { useState } from 'react'
import DeleteImage from './DeleteImage'
import OpenModalButton from '../OpenModalButton'


function DeleteMarker({ image, setImgId, tour_id }) {
    const [deletebutt, setDeleteButton] = useState(false)

    return (
        <div className='image_tour_wrapper' onMouseOver={(e) => setDeleteButton(true)} onMouseLeave={(e) => setDeleteButton(false)}>
            <img
                src={image.url}
                className='image_tour'
                alt={tour_id}
                onClick={(e) => setImgId(image)}

            />
            <OpenModalButton
                buttonText={<i className="fa-solid fa-x"></i>}
                modalComponent={<DeleteImage
                    tour_id={tour_id}
                    image_id={image.id}
                />}
                className={`delete_button${deletebutt}`}
            />
        </div>
    )
}

export default DeleteMarker