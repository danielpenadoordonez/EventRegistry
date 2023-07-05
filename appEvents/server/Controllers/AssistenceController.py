from DB.DB import DBConnection
from Entities.Assistence import Assistence

class AssistenceController():
    @staticmethod
    def register_assistance(assistence:Assistence) -> None:
        #* En caso de venir o no del form de rergistrar y crear miembro
        resultado = int(assistence.member_id) if assistence.member_id is not None else "(SELECT dbo.fnGetNextMaxIdMember() - 1)"
        insert_query = f"""
        INSERT INTO AsistenciaEvento VALUES (
            {assistence.event_id},
            {resultado},
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
        SET Confirmado = Presente = {assistence.was_present},
            Id_Usuario = {assistence.id_usuario},
            Fecha_Hora = {assistence.date_time}
        WHERE Id_Evento = {assistence.event_id} AND Id_Miembro = {assistence.member_id}
        """
        try:
            DBConnection.run_statement(update_query)
        except:
            raise