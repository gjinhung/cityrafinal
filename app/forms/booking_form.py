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
    guide_id = IntegerField("guide_id", validators=[DataRequired()])
    submit = SubmitField("Submit")
