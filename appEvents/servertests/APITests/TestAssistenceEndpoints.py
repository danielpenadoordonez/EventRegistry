from server.server import server
from server.Entities.Assistence import Assistence
from flask import Flask
from flask.testing import FlaskClient
import unittest

class TestAssistenceEndpoints(unittest.TestCase):
    
    def setUp(self) -> None:
        server.testing = True
        self.server = server.test_client()
        self.assistance = Assistence(
            event_id=106,
            member_id=10,
            confirmed=1,
            date_time="2023-05-29",
            was_present=1,
            id_usuario=2
        )
        
    def test_register_assistence(self):
        response = self.server.post('/register-assistance', 
                                    json={'event_id': self.assistance.event_id,
                                          'confirmed': self.assistance.confirmed,
                                          'date_time': self.assistance.date_time,
                                          'was_present': self.assistance.was_present,
                                          'id_usuario': self.assistance.id_usuario})
        self.assertEqual(response.status_code, 200)
    
    def test_update_assistence(self):
        response = self.server.put(f'/register-assistance?event_id={self.assistance.event_id}&member_id={self.assistance.member_id}', 
                                    json={'confirmed': self.assistance.confirmed,
                                          'was_present': self.assistance.was_present,
                                          'id_usuario': self.assistance.id_usuario,
                                          'date_time': self.assistance.date_time})
        self.assertEqual(response.status_code, 200)
        
if __name__== "__main__":
    unittest.main()