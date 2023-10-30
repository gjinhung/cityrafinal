import React from 'react';
import './DeleteBookingModal.css'
import { useDispatch } from "react-redux";
import { useState } from 'react';
import { useModal } from "../../context/Modal";
import { allUsers } from '../../store/users';
import { deleteBooking, getBookings } from '../../store/booking';
import { authenticate } from '../../store/session';


function DeleteBookingModal({ booking_id }) {
  const [errors, setErrors] = useState('');
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const data = await dispatch(deleteBooking(booking_id))
    if (data) {
      console.log(data)
      setErrors(data)
    } else {
      closeModal()
      dispatch(getBookings())
      dispatch(allUsers())
      dispatch(authenticate())
      window.location.reload(true)
    }
  }


  return (
    <div className="deleteTourContainer">
      <div className="deleteHeader">Confirm Cancel</div>
      <div className="deleteText">Are you sure you want to cancel this tour?</div>
      <div className="post-tour-buttons-container">
        <button
          onClick={handleSubmit}
          className='yes-delete'
        >
          Yes (Cancel Tour)
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
    </div >
  )
}

export default DeleteBookingModal;