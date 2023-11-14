from flask_wtf import FlaskForm
from wtforms import FloatField, SubmitField, DateField, TimeField, IntegerField
from wtforms.validators import DataRequired


class BookingForm(FlaskForm):
    date = DateField("date", validators=[DataRequired()])
    time = TimeField("time", validators=[DataRequired()])
    guide_id = IntegerField("guide_id", validators=[DataRequired()])
    submit = SubmitField("Submit")
