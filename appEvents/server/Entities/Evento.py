from datetime import date

class Evento():

    def __init__(self, id_Usuario:int=0, nombre:str="", descripcion:str="", fecha:date=None, abierto:bool=False) -> None:
        self.id:int = 0
        self.id_Usuario:int = id_Usuario
        self.nombre:str = nombre
        self.descripcion:str = descripcion
        self.fecha:date = fecha
        self.abierto:bool = abierto
