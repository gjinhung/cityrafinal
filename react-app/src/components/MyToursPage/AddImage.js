import React, { useState } from 'react'
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from 'react-redux';
import { createImage } from '../../store/images';
import { getTours } from '../../store/tour';
import { useHistory } from 'react-router-dom/';
import OpenModalButton from '../OpenModalButton';
import UserImages from './UserImages';

function AddImage({ tour_id }) {
    const [profile_pic, setProfilePic] = useState('')
    const [image_url, setImgUrl] = useState("");
    const [preview, setPrev] = useState(false)
    const tours = useSelector((state) => state.tours)
    const dispatch = useDispatch()
    const { closeModal } = useModal();
    const history = useHistory()


    async function handleAddImage(e) {

        e.preventDefault()
        const formData = new FormData();
        formData.append('url', profile_pic);
        formData.append('tour_id', tour_id)
        formData.append('preview', preview)


        const data = await dispatch(createImage(tour_id, formData))
        if (data) {
            console.log(data)
        } else {
            await dispatch(getTours())
            closeModal()
            // await console.log(tours)
            history.push('/mytours')
        }

    }

    return (
        <div className='add_image_modal_container'>

            <div className='add_image_title'>Add Image</div>
            <div className='image_url_wrapper'>
                <input
                    type="file"
                    id='uploadImage'
                    accept="image/*"
                    placeholder="Image URL"
                    value={image_url}
                    onChange={(e) => {
                        setProfilePic(e.target.files[0]);
                        setImgUrl(e.target.value);
                    }}
                    // onChange={handleFileChange}
                    className="imgurl-input"
                    required
                />
                {image_url && <i className="fa-solid fa-xmark" onClick={(e) => {
                    setImgUrl('')
                    setProfilePic('')
                }}></i>}
            </div>
            <div className='main_image_checkbox'>
                <input type='checkbox' value={preview} onChange={(e) => setPrev(prev => !prev)}></input>
                <label>Main Image</label>
            </div>
            <div className='image_upload_wrapper'>
                <button className={`upload_image_button`} disabled={image_url ? false : true} onClick={(e) => handleAddImage(e)}>
                    UPLOAD IMAGE
                </button>
                <div >
                    <OpenModalButton
                        buttonText={"CANCEL"}
                        modalComponent={<UserImages
                            tour_id={tour_id} />}
                        className='cancel_image_button'
                    />
                </div>
            </div>

        </div >
    )
}

export default AddImage