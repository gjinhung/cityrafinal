from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField, FloatField, BooleanField
from wtforms.validators import DataRequired, NumberRange, Length


class AvailabilityForm(FlaskForm):
    date = IntegerField("date")
    time = IntegerField("time")
    submit = SubmitField("Submit")
