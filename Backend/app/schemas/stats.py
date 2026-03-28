# app/schemas/stats.py
from pydantic import BaseModel

class SystemStatsResponse(BaseModel):
    workers: int
    clients: int