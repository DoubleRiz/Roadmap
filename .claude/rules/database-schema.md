# Database Schema (Supabase / PostgreSQL)

Schéma réel vérifié via MCP Supabase (`list_tables`). Toujours revérifier avec `list_tables` avant d'écrire une migration ou des types.

## profiles
- `id` : uuid (PK, FK -> `auth.users.id`)
- `email` : text (NOT NULL, unique)
- `firstname`, `lastname` : text (nullable)
- `photo` : text (nullable)
- `role` : text, CHECK IN (`admin`, `user`)
- `created_at`, `updated_at` : timestamptz (auto)

## features
- `id` : int8 (PK, identity)
- `title` : text (NOT NULL)
- `description` : text (nullable)
- `status` : text, CHECK IN (`to_do`, `in_progress`, `done`), default `to_do`
- `priority` : text, default `medium`
- `due_date` : date (nullable) -> échéance
- `difficulty` : int4 (nullable) -> estimation d'effort
- `user_id` : uuid (FK -> `profiles.id`, nullable) -> utilisateur assigné
- `created_at`, `updated_at` : timestamptz (auto)

## comments
- `id` : int8 (PK, identity)
- `feature_id` : int8 (NOT NULL, FK -> `features.id`)
- `user_id` : uuid (NOT NULL, FK -> `profiles.id`) -> auteur
- `content` : text (NOT NULL)
- `created_at`, `updated_at` : timestamptz (auto)

## notifications
- `id` : int8 (PK, identity)
- `user_id` : uuid (NOT NULL, FK -> `profiles.id`) -> destinataire
- `type` : text, CHECK IN (`new_comment`, `feature_assigned`)
- `feature_id` : int8 (NOT NULL, FK -> `features.id`)
- `triggered_by` : uuid (FK -> `profiles.id`, nullable) -> déclencheur
- `message` : text (nullable)
- `read_at` : timestamptz (NULL = non lue, date = lue)
- `created_at` : timestamptz (auto)

## features_history
- `id` : int8 (PK, identity always)
- `feature_id` : int8 (FK -> `features.id`, nullable)
- `updated_by` : uuid (FK -> `auth.users.id`, nullable)
- `event_type` : text (NOT NULL)
- `old_value`, `new_value` : jsonb (nullable)
- `changed_at` : timestamptz (auto)

Alimentée automatiquement par le trigger `trigger_feature_audit` (voir [database-triggers.md](database-triggers.md)) — ne pas y insérer manuellement depuis le front.
