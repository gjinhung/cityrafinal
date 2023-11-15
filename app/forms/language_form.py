from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField, FloatField, BooleanField
from wtforms.validators import DataRequired, NumberRange, Length


class LanguageForm(FlaskForm):
    language = StringField("language")
    submit = SubmitField("Submit")
