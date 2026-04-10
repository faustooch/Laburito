from sqlalchemy.orm import declarative_base

Base = declarative_base()

# IMPORTANTE: importar modelos acá
from app.domains.users.models import User