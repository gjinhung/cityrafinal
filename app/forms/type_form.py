from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField, FloatField, BooleanField
from wtforms.validators import DataRequired, NumberRange, Length


class TypeForm(FlaskForm):
    type = StringField("type")
    submit = SubmitField("Submit")
