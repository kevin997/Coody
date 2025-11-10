# 🎓 Coody - Plateforme d'Apprentissage en Programmation

**Coody** est une plateforme d'apprentissage interactive inspirée de LeetCode, conçue pour enseigner Python, SQL et l'analyse financière. Elle offre une expérience d'apprentissage moderne avec des cours structurés, des notebooks Jupyter interactifs, et un suivi de progression local.

## ✨ Fonctionnalités

### Pour les Apprenants
- 📚 **Cours Structurés**: Parcours d'apprentissage organisés en modules et sections
- 📝 **Rendu Markdown**: Documentation et explications formatées avec syntaxe enrichie
- 💻 **Notebooks Jupyter**: Visualisation et exécution de code Python interactif
- 📊 **Suivi de Progression**: Marquez les sections comme complétées et suivez votre avancement
- 📖 **Système de Notes**: Prenez des notes sur chaque section, sauvegardées localement
- 🎯 **Navigation Intuitive**: Parcourez facilement les modules et sections
- 💾 **Stockage Local**: Toutes vos données restent sur votre ordinateur (MVP)

### Pour les Instructeurs
- 👨‍🏫 **Mode Présentation**: Interface optimisée pour présenter les cours
- 📊 **Suivi des Apprenants**: Visualisez la progression de vos étudiants
- 🎨 **Contenu Personnalisable**: Structurez vos cours comme vous le souhaitez

## 🚀 Technologies Utilisées

- **Framework**: [Next.js 16](https://nextjs.org/) avec App Router
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Markdown**: [react-markdown](https://github.com/remarkjs/react-markdown) avec remark-gfm
- **Code Highlighting**: [rehype-highlight](https://github.com/rehypejs/rehype-highlight)
- **Icons**: [Lucide React](https://lucide.dev/)
- **TypeScript**: Full type safety

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm, yarn, ou pnpm

### Étapes

1. **Cloner le repository**
```bash
cd /home/atlas/Projects/Olku/coody/coody-platform
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer le serveur de développement**
```bash
npm run dev
```

4. **Ouvrir dans le navigateur**
Visitez [http://localhost:3000](http://localhost:3000)

## 📚 Structure du Projet

```
coody-platform/
├── src/
│   ├── app/                  # Pages Next.js (App Router)
│   │   ├── page.tsx         # Page d'accueil
│   │   ├── cours/           # Pages de cours
│   │   │   └── [courseId]/  # Visualiseur de cours dynamique
│   │   └── api/             # API Routes
│   │       └── content/     # Serveur de contenu
│   ├── components/          # Composants React
│   │   ├── ui/             # Composants shadcn/ui
│   │   ├── CourseHeader.tsx
│   │   ├── CourseNavigation.tsx
│   │   ├── MarkdownRenderer.tsx
│   │   └── NotebookViewer.tsx
│   ├── stores/             # Stores Zustand
│   │   ├── userStore.ts    # État utilisateur et progression
│   │   └── courseStore.ts  # État des cours
│   ├── types/              # Définitions TypeScript
│   │   └── course.ts
│   └── lib/                # Utilitaires
│       ├── courseLoader.ts # Chargement des cours
│       └── utils.ts
└── python-sql-finance/     # Contenu du cours
    ├── formation-python-sql-finance.md
    ├── slides-formation-python-finance.md
    └── *.ipynb            # Notebooks Jupyter
```

## 🎯 Cours Disponible

### Python & SQL pour la Finance

Programme complet de 10-12 semaines pour débutants:

#### Module 1: Fondations Python (4 semaines)
- Introduction et premiers pas
- Structures conditionnelles
- Boucles et itérations
- Structures de données

#### Module 2: Bibliothèques Essentielles (2 semaines)
- NumPy pour calculs vectorisés
- Pandas pour manipulation de données
- Matplotlib pour visualisation

#### Module 3: SQL et Bases de Données (2 semaines)
- Fondamentaux SQL
- Requêtes avancées
- Intégration Python + SQL

#### Module 4: Applications Financières (4 semaines)
- Analyse de données boursières
- Gestion de portefeuille
- Calculs financiers
- Projet final

## 💡 Utilisation

### Pour les Apprenants

1. **Accéder à un cours**: Cliquez sur "Commencer le cours" depuis la page d'accueil
2. **Naviguer**: Utilisez le menu latéral pour sélectionner les sections
3. **Lire le contenu**: Le contenu s'affiche avec formatage enrichi
4. **Prendre des notes**: Utilisez la zone de notes en bas de chaque section
5. **Marquer comme complété**: Cliquez sur le bouton pour suivre votre progression

### Pour les Instructeurs

1. **Mode présentation**: Les slides peuvent être affichés en plein écran
2. **Navigation fluide**: Passez facilement d'une section à l'autre
3. **Contenu enrichi**: Markdown et notebooks Jupyter pour des explications claires

## 🔧 Développement

### Ajouter un Nouveau Cours

1. **Créer le contenu** dans un dossier séparé (ex: `nouveau-cours/`)
2. **Définir la structure** dans `src/lib/courseLoader.ts`:

```typescript
export function loadNouveauCours(): Course {
  return {
    id: 'nouveau-cours',
    title: 'Titre du Cours',
    description: 'Description',
    // ... modules et sections
  };
}
```

3. **Ajouter à la liste** dans `loadAllCourses()`

### Personnaliser l'Interface

- **Couleurs**: Modifiez les variables CSS dans `src/app/globals.css`
- **Composants**: Utilisez shadcn/ui pour ajouter de nouveaux composants
- **Layout**: Ajustez `src/components/CourseHeader.tsx` et `CourseNavigation.tsx`

## 🎨 Design System

La plateforme utilise **shadcn/ui** comme foundation, offrant:
- ✅ Composants accessibles (ARIA)
- ✅ Thème clair/sombre
- ✅ Responsive design
- ✅ Personnalisable avec Tailwind CSS

## 📝 Format des Contenus

### Markdown (`.md`)
- Support complet du GFM (GitHub Flavored Markdown)
- Code highlighting avec syntaxe Python, SQL, etc.
- Tables, listes, citations
- Liens et images

### Jupyter Notebooks (`.ipynb`)
- Cellules markdown et code
- Affichage des outputs
- Bouton d'exécution (prévu pour future version avec kernel)

## 🚧 Roadmap

### Version 1.0 (MVP) ✅
- [x] Rendu Markdown
- [x] Visualisation Jupyter Notebooks
- [x] Navigation cours
- [x] Suivi progression local
- [x] Système de notes

### Version 1.1 (Prévu)
- [ ] Exécution de code Python en temps réel
- [ ] Système d'exercices avec validation
- [ ] Quiz interactifs
- [ ] Certificats de complétion

### Version 2.0 (Futur)
- [ ] Backend API (Node.js/Python)
- [ ] Authentification utilisateurs
- [ ] Synchronisation cloud
- [ ] Mode collaboratif
- [ ] Analytics pour instructeurs

## 🤝 Contribution

Les contributions sont les bienvenues! Pour contribuer:

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- [LeetCode](https://leetcode.com/) pour l'inspiration UI/UX
- [shadcn/ui](https://ui.shadcn.com/) pour les composants
- [Next.js](https://nextjs.org/) pour le framework
- La communauté open-source

## 📧 Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur GitHub.

---

**Fait avec ❤️ pour les apprenants en programmation et finance**
