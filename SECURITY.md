# Security Policy

## Reporting a Vulnerability

Report security issues via [GitHub Issues](https://github.com/sdprojects12/f1-data-hub/issues).
Please do not disclose the issue publicly until it has been addressed.

## Scope

This project is a data-visualization website using public APIs (OpenF1, Jolpica).
It does not collect, store, or transmit user data server-side.
Favorites persist only in the browser's localStorage.

- **In scope**: the f1-data-hub codebase itself
- **Out of scope**: upstream APIs, dependencies (Next.js, React), browser extensions

## Security Considerations

- No authentication or user accounts
- No server-side data storage
- All API requests go to public, keyless endpoints
- Favorites stored client-side only (localStorage)
- The `/api/openf1` proxy is a thin passthrough — it does not cache or log request data

## Dependencies

Dependencies are audited via standard `npm audit`. Keep them current:
```bash
npm audit        # review vulnerabilities
npm audit fix    # apply safe patches
