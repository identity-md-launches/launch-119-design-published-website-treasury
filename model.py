#!/usr/bin/env python3
"""Forward scenario model for AssetFold. Standard library only.

This is deliberately not a backtest: Robinhood Chain does not have twelve months
of mainnet history as of the model date. All economic inputs below are assumptions.
Run: python3 model.py
"""

from __future__ import annotations

import csv
from pathlib import Path

MONTHS = 12
OUTPUT = Path(__file__).with_name("data") / "scenarios.csv"

# ASSUMPTIONS. Dollar values are USD-equivalent.
INITIAL_TREASURY = 100_000.0
INITIAL_IMD_LIQUIDITY_COMPONENT = 50_000.0
HOOK_FEE = 0.0030
CANONICAL_LP_FEE = 0.0030
TREASURY_SHARE_OF_CANONICAL_LP = 0.90
EFFECTIVE_TOKEN_FEE_CAPTURE = HOOK_FEE + CANONICAL_LP_FEE * TREASURY_SHARE_OF_CANONICAL_LP
ASSET_POOL_MONTHLY_VOLUME = 2_000_000.0
ASSET_POOL_FEE = 0.0030
TREASURY_SHARE_OF_ASSET_LP = 0.05
MONTHLY_OPERATING_COST = 2_500.0
IMD_LIQUIDITY_SHARE_OF_NET_INCOME = 0.30

SCENARIOS = {
    # initial token volume, monthly growth, treasury asset return, LP-loss drag
    "base": (2_000_000.0, 0.02, 0.003, 0.0015),
    "bull": (3_000_000.0, 0.08, 0.015, 0.0025),
    "bear": (1_000_000.0, -0.05, -0.015, 0.0080),
    "token_trading_fades": (2_000_000.0, 0.00, 0.000, 0.0030),
    "imd_price_falls_70pct": (2_000_000.0, 0.02, -0.005, 0.0030),
}


def token_volume(name: str, month: int, initial: float, growth: float) -> float:
    """Monthly token trading volume; fade reaches -90% in month 3."""
    if name == "token_trading_fades":
        return initial * ({1: 0.70, 2: 0.40, 3: 0.10}.get(month, 0.10))
    return initial * (1.0 + growth) ** (month - 1)


def imd_shock(name: str, month: int) -> float:
    """Dollar loss on the initial IMD component: 70% linearly over 3 months."""
    if name == "imd_price_falls_70pct" and month <= 3:
        return INITIAL_IMD_LIQUIDITY_COMPONENT * 0.70 / 3.0
    return 0.0


def run() -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    for name, (initial_volume, growth, asset_return, lp_loss_rate) in SCENARIOS.items():
        treasury = INITIAL_TREASURY
        cumulative_imd_added = 0.0
        for month in range(1, MONTHS + 1):
            volume = token_volume(name, month, initial_volume, growth)
            token_fee_income = volume * EFFECTIVE_TOKEN_FEE_CAPTURE
            asset_lp_income = ASSET_POOL_MONTHLY_VOLUME * ASSET_POOL_FEE * TREASURY_SHARE_OF_ASSET_LP
            gross_income = token_fee_income + asset_lp_income
            lp_loss = treasury * lp_loss_rate
            market_pnl = treasury * asset_return
            shock = imd_shock(name, month)
            net_income = gross_income - MONTHLY_OPERATING_COST
            imd_added = max(0.0, net_income) * IMD_LIQUIDITY_SHARE_OF_NET_INCOME
            cumulative_imd_added += imd_added
            # Income is retained. Costs, LP drag and market/shock P&L change NAV.
            treasury = max(0.0, treasury + market_pnl - lp_loss - shock + net_income)
            loss_and_cost = lp_loss + MONTHLY_OPERATING_COST
            breakpoint = max(0.0, (loss_and_cost - asset_lp_income) / EFFECTIVE_TOKEN_FEE_CAPTURE)
            rows.append({
                "scenario": name,
                "month": str(month),
                "token_volume_usd": f"{volume:.2f}",
                "treasury_value_usd": f"{treasury:.2f}",
                "gross_income_usd": f"{gross_income:.2f}",
                "operating_cost_usd": f"{MONTHLY_OPERATING_COST:.2f}",
                "market_pnl_usd": f"{market_pnl:.2f}",
                "lp_loss_usd": f"{lp_loss:.2f}",
                "imd_price_shock_usd": f"{shock:.2f}",
                "imd_liquidity_added_usd": f"{imd_added:.2f}",
                "cumulative_imd_liquidity_added_usd": f"{cumulative_imd_added:.2f}",
                "break_even_token_volume_usd": f"{breakpoint:.2f}",
            })
    return rows


def main() -> None:
    rows = run()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
    print(f"wrote {len(rows)} rows to {OUTPUT}")


if __name__ == "__main__":
    main()
