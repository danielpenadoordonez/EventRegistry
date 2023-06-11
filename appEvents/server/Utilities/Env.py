import os

class Env:

    __DOTENV_FILE = None

    @classmethod
    def load_Env_Variables(cls, dotenv_File=".env") -> None:
        """
            Loads environment variables from .env file, if the path to .env is not specified
            with dotenv_File parameter, then it is going to load by default .env file on the current directory
        """
        #Path to the .env file
        cls.__DOTENV_FILE = dotenv_File
        #List that contains every variable in .env as an element
        dotenv_Vars = list() 
        
        try:
            with open(cls.__DOTENV_FILE, 'r') as f:
                dotenv_Vars = f.read().split()
        except FileNotFoundError:
            raise FileNotFoundError("No se encontró un archivo importante del programa!!")
        except Exception as err:
            raise Exception(err)

        for var in dotenv_Vars:
            if var.startswith('#') or var.isspace(): #Skip comment and empty lines
                continue
            #Add the variable to the current environment
            os.environ[var.split('=')[0]] = var.split('=')[1]