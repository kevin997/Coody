# 🚀 Guide de Démarrage Rapide - Coody

## Lancement Immédiat

```bash
# 1. Naviguer vers le projet
cd /home/atlas/Projects/Olku/coody/coody-platform

# 2. Lancer le serveur de développement
npm run dev

# 3. Ouvrir dans le navigateur
# Visitez http://localhost:3000
```

## Première Utilisation

### 1. Page d'Accueil
- Vue d'ensemble de la plateforme
- Présentation des fonctionnalités
- Accès rapide au cours Python & SQL Finance

### 2. Commencer un Cours
- Cliquez sur "Commencer le cours" ou "Commencer maintenant"
- Vous serez redirigé vers `/cours/python-sql-finance`

### 3. Interface du Cours

#### Navigation Latérale (Desktop)
- Liste complète des modules et sections
- Progression affichée par module
- Cliquez sur une section pour y accéder

#### Navigation Mobile
- Bouton "Navigation du cours" en haut
- Même fonctionnalité dans un panneau latéral

#### Zone de Contenu
- **Markdown**: Rendu enrichi avec code highlighting
- **Notebooks**: Cellules code et markdown avec bouton d'exécution
- **Notes**: Zone pour prendre des notes personnelles
- **Navigation**: Boutons Précédent/Suivant en bas

### 4. Fonctionnalités

#### Marquer comme Complété
1. Lisez le contenu de la section
2. Cliquez sur "Marquer comme complété"
3. La section sera marquée ✓ dans la navigation
4. Progression mise à jour automatiquement

#### Prendre des Notes
1. Utilisez la zone de texte "Mes Notes"
2. Tapez vos notes
3. Cliquez sur "Sauvegarder"
4. Notes stockées localement dans le navigateur

#### Progression Automatique
- Toutes les données sont sauvegardées dans le localStorage
- Aucune connexion requise
- Les données persistent entre les sessions

## Structure du Cours Actuel

### Module 1: Fondations Python (4 semaines)
- ✓ Introduction et Premiers Pas
- ✓ Notebook - Séance 1: Introduction
- ✓ Structures conditionnelles
- ✓ Boucles
- ✓ Notebook - Séances 4-5: Boucles

### Module 2: Bibliothèques Essentielles (2 semaines)
- Introduction à NumPy
- Pandas pour la manipulation de données

### Module 3: SQL et Bases de Données (2 semaines)
- Fondamentaux SQL

### Module 4: Applications Financières (4 semaines)
- Analyse de données boursières

## Fonctionnalités à Venir

### Version Actuelle (MVP)
- ✅ Lecture de contenu markdown
- ✅ Visualisation de notebooks Jupyter
- ✅ Suivi de progression
- ✅ Système de notes
- ⚠️ Exécution de code (interface prête, nécessite kernel)

### Prochaines Versions
- [ ] Exécution de code Python en temps réel
- [ ] Exercices interactifs avec validation
- [ ] Quiz et évaluations
- [ ] Mode instructeur avancé
- [ ] Synchronisation cloud (optionnelle)

## Dépannage

### Le contenu ne s'affiche pas
**Problème**: Message "⚠️ Contenu à charger depuis..."

**Solution**: Le contenu doit être placé dans le dossier parent:
```bash
# Vérifier la structure
ls -la /home/atlas/Projects/Olku/coody/python-sql-finance/
```

Les fichiers suivants doivent être présents:
- `formation-python-sql-finance.md`
- `slides-formation-python-finance.md`
- `notebook-seance-01-introduction.ipynb`
- `notebook-seances-04-05-boucles-finance.ipynb`

### Erreur au démarrage
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install

# Relancer
npm run dev
```

### Notes/Progression perdues
- Vérifiez le localStorage du navigateur
- Ne pas utiliser le mode navigation privée
- Pas de nettoyage automatique des données du navigateur

## Personnalisation

### Changer les Couleurs
Modifiez `/home/atlas/Projects/Olku/coody/coody-platform/src/app/globals.css`:

```css
@layer base {
  :root {
    --primary: 210 100% 50%; /* Bleu */
    --secondary: 210 40% 96%; /* Gris clair */
    /* ... autres variables */
  }
}
```

### Ajouter du Contenu
1. Créez vos fichiers markdown ou notebooks
2. Mettez-les dans un dossier (ex: `nouveau-cours/`)
3. Modifiez `src/lib/courseLoader.ts` pour référencer le nouveau contenu

### Modifier la Navigation
- Header: `src/components/CourseHeader.tsx`
- Sidebar: `src/components/CourseNavigation.tsx`

## Commandes Utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Démarrer en production
npm start

# Linter
npm run lint

# Ajouter un composant shadcn
npx shadcn@latest add [component-name]
```

## Support

Pour toute question:
1. Consultez le README.md complet
2. Vérifiez les logs de la console
3. Ouvrez une issue sur GitHub

---

**Bon apprentissage! 🎓**
