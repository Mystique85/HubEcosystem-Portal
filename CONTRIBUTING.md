# 🤝 Contributing to HUB Ecosystem Project

Thank you for your interest in developing the **HUB Ecosystem Project**!  
Every contribution — regardless of size — helps improve the project and build an open web3 environment.  
Below you'll find brief guidelines on how to contribute effectively.

---

## 🧩 General Principles

- The repository is public — all PRs are visible and manually verified
- Maintain transparency and describe every change in your commits
- Do not commit build files (`out/`, `artifacts/`, `cache/`, `node_modules/`)
- Do not upload files with private data (`.env`, keys, local configurations)
- Source contract files should be located in the `src/` or `contracts/` directory

---

## 🌿 Repository Structure

[Repository structure content would go here]

---

## 🔀 Commit and Pull Request Guidelines

### Commits
- Use short, descriptive messages:
  - ✅ `add HUBRewardVault.sol`
  - ✅ `update docs for RewardVault`
  - ❌ `fix` or `update stuff`

### Pull Requests
- Each PR should:
  1. Address **one specific goal** (e.g., documentation update or new contract)
  2. Have a **description of changes** (what, why, how)
  3. Be rebased on the current `main` branch

---

## 🧠 Style and Conventions

- Contract names: `PascalCase` (e.g., `HUBRewardVault`)
- Variable names: `camelCase`
- Public and external functions should have clear, descriptive comments in `///` format
- Private variables should be marked with `_` prefix (`_owner`, `_totalSupply`)
- Documentation: `.md` files in `docs/` — in EN and PL versions when possible

---

## 🛡️ Security Guidelines

- Do not publish any keys, seeds, or private data
- Test changes locally before submitting a PR
- If you discover a potential security issue — **do not disclose it publicly**  
  Contact the project maintainer directly

---

## 🧾 License

The project is open-source and available under the **MIT License**.  
By submitting a contribution, you agree to its publication under the same license.

---

### 💬 Thank You!

If you have ideas on how to improve documentation, code, or processes — feel free to open an issue or PR.  
All feedback is valuable 💙