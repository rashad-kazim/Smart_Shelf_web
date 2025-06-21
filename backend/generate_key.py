# backend/generate_key.py

from cryptography.fernet import Fernet
import secrets

def generate_keys():
    """
    Generates both the ENCRYPTION_KEY (for Fernet) and
    the SECRET_KEY (for JWT) and prints them to the console.
    """
    
    # 1. ENCRYPTION_KEY'i üret (Fernet için özel format)
    encryption_key = Fernet.generate_key()
    
    # 2. SECRET_KEY'i üret (32-byte hex string)
    secret_key = secrets.token_hex(32)
    
    print("--- Your New Keys ---")
    print("\nCopy the keys below and paste them into your .env file.")
    print("-" * 25)
    
    print("\n# For data encryption (e.g., WiFi passwords)")
    print(f"ENCRYPTION_KEY={encryption_key.decode()}")
    
    print("\n# For JWT token signing")
    print(f"SECRET_KEY={secret_key}")
    
    print("\n" + "-" * 25)

if __name__ == "__main__":
    generate_keys()