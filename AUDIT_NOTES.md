# Audit Notes

## Encoding

Vietnamese content in the main HTML, Markdown, and JSON files is stored as UTF-8. If PowerShell prints mojibake, prefer checking with a UTF-8-aware reader such as Node before rewriting files.

## Candidate Legacy Cleanup

These files are not referenced by the current HTML entry points and should be reviewed before any deletion:

- `app.js`
- `data.js`
- `style.css`
- Root-level data generation and migration scripts that duplicate newer `scripts/` helpers
- Root-level generated reports such as `duplicates_report.txt`, `integrity_report.txt`, and `report.log`

Do not remove them until their manual/generation use is confirmed.
