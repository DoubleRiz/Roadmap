# Fonctionnalités attendues

- **Liste des features** : afficher toutes les features, avec filtres (statut, priorité, assigné, échéance...).
- **Détail d'une feature** : titre, description, date de création (`created_at`), échéance (`due_date`), utilisateur assigné, commentaires associés.
- **CRUD feature** :
  - Création réservée aux admins (`role = 'admin'`)
  - Édition / suppression réservées à l'assigné (`user_id = auth.uid()`) ou à un admin (voir [security-rls.md](security-rls.md))
- **Filtrage** : par statut (`to_do`, `in_progress`, `done`), priorité, assigné, échéance.
- **Notifications** : afficher les notifications de l'utilisateur connecté
  - `new_comment` : un commentaire a été ajouté sur une feature dont il est propriétaire/assigné
  - `feature_assigned` : il vient d'être assigné à une feature
  - Logique de création automatique gérée par les triggers DB (voir [database-triggers.md](database-triggers.md)), ne pas la dupliquer côté front.
  - Marquer comme lue : UPDATE sur `notifications.read_at` (autorisé uniquement pour le destinataire, voir [security-rls.md](security-rls.md))
