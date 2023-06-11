class User():

    def __init__(self, id_perfil:int=0, username:str="", password:str="") -> None:
        self.id_perfil:int = id_perfil
        self.username:str = username
        self.password:str = password