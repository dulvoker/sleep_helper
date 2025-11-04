from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime


class SleepInput(BaseModel):
    bedtime: str
    wake_time: str
    tst_min: int
    waso_min: int
    awakenings: int
    deep_min: Optional[int] = None
    rem_min: Optional[int] = None
    caffeine_after_14: bool = False
    
    @field_validator('bedtime', 'wake_time', mode='before')
    @classmethod
    def validate_time_format(cls, v: str) -> str:
        try:
            datetime.strptime(v, '%H:%M')
            return v
        except ValueError:
            raise ValueError('Time must be in HH:MM format (e.g., "23:30" or "07:00")')

class SleepOutput(BaseModel):
    sleep_quality: str
    sleep_quality_score: int
    sleep_quality_description: str
    sleep_quality_recommendations: list[str]
    sleep_quality_score_explanation: str
    sleep_quality_score_recommendations: list[str]