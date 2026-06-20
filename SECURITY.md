# Security Policy

## Overview

ApplyPilot AI Pro is a **local-first portfolio application**. All data and authentication run entirely in the browser. There is no backend server, no database, and no external API integration.

## What This Means

### Authentication

- User accounts are stored in `localStorage`
- Passwords are **never stored in plain text**
- Passwords are hashed using the **Web Crypto API** (SHA-256) with a unique per-user salt
- Session tokens are generated locally and stored in `localStorage`
- Auto-logout is enforced after configurable inactivity periods

### Important Limitations

**This is NOT production-grade authentication.**

- Anyone with access to the browser can inspect `localStorage` and extract hashed passwords
- There is no protection against brute-force attacks at the server level (there is no server)
- Session tokens are not cryptographically signed or validated server-side
- There is no rate limiting, account lockout, or breach detection
- Clearing browser data deletes all accounts and data permanently

### Data Storage

- All application data, documents, and analyses are stored in `localStorage`
- No data is transmitted to external servers
- Import/export uses JSON files validated with Zod schemas
- Corrupted `localStorage` data falls back to empty defaults safely

### Input Handling

- User input is validated with Zod schemas
- Text content is sanitized before display (HTML entity encoding)
- `dangerouslySetInnerHTML` is not used anywhere in the application
- Imported JSON is schema-validated before being written to storage

### CV Analyzer

- Runs entirely client-side using keyword and skill matching
- No external AI APIs, no OpenAI, no paid services
- CV and job description text never leave the browser

## Reporting Issues

This is a portfolio/demo project. If you find a security concern in the codebase, please open a GitHub issue.

## Recommendations

- Do not use this app to store truly sensitive information
- Do not reuse passwords from real accounts
- Export your data regularly as a backup
- Treat the demo account credentials as public knowledge