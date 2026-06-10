# Triggers & Automatismes (Database)

**CRITIQUE** : Ces fonctions s'exécutent côté base de données avec le privilège `SECURITY DEFINER`. Ne jamais recréer cette logique côté front-end (Next.js).

## on_comment_created (AFTER INSERT ON comments)
- Fonction : `handle_new_comment_notification()`
- Récupère le propriétaire (`user_id`) de la feature liée et lui crée une notification `new_comment`, sauf si l'auteur du commentaire est lui-même le propriétaire.

## on_feature_assigned (AFTER INSERT OR UPDATE ON features)
- Fonction : `handle_feature_assigned_notification()`
- Déclenchée si `user_id` est défini à la création ou change lors d'un update. Crée une notification `feature_assigned` pour le nouvel assigné.

## trigger_feature_audit (AFTER UPDATE ON features)
- Fonction : `process_feature_audit()`
- Logue les changements (`old_value` / `new_value` en jsonb) dans `features_history`.

## set_updated_at (BEFORE UPDATE on profiles, features, comments, sprints)
- Fonction : `update_updated_at()`
- Met à jour automatiquement `updated_at`. Ne jamais l'envoyer manuellement depuis le client.

## on_auth_user_created (AFTER INSERT ON auth.users)
- Fonction : `handle_new_user()`
- Crée automatiquement la ligne `profiles` correspondante lors de l'inscription.
