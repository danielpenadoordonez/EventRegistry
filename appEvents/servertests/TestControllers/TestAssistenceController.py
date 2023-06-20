from server.Controllers.AssistenceController import AssistenceController
from server.Entities.Assistence import Assistence
import unittest

class TestAssistenceController(unittest.TestCase):
    
    def setUp(self) -> None:
        self.assistance = Assistence(
            event_id=106,
            member_id=10,
            confirmed=1,
            date_time="2023-05-29",
            was_present=1,
            id_usuario=2
        )
        
    def test_register_assistance(self):
        with self.assertRaises(BaseException):
            AssistenceController.register_assistance(self.assistance)

    def test_update_assistance(self):
        with self.assertRaises(BaseException):
            AssistenceController.update_assistance(self.assistance)
            
if __name__== "__main__":
    unittest.main()