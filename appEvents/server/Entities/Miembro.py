class Miembro():

    def __init__(self, nombre_completo:str="", cedula:str="", status:bool=False, correo:str="", telefono:str="") -> None:
        self.id = 0
        self.nombre_completo = nombre_completo
        self.cedula = cedula
        self.status = status
        self.correo = correo
        self.telefono = telefono