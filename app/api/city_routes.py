from flask import Blueprint, jsonify, request, session
from app.models import db, City
from flask_login import current_user, login_user, logout_user, login_required
from app.forms import CityForm
import datetime

city_routes = Blueprint("city", __name__)


@city_routes.route("/")
def get_all_cities():
    city_data = []
    cities = City.query.all()

    if request.args.get("city"):
        city = request.args.get("city").title()
        if not City.query.filter_by(city=city).count():
            return jsonify({"errors": "City is currently unavailable"}), 404
        else:
            cities = City.query.filter_by(city=city)
    for city in cities:
        city_dict = city.to_dict()
        tours = city.tours
        tour_list = []
        for tour in tours:
            t_dic = tour.id
            tour_list.append(t_dic)

        city_dict["tours_id"] = tour_list
        city_data.append(city_dict)

    return {city["id"]: city for city in city_data}


@city_routes.route("/<int:id>")
def get_one_city(id):
    city = City.query.get(id)

    if not city:
        return jsonify({"errors": "City not found"}), 404
    city_dict = city.to_dict()
    tours = city.tours
    tour_list = []
    for tour in tours:
        t_dic = tour.id
        tour_list.append(t_dic)
    city_dict["tours_id"] = tour_list

    return {city_dict["id"]: city_dict}


@city_routes.route("/new", methods=["POST"])
@login_required
def post_city():
    form = CityForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        city = City(
            city=form.city.data.title(),
            created_at=datetime.datetime.utcnow(),
            updated_at=datetime.datetime.utcnow(),
        )

        db.session.add(city)
        db.session.commit()

        city_dict = city.to_dict()

        tours = city.tours
        tour_list = []
        for tour in tours:
            t_dic = tour.id
            tour_list.append(t_dic)
        city_dict["tours_id"] = tour_list

        return city_dict
    else:
        return {"errors": "error in post a new city"}


def new_city(city_name):
    city = City(
        city=city_name.title(),
        created_at=datetime.datetime.utcnow(),
        updated_at=datetime.datetime.utcnow(),
    )
    db.session.add(city)
    db.session.commit()
    city_dict = city.to_dict()
    tours = city.tours
    tour_list = []
    for tour in tours:
        t_dic = tour.id
        tour_list.append(t_dic)
    city_dict["tours_id"] = tour_list
    return city_dict
