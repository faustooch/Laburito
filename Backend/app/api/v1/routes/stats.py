# app/api/v1/routes/stats.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.schemas.stats import SystemStatsResponse
from app.services import stats_service

router = APIRouter(prefix="/stats", tags=["stats"])

@router.get("/", response_model=SystemStatsResponse)
def get_system_stats(db: Session = Depends(get_db)):
    """
    Endpoint dedicado a proveer métricas globales de la plataforma.
    """
    return stats_service.get_general_stats(db)