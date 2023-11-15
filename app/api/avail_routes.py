from flask import Blueprint, jsonify, request
from app.models import db, Tour, City, Date, Language, Availability
from flask_login import current_user, login_required

# from app.forms import TourGuideForm
import datetime
from .auth_routes import validation_errors_to_error_messages

avail_routes = Blueprint("availabilities", __name__)


@avail_routes.route("/")
def get_all_avail():
    availabilities = Availability.query.all()
    availabilities_data = []
    for avail in availabilities:
        avail_dict = avail.to_dict()
        availabilities_data.append(avail_dict)

    return {"availabilities": {avail["id"]: avail for avail in availabilities_data}}


@avail_routes.route("/tour/<int:id>")
def get_tour_avail(id):
    tour = Tour.query.get_or_404(id)

    if not tour:
        return jsonify({"errors": "Tour not found"}), 404

    avails = Availability.query.filter_by(tour_id=id).all()
    availabilities_data = []
    for avail in avails:
        avail_dict = avail.to_dict()
        availabilities_data.append(avail_dict)

    return {"availabilities": {avail["id"]: avail for avail in availabilities_data}}


# @avail_routes.route("/new", methods=["POST"])
# @login_required
# def add_tour():
#     form = TourGuideForm()
#     form["csrf_token"].data = request.cookies["csrf_token"]

#     errors = {}
#     if form.city.data:
#         city_name = (form.city.data).title()
#         city_data = City.query.filter_by(city=city_name).first()

#         if not city_data:
#             errors["city"] = "City not found"
#     else:
#         errors["city"] = "City Required"

#     if form.language.data:
#         language = (form.language.data).title()
#         language_data = Language.query.filter_by(language=language).first()

#         if not language_data:
#             errors["language"] = "Language not found"
#     else:
#         errors["language"] = "Language Required"

#     if not form.price.data:
#         errors["price"] = "Price Required"

#     if not form.about.data:
#         errors["about"] = "Description of Tour Required"
#     elif len(form.about.data) <= 20:
#         errors["about"] = "Description needs at least 20 characters"

#     if form.history.data == False:
#         if form.food.data == False:
#             if form.adventure.data == False:
#                 if form.other.data == False:
#                     errors["type"] = "Type of Tour Required"

#     if len(errors):
#         return {"errors": errors}, 403

#     if form.validate_on_submit():

#         def get_date(date_name):
#             title_date = date_name.title()
#             date = Date.query.filter_by(date=title_date).first()
#             return date

#         def get_spec(specialty):
#             title_spec = specialty.title()
#             spec = Specialty.query.filter_by(specialty=title_spec).first()
#             return spec

#         dates_list = []
#         spec_list = []
#         dates_id = []
#         spec_id = []
#         for data in form.data:
#             specialty_list = ["Food", "History", "Adventure", "Other"]
#             date_list = [
#                 "Monday",
#                 "Tuesday",
#                 "Wednesday",
#                 "Thursday",
#                 "Friday",
#                 "Saturday",
#                 "Sunday",
#             ]
#             if data.title() in date_list:
#                 if form.data[data] == True:
#                     date_class = get_date(data)
#                     dates_list.append(date_class)
#                     dates_id.append(date_class.id)
#             if data.title() in specialty_list:
#                 if form.data[data] == True:
#                     spec_class = get_spec(data)
#                     spec_list.append(spec_class)
#                     spec_id.append(spec_class.id)

#         tour = TourGuide(
#             guide_id=current_user.id,
#             city_id=city_data.id,
#             language_id=language_data.id,
#             price=form.price.data,
#             about=form.about.data,
#             created_at=datetime.datetime.utcnow(),
#             updated_at=datetime.datetime.utcnow(),
#         )

#         for date in dates_list:
#             tour.dates.append(date)

#         for spec in spec_list:
#             tour.specialties.append(spec)

#         db.session.add(tour)
#         db.session.commit()
#         tour_dict = tour.to_dict()

#         tour_dict["bookings_id"] = []
#         tour_dict["dates"] = dates_id
#         tour_dict["specialties_id"] = spec_id

#         return tour_dict
#     else:
#         return {"errors": validation_errors_to_error_messages(form.errors)}


# @tours_routes.route("/<int:id>", methods=["PUT"])
# @login_required
# def edit_review(id):
#     form = TourGuideForm()
#     form["csrf_token"].data = request.cookies["csrf_token"]
#     tour = TourGuide.query.get(id)

#     if not tour:
#         return jsonify({"errors": "Tour not found"}), 403

#     errors = {}

#     if form.city.data:
#         city_name = (form.city.data).title()
#         city_data = City.query.filter_by(city=city_name).first()

#         if not city_data:
#             errors["city"] = "City not found"
#     else:
#         errors["city"] = "City Required"

#     if form.language.data:
#         language = (form.language.data).title()
#         language_data = Language.query.filter_by(language=language).first()

#         if not language_data:
#             errors["language"] = "Language not found"
#     else:
#         errors["language"] = "Language Required"

#     if not form.price.data:
#         errors["price"] = "Price Required"

#     if not form.about.data:
#         errors["about"] = "Description of Tour Required"
#     elif len(form.about.data) <= 20:
#         errors["about"] = "Description needs at least 20 characters"

#     if current_user.id != tour.guide_id:
#         return jsonify({"errors": "Unauthorized to edit this review"}), 403

#     if form.history.data == False:
#         if form.food.data == False:
#             if form.adventure.data == False:
#                 if form.other.data == False:
#                     errors["type"] = "Type of Tour Required"

#     if len(errors):
#         return jsonify(errors), 403

#     if form.validate_on_submit():
#         attributes_to_update = ["price", "about"]
#         for attr in attributes_to_update:
#             if hasattr(form, attr):
#                 setattr(tour, attr, getattr(form, attr).data)

#         tour.updated_at = datetime.datetime.utcnow()

#         tour.language_id = language_data.id

#         city_name = (form.city.data).title()
#         city_data = City.query.filter_by(city=city_name).first()

#         if not city_data:
#             return jsonify({"errors": "City not found"}), 404

#         tour.city_id = city_data.id

#         # find dates and specialties
#         def get_date(date_name):
#             title_date = date_name.title()
#             date = Date.query.filter_by(date=title_date).first()
#             return date

#         def get_spec(specialty):
#             title_spec = specialty.title()
#             spec = Specialty.query.filter_by(specialty=title_spec).first()
#             return spec

#         tour.dates = []
#         tour.specialties = []
#         dates_list = []
#         spec_list = []
#         dates_id = []
#         spec_id = []
#         for data in form.data:
#             specialty_list = ["Food", "History", "Adventure", "Other"]
#             date_list = [
#                 "Monday",
#                 "Tuesday",
#                 "Wednesday",
#                 "Thursday",
#                 "Friday",
#                 "Saturday",
#                 "Sunday",
#             ]
#             if data.title() in date_list:
#                 if form.data[data] == True:
#                     date_class = get_date(data)
#                     dates_list.append(date_class)
#                     dates_id.append(date_class.id)
#             if data.title() in specialty_list:
#                 if form.data[data] == True:
#                     spec_class = get_spec(data)
#                     spec_list.append(spec_class)
#                     spec_id.append(spec_class.id)

#         for date in dates_list:
#             tour.dates.append(date)

#         for spec in spec_list:
#             tour.specialties.append(spec)

#         db.session.commit()

#         tour_dict = tour.to_dict()

#         tour_dict["bookings_id"] = []
#         tour_dict["dates"] = dates_id
#         tour_dict["specialties_id"] = spec_id

#         return tour_dict
#     else:
#         return {"errors": validation_errors_to_error_messages(form.errors)}


# @tours_routes.route("/<int:id>/delete", methods=["DELETE"])
# def delete_tour(id):
#     tour = TourGuide.query.get(id)

#     if current_user.id != tour.guide_id:
#         return jsonify({"errors": "Unauthorized to delete this Tour"}), 403

#     if not tour:
#         return jsonify({"errors": "Tour not found"}), 404

#     try:
#         db.session.delete(tour)
#         db.session.commit()

#         response = {"message": "Tour successfully deleted."}

#         return jsonify(response)

#     except Exception as e:
#         db.session.rollback()
#         return (
#             jsonify(
#                 {
#                     "errors": "An error occurred while deleting the Tour",
#                     "message": str(e),
#                 }
#             ),
#             500,
#         )
