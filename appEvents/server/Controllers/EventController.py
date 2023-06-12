from DB.DB import DBConnection
from Entities.Evento import Evento

class EventController():

    def __init__(self) -> None:
        pass

    @staticmethod
    def get_events_from_db() -> list:
        select_query = "SELECT * FROM Evento"
        query_result = DBConnection.run_query(select_query)

        events = list()
        for result in query_result:
            event_dict = dict()
            event_dict['event_id'] = result[0]
            event_dict['usuario'] = result[1]
            event_dict['nombre'] = result[2]
            event_dict['descripcion'] = result[3]
            event_dict['fecha'] = result[4]
            event_dict['abierto'] = result[5]
            events.append(event_dict)

        return events
    
    @staticmethod
    def get_event_from_db(event_id) -> dict:
        select_query = f"SELECT * FROM Evento WHERE Id = {event_id}"
        query_result = DBConnection.run_query(select_query)

        if len(query_result) > 0:
            event = Evento()
            event.id = query_result[0][0]
            event.id_Usuario = query_result[0][1]
            event.nombre = query_result[0][2]
            event.descripcion = query_result[0][3]
            event.fecha = query_result[0][4]
            event.abierto = query_result[0][5]
            return event.__dict__
        else:
            return {404: "Event not found"}
        
    @staticmethod
    def save_event_on_db(event:Evento) -> None:
        insert_query = f"""INSERT INTO Evento VALUES (
        {event.id_Usuario}, '{event.nombre}', '{event.descripcion}', '{event.fecha}', {event.abierto})"""
        try:
            DBConnection.run_statement(insert_query)
        except:
            raise

    @staticmethod
    def update_event_on_db(event:Evento) -> dict:
        update_query = f"""UPDATE Evento
                           SET Nombre = '{event.nombre}',
                               Descripcion = '{event.descripcion}',
                               Fecha = '{event.fecha}'
                            WHERE Id = {event.id}"""
        try:
            DBConnection.run_statement(update_query)
            return EventController.get_event_from_db(event.id)
        except:
            raise