from DB.DB import DBConnection
from Entities.Perfil import Perfil

class PerfilController():

    @staticmethod
    def get_profiles() -> list:
        select_query = "SELECT * FROM Perfil"
        profiles = list()
        try:
            query_result = DBConnection.run_query(select_query)
            for result in query_result:
                profile = Perfil()
                profile.id = result[0]
                profile.descripction = result[1]
                profiles.append(profile.__dict__)
        except:
            raise
        return profiles