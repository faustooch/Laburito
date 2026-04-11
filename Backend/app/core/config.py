from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator


class Settings(BaseSettings):
    PROJECT_NAME: str
    API_V1_STR: str

    # Credenciales de Google Auth
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str

    @field_validator("GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", mode="before")
    @classmethod
    def strip_quotes_and_spaces(cls, v: str) -> str:
        if isinstance(v, str):
            return v.strip(' "\'')
        return v

    # Credenciales de Base de Datos (¡Ahora es una sola línea!)
    DATABASE_URL: str

    # Seguridad
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()