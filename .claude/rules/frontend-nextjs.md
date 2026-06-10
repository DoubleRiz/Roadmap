---
paths:
  - "app/**/*.{ts,tsx}"
  - "components/**/*.{ts,tsx}"
  - "lib/**/*.ts"
---

# Conventions Front-end (Next.js / React / Tailwind)

- **Server Components par défaut** : ajouter `"use client"` uniquement si le composant a besoin d'interactivité, de hooks React ou d'API navigateur.
- **TypeScript strict** : jamais `any`. Si un type est vraiment impossible à déterminer, utiliser `unknown` + narrowing.
- **Tailwind CSS v4** : utility-first. Thème et tokens définis dans `globals.css` via `@theme`. Pas de fichier de config JS, pas de CSS modules, pas de styled-components.
- **Composants UI** : utiliser shadcn/ui (Radix UI + Tailwind) plutôt que de réécrire des composants custom (dialog, select, dropdown, etc.).
- Ne jamais envoyer manuellement `updated_at` lors d'un update Supabase (géré par trigger, voir [database-triggers.md](database-triggers.md)).
