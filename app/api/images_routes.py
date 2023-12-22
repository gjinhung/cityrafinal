from flask import Blueprint, jsonify, request
from ..models import Image, db, Tour
from flask_login import current_user, login_required
from ..forms import ImageForm
from datetime import datetime
from .aws import get_unique_filename, upload_file_to_s3, remove_file_from_s3
from .auth_routes import validation_errors_to_error_messages


images_routes = Blueprint("tour", __name__)

ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "gif"}


# Get all Images by Business
@images_routes.route("/<int:id>/images")
def images(id):
    images = Image.query.filter_by(tour_id=id)

    # find business
    tour = Tour.query.get(id)
    if not tour:
        return jsonify({"error": "Tour not found"}), 404

    images_data = []

    for image in images:
        img_dict = image.to_dict()
        images_data.append(img_dict)
    # return jsonify(images_data)
    return {"images": {image.id: image.to_dict() for image in images}}


@images_routes.route("/<int:id>/images/new", methods=["POST"])
@login_required
def images_post(id):
    form = ImageForm()
    tour = Tour.query.get(id)
    if not tour:
        return jsonify({"error": "Tour not found"}), 404

    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        images = Image.query.filter(Image.tour_id == id).all()

        if not images:
            form.preview.data = True

        try:
            # Retrieving form data separately
            image = form.data["url"]
            image_preview = form.data["preview"]
            tour_id = form.data["tour_id"]
            image.filename = get_unique_filename(image.filename)
            upload = upload_file_to_s3(image)
            print(request.files)

            # Printing filename and upload info for debugging
            print(f"Filename: {image.filename}")
            print("😇😇😇", upload)

            # Update image previews for the business

            images = Image.query.filter(Image.tour_id == id).all()
            if image_preview:
                for img in images:
                    img.preview = False
                    img.updated_at = datetime.utcnow()

            # Create a new BusinessImage instance
            new_image = Image(
                url=upload["url"],
                preview=image_preview,
                tour_id=form.data["tour_id"],
                user_id=current_user.id,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            )

            # Add and commit changes to the database
            db.session.add(new_image)
            db.session.commit()

            return new_image.to_dict(), 201

        except Exception as e:
            print(f"An error occurred: {e}")
            return (
                jsonify({"error": "An error occurred while uploading the image"}),
                500,
            )
    else:
        print(form.errors)
        return (
            jsonify({"errors": validation_errors_to_error_messages(form.errors)}),
            400,
        )


@images_routes.route("/images/<int:id>", methods=["DELETE"])
@login_required
def images_delete(id):
    image = Image.query.get(id)
    if not image:
        return jsonify({"error": "Image not found"}), 404
    tour = Tour.query.get(image.tour_id)

    if current_user.id != image.user_id and tour.guide_id != current_user.id:
        return jsonify({"error": "Unauthorized to delete this image"}), 403

    try:
        remove_file_from_s3(image.url)
    except Exception as e:
        print(f"An error occurred: {e}")
        return (
            jsonify({"error": "An error occurred while deleting the image"}),
            500,
        )

    db.session.delete(image)
    db.session.commit()

    last_img = (
        Image.query.filter_by(tour_id=image.tour_id)
        .order_by(Image.created_at.desc())
        .first()
    )

    if image.preview:
        last_img.preview = True
        last_img.updated_at = datetime.utcnow()

        db.session.commit()

    return "Successfully deleted"
