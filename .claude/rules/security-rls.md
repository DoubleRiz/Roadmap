# RLS Policies (Row Level Security)

RLS activé sur toutes les tables. Vérifier avec `get_advisors` avant toute modification de policy.

## profiles
- **SELECT** : tous les utilisateurs authentifiés
- **UPDATE** : `auth.uid() = id`, et le champ `role` ne peut pas être modifié par l'utilisateur lui-même (vérifié dans le `WITH CHECK`)

## features
- **SELECT** : tous les utilisateurs authentifiés
- **INSERT** : réservé aux profils avec `role = 'admin'`
- **UPDATE / DELETE** : l'assigné (`user_id = auth.uid()`) ou un admin

## comments
- **SELECT / INSERT** : tous les utilisateurs authentifiés
- **UPDATE** : uniquement l'auteur (`auth.uid() = user_id`)
- Pas de policy DELETE -> suppression de commentaire non autorisée

## notifications
- **SELECT** : `auth.uid() = user_id` (chacun ne voit que ses notifications)
- **UPDATE** : `auth.uid() = user_id` (ex : passer `read_at` à `now()` pour marquer comme lue)
- **INSERT** : bloqué (`WITH CHECK (false)`) — réservé aux triggers `SECURITY DEFINER`

## features_history
- RLS activé, aucune policy définie -> aucun accès direct pour le rôle `authenticated`. Table alimentée uniquement par le trigger `trigger_feature_audit`.

## sprints
- **SELECT** : tous les utilisateurs authentifiés
- **INSERT / UPDATE / DELETE** : réservés aux profils avec `role = 'admin'`
