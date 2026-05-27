"""Random Chinese-style user generator."""

import random

from faker import Faker
from pypinyin import Style, pinyin

from app.modules.users.schemas import RandomUser

_fake = Faker("zh_CN")
_EMAIL_DOMAIN = "126.com"


def _to_pinyin(text: str) -> str:
    return "".join(item[0] for item in pinyin(text, style=Style.NORMAL))


def generate_random_user() -> RandomUser:
    last_name = _fake.last_name()
    first_name = _fake.first_name()
    first_pinyin = _to_pinyin(first_name)
    last_pinyin = _to_pinyin(last_name)
    email = f"{first_pinyin}{random.randint(1000, 9999)}@{_EMAIL_DOMAIN}"
    return RandomUser(
        first_name=first_name,
        last_name=last_name,
        email=email,
        first_name_pinyin=first_pinyin,
        last_name_pinyin=last_pinyin,
        title=random.choice(["Mr.", "Ms."]),
    )
