from datetime import date

class Assistence():

    def __init__(self, event_id:int=0, member_id:int=0, confirmed:bool=False, date_time:date="", was_present:bool=False, id_usuario:int=0) -> None:
        self.event_id:int = event_id
        self.member_id:int = member_id
        self.confirmed:bool= confirmed
        self.date_time:date = date_time
        self.was_present:bool = was_present
        self.id_usuario:int = id_usuario 