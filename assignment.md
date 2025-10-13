# Refactoring Exercise — YCS St. Dominic Project

- **Author**: Full‑stack refactor notes for `frontend/src/components/Navbar.jsx`
- **Date**: 2025‑10‑13

## 1) Principle Applied
- **Single Responsibility Principle (SRP)** and **Separation of Concerns (SoC)**.

## 2) Problem Before Refactoring (1–2 sentences)
- `Navbar.jsx` mixes multiple responsibilities: building auth/role‑aware nav items, routing/highlight logic, mobile drawer state/behavior, and presentational layout (MUI components). This tight coupling makes it harder to test, extend (e.g., adding new routes or badges), or reuse logic (e.g., computing nav items) elsewhere.

## 3) Change Made (design + snippet)

- **Extract navigation composition into a hook** `useNavItems(user)` that returns role‑aware items and an `isActive` helper. This isolates logic from UI.
- **Split UI into presentational pieces**:
  - `NavbarBrand` (logo/title/admin chip)
  - `NavbarLinks` (desktop links)
  - `NavbarDrawer` (mobile drawer list)
- **Keep `Navbar` as an orchestrator** to wire theme, media query, and handlers.

Proposed structure (no breaking changes to routes):
```
frontend/src/components/
  Navbar/
    useNavItems.js         # pure logic: items + isActive
    NavbarBrand.jsx        # brand area with avatar/title/admin chip
    NavbarLinks.jsx        # desktop links only
    NavbarDrawer.jsx       # mobile drawer only
    index.jsx              # orchestrates layout, state, and composition
```

Minimal example of extracted logic:
```jsx
// frontend/src/components/Navbar/useNavItems.js
import { useLocation } from 'react-router-dom';

export function useNavItems(user) {
  const location = useLocation();
  const base = [
    { label: 'Leaders', to: '/leaders' },
    { label: 'Blog', to: '/blog' },
    { label: 'Events', to: '/events' },
    { label: 'Gallery', to: '/gallery' },
  ];
  if (user) base.push({ label: 'Members', to: '/members' }, { label: 'Profile', to: '/profile' });
  if (user?.is_admin) base.push({ label: 'Admin Dashboard', to: '/admin' });

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + '/');
  return { items: base, isActive };
}
```

Presentational component snippet (desktop links):
```jsx
// frontend/src/components/Navbar/NavbarLinks.jsx
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function NavbarLinks({ items, isActive, user, onLogout }) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {items.map((item) => (
        <Link key={item.to} href={item.to} underline="none"
          sx={{ color: 'inherit', fontWeight: isActive(item.to) ? 700 : 500,
                bgcolor: isActive(item.to) ? 'action.selected' : 'transparent', px: 1, py: 0.5, borderRadius: 1 }}>
          {item.label}
        </Link>
      ))}
      {user ? (
        <Button variant="outlined" color="inherit" onClick={onLogout}>Logout</Button>
      ) : null}
    </Stack>
  );
}
```

Mermaid diagram of responsibilities after refactor:
```mermaid
flowchart LR
  Navbar[Navbar (orchestrator)] --> useNavItems
  Navbar --> NavbarBrand
  Navbar --> NavbarLinks
  Navbar --> NavbarDrawer
  useNavItems -.pure logic.-> Items[(items + isActive)]
```

Notes:
- The refactor is non‑functional (no changes to routes or AuthContext). It reduces the cognitive load in `Navbar.jsx` and clarifies boundaries for testability and future additions.
- Optional follow‑up: address double wrapping of `AuthProvider` (currently in both `src/main.jsx` and `src/App.jsx`) to follow SRP at app root; keep it only in `src/main.jsx`.

## 4) Benefits Gained
- **Clarity**: UI is separated from nav composition logic; each file is shorter and purpose‑specific.
- **Reusability**: `useNavItems` can be reused by a sidebar or footer nav without duplicating role logic.
- **Testability**: `useNavItems` can be unit‑tested with different `user` inputs; presentational components can be snapshot‑tested.
- **Extensibility**: Adding a route or changing the active link rule is a single‑place change with minimal impact on UI components.

---

### Timebox Mapping to Prompt
- Step 1 (Identify): `Navbar.jsx` combining composition, state, routing, and layout.
- Step 2 (Principle): SRP + SoC.
- Step 3 (Refactor): Extract `useNavItems`, split presentational components, keep `Navbar` orchestration.
- Step 4 (Document): This half‑page note with code snippets and a small diagram.
