from flask import Blueprint, jsonify, request
from app.models import db, Tour, City, Date, Language, Type
from flask_login import current_user, login_required

from app.forms import TourForm
import datetime
from .auth_routes import validation_errors_to_error_messages
from .city_routes import new_city
from .type_routes import new_type

tours_routes = Blueprint("tours", __name__)


@tours_routes.route("/")
def get_all_tours():
    tours = Tour.query.all()
    tours_data = []
    for tour in tours:
        tour_dict = tour.to_dict()
        # get bookings of tours
        bookings = tour.bookings
        bookings_data = []
        for booking in bookings:
            bookings_data.append(booking.id)
        tour_dict["bookings_id"] = bookings_data

        # get availability
        availabilities = tour.availability
        availability_list = []
        for availability in availabilities:
            # av_dict = availability.to_dict()
            raw_time = availability.time
            time_format = "%H:%M"
            string_time = raw_time.strftime(time_format)
            dict = {
                "id": availability.id,
                "tour_id": availability.tour_id,
                "date_id": availability.date_id,
                "time": string_time,
            }
            availability_list.append(dict)
        tour_dict["availabilities"] = availability_list

        types = tour.type.to_dict()
        # types_data = []
        # for type in types:
        #     types_data.append(type.id)
        tour_dict["type"] = types["type"]

        tours_data.append(tour_dict)

    return {"tours": {tours["id"]: tours for tours in tours_data}}


@tours_routes.route("/<int:id>")
def get_one_tour(id):
    tour = Tour.query.get_or_404(id)

    if not tour:
        return jsonify({"errors": "Tour not found"}), 404

    tour_dict = tour.to_dict()
    # get bookings of tours
    bookings = tour.bookings
    bookings_data = []
    for booking in bookings:
        bookings_data.append(booking.id)
    tour_dict["bookings_id"] = bookings_data

    # get availability
    availabilities = tour.availability
    availability_list = []
    for availability in availabilities:
        # av_dict = availability.to_dict()
        raw_time = availability.time
        time_format = "%H:%M"
        string_time = raw_time.strftime(time_format)
        dict = {
            "id": availability.id,
            "tour_id": availability.tour_id,
            "date_id": availability.date_id,
            "time": string_time,
        }
        availability_list.append(dict)
    tour_dict["availabilities"] = availability_list

    # return tour_dict

    return {"tours": {tour_dict["id"]: tour_dict}}


@tours_routes.route("/new", methods=["POST"])
@login_required
def add_tour():
    form = TourForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    errors = {}

    if form.city.data:
        city_name = (form.city.data).title()
        city_data = City.query.filter_by(city=city_name).first()

        if not city_data:
            city_data_id = new_city(city_name)["id"]
        else:
            city_data_id = city_data.id
    else:
        errors["city"] = "City Required"

    if not form.duration.data:
        errors["duration"] = "Duration Required"

    if not form.title.data:
        errors["title"] = "Title Required"

    if not form.price.data:
        errors["price"] = "Price Required"

    if not form.about.data:
        errors["about"] = "Description of Tour Required"
    elif len(form.about.data) <= 20:
        errors["about"] = "Description needs at least 20 characters"

    if form.type.data:
        type_name = (form.type.data).title()
        type_data = Type.query.filter_by(type=type_name).first()

        if not type_data:
            type_data_id = new_type(type_name)["id"]
        else:
            type_data_id = type_data.id
    else:
        errors["type"] = "Type of Tour Required"

    if len(errors):
        return {"errors": errors}, 403

    if form.validate_on_submit():
        tour = Tour(
            guide_id=current_user.id,
            city_id=city_data_id,
            type_id=type_data_id,
            title=form.title.data,
            price=form.price.data,
            about=form.about.data,
            duration=form.duration.data,
            created_at=datetime.datetime.utcnow(),
            updated_at=datetime.datetime.utcnow(),
        )

        db.session.add(tour)
        db.session.commit()
        tour_dict = tour.to_dict()

        bookings = tour.bookings
        bookings_data = []
        for booking in bookings:
            bookings_data.append(booking.id)
        tour_dict["bookings_id"] = bookings_data

        # get availability
        availabilities = tour.availability
        availability_list = []
        for availability in availabilities:
            # av_dict = availability.to_dict()
            raw_time = availability.time
            time_format = "%H:%M"
            string_time = raw_time.strftime(time_format)
            dict = {
                "id": availability.id,
                "tour_id": availability.tour_id,
                "date_id": availability.date_id,
                "time": string_time,
            }
            availability_list.append(dict)
        tour_dict["availabilities"] = availability_list

        return tour_dict
    else:
        return {"errors": validation_errors_to_error_messages(form.errors)}


@tours_routes.route("/<int:id>", methods=["PUT"])
@login_required
def edit_tour(id):
    form = TourForm()

    form["csrf_token"].data = request.cookies["csrf_token"]
    tour = Tour.query.get(id)

    if not tour:
        return jsonify({"errors": "Tour not found"}), 403

    errors = {}

    if form.city.data:
        city_name = (form.city.data).title()
        city_data = City.query.filter_by(city=city_name).first()

        if not city_data:
            city_data_id = new_city(city_name)["id"]
        else:
            city_data_id = city_data.id
    else:
        errors["city"] = "City Required"

        #         if not form.duration.data:
        errors["duration"] = "Duration Required"

    if not form.title.data:
        errors["title"] = "Title Required"

    if not form.price.data:
        errors["price"] = "Price Required"

    if not form.about.data:
        errors["about"] = "Description of Tour Required"
    elif len(form.about.data) <= 20:
        errors["about"] = "Description needs at least 20 characters"

    if form.type.data:
        type_name = (form.type.data).title()
        type_data = Type.query.filter_by(type=type_name).first()

        if not type_data:
            type_data_id = new_type(type_name)["id"]
        else:
            type_data_id = type_data.id
    else:
        errors["type"] = "Type of Tour Required"

    if len(errors):
        return jsonify(errors), 403

    if form.validate_on_submit():
        tour.updated_at = datetime.datetime.utcnow()

        tour.city_id = city_data_id
        tour.type_id = type_data_id
        tour.title = form.title.data
        tour.price = form.price.data
        tour.about = form.about.data
        tour.duration = form.duration.data

        db.session.commit()

        tour_dict = tour.to_dict()

        bookings = tour.bookings
        bookings_data = []
        for booking in bookings:
            bookings_data.append(booking.id)
        tour_dict["bookings_id"] = bookings_data

        # get availability
        availabilities = tour.availability
        availability_list = []
        for availability in availabilities:
            # av_dict = availability.to_dict()
            raw_time = availability.time
            time_format = "%H:%M"
            string_time = raw_time.strftime(time_format)
            dict = {
                "id": availability.id,
                "tour_id": availability.tour_id,
                "date_id": availability.date_id,
                "time": string_time,
            }
            availability_list.append(dict)
        tour_dict["availabilities"] = availability_list

        return tour_dict
    else:
        return {"errors": validation_errors_to_error_messages(form.errors)}


@tours_routes.route("/<int:id>/delete", methods=["DELETE"])
def delete_tour(id):
    tour = Tour.query.get(id)

    if current_user.id != tour.guide_id:
        return jsonify({"errors": "Unauthorized to delete this Tour"}), 403

    if not tour:
        return jsonify({"errors": "Tour not found"}), 404

    try:
        db.session.delete(tour)
        db.session.commit()

        response = {"message": "Tour successfully deleted."}

        return jsonify(response)

    except Exception as e:
        db.session.rollback()
        return (
            jsonify(
                {
                    "errors": "An error occurred while deleting the Tour",
                    "message": str(e),
                }
            ),
            500,
        )
