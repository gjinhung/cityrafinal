import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import OpenModalButton from "../OpenModalButton";
import AddImage from "./AddImage";
import { useModal } from '../../context/Modal';

function Images({ tour_id }) {
    const tour = useSelector(state => state.tours[tour_id])
    // const current_user = useSelector(state => state.session.user)
    let previewImg = []
    let notPImg = []
    const images = tour.images
    const { closeModal } = useModal();
    const ulRef = useRef()

    images.forEach((image) => {
        if (image.preview) {
            previewImg.push(image)
        } else {
            notPImg.push(image)
        }
    })
    let sortedImages = [...previewImg, ...notPImg]
    const [img_id, setImgId] = useState(previewImg[0])

    useEffect(() => {
        // if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current || !ulRef.current.contains(e.target)) {
                closeModal();
            }
        };

        document.addEventListener("click", closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, []);

    return (
        <div className='image-modal-container' ref={ulRef}>
            <div className='image-modal-top'>
                <img
                    src={img_id.url}
                    className='image_tour_prev'
                    alt={tour_id}
                    key={tour_id}
                />
            </div>
            <div className='image-modal-bottom'>
                <div className='image-scroll-container'>
                    {
                        sortedImages.map((image, idx) => {
                            return (
                                <img
                                    src={image.url}
                                    className='image_tour'
                                    alt={tour_id}
                                    key={idx}
                                    onClick={(e) => setImgId(image)}
                                />
                            )
                        })

                    }
                </div>
            </div>

        </div>
    )
}

export default Images