from app import app, db
from models import Customer, Service, Appointment
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta

bcrypt = Bcrypt()

with app.app_context():
    # Clear existing data
    Appointment.query.delete()
    Service.query.delete()
    Customer.query.delete()
    db.session.commit()

    # Seed customers
    password1 = bcrypt.generate_password_hash("password123").decode("utf-8")
    password2 = bcrypt.generate_password_hash("secret456").decode("utf-8")

    customer1 = Customer(name="Alice Beauty", phone_number="0712345678", password_hash=password1)
    customer2 = Customer(name="Jane Glow", phone_number="0798765432", password_hash=password2)

    db.session.add_all([customer1, customer2])
    db.session.commit()

    # Seed services
    services = [
        Service(name="Haircut", price=1000),
        Service(name="Facial", price=2000),
        Service(name="Manicure", price=1500),
        Service(name="Pedicure", price=1800),
        Service(name="Massage", price=2500)
    ]
    db.session.add_all(services)
    db.session.commit()

    # Seed appointments
    appointment1 = Appointment(
        customer_id=customer1.id,
        service_id=services[0].id,  # Haircut
        appointment_time=datetime.utcnow() + timedelta(days=1)
    )
    appointment2 = Appointment(
        customer_id=customer2.id,
        service_id=services[2].id,  # Manicure
        appointment_time=datetime.utcnow() + timedelta(days=2)
    )

    db.session.add_all([appointment1, appointment2])
    db.session.commit()

    print("✅ Database seeded successfully!")
