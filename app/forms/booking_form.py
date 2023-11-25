from flask_wtf import FlaskForm
from wtforms import (
    FloatField,
    SubmitField,
    DateField,
    TimeField,
    IntegerField,
    StringField,
)
from wtforms.validators import DataRequired


class BookingForm(FlaskForm):
    date = StringField("date", validators=[DataRequired()])
    time = StringField("time", validators=[DataRequired()])
    tour_title = StringField("tour_title")
    tour_city = StringField("tour_city")
    tour_duration = IntegerField("tour_duration")
    tour_price = FloatField("tour_price")
    guide_id = IntegerField("guide_id", validators=[DataRequired()])
    submit = SubmitField("Submit")
