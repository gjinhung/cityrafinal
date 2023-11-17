from flask import Blueprint, jsonify, request
from ..models import db, Type
from flask_login import login_required
from ..forms.type_form import TypeForm
import datetime
from .auth_routes import validation_errors_to_error_messages

type_routes = Blueprint("type", __name__)


@type_routes.route("/")
def get_all_types():
    type_data = []
    types = Type.query.all()

    if request.args.get("type"):
        type = request.args.get("type").title()
        if not Type.query.filter_by(type=type).count():
            return jsonify({"errors": "Language is currently unavailable"}), 404
        else:
            types = Type.query.filter_by(type=type)
    for type in types:
        type_dict = type.to_dict()
        tours = type.tours
        tours_list = []
        for type in tours:
            t_dic = type.to_dict()
            tours_list.append(t_dic["id"])
        type_dict["tours_id"] = tours_list
        type_data.append(type_dict)

    return {type["id"]: type for type in type_data}


@type_routes.route("/<int:id>")
def get_one_type(id):
    type = Type.query.get(id)

    if not type:
        return jsonify({"errors": "Type not found"}), 404

    type_dict = type.to_dict()
    tours = type.tours
    tours_list = []
    for type in tours:
        t_dic = type.to_dict()
        tours_list.append(t_dic["id"])
    type_dict["tours_id"] = tours_list

    return {type_dict["id"]: type_dict}


@type_routes.route("/new", methods=["POST"])
@login_required
def post_type():
    form = TypeForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        type = Type(
            type=form.type.data.title(),
            created_at=datetime.datetime.utcnow(),
            updated_at=datetime.datetime.utcnow(),
        )

        db.session.add(type)
        db.session.commit()

        type_dict = type.to_dict()
        tours = type.tours
        tours_list = []
        for type in tours:
            t_dic = type.to_dict()
            tours_list.append(t_dic["id"])
        type_dict["tours_id"] = tours_list

        return type_dict
    else:
        return {"errors": validation_errors_to_error_messages(form.errors)}, 401


@type_routes.route("/<int:id>/delete", methods=["DELETE"])
def delete_type(id):
    type = Type.query.get(id)

    if not type:
        return jsonify({"errors": "Type not found"}), 404

    # if current_user.id != booking.tourist_id and current_user.id != booking.tour_guide_id:
    #     return jsonify({"errors": "Unauthorized to delete this booking"}), 403

    try:
        db.session.delete(type)
        db.session.commit()

        response = {"message": "Type successfully deleted."}

        return jsonify(response)

    except Exception as e:
        db.session.rollback()
        return (
            jsonify(
                {
                    "errors": "An error occurred while deleting the Type",
                    "message": str(e),
                }
            ),
            500,
        )


def new_type(type_name):
    type = Type(
        type=type_name.title(),
        created_at=datetime.datetime.utcnow(),
        updated_at=datetime.datetime.utcnow(),
    )

    db.session.add(type)
    db.session.commit()

    type_dict = type.to_dict()
    tours = type.tours
    tours_list = []
    for type in tours:
        t_dic = type.to_dict()
        tours_list.append(t_dic["id"])
    type_dict["tours_id"] = tours_list

    return type_dict
