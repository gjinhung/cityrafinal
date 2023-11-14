from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField, FloatField, BooleanField
from wtforms.validators import DataRequired, NumberRange, Length


class TourForm(FlaskForm):
    title = StringField("title", validators=[DataRequired()])
    price = IntegerField("price", validators=[DataRequired()])
    duration = IntegerField("duration", validators=[DataRequired()])
    about = StringField("about", validators=[DataRequired()])
    city = StringField("city", validators=[DataRequired()])
    submit = SubmitField("Submit")
