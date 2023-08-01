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
    
    @staticmethod
    def update_assistance(assistence:Assistence) -> None:
        update_query = f"""
        UPDATE AsistenciaEvento
        SET Presente = {assistence.was_present},
            Id_Usuario = {assistence.id_usuario},
            Fecha_Hora = '{assistence.date_time}'
        WHERE Id_Evento = {assistence.event_id} AND Id_Miembro = {assistence.member_id}
        """
        try:
            DBConnection.run_statement(update_query)
        except:
            raise

    @staticmethod
    def get_assistance_for_report(event_id:int) -> list:
        select_query = f"""
        SELECT m.NumeroCedula as Cedula, m.NombreCompleto as Miembro, ae.Confirmado as Confirmado, ae.Fecha_Hora as Fecha, u.NombreUsuario as UsuarioRegistrador
        FROM Miembro m, AsistenciaEvento ae, Usuario u
        WHERE ae.Id_Evento = {event_id} AND ae.Id_Miembro = m.id AND ae.Id_Usuario = u.id
        """
        try:
            query_result = DBConnection.run_query(select_query)
            assistance_from_event = list()
            for result in query_result:
                assistance_dict = dict()
                assistance_dict['cedula'] = result[0]
                assistance_dict['miembro'] = result[1]
                assistance_dict['confirmado'] = result[2]
                assistance_dict['fecha'] = result[3]
                assistance_dict['usuario_registrador'] = result[4]
                
                assistance_from_event.append(assistance_dict)

            return assistance_from_event
        except:
            raise