from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

users_languages = db.Table(
    "users_languages",
    db.Model.metadata,
    db.Column(
        "language_id",
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("languages.id")),
        primary_key=True,
    ),
    db.Column(
        "users_id",
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("users.id")),
        primary_key=True,
    ),
)

if environment == "production":
    users_languages.schema = SCHEMA


class User(db.Model, UserMixin):
    __tablename__ = "users"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    joined_on = db.Column(db.DateTime(), nullable=False)
    student = db.Column(db.Boolean(), nullable=False)
    graduation_date = db.Column(db.Date(), nullable=True)
    profile_pic = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime(), nullable=False)
    updated_at = db.Column(db.DateTime(), nullable=False)

    tours_given = db.relationship("Tour", back_populates="guide")
    reviews = db.relationship("Review", back_populates="reviewer")
    bookings = db.relationship("Booking", back_populates="tourist")
    images = db.relationship("Image", back_populates="user")

    languages = db.relationship(
        "Language", secondary=users_languages, back_populates="guides"
    )

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "last_name": self.last_name,
            "first_name": self.first_name,
            "joined_on": self.joined_on,
            "student": self.student,
            "graduation_date": self.graduation_date,
            "profile_pic": self.profile_pic,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }


class Booking(db.Model):
    __tablename__ = "bookings"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    tourist_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    tour_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("tours.id")))
    guide_id = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date(), nullable=False)
    time = db.Column(db.Time(), nullable=False)
    tour_title = db.Column(db.String(255), nullable=False)
    tour_city = db.Column(db.String(255), nullable=False)
    tour_duration = db.Column(db.Integer, nullable=False)
    tour_price = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime(), nullable=False)
    updated_at = db.Column(db.DateTime(), nullable=False)

    tourist = db.relationship("User", back_populates="bookings")
    tour = db.relationship("Tour", back_populates="bookings")

    def to_dict(self):
        time_format = "%H:%M"
        date_format = "%A, %B %d, %Y"
        raw_time = self.time
        raw_date = self.date
        string_time = raw_time.strftime(time_format)
        string_date = raw_date.strftime(date_format)
        self.date = string_date
        self.time = string_time

        return {
            "id": self.id,
            "tour_id": self.tour_id,
            "tourist_id": self.tourist_id,
            "tour_title": self.tour_title,
            "tour_city": self.tour_city,
            "tour_duration": self.tour_duration,
            "tour_price": self.tour_price,
            "guide_id": self.guide_id,
            "date": self.date,
            "time": self.time,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }


class Date(db.Model):
    __tablename__ = "dates"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(255), nullable=False, unique=True)
    created_at = db.Column(db.DateTime(), nullable=False)
    updated_at = db.Column(db.DateTime(), nullable=False)

    available_tours = db.relationship("Availability", back_populates="date")

    def to_dict(self):
        return {"id": self.id, "date": self.date}


class City(db.Model):
    __tablename__ = "cities"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    city = db.Column(db.String(255), nullable=False)
    state = db.Column(db.String(2), nullable=False)
    created_at = db.Column(db.DateTime(), nullable=False)
    updated_at = db.Column(db.DateTime(), nullable=False)

    tours = db.relationship("Tour", back_populates="city")

    def to_dict(self):
        return {"id": self.id, "city": self.city}


class Language(db.Model):
    __tablename__ = "languages"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    language = db.Column(db.String(255), nullable=False, unique=True)
    created_at = db.Column(db.DateTime(), nullable=False)
    updated_at = db.Column(db.DateTime(), nullable=False)

    guides = db.relationship(
        "User", secondary=users_languages, back_populates="languages"
    )

    def to_dict(self):
        return {"id": self.id, "language": self.language}


class Review(db.Model):
    __tablename__ = "reviews"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    reviewer_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    # tour_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("tours.id")))
    guide_id = db.Column(db.Integer, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    communication_rating = db.Column(db.Integer, nullable=False)
    knowledgeability_rating = db.Column(db.Integer, nullable=False)
    professionalism_rating = db.Column(db.Integer, nullable=False)
    review_body = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now())

    reviewer = db.relationship("User", back_populates="reviews")
    # tour = db.relationship("Tour", back_populates="reviews")

    def to_dict(self):
        return {
            "id": self.id,
            "reviewer_id": self.reviewer_id,
            # "tour_id": self.tour_id,
            "guide_id": self.guide_id,
            "communication_rating": self.communication_rating,
            "knowledgeability_rating": self.knowledgeability_rating,
            "professionalism_rating": self.professionalism_rating,
            "rating": self.rating,
            "review_body": self.review_body,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }


class Type(db.Model):
    __tablename__ = "types"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    type = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime(), nullable=False)
    updated_at = db.Column(db.DateTime(), nullable=False)

    tours = db.relationship("Tour", back_populates="type")

    def to_dict(self):
        return {"id": self.id, "type": self.type}


class Tour(db.Model):
    __tablename__ = "tours"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    guide_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    type_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("types.id")), nullable=False
    )
    city_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("cities.id")), nullable=False
    )
    title = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    about = db.Column(db.String(255), nullable=False)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime(), nullable=False)
    updated_at = db.Column(db.DateTime(), nullable=False)

    guide = db.relationship("User", back_populates="tours_given")
    city = db.relationship("City", back_populates="tours")
    bookings = db.relationship("Booking", back_populates="tour")
    type = db.relationship("Type", back_populates="tours")
    availability = db.relationship("Availability", back_populates="tour")
    images = db.relationship("Image", back_populates="tour")
    # reviews = db.relationship("Review", back_populates="tour")

    def to_dict(self):
        return {
            "id": self.id,
            "guide_id": self.guide_id,
            "city_id": self.city_id,
            "type_id": self.type_id,
            "title": self.title,
            "price": self.price,
            "duration": self.duration,
            "about": self.about,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }


class Availability(db.Model):
    __tablename__ = "availabilities"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    tour_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("tours.id")))
    date_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("dates.id")))
    time = db.Column(db.Time(), nullable=False)
    created_at = db.Column(db.DateTime(), nullable=False)
    updated_at = db.Column(db.DateTime(), nullable=False)

    tour = db.relationship("Tour", back_populates="availability")
    date = db.relationship("Date", back_populates="available_tours")

    def to_dict(self):
        time_format = "%H:%M"
        raw_time = self.time
        string_time = raw_time.strftime(time_format)
        self.time = string_time
        return {
            "id": self.id,
            "tour_id": self.tour_id,
            "date_id": self.date_id,
            "time": self.time,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }


class Image(db.Model):
    __tablename__ = "images"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    tour_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("tours.id")))
    preview = db.Column(db.Boolean)
    url = db.Column(db.String(), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    created_at = db.Column(db.DateTime(), nullable=False)
    updated_at = db.Column(db.DateTime(), nullable=False)

    tour = db.relationship("Tour", back_populates="images")
    user = db.relationship("User", back_populates="images")

    def to_dict(self):
        return {
            "id": self.id,
            "tour_id": self.tour_id,
            "preview": self.preview,
            "url": self.url,
            "user_id": self.user_id,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
