# app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "API de Usuarios"
    API_V1_STR: str = "/api/v1"

    # Esta variable ahora es obligatoria y viene del .env
    GOOGLE_CLIENT_ID: str

    # Configuración de PostgreSQL
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"

    # Esta variable ahora es obligatoria y viene del .env
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str = "fastapi_db"
    POSTGRES_PORT: str = "5432"

    @property
    def database_url(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # Configuración de Seguridad (JWT)
    # Esta variable ahora es obligatoria y viene del .env
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Configuración de Pydantic para leer el archivo .env
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()