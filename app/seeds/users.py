from app.models import (
    db,
    User,
    City,
    Date,
    Review,
    Booking,
    Tour,
    Language,
    Type,
    Availability,
    environment,
    SCHEMA,
)
from sqlalchemy.sql import text
import datetime


# Adds a demo user, you can add other users here if you want
def seed_users():
    english = Language(
        language="English",
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    spanish = Language(
        language="Spanish",
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    chinese = Language(
        language="Chinese",
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    italian = Language(
        language="Italian",
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    demo = User(
        username="Demo",
        email="demo@aa.io",
        password="password",
        first_name="Demo",
        last_name="Stration",
        profile_pic="https://publichealth.uga.edu/wp-content/uploads/2020/01/Thomas-Cameron_Student_Profile.jpg",
        joined_on=datetime.datetime.now(),
        student=True,
        languages=[english, chinese],
        graduation_date=datetime.date(2024, 5, 24),
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    demo2 = User(
        username="Demo2",
        email="demo2@aa.io",
        password="password",
        first_name="John",
        last_name="Chen",
        profile_pic="https://png.pngtree.com/background/20230426/original/pngtree-young-professional-asian-college-man-with-glasses-picture-image_2489385.jpg",
        joined_on=datetime.datetime.now(),
        student=True,
        languages=[english, spanish],
        graduation_date=datetime.date(2024, 5, 24),
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    demo3 = User(
        username="Demo3",
        email="demo3@aa.io",
        password="password",
        first_name="Demo",
        last_name="Lition",
        profile_pic="https://3.bp.blogspot.com/-uXdYwoAZnDM/W1dzL3uLkoI/AAAAAAAADY0/RVbd3BlqORsT_aUNHVHDEIxxxNIaspLrwCLcBGAs/s1600/IMG_6141.JPG",
        joined_on=datetime.datetime.now(),
        student=False,
        graduation_date=None,
        languages=[english, italian],
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    demo4 = User(
        username="Demo4",
        email="demo4@aa.io",
        password="password",
        first_name="Mary",
        last_name="Poppins",
        profile_pic="https://www.davidson.edu/sites/default/files/styles/extra_extra_large_16_9/public/2020-10/Grace_Rooker%2724_03.jpg",
        joined_on=datetime.datetime.now(),
        student=False,
        graduation_date=None,
        languages=[english],
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    demo5 = User(
        username="Demo5",
        email="demo5@aa.io",
        password="password",
        first_name="Stue",
        last_name="Dent",
        profile_pic="https://www.ecclesiologyandethnography.net/wp-content/uploads/2019/06/Koos-Tamminga.jpg",
        joined_on=datetime.datetime.now(),
        student=True,
        graduation_date=datetime.date(2024, 6, 24),
        languages=[english, spanish],
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    new_york = City(
        city="New York",
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    los_angeles = City(
        city="Los Angeles",
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    seattle = City(
        city="Seattle",
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    miami = City(
        city="Miami",
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    food = Type(
        type="Food",
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    history = Type(
        type="History",
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    adventure = Type(
        type="Adventure",
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    other = Type(
        type="Other",
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    monday = Date(
        date="Monday",
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    tuesday = Date(
        date="Tuesday",
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    wednesday = Date(
        date="Wednesday",
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    thursday = Date(
        date="Thursday",
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    friday = Date(
        date="Friday",
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    saturday = Date(
        date="Saturday",
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    sunday = Date(
        date="Sunday",
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    tour1 = Tour(
        guide=demo,
        type=food,
        city=new_york,
        title="A Little Taste of New York",
        price=120,
        duration=3,
        about='Born and raised in NYC. I"ve spent a lot of money and time, traveling around, taking pictures and eating all over New York. Come with me on a journey to explore New York',
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    tour1_avail = Availability(tour=tour1, date=monday, time=18)

    tour1_avail1 = Availability(tour=tour1, date=saturday, time=18)

    tour1_avail2 = Availability(tour=tour1, date=sunday, time=18)

    tour2 = Tour(
        guide=demo2,
        city=los_angeles,
        price=80,
        title="Explore LA's street arts",
        about='Born and raised in LA. I"ve spent a lot of money and time, traveling around, taking pictures and eating all over LA. Come with me on a journey to explore Los Angeles.',
        type=other,
        duration=4,
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    tour2_avail = Availability(tour=tour2, date=friday, time=17)

    tour2_avail1 = Availability(tour=tour2, date=saturday, time=14)

    tour2_avail2 = Availability(tour=tour2, date=sunday, time=11)

    tour3 = Tour(
        guide=demo2,
        city=seattle,
        price=300,
        duration=6,
        title="Guided Hike of Mount Rainier",
        about='Born and raised in Seattle. I"ve spent a lot of money and time, traveling around, taking pictures and eating all over Seattle. Come with me on a journey to explore Seattle',
        type=adventure,
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    tour3_avail = Availability(tour=tour3, date=monday, time=17)

    tour3_avail1 = Availability(tour=tour3, date=tuesday, time=14)

    tour3_avail2 = Availability(tour=tour3, date=thursday, time=11)

    review1 = Review(
        reviewer=demo3,
        guide_id=1,
        communication_rating=5,
        knowledgability_rating=4,
        professionalism_rating=5,
        rating=round(((5 + 4 + 5) / 3), 2),
        # rating=5,
        review_body="Demo was a very friendly person with lots of knowledge of the city",
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    review2 = Review(
        reviewer=demo3,
        guide_id=2,
        communication_rating=5,
        knowledgability_rating=4,
        professionalism_rating=5,
        # rating=4,
        rating=round(((5 + 4 + 5) / 3), 2),
        review_body="Demo2 was a very friendly person with lots of knowledge of the city",
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    review3 = Review(
        reviewer=demo,
        guide_id=2,
        communication_rating=5,
        knowledgability_rating=4,
        professionalism_rating=5,
        rating=round(((5 + 4 + 5) / 3), 2),
        # rating=4,
        review_body="Demo3 was a very friendly person with lots of knowledge of the city",
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    review4 = Review(
        reviewer=demo4,
        guide_id=5,
        communication_rating=5,
        knowledgability_rating=4,
        professionalism_rating=5,
        rating=round(((5 + 4 + 5) / 3), 2),
        # rating=4,
        review_body="Demo3 was a very friendly person with lots of knowledge of the city",
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    booking1 = Booking(
        tourist=demo3,
        tour=tour1,
        guide_id=1,
        date=datetime.date(2024, 1, 1),
        time=datetime.time(9),
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    booking2 = Booking(
        tourist=demo3,
        tour=tour2,
        guide_id=2,
        date=datetime.date(2024, 2, 1),
        time=datetime.time(9),
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    booking3 = Booking(
        tourist=demo,
        tour=tour2,
        guide_id=2,
        date=datetime.date(2024, 1, 15),
        time=datetime.time(13),
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    booking4 = Booking(
        tourist=demo,
        tour=tour3,
        guide_id=2,
        date=datetime.date(2023, 1, 27),
        time=datetime.time(13),
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    booking5 = Booking(
        tourist=demo3,
        tour=tour2,
        guide_id=2,
        date=datetime.date(2023, 1, 20),
        time=datetime.time(13),
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    booking6 = Booking(
        tourist=demo5,
        tour=tour1,
        guide_id=1,
        date=datetime.date(2024, 1, 13),
        time=datetime.time(13),
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    booking7 = Booking(
        tourist=demo4,
        tour=tour2,
        guide_id=2,
        date=datetime.date(2024, 1, 13),
        time=datetime.time(13),
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now(),
    )

    db.session.add_all(
        [
            tour3_avail,
            tour3_avail1,
            tour3_avail2,
            tour1_avail,
            tour1_avail1,
            tour1_avail2,
            tour2_avail,
            tour2_avail1,
            tour2_avail2,
            seattle,
            new_york,
            los_angeles,
            miami,
            demo,
            demo2,
            demo3,
            demo4,
            demo5,
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday,
            sunday,
            adventure,
            history,
            food,
            other,
            english,
            spanish,
            chinese,
            booking1,
            booking2,
            booking3,
            tour1,
            tour2,
            tour3,
            review1,
            review2,
            review3,
            review4,
            booking4,
            booking5,
            booking6,
            booking7,
        ]
    )
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.bookings RESTART IDENTITY CASCADE;"
        )
        db.session.execute(f"TRUNCATE table {SCHEMA}.cities RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.dates RESTART IDENTITY CASCADE;")
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.languages RESTART IDENTITY CASCADE;"
        )
        db.session.execute(f"TRUNCATE table {SCHEMA}.types RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.tours RESTART IDENTITY CASCADE;")
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.availabilities RESTART IDENTITY CASCADE;"
        )
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.users_languages RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
