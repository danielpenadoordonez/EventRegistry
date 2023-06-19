from DB.DB import DBConnection
from Entities.Assistence import Assistence

class AssistenceController():

    @staticmethod
    def register_assistance(assistence:Assistence) -> None:
        insert_query = f"""
        INSERT INTO AsistenciaEvento VALUES (
            {assistence.event_id},
            {assistence.member_id},
            {assistence.confirmed},
            '{assistence.date_time}',
            {assistence.was_present},
            {assistence.id_usuario})
        """
        try:
            DBConnection.run_statement(insert_query)
        except:
            raise

    def update_assistance(assistence:Assistence) -> None:
        update_query = f"""
        UPDATE AsistenciaEvento
        SET Confirmado = {assistence.confirmed},
            Presente = {assistence.was_present},
            Id_Usuario = {assistence.id_usuario}
        WHERE Id_Evento = {assistence.event_id} AND Id_Miembro = {assistence.member_id}
        """
        try:
            DBConnection.run_statement(update_query)
        except:
            raise