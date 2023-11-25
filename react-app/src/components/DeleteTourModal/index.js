import React from 'react';
import './DeleteTourModal.css'
import { useDispatch } from "react-redux";
import { useState } from 'react';
import { useModal } from "../../context/Modal";
import { allUsers } from '../../store/users';
import { deleteTour, getTours } from '../../store/tour';
import { authenticate } from '../../store/session';


function DeleteTourModal({ tour_id }) {
  const [errors, setErrors] = useState('');
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  console.log(tour_id)

  const handleSubmit = async (e) => {
    console.log('submited')
    e.preventDefault();
    setErrors({});
    const data = await dispatch(deleteTour(tour_id))
    if (data) {
      setErrors(data.errors)
      console.log(errors)
    } else {
      closeModal()
      dispatch(authenticate())
      dispatch(allUsers())
      dispatch(getTours())
      // window.location.reload(true)
    }
  }


  return (
    <div className="deleteTourContainer">
      <div className="deleteHeader">Confirm Delete</div>
      <div className="deleteText">Are you sure you want to delete this tour?</div>
      <div className="post-tour-buttons-container">
        <button
          onClick={handleSubmit}
          className='yes-delete'
        >
          Yes (Delete Tour)
        </button>
        <button
          onClick={((e) => {
            closeModal();
          })}
          className='tours-buttons'
        >
          No (Keep Tour)
        </button>
      </div>
      {/* {errors && < label style={{ color: "red" }}>{errors}</label>} */}
    </div>
  )
}

export default DeleteTourModal;