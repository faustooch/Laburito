from fastapi import APIRouter

router = APIRouter()

@router.get("/professions")
def get_professions():
    """Oficios hardcodeados por el momento, en el futuro se podrían agregar a la base de datos..."""
    return [
        {"id": 1, "name": "Albañilería"},
        {"id": 2, "name": "Carpintería"},
        {"id": 3, "name": "Cerrajería"},
        {"id": 4, "name": "Electricidad"},
        {"id": 5, "name": "Fletes y Mudanzas"},
        {"id": 6, "name": "Herrería"},
        {"id": 7, "name": "Jardinería"},
        {"id": 8, "name": "Limpieza"},
        {"id": 9, "name": "Pintura"},
        {"id": 10, "name": "Plomería"},
        {"id": 11, "name": "Reparación de PC"},
        {"id": 12, "name": "Refrigeración (Aires)"},
        {"id": 13, "name": "Otro"}
    ]