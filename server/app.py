from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)

from models import db, Customer, Service, Appointment
from datetime import datetime

app = Flask(__name__)

# Database setup
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///beauty_parlour.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = "super-secret-key"  # change this in production!


CORS(app)
db.init_app(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
api = Api(app)
jwt = JWTManager(app)


# -------- Resources -------- #

class Register(Resource):
    def post(self):
        data = request.get_json()
        name = data.get("name")
        phone_number = data.get("phone_number")
        password = data.get("password")

        if not (name and phone_number and password):
            return {"error": "All fields required"}, 400

        if Customer.query.filter_by(phone_number=phone_number).first():
            return {"error": "Phone number already registered"}, 400

        password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

        customer = Customer(name=name, phone_number=phone_number, password_hash=password_hash)
        db.session.add(customer)
        db.session.commit()

        return {"message": "Account created successfully!"}, 201


class Login(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("phone_number", type=str, required=True, help="Phone number is required")
    parser.add_argument("password", type=str, required=True, help="Password is required")

    def post(self):
        data = Login.parser.parse_args()
        customer = Customer.query.filter_by(phone_number=data["phone_number"]).first()

        if not customer or not bcrypt.check_password_hash(customer.password_hash, data["password"]):
            return {"error": "Invalid phone number or password"}, 401

        
        access_token = create_access_token(identity=str(customer.id))
        return {"access_token": access_token}, 200
    


class ServiceList(Resource):
    def get(self):
        services = Service.query.all()
        return [{"id": s.id, "name": s.name, "price": s.price} for s in services], 200

    def post(self):
        data = request.get_json()
        service = Service(name=data["name"], price=data["price"])
        db.session.add(service)
        db.session.commit()
        return {"message": "Service added successfully"}, 201


class AppointmentList(Resource):
    @jwt_required()
    def get(self):
        customer_id = int(get_jwt_identity())
        appointments = Appointment.query.filter_by(customer_id=customer_id).all()

        return [{
            "id": a.id,
            "customer": a.customer.name,
            "service": a.service.name,
            "appointment_time": a.appointment_time.strftime("%Y-%m-%d %H:%M:%S")
        } for a in appointments], 200

    @jwt_required()
    def post(self):
        customer_id = int(get_jwt_identity())
        data = request.get_json()
        service_id = data.get("service_id")
        appointment_time = data.get("appointment_time")

        if not service_id:
            return {"error": "service_id is required"}, 400
        if not appointment_time:
            return {"error": "appointment_time is required"}, 400

        try:
            from datetime import datetime
            appointment_dt = datetime.strptime(appointment_time, "%Y-%m-%d %H:%M:%S")
        except ValueError:
            return {"error": "Invalid datetime format. Use YYYY-MM-DD HH:MM:SS"}, 400

        appointment = Appointment(
            customer_id=customer_id,
            service_id=service_id,
            appointment_time=appointment_dt
        )

        db.session.add(appointment)
        db.session.commit()
        return {"message": "Appointment created successfully"}, 201

class AppointmentResource(Resource):
    @jwt_required()
    def delete(self, appointment_id):
        appointment = Appointment.query.get(appointment_id)
        if not appointment:
            return {"error": "Appointment not found"}, 404

        db.session.delete(appointment)
        db.session.commit()
        return {"message": "Appointment deleted successfully"}, 200
class Profile(Resource):
    @jwt_required()
    def get(self):
        customer_id = int(get_jwt_identity())
        customer = Customer.query.get_or_404(customer_id)
        return {
            "id": customer.id,
            "name": customer.name,
            "phone_number": customer.phone_number
        }, 200

# Register resources with endpoints
api.add_resource(Register, "/register")
api.add_resource(Login, "/login")
api.add_resource(Profile, "/me")
api.add_resource(ServiceList, "/services")
api.add_resource(AppointmentList, "/appointments")
api.add_resource(AppointmentResource, "/appointments/<int:appointment_id>")


if __name__ == "__main__":
    app.run(debug=True)
