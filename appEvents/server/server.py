from flask import Flask, request, jsonify, abort
from flask_cors import CORS, cross_origin
from Utilities.Env import Env
from Controllers.EventController import EventController
from Controllers.UserController import UserController
from Controllers.MiembroController import MiembroController
from Controllers.PerfilController import PerfilController
from Controllers.AssistenceController import AssistenceController
from Entities.Evento import Evento
from Entities.User import User
from Entities.Miembro import Miembro
from Entities.Perfil import Perfil
from Entities.Assistence import Assistence
import os
import json

Env.load_Env_Variables()
server = Flask(__name__)
server.secret_key = os.environ.get('sec_key')
#Add CORS
CORS(server)

###############
#EVENT APIs
###############
@server.route('/get-events', methods = ['GET'])
@cross_origin(origin="*", headers=["Content-Type"])
def get_events():
    events:list = EventController.get_events_from_db()
    return jsonify({'events': events})

@server.route('/get-event', methods = ['GET'])
@cross_origin(origin="*", headers=["Content-Type"])
def get_event_by_id():
    params = request.args
    event = EventController.get_event_from_db(params.get('event_id'))
    return jsonify(event)

@server.route('/save-event', methods = ['POST'])
@cross_origin(origin="*", headers=["Content-Type"])
def save_event():
    event_data = json.loads(request.data)

    event = Evento()
    event.id_Usuario = event_data.get('id_usuario')
    event.nombre = str(event_data.get('nombre')).replace("\"", "'")
    event.descripcion = str(event_data.get('descripcion')).replace("\"", "'")
    event.fecha = event_data.get('fecha').replace("\"", "'")
    event.abierto = event_data.get('abierto')

    EventController.save_event_on_db(event)
    return jsonify({200: "Success"})

@server.route('/update-event', methods = ['PUT'])
@cross_origin(origin="*", headers=["Content-Type"])
def update_event():
    params = request.args
    event_data = json.loads(request.data)

    event = Evento()
    event.id = params.get('event_id')
    event.id_Usuario = event_data.get('id_usuario')
    event.nombre = str(event_data.get('nombre')).replace("\"", "'")
    event.descripcion = str(event_data.get('descripcion')).replace("\"", "'")
    event.fecha = event_data.get('fecha').replace("\"", "'")
    event.abierto = event_data.get('abierto')

    return jsonify(EventController.update_event_on_db(event)) 


###########
#USER APIs
##########

@server.route('/login', methods = ['GET'])
@cross_origin(origin="*", headers=["Content-Type"])
def login():
    params = request.args

    username = str(params.get('username'))
    password = str(params.get('password'))

    if not UserController.is_user_Registered(username):
        abort(404, "User Not Found")

    if UserController.is_password_correct(username, password):
        user:User = UserController.get_user(username).__dict__
        del user["password"]
        return jsonify(user)
    else:
        return abort(401, "Login Information Incorrect")
    
@server.route('/create-user', methods = ['POST'])
@cross_origin(origin="*", headers=["Content-Type"])
def create_user():
    user_data = json.loads(request.data)

    user = User()
    user.id_perfil = user_data.get('id_perfil')
    user.username = str(user_data.get('username')).replace("\"", "'")
    user.password = str(user_data.get('password')).replace("\"", "'")

    UserController.create_user(user)
    return jsonify({200: "Success"})


################
#Profile APIs
################
@server.route('/get-profiles', methods = ['GET'])
@cross_origin(origin="*", headers=["Content-Type"])
def get_profiles():
    profiles = PerfilController.get_profiles()
    return jsonify({'profiles': profiles})
    
###############
#Member APIs
###############
@server.route('/save-member', methods = ['POST'])
@cross_origin(origin="*", headers=["Content-Type"])
def save_member():
    member_data = json.loads(request.data)

    member = Miembro()
    member.id = member_data.get('id')
    member.nombre_completo = str(member_data.get('nombre_completo')).replace("\"", "'")
    member.cedula = str(member_data.get('cedula')).replace("\"", "'")
    member.status = member_data.get('status')
    member.correo = str(member_data.get('correo')).replace("\"", "'")
    member.telefono = str(member_data.get('telefono')).replace("\"", "'")

    MiembroController.save_member(member)
    return jsonify({200: "Success"})

@server.route('/members-by-event', methods = ['GET'])
@cross_origin(origin="*", headers=["Content-Type"])
def get_members_on_event():
    params = request.args

    event_id = int(params.get('event'))
    members = MiembroController.get_members_on_event(event_id)
    return jsonify({'members': members})

#################
#Assistance APIs
#################
@server.route('/register-assistance', methods = ['POST'])
@cross_origin(origin="*", headers=["Content-Type"])
def register_assistance():
    assistance_data = json.loads(request.data)

    assistance = Assistence()
    assistance.event_id = assistance_data.get('event_id')
    assistance.member_id = assistance_data.get(' ')
    assistance.confirmed = assistance_data.get('confirmed')
    assistance.date_time = assistance_data.get("date_time").replace("\"", "'")
    assistance.was_present = assistance_data.get('was_present')
    assistance.id_usuario = assistance_data.get('id_usuario')

    AssistenceController.register_assistance(assistance)
    return jsonify({200: "Success"})

@server.route('/update-assistance', methods = ['PUT'])
@cross_origin(origin="*", headers=["Content-Type"])
def update_assistance():
    params = request.args
    assistance_data = json.loads(request.data)

    assistance = Assistence()
    assistance.event_id = params.get('event_id')
    assistance.member_id = params.get('member_id')
    assistance.confirmed = assistance_data.get('confirmed')
    assistance.was_present = assistance_data.get('was_present')
    assistance.id_usuario = assistance_data.get('id_usuario')

    AssistenceController.update_assistance(assistance)
    return jsonify({200: "Success"})


if __name__ == "__main__":
    server.run(host='0.0.0.0', port=8080)