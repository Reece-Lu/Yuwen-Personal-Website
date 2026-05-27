"""Pydantic schemas for the random user module."""

from pydantic import BaseModel, EmailStr, Field


class RandomUser(BaseModel):
    """A fabricated Chinese-style user, with name in both Chinese characters and pinyin."""

    first_name: str = Field(..., description="Given name in Chinese characters.", examples=["伟"])
    last_name: str = Field(..., description="Family name in Chinese characters.", examples=["张"])
    email: EmailStr = Field(..., description="Generated email of the form <pinyin><digits>@126.com.")
    first_name_pinyin: str = Field(..., description="Given name in pinyin.", examples=["wei"])
    last_name_pinyin: str = Field(..., description="Family name in pinyin.", examples=["zhang"])
    title: str = Field(..., description="Either 'Mr.' or 'Ms.'.", examples=["Mr."])
