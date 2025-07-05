# backend/app/utils/encryption.py

from cryptography.fernet import Fernet
from app.core.config import settings

# Veri şifreleme için Fernet kullanıyoruz.
cipher_suite = Fernet(settings.ENCRYPTION_KEY.encode())

def encrypt_data(data: str) -> str:
    """Verilen string'i şifreler."""
    if not data:
        return data
    encrypted_data = cipher_suite.encrypt(data.encode())
    return encrypted_data.decode()

def decrypt_data(encrypted_data: str) -> str:
    """Şifrelenmiş veriyi çözer."""
    if not encrypted_data:
        return encrypted_data
    try:
        decrypted_data = cipher_suite.decrypt(encrypted_data.encode())
        return decrypted_data.decode()
    except Exception:
        return ""