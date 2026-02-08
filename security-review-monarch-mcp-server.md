# Security & Privacy Review: monarch-mcp-server

**Repository:** https://github.com/robcerda/monarch-mcp-server
**Underlying SDK:** https://github.com/hammem/monarchmoney (`monarchmoney` 0.1.15)
**Review Date:** 2026-02-08
**Reviewer:** Automated security analysis

---

## Executive Summary

The `monarch-mcp-server` is an MCP (Model Context Protocol) server that exposes Monarch Money personal finance data to Claude Desktop. It relies on the unofficial `monarchmoney` Python SDK (by @hammem) for API communication.

This review identified **3 critical/high**, **5 medium**, and **several low/informational** findings across the MCP server and the underlying SDK. The most serious issues center on the SDK's use of Python pickle for session storage (arbitrary code execution risk), missing SSL certificate verification, and the SDK itself being effectively abandoned with a broken API endpoint.

---

## Findings Summary

| # | Finding | Severity | Component |
|---|---------|----------|-----------|
| 1 | SDK uses `pickle.load()` for session deserialization — arbitrary code execution | **CRITICAL** | monarchmoney SDK |
| 2 | SDK does not verify SSL/TLS certificates by default | **HIGH** | monarchmoney SDK |
| 3 | SDK session file created with default permissions (world-readable token) | **HIGH** | monarchmoney SDK |
| 4 | SDK is effectively abandoned; API domain changed, library is broken | **MEDIUM** | monarchmoney SDK |
| 5 | Credentials available via environment variables in plaintext | **MEDIUM** | MCP server |
| 6 | All financial data (read + write) exposed to LLM via MCP tools | **MEDIUM** | MCP server |
| 7 | Error messages may leak sensitive server responses | **MEDIUM** | monarchmoney SDK |
| 8 | MFA secret key handled as plaintext in memory | **MEDIUM** | monarchmoney SDK |
| 9 | README makes inaccurate security claims | **LOW** | MCP server |
| 10 | No input validation on MCP tool parameters | **LOW** | MCP server |
| 11 | No certificate pinning | **LOW** | monarchmoney SDK |
| 12 | `debug_session_loading` tool leaks stack traces | **LOW** | MCP server |
| 13 | Single-maintainer dependency with no security policy | **INFO** | monarchmoney SDK |
| 14 | aiohttp dependency has known CVEs | **INFO** | monarchmoney SDK |
| 15 | Unofficial reverse-engineered API (ToS risk) | **INFO** | monarchmoney SDK |

---

## Detailed Findings

### CRITICAL

#### 1. Arbitrary Code Execution via Pickle Deserialization (SDK)

**Location:** `monarchmoney/monarchmoney.py` — `load_session()` method

The SDK stores authentication sessions using Python's `pickle` module in `.mm/mm_session.pickle`. The `pickle.load()` call on this file allows **arbitrary code execution** if an attacker can modify or substitute the file.

Attack scenarios:
- An attacker with write access to the user's working directory replaces the pickle file
- A shared computing environment where another user can write to `.mm/`
- A symlink attack redirecting the session file to a malicious payload

The data stored is simply `{"token": "..."}`, which could trivially be stored as JSON instead.

**Note:** The MCP server's `secure_session.py` mitigates this for *new* setups by using the system keyring instead. However, the underlying SDK still uses pickle, and the MCP server's `login_setup.py` calls `mm.save_session()` (line 82), which writes the pickle file. Users who follow the setup instructions will have both a keyring entry *and* a pickle file on disk.

---

### HIGH

#### 2. SSL/TLS Certificate Verification Not Enforced (SDK)

**Location:** `monarchmoney/monarchmoney.py` — GraphQL transport initialization

GitHub Issue [#142](https://github.com/hammem/monarchmoney/issues/142) documents that the `AIOHTTPTransport` used for GraphQL communication **does not verify SSL certificates by default**. This means MITM (man-in-the-middle) attacks on the HTTPS connection to `api.monarchmoney.com` would not be detected.

For a library that transmits financial credentials, account balances, and transaction data, this is a serious deficiency.

**Status:** Open and unpatched since the issue was filed.

#### 3. Session File Created with Default Permissions (SDK)

**Location:** `monarchmoney/monarchmoney.py` — `save_session()` method

The session pickle file is created with default OS permissions (typically `0644` on Linux — world-readable). Any user on a multi-user system can read the auth token from `.mm/mm_session.pickle` and gain full access to the victim's Monarch Money account.

There is no call to `os.chmod()`, `os.umask()`, or use of `os.open()` with restricted mode flags.

---

### MEDIUM

#### 4. SDK is Effectively Abandoned; API Domain Changed

**GitHub Issue:** [#184](https://github.com/hammem/monarchmoney/issues/184)

Monarch Money has migrated their API from `api.monarchmoney.com` to `api.monarch.com`. The SDK hardcodes the old domain and has not been updated. This means:
- The library is currently **broken** and cannot connect to the API
- No releases have been made in over 12 months
- The single maintainer appears inactive

Community forks exist (`monarchmoney-enhanced`, `monarchmoneycommunity`) that address this, but the MCP server depends on the original package.

#### 5. Plaintext Credentials in Environment Variables (MCP Server)

**Location:** `server.py:67-73`

The MCP server falls back to `MONARCH_EMAIL` and `MONARCH_PASSWORD` environment variables for authentication. Environment variables are:
- Visible in `/proc/<pid>/environ` on Linux
- Often logged by process managers, CI/CD systems, and crash reporters
- Inherited by child processes

While the server also supports keyring-based auth (which is better), the env-var fallback creates an additional attack surface.

#### 6. Full Financial Read+Write Access Exposed to LLM (MCP Server)

**Location:** `server.py` — all `@mcp.tool()` decorated functions

The MCP server exposes tools that allow the LLM to:
- **Read:** All accounts, balances, transactions, budgets, cashflow, investment holdings
- **Write:** Create transactions, update transactions, refresh accounts

This means a prompt injection attack or malicious tool use by the LLM could:
- Exfiltrate all financial data by including it in responses
- Create fraudulent transactions
- Modify existing transaction records

There are no confirmation prompts, rate limits, or access controls on write operations. The `create_transaction` and `update_transaction` tools are particularly sensitive — they allow arbitrary financial record modification with no user confirmation gate.

#### 7. Exception Messages May Leak Sensitive Data (SDK)

**Location:** `monarchmoney/monarchmoney.py` — `_multi_factor_authenticate()`

The SDK includes raw HTTP response bodies in exception messages:
```python
raise LoginFailedException(f"HTTP Code {resp.status}: {resp.reason}\nRaw response: {resp.text}")
```

If server responses contain tokens, session IDs, or internal error details, they will be propagated into exception messages that may appear in logs, error trackers, or user-facing output.

A bare `except:` clause also catches and re-wraps exceptions indiscriminately, losing the original error context.

#### 8. MFA Secret Key as Plaintext in Memory (SDK)

When `mfa_secret_key` is provided to the SDK's `login()` method, the raw TOTP secret is held as a plain string in memory. If stored in config files or passed via command-line arguments, it could be exposed in shell history or process listings.

---

### LOW

#### 9. README Makes Inaccurate Security Claims

**Location:** `README.md:192`

The README states: *"Session files are encrypted"* — this is **false**. The SDK's pickle files are not encrypted. They contain the plaintext auth token serialized via pickle. The MCP server's keyring-based storage is better (OS-level encryption on macOS Keychain / GNOME Keyring), but the claim about session files being encrypted is misleading.

The README also states sessions are stored in `.mm/mm_session.pickle`, but the actual code uses keyring storage. This inconsistency suggests the README was not updated when `secure_session.py` was added.

#### 10. No Input Validation on MCP Tool Parameters

**Location:** `server.py` — `get_transactions()`, `create_transaction()`, `update_transaction()`

Parameters like `start_date`, `end_date`, `account_id`, and `transaction_id` are passed directly to the SDK without validation. While the SDK likely validates them server-side, the MCP server does not check:
- Date format validity (could send malformed strings)
- ID format (could send injection payloads if the SDK constructs queries unsafely)
- Amount bounds (no limits on transaction amounts)

#### 11. No Certificate Pinning (SDK)

The SDK relies on the system's default TLS certificate store with no certificate pinning. This is standard for most libraries but means attacks that install rogue CA certificates would succeed.

#### 12. Debug Tool Leaks Stack Traces

**Location:** `server.py:148-151` — `debug_session_loading()`

The `debug_session_loading` tool returns full Python tracebacks including file paths, line numbers, and exception details. This information could aid an attacker in understanding the server's internal structure and deployment.

---

### INFORMATIONAL

#### 13. Single-Maintainer Dependency (SDK)

The `monarchmoney` package has a single maintainer on PyPI (hammem). There is no `SECURITY.md`, no security advisory process, and no evidence of automated dependency scanning (Dependabot). The bus factor of 1 on a financial data library is a supply chain risk.

#### 14. aiohttp Dependency Has Known CVEs

The SDK requires `aiohttp >= 3.8.4`, which permits installation of versions with known vulnerabilities:
- **CVE-2024-23334** (Path Traversal, High) — fixed in 3.9.2
- **CVE-2024-27306** (XSS, Medium) — fixed in 3.9.4

These primarily affect aiohttp when used as a server, so the direct risk to monarchmoney (a client) is lower, but the loose version pinning is still poor practice.

#### 15. Unofficial Reverse-Engineered API

The SDK communicates with Monarch Money's API using a `User-Agent` of `MonarchMoneyAPI` and `Client-Platform: web`, impersonating a web browser. This is an unofficial, reverse-engineered integration that may violate Monarch Money's Terms of Service. The API could change or be blocked without notice.

---

## Privacy Analysis

### Data Exposed to the LLM

When this MCP server is active, Claude Desktop has access to:

| Data Type | Sensitivity | Access |
|-----------|-------------|--------|
| Bank account names, types, balances | **High** | Read |
| Institution names (banks, brokerages) | **High** | Read |
| Transaction history (amounts, merchants, dates) | **High** | Read |
| Investment holdings (tickers, values, cost basis) | **High** | Read |
| Budget categories and spending | **Medium** | Read |
| Cashflow summaries | **Medium** | Read |
| Transaction creation/modification | **High** | Write |
| Account refresh triggers | **Low** | Write |

All of this data flows through the MCP protocol to the LLM, meaning:
1. Financial data is included in prompts sent to Anthropic's API
2. The LLM can access and reason over the complete financial picture
3. Write operations (create/update transactions) have no user-confirmation step
4. There is no data minimization — tools return full account/transaction objects

### Credential Storage

| Method | Security Level | Notes |
|--------|---------------|-------|
| System keyring (secure_session.py) | **Good** | OS-level encryption (macOS Keychain, GNOME Keyring) |
| Environment variables | **Poor** | Visible in process listings, inherited by children |
| SDK pickle file (.mm/mm_session.pickle) | **Poor** | Plaintext token, world-readable, arbitrary code execution risk |

---

## Dependency Chain Risk

```
monarch-mcp-server
├── mcp[cli] >= 1.0.0        (Anthropic's MCP framework)
├── monarchmoney >= 0.1.15   ← ABANDONED, BROKEN, security issues
│   ├── aiohttp >= 3.8.4     ← Known CVEs in older versions
│   ├── gql >= 4.0           (OK)
│   └── oathtool >= 2.3.1    (inactive maintenance)
├── keyring >= 24.0.0         (OK, well-maintained)
├── python-dotenv >= 1.0.0    (OK)
├── pydantic >= 2.0.0         (OK)
└── gql >= 3.4, < 4.0        ← Conflicts with SDK's gql >= 4.0
```

Note: The MCP server pins `gql >= 3.4, < 4.0` while the SDK requires `gql >= 4.0`. This is a **dependency conflict** that may cause installation issues.

---

## Recommendations

### For Users of This MCP Server

1. **Do not use in production or with real financial data** until the underlying SDK issues are resolved
2. **Use the keyring-based auth** (run `login_setup.py`) rather than environment variables
3. **Delete any `.mm/mm_session.pickle` files** after setup — the keyring makes them unnecessary
4. **Consider using a community fork** of the SDK (`monarchmoney-enhanced` or `monarchmoneycommunity`) that fixes the broken API domain and SSL issues
5. **Be aware that all financial data will be sent to Anthropic's API** as part of LLM prompts when using these tools
6. **Remove the `create_transaction` and `update_transaction` tools** if you only need read access, to reduce prompt injection risk

### For the MCP Server Author

1. **Switch to an actively maintained fork** of the monarchmoney SDK
2. **Remove the environment variable credential fallback** — keyring is sufficient and more secure
3. **Add user confirmation for write operations** (create/update transactions)
4. **Fix the README security claims** — session files are not encrypted
5. **Add input validation** on date formats, IDs, and amounts
6. **Remove or gate the `debug_session_loading` tool** in production
7. **Ensure `login_setup.py` does not call `mm.save_session()`** to avoid creating the insecure pickle file alongside the keyring entry
8. **Resolve the gql version conflict** between `pyproject.toml` and the SDK

### For the SDK Author (monarchmoney)

1. **Replace pickle with JSON** for session storage
2. **Set file permissions to 0600** on session files
3. **Enable SSL certificate verification** in the GraphQL transport
4. **Update the API domain** to `api.monarch.com`
5. **Fix the bare `except` clause** in MFA authentication
6. **Sanitize exception messages** to avoid leaking server responses
