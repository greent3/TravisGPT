from openai import OpenAI
from core.config import settings

client_ai  = OpenAI(api_key=settings.openai_api_key)

def get_client_ai():
    return client_ai