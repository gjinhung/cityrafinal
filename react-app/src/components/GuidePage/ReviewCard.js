import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom/";
import { getReviews, newReview } from "../../store/reviews";
import { allUsers } from "../../store/users";
import StarsRating from "./StarRating";
import OpenModalButton from "../OpenModalButton"
import EditReviewModal from "../EditReviewModal";
import DeleteReviewModal from '../DeleteReviewModal'
import './GuidePage.css'
import { authenticate } from "../../store/session";
import Review from "./Review";


export default function ReviewCard() {
    const { id } = useParams()
    const dispatch = useDispatch()
    const current_user = useSelector((state) => state.session.user)
    const users = useSelector((state) => state.users)
    const reviews = useSelector((state) => state.reviews)
    const [canPost, setCanPost] = useState(true)
    const [loggedIn, setLoggedIn] = useState(false)
    const [kStars, setKStars] = useState(0);
    const [cStars, setCStars] = useState(0);
    const [pStars, setPStars] = useState(0);
    const [comment, setComment] = useState("");
    const [showPost, setShowPost] = useState(false)
    const [errors, setErrors] = useState({});
    const [formDisabled, setFormDisabled] = useState(true);

    useEffect(() => {
        setCanPost(true)
        if (current_user) {
            setLoggedIn(true)
            if (+current_user.id === +id) {
                setCanPost(false)
            } else {
                let reviews_of_guide = users[id].reviews_of_guide_id
                reviews_of_guide.forEach((review_id) => {
                    if (+reviews[review_id].reviewer_id === +current_user.id) {
                        setCanPost(false)
                    }
                })
            }
        } else {
            setCanPost(false)
            setLoggedIn(false)
        }
    }, [current_user, id, reviews, users]);

    useEffect(() => {
        if (!cStars || !kStars || !pStars || !comment || comment.length < 10) {
            setFormDisabled(true);
        } else {
            setFormDisabled(false);
        }
    }, [cStars, kStars, pStars, comment]);

    function reviewToggle() {
        setComment('')
        setCStars(0)
        setKStars(0)
        setPStars(0)
        setShowPost(!showPost)
        setCanPost(!canPost)
    }

    const reviewSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        let submittedReview = {
            'communication_rating': cStars,
            'knowledgeability_rating': kStars,
            'professionalism_rating': pStars,
            'review_body': comment,
            'guide_id': +id
        }
        await dispatch(newReview(submittedReview, +id,)).then(() => {
            dispatch(getReviews()).then(() =>
                dispatch(allUsers())).then(() =>
                    dispatch(authenticate())).then(() => {
                        setShowPost(false)
                        setCanPost(false)
                    }).catch(async (res) => {
                        const data = await res.json();
                        if (data && data.errors) {
                            setErrors(data.errors);
                        }
                    });
        })
    }

    const onChangeC = (stars) => {
        setCStars(stars);
    }

    const onChangeK = (stars) => {
        setKStars(stars);
    }

    const onChangeP = (stars) => {
        setPStars(stars);
    }

    const onValueChanged = (input) => {
        setCanPost(input);
    }

    let review_lists = []
    let normalized_reviews = Object.values(reviews)
    normalized_reviews.forEach((review) => {
        if (review.guide_id === +id) {
            review_lists.push(review)
        }
    })

    return (
        <>
            <h3>Reviews</h3>
            {canPost &&
                (<>
                    <button
                        onClick={reviewToggle}
                        className="tours-buttons">Post a Review</button>
                    <br />
                </>)
            }

            {showPost &&
                (<>
                    <br />
                    <form onSubmit={reviewSubmit}>
                        <div className='text-container'>
                            <textarea
                                style={{ resize: "none" }}
                                name="text"
                                rows={2}
                                cols={40}
                                placeholder="Leave your review here... (10 characters minimum)"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            >
                            </textarea>
                        </div>
                        {/* {errors.comment && errors.comment ? <div style={{ color: "red" }}>{errors.comment}</div> : <div className="empty-space"> </div>} */}
                        <div className="rating-input">
                            <div className="rating-input-sub">
                                <div>
                                    <div className="type">Communication: </div>
                                    <div className="type_star_container">
                                        <StarsRating disabled={false} stars={cStars} onChange={onChangeC} />
                                        {errors.cStars && <div style={{ color: "red" }}>{errors.cStars}</div>}
                                    </div>
                                </div>
                                <div>
                                    <div className="type">Knowledgeability: </div>
                                    <div className="type_star_container">
                                        <StarsRating disabled={false} stars={kStars} onChange={onChangeK} />
                                        {errors.kStars && <div style={{ color: "red" }}>{errors.kStars}</div>}
                                    </div>
                                </div>
                                <div>
                                    <div className="type">Professionalism: </div>
                                    <div className="type_star_container">                                <StarsRating disabled={false} stars={pStars} onChange={onChangeP} />
                                        {errors.pStars && <div style={{ color: "red" }}>{errors.pStars}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            className={'tours-buttons'}
                            type="submit"
                            disabled={formDisabled}
                        >
                            Submit Your Review
                        </button>
                        <button
                            className={'tours-buttons'}
                            onClick={reviewToggle}>
                            Cancel
                        </button>

                    </form>
                    <br />
                </>)
            }
            <br />
            {review_lists.map((review, idx) => {
                return (
                    <Review
                        review={review}
                        key={idx}
                    />
                )
            })}
        </>
    )
}