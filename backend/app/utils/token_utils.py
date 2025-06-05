import secrets
import string

def generate_server_token(length=32):
    """Creates a secure token for server identification"""
    alphabet = string.ascii_letters + string.digits
    token = ''.join(secrets.choice(alphabet) for i in range(length))
    return f"SRV_{token}"

def generate_esp32_token(length=32):
    """Creates a secure token for ESP32 identification"""
    alphabet = string.ascii_letters + string.digits
    token = ''.join(secrets.choice(alphabet) for i in range(length))
    return f"ESP_{token}"