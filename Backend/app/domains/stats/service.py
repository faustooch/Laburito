# app/services/stats_service.py
from sqlalchemy.orm import Session
from app.domains.stats import repository as stats_repository
from app.domains.users.models import Role
from app.domains.stats.schemas import SystemStatsResponse


def get_general_stats(db: Session) -> SystemStatsResponse:
    workers = stats_repository.get_user_count_by_role(db, Role.WORKER)
    clients = stats_repository.get_user_count_by_role(db, Role.CLIENT)

    return SystemStatsResponse(
        workers=workers,
        clients=clients
    )