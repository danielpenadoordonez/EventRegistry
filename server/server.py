from flask import Flask, request, jsonify, abort
from flask_cors import CORS, cross_origin
from Utilities.Env import Env
from Controllers.EventController import EventController
from Controllers.UserController import UserController
from Entities.Evento import Evento
from Entities.User import User
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


if __name__ == "__main__":
    server.run(host='0.0.0.0', port=8080)