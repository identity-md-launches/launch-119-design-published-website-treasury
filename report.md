# AssetFold ($AFOLD): protocol design and 12-month forward model

**As of 2026-09-23 · Parts A and B · not legal, investment, or tax advice**

## Executive answer

**Verdict: works under conditions.** AssetFold can compound real fees into diversified protocol-owned liquidity only if its canonical AFOLD/IMD pool sustains roughly **$0.41M–$0.56M of monthly AFOLD volume** under the modeled conditions, eligible asset pools exist, and conversions can clear without exceeding the price-impact cap. It does not work merely because assets are “long-lived.” If token trading fades, fee income approaches zero while costs and LP losses remain: the fade scenario ends month 12 at **$93,883**, below the assumed $100,000 start. This is a forward scenario model, not a backtest or return promise.

The design answers the five prior-job problems directly:

1. **Too little history:** no historical performance claim; all twelve-month economics are labeled assumptions and five scenarios are shown.
2. **A hook governs only its pool:** “every trade” is narrowed to every swap in the immutable canonical AFOLD/IMD pool. Incentives and official routing favor it, but no claim is made that third-party pools can be prevented.
3. **Thin IMD liquidity:** conversions are batched, impact-capped, and allowed to remain unconverted. Treasury growth pauses rather than forcing a bad trade.
4. **Income depends on token volume:** the model exposes volume and a monthly break-even volume; the fade scenario is a failure case.
5. **Legal risk:** earnings are retained in protocol-owned liquidity. There is no holder dividend, promised yield, or buyback-and-burn policy. Counsel and product eligibility remain launch gates.

## What is fact, input, assumption, and inference

- **SOURCED FACT:** Robinhood describes its chain as a permissionless, EVM-compatible Arbitrum L2 designed for tokenized real-world assets, with chain ID 4663 ([sources 1–2](sources.md)). Uniswap documents that hooks attach to pools and run around pool actions ([source 3](sources.md)).
- **PRIOR-JOB INPUT:** mainnet launched 2026-07-01; only ~84 days are available; the observed Robinhood Chain IMD pool was about $7,000 with near-zero daily volume; and the named competitor set exists. These are supplied premises, not re-measured here.
- **ASSUMPTION:** every economic number in `model.py`, including starting capital, volumes, fee capture, returns, losses, costs, and pool ownership.
- **INFERENCE:** retained earnings likely create less investment-contract signaling than direct holder payments or programmatic buybacks. It does not eliminate legal risk; the managed treasury and tokenized securities may create additional regimes ([sources 7–9](sources.md)).
- **UNANSWERED:** which tokenized assets are legally accessible to the contracts and target users; whether their issuers permit AMM use; actual mainnet depth; audit results; tax treatment; and NetNet's documented mechanism.

## A1. Launch

**Fixed maximum supply: 1,000,000,000 AFOLD; no mint function.**

| Allocation | Tokens | Share | Constraint |
|---|---:|---:|---|
| Canonical AFOLD/IMD POL | 700,000,000 | 70% | Deposited at launch; position owned by a non-upgradeable timelock/locker; no discretionary withdrawal, only fee collection and range migration under published rules |
| Treasury inventory | 250,000,000 | 25% | 24-month cliff; afterward usable only to pair as protocol-owned liquidity, never payroll or market sale |
| IMD swarm contributors | 50,000,000 | 5% | 12-month cliff, then linear vest over 36 months; public beneficiary schedule |
| **Total** | **1,000,000,000** | **100%** | Fixed forever |

There is no separate team share beyond the disclosed 5% contributor allocation and no emissions. The IMD side is contributed at launch; the model assumes $50,000 of the $100,000 opening treasury value is the IMD-side liquidity component. That is an assumption, not committed financing. Launch must be canceled if the opening AFOLD/IMD pool is below **$50,000 TVL**; launching into the prior observed ~$7,000 depth would contradict this design.

Justification: 70% makes the canonical market the deepest intended route; permanent POL removes a liquidity-withdrawal option; long vesting reduces immediate supply pressure. The reserve exists only to pair future fee-funded assets and cannot be treated as treasury NAV.

## A2. Hook fee

The canonical pool uses a **static 0.30% hook fee plus a 0.30% Uniswap LP fee: 0.60% total before gas and route fees**. The hook fee is charged on every canonical-pool swap, in the input asset. The rate cannot be raised; governance may reduce it only after a 14-day timelock.

A dynamic fee would add oracle, governance, and user-predictability risk before sufficient history exists. A fixed 30 bp hook fee is easy to quote and audit. The model further assumes the treasury owns 90% of active canonical liquidity, so effective modeled capture is `0.30% + 90% × 0.30% = 0.57%` of canonical dollar volume. This 90% is an assumption and must be replaced with measured ownership in any live dashboard.

## A3. Canonical routing and thin-IMD conversion

A hook cannot bind pools it is not attached to. The mechanism therefore uses alignment, not a false monopoly claim:

- The immutable canonical AFOLD/IMD pool is the only pool linked from official interfaces and the only AFOLD pool receiving treasury liquidity.
- The published token list and router prefer the canonical pool; aggregators receive verified pool metadata. There are no rebates or emissions.
- Governance never seeds, recognizes, or routes treasury orders to another AFOLD pool. Anyone may still create one; the protocol cannot stop it.
- The website must say: **“Every canonical-pool swap routes through IMD,”** never “every AFOLD trade routes through IMD.”

Fee conversion is a guarded process:

1. Accrue fees in-kind; do not market-sell on every swap.
2. Once weekly, a permissionless keeper seeks a time-weighted route or sealed batch/RFQ.
3. A conversion may use at most **2% of the trailing seven-day IMD pool TVL per week**, must quote **≤0.50% price impact**, and must be within **1.0% of a 30-minute TWAP**.
4. Prefer direct in-kind pairing: match IMD receipts with AFOLD treasury inventory to deepen the canonical pool. Convert only the portion needed for eligible asset pools.
5. If no route passes, retain IMD and disclose “conversion pending.” There is no deadline and no OTC counterparty exemption from the same price check.

At $7,000 liquidity, the 2% cap is only $140/week. That makes deployment slow by design. The answer to thin liquidity is not a heroic price-impact assumption; it is to wait, add paired IMD liquidity, or not deploy.

## A4. Treasury allocation and entry gates

Target weights apply to deployable treasury NAV, including idle USDG. “Commodity” in this design includes crypto majors as required by the concept.

| Sleeve | Target | LP range around reference price | Class cap |
|---|---:|---:|---:|
| USDG / cash buffer | 20% | Not concentrated unless paired; ≥15% must remain idle | 30% stablecoins |
| BTC | 20% | ±20% | 35% crypto majors |
| ETH | 10% | ±20% | included above |
| Tokenized gold | 15% | ±12% | 20% metals |
| Tokenized S&P 500 ETF | 15% | ±15% | 35% equity ETFs |
| Tokenized Nasdaq-100 ETF | 10% | ±18% | included above |
| Tokenized Apple | 5% | ±18% | 5% per single stock |
| Tokenized Microsoft | 5% | ±18% | 5% per single stock |

These are target exposures, not assertions that eligible Robinhood Chain tokens currently exist. A pool enters only after all gates pass for 30 consecutive days: issuer and contract verified; transferable and AMM use permitted; independent legal memo; no freeze/redemption anomaly; **≥$250,000 TVL**, **≥$50,000 median daily volume**, at least 30 days of observations, a reliable reference price, and a quoted $5,000 exit at ≤1% impact. Until then its weight stays in USDG. No memecoin or crypto asset outside BTC/ETH is eligible.

Rebalance when an asset is more than **5 percentage points** off target, its position leaves range, or a gate fails. Use fee cash first; sell only through the same 50 bp impact guard. Check weekly, execute no more than 10% of treasury NAV per week. This reduces churn; it cannot eliminate LP loss.

## A5. Risk rules

- **Position caps:** the table's class caps; 20% per asset except 5% per single stock; 10% per pool; 20% per issuer/custodian; 30% aggregate exposure to contracts sharing one bridge or oracle.
- **Closed underlying markets:** from 30 minutes before the referenced equity market closes until 30 minutes after it reopens, remove 50% of each single-stock/ETF position to USDG and widen the remainder to ±30%. During weekends, no new equity range is opened. If the on-chain/reference gap exceeds 2%, remove all remaining active equity liquidity until 30 minutes after the underlying reopens and the gap is below 1% for 15 minutes.
- **Oracle/depeg:** halt a pool when two independent references disagree by >1%, or a stablecoin is outside $0.99–$1.01 for 15 minutes.
- **Drawdown:** at 20% below treasury high-water mark, stop new deployments and withdraw all removable active liquidity to approved stablecoins. At 30%, enter recovery mode: fee collection only; restarting requires a 14-day timelock, public incident report, and re-passing every gate.
- **Contracts:** non-upgradeable core where possible; otherwise 48-hour timelock, multisig with independent signers, audit, bug bounty, and permissionless emergency pause limited to stopping new positions—not transferring treasury assets.

## A6. Use of income and legal posture

| Use | Design choice | Economic effect | Relative legal/regulatory concern |
|---|---|---|---|
| Reinvest in eligible asset POL | **60%** | Broadens fee base | Lowest of four, but managed-vault and tokenized-security issues remain |
| Add AFOLD/IMD liquidity | **30%** | Deepens canonical route without forced IMD selling | Low-to-medium; still managerial activity intended to improve the network |
| Operating/audit reserve | **10%** | Pays keepers, audits, legal and incident response | Ordinary expense; transparent caps required |
| Buyback and burn | **0%** | Could support token price | Higher signaling risk; rejected |
| Pay holders/stakers | **0%** | Direct cash yield | Highest expectation-of-profit/distribution risk; rejected |

All three selected buckets remain protocol-owned. “Lowest” is relative, not “safe.” SEC materials make the analysis facts-and-circumstances based, and a vault allocating to securities can raise investment-company questions ([sources 7–9](sources.md)). Launch requires advice in every offered jurisdiction. The token must not be marketed as ownership of treasury assets or a claim on income.

## A7. Name, ticker, and lore

**Selected: AssetFold ($AFOLD).** It states the function without memecoin framing and leaves room for stocks, metals, and crypto majors.

Ticker checks on 2026-09-23 found no exact AFOLD listing in CoinGecko, CoinMarketCap, or DexScreener searches ([source 15](sources.md)). This is a point-in-time search result, not proof of uniqueness or a reservation. Symbols are non-unique; check all three again at deployment and identify the asset by chain and contract address.

**Lore (8 sentences).** AssetFold began with a simple refusal: a treasury should not survive by printing another token. It folds each real trading fee back into markets intended to outlast a season. Its first fold is IMD, the root pair that gives the IdentityMD ecosystem deeper ground on Robinhood Chain. The next folds spread risk across Bitcoin, Ether, gold, broad equity baskets, and only the largest individual companies. Some folds will go out of range, and some assets will fail their gates; the book shows both. When the old markets sleep, AssetFold pulls in its edges rather than pretending the gap cannot happen. No holder is promised a dividend, a burn, or a rescue bid. The artifact is the point: public contracts, public rules, and a public ledger of what the IMD swarm can build.

## A8. Comparison with existing projects

| Project | What public materials say | Difference from AssetFold | Is AssetFold better? |
|---|---|---|---|
| SHROOM | Stock-token liquidity network; MU rewards; treasury fees buy back/burn SHROOM ([source 10](sources.md)) | AFOLD starts paired to IMD, diversifies beyond stocks, and retains income without rewards/burn | Lower distribution/signaling exposure and broader risk spread; SHROOM may be better at existing traction and holder incentives |
| Twofold | DualPool combines pool fees with USDG vault yield and uses managed market-hours controls; TWO staking ([source 11](sources.md)) | AFOLD does not add lending-vault risk or pay stakers; it owns diversified liquidity | Simpler dependency stack; Twofold may use idle dollars more efficiently |
| What The Hook | Captures cross-pool arbitrage and shares realized profit with LPs, treasury, referrer and swapper ([source 12](sources.md)) | AFOLD charges a fixed canonical swap fee and deploys a treasury; it does not claim MEV innovation | Not better at execution efficiency; different objective |
| Pons | Token launch and trading infrastructure with standardized launch mechanics ([source 13](sources.md)) | AFOLD is a single treasury protocol, not a launchpad | Not a direct substitute |
| PipePad | Fixed-supply launches paired with PIPEDOG; locks liquidity and routes fees ([source 14](sources.md)) | AFOLD is IMD-paired and deploys fees into gated long-lived-asset pools | More specific treasury mandate; PipePad is better for repeat launches |
| NetNet | **UNANSWERED:** no adequate primary public mechanism documentation located | Cannot make a responsible mechanism comparison | No “better” claim |

The supplied competitor list also names Pons as a project and “NetNet”; the table does not manufacture details where primary documentation was not found. The proposed protocol is not categorically better. Its defensible differentiators are IMD-first routing, explicit conversion throttles, diversified gated POL, market-close controls, and no holder distribution/buyback.

## B. Model specification

`model.py` uses only Python's standard library and writes `data/scenarios.csv`. It runs five named scenarios for 12 monthly steps and outputs, per month: token volume, treasury value, gross income, costs, market P&L, LP loss, IMD shock, monthly and cumulative IMD liquidity added, and break-even token volume.

### Assumptions

| Input | Assumption | Why it is not presented as fact |
|---|---:|---|
| Opening treasury NAV | $100,000 | No committed raise or deposits supplied |
| Initial IMD component | $50,000 | Launch capitalization choice |
| Hook / LP fee | 0.30% / 0.30% | Design parameters |
| Treasury canonical LP share | 90% | Future market ownership unknown |
| Asset-pool volume | $2.0M/month | Eligible pools and live volume unknown |
| Treasury share of asset LP | 5% | Future position share unknown |
| Asset-pool LP fee | 0.30% | Simplification across pools |
| Operating cost | $2,500/month | Keeper, audit and administration estimate |
| Income allocation to IMD liquidity | 30% of positive net income | Design rule |

Scenario-specific assumptions:

| Scenario | Initial token volume | Monthly volume path | Market return/mo | LP-loss drag/mo | Extra shock |
|---|---:|---:|---:|---:|---|
| Base | $2.0M | +2% | +0.3% | 0.15% | None |
| Bull | $3.0M | +8% | +1.5% | 0.25% | None |
| Bear | $1.0M | −5% | −1.5% | 0.80% | None |
| Token trading fades | $2.0M | 70%, 40%, 10% of start in months 1–3; then flat | 0% | 0.30% | None |
| IMD price falls 70% | $2.0M | +2% | −0.5% | 0.30% | $35,000 loss in each? No: **$35,000 total**, spread equally over months 1–3, equal to 70% of the $50,000 initial IMD component |

The asset fee contribution is `$2,000,000 × 0.30% × 5% = $300/month`. Gross token-fee income is `token volume × 0.57%`. Treasury NAV evolves as:

`prior NAV + market return − LP loss − IMD shock + gross income − operating cost`

Break-even token volume is recalculated monthly:

`max(0, (LP loss + operating cost − asset LP income) / 0.57%)`

“Break-even” covers modeled LP loss and operating costs only. It does not guarantee preservation of NAV under negative market returns or shocks.

### Results

| Scenario | Month-12 treasury | Month-12 gross income | Total IMD liquidity added | Month-12 break-even volume |
|---|---:|---:|---:|---:|
| Base | $229,307 | $14,474 | $37,949 | $443,072 |
| Bull | $431,661 | $40,171 | $89,433 | $556,634 |
| Bear | $97,936 | $3,542 | $7,800 | $525,157 |
| Token trading fades | $93,883 | $1,440 | $2,442 | $436,085 |
| IMD price falls 70% | $179,867 | $14,474 | $37,949 | $475,042 |

The first-month break-even is $412,281 in base and $526,316 in bear; across the saved paths it ranges roughly $0.41M–$0.56M/month. In the fade case, month-3 and later token volume is $200,000—well below break-even—and positive net income stops, so no additional IMD liquidity is allocated after month 2. In the IMD shock case, the model loses $35,000 over three months rather than pretending diversification makes the initial pair immune.

These results are arithmetic consequences of assumptions, not evidence that volume will occur. The bull result is especially sensitive to compounding a +1.5% monthly asset return and +8% monthly token-volume growth. The CSV, rather than rounded report figures, is authoritative.

## Failure conditions and go/no-go gates

Do not launch unless all are true: audited hook and treasury contracts; ≥$50,000 canonical opening TVL; legal clearance for token distribution and each asset type; at least two asset pools pass every entry gate; a live conversion quote passes the 50 bp impact rule; and six months of operating costs are funded without relying on token fees.

Pause expansion when rolling three-month canonical volume is below the modeled break-even level, conversion backlog exceeds 10% of treasury NAV, or fewer than two non-correlated assets pass gates. Wind down removable positions if the 30% drawdown circuit breaker fires or legal/product access is withdrawn. Permanent canonical liquidity may not be recoverable; that is intentional and must be disclosed.

## Reproducibility and limits

Run:

```sh
python3 model.py
```

The script deterministically rewrites `data/scenarios.csv` with 60 rows. It performs no network, RPC, or package call. Public sources support chain, AMM, product, legal-context, and competitor descriptions; they do not support the modeled returns. The greatest unanswered empirical questions are sustainable AFOLD volume, eligible asset-pool depth, real conversion capacity, and realized LP loss. Those should become measured dashboard inputs after launch, not retrofitted claims about this scenario model.
