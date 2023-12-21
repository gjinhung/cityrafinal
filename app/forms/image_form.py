from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField, FloatField, BooleanField
from wtforms.validators import DataRequired, ValidationError
from flask_wtf.file import FileField, FileAllowed, FileRequired

ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "gif"}


# is image extension valid?
def valid_image_url(form, field):
    file = field.data
    if ("." in file and file.rsplit(".", 1)[1].lower() not in ALLOWED_EXTENSIONS) or (
        "." not in file
    ):
        raise ValidationError("Invalid Image File Extension")


class ImageForm(FlaskForm):
    url = FileField(
        "url",
        validators=[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))],
    )
    tour_id = IntegerField("tour_id", validators=[DataRequired()])
    preview = BooleanField("preview")
    submit = SubmitField("Submit")
