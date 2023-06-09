from DB.DB import DBConnection
from Entities.Miembro import Miembro

class MiembroController():
    
    @staticmethod
    def get_members_on_event(event_id:int) -> list:
        select_query = f"""
        SELECT a.Id_Miembro, m.NombreCompleto, m.NumeroCedula, m.Estatus1, m.Correo, m.Telefono, a.confirmado, a.presente
        FROM AsistenciaEvento a, Miembro m
        WHERE a.Id_Evento = {event_id} AND a.Id_Miembro = m.id
        """
        members = list()
        try:
            query_result = DBConnection.run_query(select_query)
            for result in query_result:
                member = Miembro()
                member.id = result[0]
                member.nombre_completo = result[1]
                member.cedula = result[2]
                member.status = result[3]
                member.correo = result[4]
                member.telefono = result[5]
                member.confirmado = result[6]
                member.presente = result[7]
                members.append(member.__dict__)
        except:
            raise
        return members
    
    @staticmethod
    def save_member(member:Miembro) -> None:
        insert_query = f"""
        INSERT INTO Miembro VALUES (
            (SELECT dbo.fnGetNextMaxIdMember()), '{member.nombre_completo}', '{member.cedula}', {member.status}, '{member.correo}', {member.telefono})
        """
        try:
            DBConnection.run_statement(insert_query)
        except:
            raise
        
        #AQUÍ Mario, dejo una función para obtener el last id (SELECT dbo.fnLastIdEvent();)