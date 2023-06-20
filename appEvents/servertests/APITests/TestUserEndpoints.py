from server.server import server
from server.Entities.User import User
from flask import Flask
from flask.testing import FlaskClient
import unittest

class TestUserEndpoints(unittest.TestCase):
    
    def setUp(self) -> None:
        server.testing = True
        self.server = server.test_client()
        self.user = User(username="testuser", password="12345")
        
    def test_login(self):
        response = self.server.get(f'/login?username={self.user.username}&password={self.user.password}')
        self.assertEqual(response.status_code, 200)
        
    # def test_create_user(self):
    #     response = self.server.post('/create-user', 
    #                                 json={'id_perfil': self.user.id_perfil, 
    #                                       'username': self.user.username, 
    #                                       'password': self.user.password})
    #     self.assertEqual(response.status_code, 200)
        
if __name__== "__main__":
    unittest.main()