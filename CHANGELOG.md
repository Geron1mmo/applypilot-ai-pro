# Changelog

All notable changes to ApplyPilot AI Pro are documented here.

## [1.2.0] - 2026-06-22

### Added
- Internationalization: Ukrainian (default), English, and Czech
- Language switcher in top nav and Settings
- Personal owner account for daily use (`oleg@applypilot.local`)
- Weekly application goal widget on Dashboard
- Save CV match score back to application from CV Analyzer
- Open job URL button in Applications table
- Multi-device sync FAQ in Help and Settings

### Changed
- All UI strings use translation system
- Status and priority badges display localized labels
- Auth toasts and relative dates respect selected language

## [1.1.0] - 2026-06-22

### Added
- Interview date and follow-up date fields on applications
- Status history tracking when pipeline stage changes
- Dashboard reminders panel (deadlines, follow-ups, interviews)
- CSV export for filtered applications list
- Duplicate application action
- CV Analyzer deep link from application row (pre-fills job description)
- GitHub Actions CI workflow (build + lint)
- Data normalization for legacy localStorage records

### Changed
- Kanban status moves now append to status history
- Demo account includes sample reminder dates and history

## [1.0.0] - 2026-06-21

### Added
- Initial release: local-first job application tracker
- Authentication with Web Crypto password hashing
- Dashboard, Applications, Kanban, CV Analyzer, Documents
- Analytics, Profile, Settings, Security, Billing, Help pages
- JSON export/import, dark/light theme, demo account
- GitHub Pages deployment configuration