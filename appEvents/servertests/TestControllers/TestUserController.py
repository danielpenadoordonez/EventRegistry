from server.Controllers.UserController import UserController
from server.Entities.User import User
import unittest

class TestUserController(unittest.TestCase):
    
    def setUp(self) -> None:
        self.user = User(username="testuser", password="12345")
        
    def test_get_user(self):
        user = UserController.get_user(self.user.username)
        self.assertIsNotNone(user)
    
    def test_is_user_Registered(self):
        self.assertTrue(UserController.is_user_Registered(self.user.username))
    
    def test_is_password_correct(self):
        self.assertTrue(UserController.is_password_correct(
            self.user.username, self.user.password))
    
    def test_create_user(self):
        with self.assertraises(BaseException):
            UserController.create_user(self.user)
            
if __name__== "__main__":
    unittest.main()