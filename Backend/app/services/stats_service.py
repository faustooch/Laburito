# app/services/stats_service.py
from sqlalchemy.orm import Session
from app.repositories import stats_repository
from app.models.user import Role
from app.schemas.stats import SystemStatsResponse


def get_general_stats(db: Session) -> SystemStatsResponse:
    workers = stats_repository.get_user_count_by_role(db, Role.WORKER)
    clients = stats_repository.get_user_count_by_role(db, Role.CLIENT)

    return SystemStatsResponse(
        workers=workers,
        clients=clients
    )