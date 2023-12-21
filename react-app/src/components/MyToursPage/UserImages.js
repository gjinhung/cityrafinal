import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import OpenModalButton from "../OpenModalButton";
import AddImage from "./AddImage";
import Mountain from '../../images/Mountain.png'
import DeleteMarker from './DeleteMarker';


function UserImages({ tour_id }) {
    const tour = useSelector(state => state.tours[tour_id])
    let previewImg = []
    let notPImg = []
    const images = tour.images
    console.log(images)

    images.forEach((image) => {
        if (image.preview) {
            previewImg.push(image)
        } else {
            notPImg.push(image)
        }
    })
    let sortedImages = [...previewImg, ...notPImg]
    const [img_id, setImgId] = useState(previewImg[0])

    return (
        <div className='image-modal-container'>
            <div className='image-modal-top'>
                <img
                    src={img_id ? img_id.url : Mountain}
                    className='image_tour_prev'
                    alt={tour_id}
                    key={tour_id}
                />
            </div>
            <div className='image-modal-bottom'>
                <div className='image-scroll-container'>
                    <div className='image_tour'>
                        <OpenModalButton
                            buttonText={<div className='add-img-button'>
                                <i className="fa-solid fa-plus"></i>
                                <div>Add Image</div>
                            </div>}
                            modalComponent={<AddImage
                                tour_id={tour_id} />}
                            className='add-image-button'
                        />

                    </div>
                    {(sortedImages) &&
                        sortedImages.map((image, idx) => {
                            return (
                                <DeleteMarker
                                    key={idx}
                                    image={image}
                                    setImgId={setImgId}
                                    tour_id={tour_id} />
                            )
                        })

                    }
                </div>
            </div>

        </div>
    )
}

export default UserImages