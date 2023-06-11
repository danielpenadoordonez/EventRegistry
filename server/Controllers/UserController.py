from Entities.User import User
from DB.DB import DBConnection

class UserController():

    @staticmethod
    def get_user(username) -> User:
        select_query = f"SELECT * FROM Usuario WHERE NombreUsuario LIKE '{username}'"
        query_result = DBConnection.run_query(select_query)

        if len(query_result) > 0:
            user = User()
            user.id_perfil = query_result[0][1]
            user.username = query_result[0][2]
            user.password = query_result[0][3]
            return user
        
        return None
    
    @staticmethod
    def is_user_Registered(username) -> bool:
        return UserController.get_user(username) != None
    
    @staticmethod
    def is_password_correct(username, password) -> bool:
        user = UserController.get_user(username)
        return user.password == password
