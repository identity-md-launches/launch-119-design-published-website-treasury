# Sources

Checked 2026-09-23. Sources are public web pages; the model makes no RPC or blockchain query.

1. Robinhood, [About Robinhood Chain](https://docs.robinhood.com/chain/): permissionless EVM-compatible Arbitrum L2 aimed at tokenized real-world assets; ETH gas.
2. Robinhood, [Connecting to Robinhood Chain](https://docs.robinhood.com/chain/connecting/): mainnet chain ID 4663 and network endpoints. This establishes that mainnet exists, not its launch date.
3. Uniswap, [v4 Hooks concepts](https://docs.uniswap.org/contracts/v4/concepts/hooks): hooks are contracts attached to individual v4 pools and can execute around pool actions.
4. Uniswap, [Dynamic fees](https://docs.uniswap.org/contracts/v4/concepts/dynamic-fees): a pool can use a dynamic fee when configured at initialization.
5. Uniswap, [v3 concentrated liquidity](https://docs.uniswap.org/concepts/protocol/concentrated-liquidity): LP capital is active only in selected price ranges and can become single-sided outside range. Used only for mechanism/risk context; the chosen widths are assumptions.
6. Robinhood, [Stock Tokens](https://robinhood.com/eu/en/support/articles/about-stock-tokens/): stock tokens are derivatives, are not the underlying shares, and have different trading hours/risks. Availability and exact product terms must be checked before deployment.
7. SEC, [Transactions Involving Crypto Assets](https://www.sec.gov/resources-small-businesses/capital-raising-building-blocks/transactions-involving-crypto-assets) (2026): an offer/sale can be an investment contract where purchasers reasonably expect profit from essential managerial efforts. This is not a legal opinion on AssetFold.
8. SEC Commissioner Peirce, [Headstands and Summervaults](https://www.sec.gov/newsroom/speeches-statements/peirce-statement-crypto-vaults-lending-strategies-072226) (2026): a managed crypto vault and a vault allocating to securities can raise securities and investment-company issues. A commissioner statement is not a rule.
9. SEC staff, [Statement on Tokenized Securities](https://www.sec.gov/newsroom/speeches-statements/corp-fin-statement-tokenized-securities-012826-statement-tokenized-securities) (2026): tokenized securities remain securities and wrapper structures differ.
10. SHROOM, [project site](https://www.shroomnetwork.com/): describes fixed supply, stock-token pairs, MU holder rewards, and fee-funded SHROOM buyback/burn.
11. Twofold, [docs](https://twofold.fi/docs.html): describes DualPool liquidity, USDG vault integration, managed market-hours risk, and TWO staking.
12. What The Hook, [project site](https://www.whatthehook.io/): describes capturing cross-pool arbitrage and splitting realized profit among LPs, treasury, referrer, and swapper.
13. Pons, [documentation](https://docs.ponsfamily.com/): describes a token launch/trading interface, fixed supply launch mechanics, pool fees, and risks.
14. PipePad, [field manual](https://pipepad.fun/docs): describes fixed-supply launches paired with PIPEDOG, permanent liquidity, and fee routing.
15. CoinGecko, [search](https://www.coingecko.com/en/search?query=AFOLD); CoinMarketCap, [search](https://coinmarketcap.com/search/?q=AFOLD); DexScreener, [search](https://dexscreener.com/search?q=AFOLD): ticker collision checks performed 2026-09-23. Search results showed no exact **AFOLD** listing. Search absence is not a reservation or guarantee; symbols are non-unique and must be rechecked immediately before launch.

## Inputs inherited from the prior research job

The assignment requires the prior job's seven shared findings as starting premises. In particular, the July 1, 2026 launch date, roughly 84 days of history, observed ~$7,000 IMD-pool liquidity, near-zero volume, and the list including NetNet were supplied by the assignment. They were not independently derived here. Where a primary public source above did not substantiate a supplied detail, this report labels it **PRIOR-JOB INPUT**, not an independently verified fact.

No adequate primary public documentation was found for NetNet. It remains in the comparison as an **unanswered question**, not as a factual mechanism claim.
