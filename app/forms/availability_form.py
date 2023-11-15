from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField, FloatField, BooleanField
from wtforms.validators import DataRequired, NumberRange, Length


class AvailabilityForm(FlaskForm):
    date = StringField("date")
    time = StringField("time")
    submit = SubmitField("Submit")
