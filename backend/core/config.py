from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List

class Settings(BaseSettings):
    gpt_model: str
    embed_model: str
    openai_api_key: str
    access_code: str
    origins: List[str] 

    @field_validator("origins", mode="before")
    @classmethod
    def split_origins(cls, val):
        if isinstance(val, str):
            return [origin.strip() for origin in val.split(",")]
        elif isinstance(val, list):
            return val
        raise ValueError("origins must be a comma-separated string or list")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
