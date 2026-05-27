"""HTTP routes for random user generation."""

from fastapi import APIRouter

from app.modules.users.schemas import RandomUser
from app.modules.users.service import generate_random_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get(
    "/random",
    response_model=RandomUser,
    summary="Generate a random Chinese-style user",
    description=(
        "Returns a fabricated user with a Chinese name (characters + pinyin), "
        "a generated email of the form `<pinyin><digits>@126.com`, and a title. "
        "Useful for filling forms during demos. No data is persisted."
    ),
)
def random_user() -> RandomUser:
    return generate_random_user()
