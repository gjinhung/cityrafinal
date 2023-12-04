from flask import Blueprint, jsonify, request
from ..models import db, Language
from flask_login import login_required
from ..forms.language_form import LanguageForm
import datetime

language_routes = Blueprint("languages", __name__)


@language_routes.route("/")
def get_all_languages():
    language_data = []
    languages = Language.query.all()

    if request.args.get("language"):
        language = request.args.get("language").title()
        if not Language.query.filter_by(language=language).count():
            return jsonify({"errors": "Language is currently unavailable"}), 404
        else:
            languages = Language.query.filter_by(language=language)
    for language in languages:
        language_dict = language.to_dict()
        guides = language.guides
        guides_list = []
        for guide in guides:
            g_dic = guide.to_dict()
            guides_list.append(g_dic["id"])
        language_dict["guides_id"] = guides_list
        language_data.append(language_dict)

    return {language["id"]: language for language in language_data}


@language_routes.route("/<int:id>")
def get_one_language(id):
    language = Language.query.get(id)

    if not language:
        return jsonify({"errors": "Language not found"}), 404

    language_dict = language.to_dict()
    guides = language.guides
    guides_list = []
    for guide in guides:
        g_dic = guide.to_dict()
    guides_list.append(g_dic["id"])
    language_dict["guides_id"] = guides_list

    return {language_dict["id"]: language_dict}


@language_routes.route("/new", methods=["POST"])
@login_required
def new_language():
    form = LanguageForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        language = Language(
            language=form.language.data,
            created_at=datetime.datetime.utcnow(),
            updated_at=datetime.datetime.utcnow(),
        )

        db.session.add(language)
        db.session.commit()

        language_dict = language.to_dict()

        guides = language.guides
        guides_list = []
        for guide in guides:
            g_dic = guide.id
        guides_list.append(g_dic)
        language_dict["guides_id"] = guides_list

        return language_dict
    else:
        return {"errors": "error in post a new language"}
