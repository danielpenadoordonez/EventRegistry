import pyodbc
import os
from Utilities.Env import Env

class DBConnection():

    @staticmethod
    def run_query(query:str) -> list:
        """
            Runs SELECT queries that return data from the database
        """
        try:
            #Connection to DB
            connection = pyodbc.connect('Driver={SQL Server};'
                                        f'Server={os.environ.get("db_server")};'
                                        f'Database={os.environ.get("database")};'
                                        f'UID={os.environ.get("db_user")};'
                                        f'PWD={os.environ.get("db_password")}')
            #Cursor for running SQL code
            cursor = connection.cursor()
            #Run SQL code
            cursor.execute(query)
            #Get the data returned by the query
            query_data:list = cursor.fetchall()

            #Close cursor and connection
            cursor.close()
            connection.close()
            #Return data from the query
            return query_data
        except Exception as err:
            raise Exception(f"Error while fetching data from database\n{err.__str__()}")
    
    @staticmethod
    def run_statement(query:str) -> None:
        """
           Runs INSERT, DELETE or UPDATE SQL statements
        """
        try:
            #Connection to DB
            connection = pyodbc.connect('Driver={SQL Server};'
                                        f'Server={os.environ.get("db_server")};'
                                        f'Database={os.environ.get("database")};'
                                        f'UID={os.environ.get("db_user")};'
                                        f'PWD={os.environ.get("db_password")}')

            #Cursor for running SQL code
            cursor = connection.cursor()
            #Run SQL code
            cursor.execute(query)
            #Commit transaction (This line is required for an INSERT to work)
            connection.commit()

            #Close cursor and connection
            cursor.close()
            connection.close()
        except Exception as err:
            raise Exception(f"Error while inserting on database\n{err.__str__()}")

        