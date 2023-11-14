from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import User, Review, Booking
from ..models import db

user_routes = Blueprint("users", __name__)


@user_routes.route("/")
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    users_data = []
    for user in users:
        user_dict = user.to_dict()
        reviews_list = []
        reviews_given = user.reviews
        for rev in reviews_given:
            reviews_list.append(rev.id)

        bookings = user.bookings
        bookings_list_id = []
        for booking in bookings:
            bookings_list_id.append(booking.id)

        languages = user.languages
        language_list_id = []
        for language in languages:
            language_list_id.append(language.id)

        guide_ratings = []
        guide_reviews = []
        reviews = Review.query.filter_by(guide_id=user.id).all()

        for review in reviews:
            guide_ratings.append(review.rating)
            guide_reviews.append(review.id)

        rev_sum = sum(guide_ratings)
        if not len(guide_ratings):
            rating = 0
        else:
            rating = round((rev_sum / len(reviews)), 2)
        guide_bookings = []
        bookings_as_guide = Booking.query.filter_by(guide_id=user.id).all()
        for bookings in bookings_as_guide:
            guide_bookings.append(bookings.id)
        user_dict["guide_bookings"] = guide_bookings
        user_dict["rating"] = rating
        user_dict["reviews_of_guide_id"] = guide_reviews
        user_dict["reviews_given_id"] = reviews_list
        user_dict["booking_ids"] = bookings_list_id
        user_dict["language_ids"] = language_list_id
        tours_given_ids = []

        u_tours_given = user.tours_given
        for tg in u_tours_given:
            tg_dict = tg.to_dict()
            tours_given_ids.append(tg_dict["id"])

        user_dict["tours_given_ids"] = tours_given_ids
        users_data.append(user_dict)

    return {"users": {user["id"]: user for user in users_data}}


@user_routes.route("/<int:id>")
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    user_dict = user.to_dict()
    reviews_list = []
    reviews_given = user.reviews
    for rev in reviews_given:
        reviews_list.append(rev.id)
    bookings = user.bookings
    bookings_list_id = []
    for booking in bookings:
        bookings_list_id.append(booking.id)
    languages = user.languages
    language_list_id = []
    for language in languages:
        language_list_id.append(language.id)
    guide_ratings = []
    guide_reviews = []
    reviews = Review.query.filter_by(guide_id=user.id).all()
    for review in reviews:
        guide_ratings.append(review.rating)
        guide_reviews.append(review.id)
    rev_sum = sum(guide_ratings)
    if not len(guide_ratings):
        rating = 0
    else:
        rating = round((rev_sum / len(reviews)), 2)
    guide_bookings = []
    bookings_as_guide = Booking.query.filter_by(guide_id=user.id).all()
    for bookings in bookings_as_guide:
        guide_bookings.append(bookings.id)
    user_dict["guide_bookings"] = guide_bookings
    user_dict["rating"] = rating
    user_dict["reviews_of_guide_id"] = guide_reviews
    user_dict["reviews_given_id"] = reviews_list
    user_dict["booking_ids"] = bookings_list_id
    user_dict["language_ids"] = language_list_id
    tours_given_ids = []
    u_tours_given = user.tours_given
    for tg in u_tours_given:
        tg_dict = tg.to_dict()
        tours_given_ids.append(tg_dict["id"])
    user_dict["tours_given_ids"] = tours_given_ids
    return user_dict


@user_routes.route("/current")
@login_required
def current():
    user = User.query.get(current_user.id)
    user_dict = user.to_dict()
    reviews_list = []
    reviews_given = user.reviews
    for rev in reviews_given:
        reviews_list.append(rev.id)
    bookings = user.bookings
    bookings_list_id = []
    for booking in bookings:
        bookings_list_id.append(booking.id)
    languages = user.languages
    language_list_id = []
    for language in languages:
        language_list_id.append(language.id)
    guide_ratings = []
    guide_reviews = []
    reviews = Review.query.filter_by(guide_id=user.id).all()
    for review in reviews:
        guide_ratings.append(review.rating)
        guide_reviews.append(review.id)
    rev_sum = sum(guide_ratings)
    if not len(guide_ratings):
        rating = 0
    else:
        rating = round((rev_sum / len(reviews)), 2)

    guide_bookings = []
    bookings_as_guide = Booking.query.filter_by(guide_id=user.id).all()
    for bookings in bookings_as_guide:
        guide_bookings.append(bookings.id)
    user_dict["guide_bookings"] = guide_bookings
    user_dict["rating"] = rating
    user_dict["reviews_of_guide_id"] = guide_reviews
    user_dict["reviews_given_id"] = reviews_list
    user_dict["booking_ids"] = bookings_list_id
    user_dict["language_ids"] = language_list_id
    tours_given_ids = []
    u_tours_given = user.tours_given
    for tg in u_tours_given:
        tg_dict = tg.to_dict()
        tours_given_ids.append(tg_dict["id"])
    user_dict["tours_given_ids"] = tours_given_ids
    return user_dict


@user_routes.route("/<int:id>/", methods=["DELETE"])
def delete_user(id):
    user = User.query.get(id)

    db.session.delete(user)
    db.session.commit()

    response = {"message": "Tour successfully deleted."}

    return jsonify(response)
