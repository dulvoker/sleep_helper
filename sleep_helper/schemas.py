from pydantic import BaseModel
from typing import Optional


class SleepInput(BaseModel):
    time_in_bed_min: int
    tst_min: int
    waso_min: int
    awakenings: int
    deep_min: Optional[int] = None
    rem_min: Optional[int] = None
    caffeine_after_14: bool = False

class SleepOutput(BaseModel):
    sleep_quality: str
    sleep_quality_score: int
    sleep_quality_description: str
    sleep_quality_recommendations: list[str]
    sleep_quality_score_explanation: str
    sleep_quality_score_recommendations: list[str]