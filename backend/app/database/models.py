from app.database.connection import db

def create_tables():
    """Create necessary tables in the database"""
    connection = db.get_connection()
    if connection:
        cursor = connection.cursor()
        
        # Stores tablosu
        create_stores_table = """
        CREATE TABLE IF NOT EXISTS stores (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            country VARCHAR(100) NOT NULL,
            city VARCHAR(100) NOT NULL,
            branch VARCHAR(100),
            address TEXT,
            server_token VARCHAR(255) UNIQUE,
            status ENUM('active', 'inactive') DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
        """
        
        try:
            cursor.execute(create_stores_table)
            connection.commit()
            print("Tables created successfully.")
        except Exception as e:
            print(f"Table creation error: {e}")
        finally:
            cursor.close()

def init_database():
    """Start Database and create tables if not exists"""
    connection = db.get_connection()
    if connection:
        create_tables()
        return True
    return False