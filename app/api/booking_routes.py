from flask import Blueprint, jsonify, session, request
from app.models import db, Booking, Tour
from app.forms import BookingForm
from flask_login import current_user, login_required
from .auth_routes import validation_errors_to_error_messages
import datetime

booking_routes = Blueprint("bookings", __name__)


@booking_routes.route("/")
def get_all_bookings():
    bookings = Booking.query.all()
    bookings_data = []
    for booking in bookings:
        # tour_id = booking.tour_id
        # tour = Tour.query.get_or_404(tour_id)
        booking_dict = booking.to_dict()

        # print(tour_id)
        # print(tour.id)
        # booking_dict["tour_title"] = tour.title
        # # to convert to string use strftime
        # date_format = '%Y-%m-%d'
        # if not isinstance(booking.date, str):
        #     date = (booking.date).strftime(date_format)
        # else: date = booking.date
        # time_format = '%H:%M:%S'
        # start_time = (booking.start_time).strftime(time_format)
        # # to convert to datetime.date.fromisoformat(start_time)
        # booking_date = datetime.date.fromisoformat(booking.date)

        today = datetime.datetime.today()
        booking_date = datetime.datetime.strptime(booking.date, "%A, %B %d, %Y")
        # booking_date = datetime.datetime.combine(datbooking.date, datetime.time(0, 0, 0))
        diff = (booking_date - today).days
        occured = False
        if diff <= 0:
            occured = True
        booking_dict["completed"] = occured

        # booking_dict['start_time'] = start_time
        # booking_dict['date'] = date
        # tour_guide = booking.tour_guide
        # print(tour_guide)
        # tourguide_arr = []
        # tourguide_arr.append(tour_guide)

        # booking_dict['tour'] = tourguide_arr

        bookings_data.append(booking_dict)
    # return jsonify(bookings_data)
    return {"bookings": {booking["id"]: booking for booking in bookings_data}}


@booking_routes.route("/<int:id>")
def get_one_booking(id):
    booking = Booking.query.get_or_404(id)

    if not booking:
        return jsonify({"errors": "Booking not found"}), 404

    booking_dict = booking.to_dict()

    today = datetime.datetime.today()
    booking_date = datetime.datetime.strptime(booking.date, "%A, %B %d, %Y")
    diff = (booking_date - today).days
    occured = False
    if diff <= 0:
        occured = True
    booking_dict["completed"] = occured

    # booking_dict['tour'] = booking.tour_guide.to_dict()

    return {"bookings": {booking_dict["id"]: booking_dict}}


@booking_routes.route("/tour/<int:tourId>/new", methods=["POST"])
@login_required
def add_booking(tourId):
    form = BookingForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    tour = Tour.query.get_or_404(tourId)
    if not tour:
        return jsonify({"errors": "Tour not found"}), 404

    if form.validate_on_submit():
        formated_date = datetime.datetime.strptime(form.date.data, "%Y-%m-%d").date()
        formated_time = datetime.datetime.strptime(form.time.data, "%H:%M").time()

        booking = Booking(
            tourist_id=current_user.id,
            tour_id=tour.id,
            guide_id=tour.guide_id,
            date=formated_date,
            time=formated_time,
            created_at=datetime.datetime.utcnow(),
            updated_at=datetime.datetime.utcnow(),
        )

        db.session.add(booking)
        db.session.commit()

        booking_dict = booking.to_dict()

        today = datetime.datetime.today()
        booking_date = datetime.datetime.strptime(booking.date, "%A, %B %d, %Y")
        diff = (booking_date - today).days
        occured = False
        if diff <= 0:
            occured = True
        booking_dict["completed"] = occured

        # booking_dict['tour'] = booking.tour_guide.to_dict()

        return booking_dict
    else:
        return {"errors": validation_errors_to_error_messages(form.errors)}, 401


@booking_routes.route("/<int:id>", methods=["PUT"])
@login_required
def edit_booking(id):
    form = BookingForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    booking = Booking.query.get(id)
    if current_user.id != booking.tourist_id and current_user.id != booking.guide_id:
        return jsonify({"errors": "Unauthorized to edit this booking"}), 403

    if form.validate_on_submit():
        formated_date = datetime.datetime.strptime(form.date.data, "%Y-%m-%d").date()
        formated_time = datetime.datetime.strptime(form.time.data, "%H:%M").time()

        booking.date = formated_date
        booking.time = formated_time

        booking.updated_at = datetime.datetime.utcnow()
        db.session.commit()

        booking_dict = booking.to_dict()
        # booking_dict['tour'] = booking.tour_guide.to_dict()

        return booking_dict
    else:
        return {"errors": validation_errors_to_error_messages(form.errors)}, 401


@booking_routes.route("/<int:id>/delete", methods=["DELETE"])
def delete_booking(id):
    booking = Booking.query.get(id)

    if not booking:
        return jsonify({"errors": "Booking not found"}), 404

    # if current_user.id != booking.tourist_id and current_user.id != booking.tour_guide_id:
    #     return jsonify({"errors": "Unauthorized to delete this booking"}), 403

    try:
        db.session.delete(booking)
        db.session.commit()

        response = {"message": "Booking successfully deleted."}

        return jsonify(response)

    except Exception as e:
        db.session.rollback()
        return (
            jsonify(
                {
                    "errors": "An error occurred while deleting the Booking",
                    "message": str(e),
                }
            ),
            500,
        )
