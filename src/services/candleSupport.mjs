export const CANDLE_CAPABILITY_IDS = Object.freeze({
  "1d": "marketData.domesticStock.dailyCandles",
  "1w": "marketData.domesticStock.weeklyCandles",
  "1mo": "marketData.domesticStock.monthlyCandles",
  minute: "marketData.domesticStock.minuteCandles",
});

const PERIOD_ALIASES = Object.freeze({
  "1d": "1d", d: "1d", day: "1d", daily: "1d",
  "1w": "1w", w: "1w", week: "1w", weekly: "1w",
  "1mo": "1mo", mo: "1mo", month: "1mo", monthly: "1mo",
});

const WEEKLY_PERIOD_CODES = Object.freeze({ ls: "3", kis: "W" });

export function weeklyPeriodCode(broker) {
  return WEEKLY_PERIOD_CODES[broker] ?? "W";
}

export function classifyCandleInterval(input) {
  if (input == null) {
    return { kind: "unsupported", interval: null, minutes: null };
  }

  const raw = String(input).trim().toLowerCase();
  const period = PERIOD_ALIASES[raw];
  if (period) {
    return { kind: "period", interval: period, minutes: null };
  }

  const minuteMatch = raw.match(/^(\d+)(?:m|min)$/);
  if (minuteMatch) {
    const minutes = Number(minuteMatch[1]);
    if (Number.isInteger(minutes) && minutes > 0) {
      return { kind: "minute", interval: `${minutes}m`, minutes };
    }
  }

  return { kind: "unsupported", interval: null, minutes: null };
}
