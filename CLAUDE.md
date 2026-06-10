# Project: Roadmap

Application de gestion et de suivi des fonctionnalités (features) en équipe, avec un système de commentaires et de notifications automatisées.

## Stack Technique
- **Front-end** : Next.js (App Router, Server Components par défaut, `"use client"` uniquement si nécessaire)
- **Langage** : TypeScript strict (jamais `any` ; si un type est impossible, `unknown` + narrowing)
- **UI** : React 19
- **Styling** : Tailwind CSS v4 (utility-first, thème/tokens via `@theme` dans `globals.css`, pas de config JS, pas de CSS modules / styled-components)
- **Composants** : shadcn/ui (Radix UI + Tailwind)
- **Back-end & Database** : Supabase (PostgreSQL)
- **Authentification** : Supabase Auth via la table `profiles`

## Règles détaillées
- Schéma de base de données : [.claude/rules/database-schema.md](.claude/rules/database-schema.md)
- Triggers & automatismes (SECURITY DEFINER) : [.claude/rules/database-triggers.md](.claude/rules/database-triggers.md)
- RLS / sécurité : [.claude/rules/security-rls.md](.claude/rules/security-rls.md)
- Conventions Next.js / React / Tailwind / shadcn : [.claude/rules/frontend-nextjs.md](.claude/rules/frontend-nextjs.md)
- Fonctionnalités attendues : [.claude/rules/features.md](.claude/rules/features.md)
