# app/utils/token_utils.py

import secrets
import string

def generate_secure_token(prefix: str, length: int = 32):
    """Güvenli, rastgele bir token üretir."""
    alphabet = string.ascii_letters + string.digits
    token = ''.join(secrets.choice(alphabet) for _ in range(length))
    return f"{prefix}_{token}"

def generate_server_token():
    """Server için token üretir."""
    return generate_secure_token("srv")

def generate_esp32_token():
    """ESP32 için token üretir."""
    return generate_secure_token("esp")