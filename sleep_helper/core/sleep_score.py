from ..schemas import SleepInput, SleepOutput
from datetime import datetime, timedelta


def _score_duration(tst_min: int) -> float:
    if tst_min <= 0:
        return 0
    
    optimal_range = (420, 540)
    if optimal_range[0] <= tst_min <= optimal_range[1]:
        return 100
    
    if tst_min < optimal_range[0]:
        return max(0, (tst_min / optimal_range[0]) * 100)
    
    excess = tst_min - optimal_range[1]
    if excess <= 60:
        return 100 - (excess / 60) * 20
    else:
        return max(0, 80 - ((excess - 60) / 60) * 40)


def _score_efficiency(tst_min: int, time_in_bed_min: int) -> float:
    if time_in_bed_min <= 0:
        return 0
    
    efficiency = tst_min / time_in_bed_min
    
    if efficiency >= 0.95:
        return 100
    elif efficiency >= 0.90:
        return 90
    elif efficiency >= 0.85:
        return 80
    elif efficiency >= 0.75:
        return 60
    else:
        return max(0, efficiency * 80)


def _score_continuity(waso_min: int, awakenings: int) -> float:
    waso_score = 100
    if waso_min > 60:
        waso_score = 0
    elif waso_min > 30:
        waso_score = 50
    elif waso_min > 20:
        waso_score = 75
    elif waso_min > 10:
        waso_score = 90
    
    awakenings_score = 100
    if awakenings >= 5:
        awakenings_score = 30
    elif awakenings >= 3:
        awakenings_score = 60
    elif awakenings >= 2:
        awakenings_score = 80
    elif awakenings == 1:
        awakenings_score = 95
    
    return (waso_score * 0.6 + awakenings_score * 0.4)


def _score_sleep_stages(deep_min: int | None, rem_min: int | None, tst_min: int) -> float:
    if tst_min <= 0:
        return 50
    
    deep_pct = (deep_min or 0) / tst_min if deep_min else None
    rem_pct = (rem_min or 0) / tst_min if rem_min else None
    
    if deep_pct is None and rem_pct is None:
        return 50
    
    score = 50
    
    if deep_pct is not None:
        if 0.15 <= deep_pct <= 0.25:
            score += 30
        elif 0.10 <= deep_pct < 0.15 or 0.25 < deep_pct <= 0.30:
            score += 15
        elif deep_pct < 0.10:
            score -= 10
        elif deep_pct > 0.30:
            score += 10
    
    if rem_pct is not None:
        if 0.20 <= rem_pct <= 0.25:
            score += 20
        elif 0.15 <= rem_pct < 0.20 or 0.25 < rem_pct <= 0.30:
            score += 10
        elif rem_pct < 0.15:
            score -= 10
        elif rem_pct > 0.30:
            score += 5
    
    return max(0, min(100, score))


def _get_recommendations(
    efficiency: float,
    waso_min: int,
    awakenings: int,
    deep_pct: float | None,
    rem_pct: float | None,
    caffeine_after_14: bool,
    tst_min: int
) -> list[str]:
    recommendations = []
    
    if efficiency < 0.85:
        recommendations.append("Improve sleep efficiency by reducing time awake in bed. If you can't fall asleep within 15-20 minutes, get up and do something relaxing.")
    
    if waso_min > 20:
        recommendations.append(f"Reduce wake time after sleep onset ({waso_min} min). Avoid screens 1 hour before bed and heavy meals 2-3 hours before sleep.")
    
    if awakenings >= 3:
        recommendations.append(f"Minimize sleep interruptions ({awakenings} awakenings). Consider limiting evening fluids, avoiding alcohol, and ensuring a comfortable sleep environment.")
    
    if tst_min < 420:
        recommendations.append(f"Increase total sleep time ({tst_min//60}h {tst_min%60}min). Aim for 7-9 hours of sleep for optimal rest.")
    elif tst_min > 540:
        recommendations.append(f"Your sleep duration ({tst_min//60}h {tst_min%60}min) is longer than optimal. Consider if you're getting enough quality rest.")
    
    if deep_pct is not None and deep_pct < 0.15:
        recommendations.append("Increase deep sleep by getting regular exercise, maintaining a consistent sleep schedule, and avoiding late-evening meals.")
    
    if rem_pct is not None and rem_pct < 0.15:
        recommendations.append("Improve REM sleep by maintaining consistent bedtimes and wake times, even on weekends.")
    
    if caffeine_after_14:
        recommendations.append("Avoid caffeine after 2 PM to prevent sleep disruption and improve sleep quality.")
    
    if not recommendations:
        recommendations.append("Excellent sleep! Maintain your current healthy sleep habits.")
    
    return recommendations


def _calculate_time_in_bed_min(bedtime: str, wake_time: str) -> int:
    bedtime_dt = datetime.strptime(bedtime, '%H:%M')
    wake_dt = datetime.strptime(wake_time, '%H:%M')
    
    if wake_dt < bedtime_dt:
        wake_dt += timedelta(days=1)
    
    time_diff = wake_dt - bedtime_dt
    return int(time_diff.total_seconds() / 60)


def calculate_sleep_score(sleep_input: SleepInput) -> SleepOutput:
    time_in_bed_min = _calculate_time_in_bed_min(sleep_input.bedtime, sleep_input.wake_time)
    
    if time_in_bed_min <= 0:
        raise ValueError("Wake time must be after bedtime")
    
    efficiency = sleep_input.tst_min / time_in_bed_min if time_in_bed_min > 0 else 0
    
    deep_pct = None
    rem_pct = None
    if sleep_input.tst_min > 0:
        if sleep_input.deep_min is not None:
            deep_pct = sleep_input.deep_min / sleep_input.tst_min
        if sleep_input.rem_min is not None:
            rem_pct = sleep_input.rem_min / sleep_input.tst_min
    
    duration_score = _score_duration(sleep_input.tst_min)
    efficiency_score = _score_efficiency(sleep_input.tst_min, time_in_bed_min)
    continuity_score = _score_continuity(sleep_input.waso_min, sleep_input.awakenings)
    stages_score = _score_sleep_stages(sleep_input.deep_min, sleep_input.rem_min, sleep_input.tst_min)
    
    lifestyle_penalty = 0
    if sleep_input.caffeine_after_14:
        lifestyle_penalty = 5
    
    weighted_score = (
        duration_score * 0.25 +
        efficiency_score * 0.30 +
        continuity_score * 0.30 +
        stages_score * 0.15
    ) - lifestyle_penalty
    
    final_score = max(0, min(100, round(weighted_score)))
    
    if final_score >= 85:
        quality = "excellent"
        description = "You had an excellent night's sleep — restorative and efficient."
    elif final_score >= 70:
        quality = "good"
        description = "Your sleep quality is good, though there's room for optimization."
    elif final_score >= 50:
        quality = "fair"
        description = "Your sleep was somewhat disturbed or insufficient."
    else:
        quality = "poor"
        description = "Your sleep quality was low - likely fragmented or too short."
    
    recommendations = _get_recommendations(
        efficiency,
        sleep_input.waso_min,
        sleep_input.awakenings,
        deep_pct,
        rem_pct,
        sleep_input.caffeine_after_14,
        sleep_input.tst_min
    )
    
    explanation_parts = [
        f"Duration: {sleep_input.tst_min//60}h {sleep_input.tst_min%60}min",
        f"Efficiency: {efficiency:.1%}",
        f"WASO: {sleep_input.waso_min}min",
        f"Awakenings: {sleep_input.awakenings}"
    ]
    if deep_pct is not None:
        explanation_parts.append(f"Deep sleep: {deep_pct:.1%}")
    if rem_pct is not None:
        explanation_parts.append(f"REM: {rem_pct:.1%}")
    if sleep_input.caffeine_after_14:
        explanation_parts.append("Caffeine after 14:00")
    
    explanation = " | ".join(explanation_parts)
    
    return SleepOutput(
        sleep_quality=quality,
        sleep_quality_score=final_score,
        sleep_quality_description=description,
        sleep_quality_recommendations=recommendations,
        sleep_quality_score_explanation=explanation,
        sleep_quality_score_recommendations=recommendations
    )
