from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField
from wtforms.validators import DataRequired, NumberRange, Length

class ReviewForm(FlaskForm):
    rating = IntegerField('rating', validators=[DataRequired(), NumberRange(1, 5)])
    guide_id = IntegerField('guide_id', validators=[DataRequired()])
    review_body = StringField('review_body', validators=[DataRequired(), Length(max=500)])
    submit = SubmitField('Submit')