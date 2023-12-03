import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StarsRating from "./StarRating";
import './GuidePage.css'
import { useParams } from "react-router-dom/";
import { deleteReview, editReview, getReviews } from "../../store/reviews";
import { allUsers } from "../../store/users";
import { authenticate } from "../../store/session";


export default function Review({ review }) {

    const { id } = useParams
    const dispatch = useDispatch()
    const users = useSelector((state) => state.users)
    const current_user = useSelector((state) => state.session.user)
    const [edit, setEdit] = useState(false)
    const [toDelete, setDelete] = useState(false)
    const [comment, setComment] = useState(review.review_body)
    const [kStars, setKStars] = useState(review.knowledgeability_rating);
    const [cStars, setCStars] = useState(review.communication_rating);
    const [pStars, setPStars] = useState(review.professionalism_rating);
    const [errors, setErrors] = useState({})
    const [formDisabled, setFormDisabled] = useState(false);


    function resetDate(str_date) {
        let months = ["January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"];
        const date = new Date(str_date)
        let year = date.getFullYear()
        let month = months[date.getMonth()]
        let day = date.getDate()
        return (`${month} ${day}, ${year}`)
    }

    useEffect(() => {
        if (!cStars || !kStars || !pStars || !comment || comment.length < 10) {
            setFormDisabled(true);
        } else {
            setFormDisabled(false);
        }
    }, [cStars, kStars, pStars, comment]);

    const onChangeC = (stars) => {
        setCStars(stars);
    }

    const onChangeK = (stars) => {
        setKStars(stars);
    }

    const onChangeP = (stars) => {
        setPStars(stars);
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        setErrors({});
        const data = await dispatch(deleteReview(review.id))
        if (data) {
            setErrors(data.errors)
            console.log(errors)
        } else {
            dispatch(allUsers()).then(() =>
                dispatch(authenticate())).then(() =>
                    dispatch(getReviews()))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        let submittedReview = {
            'communication_rating': cStars,
            'knowledgeability_rating': kStars,
            'professionalism_rating': pStars,
            'review_body': comment,
            'guide_id': +review.guide_id
        }


        await dispatch(editReview(+review.id, submittedReview)).then(() => {
            dispatch(getReviews()).then(() =>
                dispatch(allUsers()))
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) {
                        setErrors(data.errors);
                    }
                });
        })

        setEdit(!edit)
    };

    function averageRating() {
        const numbers = [review.professionalism_rating, review.communication_rating, review.knowledgeability_rating];
        const average = Math.round((numbers.reduce((a, b) => a + b) / numbers.length) * 100) / 100;
        return average;
    }


    return (
        <>
            <div className="reviewer-container" >
                <div className="profile_pic">
                    <img src={users[review.reviewer_id].profile_pic}
                        className='reviewImg'
                        alt={review.id}
                    />
                </div>
                {!edit ? (
                    <div className="rating-container">
                        <div
                            className='review'>
                            <div>Rating: {averageRating()}<i className="fa-solid fa-star"></i></div>
                            <div className="namedatecontainer">
                                <div className="reviewer-name">{users[review.reviewer_id].first_name}</div>

                                <div className="review-date"> {resetDate(review.updated_at)}</div>
                            </div>
                            <div className="review_body">{review.review_body}</div>

                        </div>

                        {current_user && +review.reviewer_id === +current_user.id && (
                            <>
                                <div className="edit-review-container">
                                    <div className="linkbuttons"
                                        onClick={(e) => setEdit(true)}>Edit</div>

                                    {!toDelete ? (<div className="linkbuttons"
                                        onClick={(e) => setDelete(true)}>Delete</div>
                                    ) : (
                                        <div className="linkbuttons"
                                            onClick={(e) => handleDelete(e)}>Confirm Delete</div>
                                    )}
                                </div>
                                < br />
                            </>
                        )}
                    </div>) : (
                    <div>
                        <form
                            className='review'
                            onSubmit={(e) => handleSubmit(e)}
                        >
                            <div className='text-container'>
                                <textarea
                                    style={{ resize: "none" }}
                                    name="text"
                                    className="review_text_area"
                                    rows={2}
                                    cols={40}
                                    placeholder="Leave your review here..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                >
                                </textarea>
                            </div>
                            <div className="edit_review_container">
                                <div className="rating-input">
                                    <div className="type_star_container">
                                        <div className="type">Communication: </div>
                                        <StarsRating disabled={false} stars={cStars} onChange={onChangeC} />
                                    </div>
                                    <div className="type_star_container">
                                        <div className="type">Knowledgeability: </div>
                                        <StarsRating disabled={false} stars={kStars} onChange={onChangeK} />
                                    </div>
                                    <div className="type_star_container">
                                        <div className="type">Professionalism: </div>
                                        <StarsRating disabled={false} stars={pStars} onChange={onChangeP} />
                                    </div>
                                </div>
                                <div className="update_cancel_review">
                                    <button
                                        className={'tours-buttons'}
                                        type="submit"
                                        disabled={formDisabled}
                                    >
                                        Update Your Review
                                    </button>
                                    <div className="booking_update_buttons" onClick={(e) => setEdit(!edit)}> Cancel</div>
                                </div>
                            </div>

                        </form>

                    </div>
                )
                }
            </div >
        </>
    )
}