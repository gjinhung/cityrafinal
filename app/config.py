import os


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    GOOGLE_MAPS_API_KEY = os.environ.get("REACT_APP_GOOGLE_MAPS_API_KEY")
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL").replace(
        "postgres://", "postgresql://"
    )
    SQLALCHEMY_ECHO = True
