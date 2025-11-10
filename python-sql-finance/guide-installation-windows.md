# Guide d'Installation Windows - Python pour la Finance

## Configuration complète de l'environnement de développement

**Temps estimé** : 30-45 minutes  
**Niveau** : Débutant  
**Prérequis** : Windows 10 ou 11

---

## Étape 1 : Télécharger Anaconda

### 1.1 Accéder au site officiel

1. Ouvrir un navigateur web
2. Aller sur : **https://www.anaconda.com/download**
3. La page devrait détecter automatiquement Windows

### 1.2 Télécharger l'installateur

1. Cliquer sur le bouton **"Download"** pour Windows
2. Choisir la version **Python 3.11** (la plus récente)
3. Taille du fichier : ~600 MB
4. Sauvegarder dans le dossier **Téléchargements**

💡 **Astuce** : Le téléchargement peut prendre 10-30 minutes selon votre connexion

---

## Étape 2 : Installer Anaconda

### 2.1 Lancer l'installateur

1. Aller dans le dossier **Téléchargements**
2. Double-cliquer sur le fichier téléchargé : `Anaconda3-2024.XX-Windows-x86_64.exe`
3. Si Windows demande l'autorisation : cliquer **"Oui"**

### 2.2 Assistant d'installation

**Écran 1 : Bienvenue**
- Cliquer **"Next"**

**Écran 2 : Licence**
- Lire (ou pas 😉)
- Cliquer **"I Agree"**

**Écran 3 : Type d'installation**
- ✅ Choisir **"Just Me (recommended)"**
- Cliquer **"Next"**

**Écran 4 : Dossier d'installation**
- ✅ Accepter le chemin par défaut : `C:\Users\VotreNom\anaconda3`
- Cliquer **"Next"**

**Écran 5 : Options avancées** ⚠️ **IMPORTANT**
- ✅ **COCHER** : "Add Anaconda3 to my PATH environment variable"
  - (Même si c'est écrit "Not recommended", cochez quand même)
- ✅ **COCHER** : "Register Anaconda3 as my default Python 3.11"
- Cliquer **"Install"**

### 2.3 Installation

- Durée : 10-15 minutes
- La barre de progression avance
- Ne pas éteindre l'ordinateur

### 2.4 Fin de l'installation

**Écran final**
- ✅ **DÉCOCHER** : "Getting Started with Anaconda"
- ✅ **DÉCOCHER** : "Welcome to Anaconda Cloud"
- Cliquer **"Finish"**

---

## Étape 3 : Vérifier l'installation

### 3.1 Ouvrir Anaconda Prompt

**Méthode 1 : Menu démarrer**
1. Cliquer sur le bouton **Windows** (en bas à gauche)
2. Taper : **"anaconda prompt"**
3. Cliquer sur **"Anaconda Prompt"** (app avec logo serpent)

**Méthode 2 : Recherche**
1. Appuyer sur **Windows + S**
2. Taper : **"anaconda"**
3. Ouvrir **"Anaconda Prompt"**

### 3.2 Vérifier Python

Dans Anaconda Prompt, taper :

```bash
python --version
```

**Résultat attendu** :
```
Python 3.11.X
```

Si vous voyez ce message : ✅ Python est installé !

### 3.3 Vérifier les bibliothèques

Taper :

```bash
python -c "import numpy, pandas, matplotlib; print('Bibliothèques installées!')"
```

**Résultat attendu** :
```
Bibliothèques installées!
```

✅ Si vous voyez cela, tout est bon !

---

## Étape 4 : Installer les bibliothèques financières

### 4.1 Mise à jour de conda

Dans Anaconda Prompt :

```bash
conda update conda
```

- Taper **"y"** quand demandé
- Attendre 2-3 minutes

### 4.2 Installer yfinance (données boursières)

```bash
pip install yfinance
```

**Résultat attendu** :
```
Successfully installed yfinance-X.X.XX
```

### 4.3 Installer pandas-datareader

```bash
pip install pandas-datareader
```

### 4.4 Vérifier les installations

```bash
python -c "import yfinance; print('yfinance OK')"
```

Si vous voyez "yfinance OK" : ✅ Succès !

---

## Étape 5 : Tester Jupyter Notebook

### 5.1 Lancer Jupyter

Dans Anaconda Prompt :

```bash
jupyter notebook
```

**Ce qui se passe** :
- Une fenêtre de navigateur s'ouvre automatiquement
- Affiche l'interface Jupyter
- URL : `http://localhost:8888/tree`

⚠️ **NE PAS FERMER** la fenêtre Anaconda Prompt !

### 5.2 Créer un nouveau notebook

1. Dans le navigateur, cliquer sur **"New"** (en haut à droite)
2. Choisir **"Python 3"**
3. Un nouveau notebook s'ouvre

### 5.3 Premier test

Dans la première cellule, taper :

```python
print("Hello Finance!")
```

Appuyer sur **Shift + Enter** (ou cliquer sur le bouton ▶️)

**Résultat attendu** :
```
Hello Finance!
```

✅ Jupyter fonctionne !

### 5.4 Test financier

Dans une nouvelle cellule :

```python
# Calcul simple
capital = 10000
taux = 0.08
annees = 5

valeur_future = capital * (1 + taux)**annees
print(f"Valeur future : {valeur_future:,.2f} FCFA")
```

**Résultat attendu** :
```
Valeur future : 14,693.28 FCFA
```

---

## Étape 6 : (Optionnel) Installer VS Code

### 6.1 Télécharger VS Code

1. Aller sur : **https://code.visualstudio.com/**
2. Cliquer **"Download for Windows"**
3. Installer normalement (tout accepter par défaut)

### 6.2 Installer les extensions Python

1. Ouvrir VS Code
2. Cliquer sur l'icône **Extensions** (à gauche, carré avec 4 carrés)
3. Rechercher et installer :
   - **"Python"** (par Microsoft)
   - **"Jupyter"** (par Microsoft)

### 6.3 Tester VS Code

1. **File** → **New File**
2. Taper :
```python
print("Python dans VS Code fonctionne!")
```
3. **File** → **Save As** → Sauvegarder comme `test.py`
4. Clic droit dans le code → **"Run Python File in Terminal"**

---

## Résolution de problèmes

### Problème 1 : "python n'est pas reconnu"

**Solution** :
1. Fermer Anaconda Prompt
2. Rouvrir Anaconda Prompt **en tant qu'administrateur**
   - Clic droit sur "Anaconda Prompt"
   - Choisir "Exécuter en tant qu'administrateur"
3. Retaper : `python --version`

**Si ça ne marche toujours pas** :
Réinstaller Anaconda en cochant bien "Add to PATH"

### Problème 2 : Jupyter ne s'ouvre pas

**Solution 1** :
```bash
jupyter notebook --no-browser
```
Puis copier l'URL affichée dans un navigateur

**Solution 2** :
```bash
pip install --upgrade jupyter
```

### Problème 3 : Erreur d'installation de bibliothèque

**Solution** :
```bash
pip install --upgrade pip
pip install --user nomdelabibliotheque
```

### Problème 4 : Anaconda Prompt introuvable

**Solution** :
1. Ouvrir **Invite de commandes** normale (cmd)
2. Taper :
```bash
C:\Users\VotreNom\anaconda3\Scripts\activate
```

---

## Checklist finale

Avant la première séance, vérifiez :

- [ ] Anaconda installé
- [ ] Python fonctionne (`python --version`)
- [ ] Jupyter Notebook s'ouvre
- [ ] Peut créer et exécuter un notebook
- [ ] yfinance installé
- [ ] pandas-datareader installé
- [ ] (Optionnel) VS Code installé

---

## Commandes utiles à mémoriser

### Ouvrir Jupyter

```bash
jupyter notebook
```

### Fermer Jupyter

Dans Anaconda Prompt : **Ctrl + C** (deux fois)

### Installer une bibliothèque

```bash
pip install nom_bibliotheque
```

### Mettre à jour une bibliothèque

```bash
pip install --upgrade nom_bibliotheque
```

### Lister les bibliothèques installées

```bash
pip list
```

---

## Fichiers et dossiers

### Où sont mes notebooks ?

Par défaut dans : `C:\Users\VotreNom`

**Conseil** : Créez un dossier dédié
```
C:\Users\VotreNom\Documents\FormationPython
```

### Comment naviguer dans Jupyter ?

Dans l'interface Jupyter :
- Les dossiers sont cliquables
- "New" → "Folder" pour créer un dossier
- Cochez un fichier et cliquez "Rename" pour renommer

---

## Raccourcis clavier Jupyter

**Mode commande** (cellule en bleu)
- **Shift + Enter** : Exécuter cellule
- **A** : Insérer cellule au-dessus
- **B** : Insérer cellule en-dessous
- **DD** : Supprimer cellule
- **M** : Changer en Markdown
- **Y** : Changer en Code

**Mode édition** (cellule en vert)
- **Ctrl + Enter** : Exécuter sans descendre
- **Tab** : Auto-complétion
- **Ctrl + /** : Commenter/décommenter

---

## Ressources supplémentaires

### Documentation officielle

- **Anaconda** : https://docs.anaconda.com
- **Jupyter** : https://jupyter.org/documentation
- **Python** : https://docs.python.org/3/

### Tutoriels vidéo

- **Anaconda installation** : YouTube → "How to install Anaconda Python"
- **Jupyter basics** : YouTube → "Jupyter Notebook Tutorial"

### Aide

Si vous rencontrez des problèmes :
1. Google l'erreur exacte
2. Regarder sur Stack Overflow
3. Demander dans le groupe WhatsApp
4. Envoyer un email à l'instructeur

---

## Prêt pour la formation !

Si tous les tests passent : **vous êtes prêt** ! 🎉

**Prochain rendez-vous** : Séance 1 - [Date]

---

## Notes pour l'instructeur

**Temps de session d'installation guidée** : 1h30
- 15 min : Téléchargement
- 30 min : Installation
- 30 min : Configuration et tests
- 15 min : Résolution de problèmes

**Alternatives si problèmes persistent** :
- Google Colab (en ligne, gratuit)
- Replit (en ligne, gratuit)
