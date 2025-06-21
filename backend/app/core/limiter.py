# app/core/limiter.py

from slowapi import Limiter
from slowapi.util import get_remote_address

# Limiter nesnesini burada, bağımsız bir dosyada tanımlıyoruz.
limiter = Limiter(key_func=get_remote_address)