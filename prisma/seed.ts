import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Idempotency check: skip if assessment data already exists
  const existingAssessment = await prisma.assessment.findFirst({
    where: { title: 'Évaluation Pré-Mentorat DIR' },
  });
  if (existingAssessment) {
    console.log('⏭️  Seed data already exists, skipping. (Assessment: ' + existingAssessment.id + ')');
    return;
  }

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@coody.dev' },
    update: {},
    create: {
      email: 'admin@coody.dev',
      name: 'Admin Coody',
      password: adminPassword,
      role: 'admin',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create test mentee
  const menteePassword = await bcrypt.hash('mentee123', 10);
  const mentee = await prisma.user.upsert({
    where: { email: 'mentee@coody.dev' },
    update: {},
    create: {
      email: 'mentee@coody.dev',
      name: 'Jean Dupont',
      password: menteePassword,
      role: 'mentee',
    },
  });
  console.log('✅ Test mentee created:', mentee.email);

  // Create Assessment
  const assessment = await prisma.assessment.create({
    data: {
      title: 'Évaluation Pré-Mentorat DIR',
      titleEn: 'DIR Pre-Mentoring Assessment',
      description:
        'Évaluation complète des compétences en programmation couvrant les structures de données, les algorithmes et la programmation orientée objet. Cette évaluation déterminera votre niveau avant d\'intégrer le programme de mentorat du département Développement, Innovation & Recherche.',
      descriptionEn:
        'Comprehensive programming skills assessment covering data structures, algorithms, and object-oriented programming. This assessment will determine your level before joining the Development, Innovation & Research department mentoring program.',
      durationMinutes: 120,
      maxViolations: 5,
      isActive: true,
    },
  });
  console.log('✅ Assessment created:', assessment.title);

  // Create Mentoring Pathway linked to the assessment
  const mentoringPathway = await prisma.pathway.create({
    data: {
      title: 'Programme de Mentorat DIR',
      titleEn: 'DIR Mentoring Program',
      subtitle: 'Rejoignez le programme de mentorat du departement Developpement, Innovation & Recherche',
      subtitleEn: 'Join the Development, Innovation & Research department mentoring program',
      description: "Un programme complet de mentorat pour developpeurs. Passez une evaluation technique pour determiner votre niveau, puis beneficiez d'un accompagnement personnalise par des mentors experimentes du departement DIR.",
      descriptionEn: 'A comprehensive mentoring program for developers. Take a technical assessment to determine your level, then benefit from personalized guidance by experienced mentors from the DIR department.',
      icon: 'GraduationCap',
      color: 'blue',
      level: 'all',
      duration: '12 weeks',
      order: 0,
      assessments: {
        create: [{ assessmentId: assessment.id, order: 0 }],
      },
    },
  });
  console.log('✅ Mentoring pathway created:', mentoringPathway.title);

  // Create Python & Finance Pathway (no assessments yet)
  await prisma.pathway.create({
    data: {
      title: 'Python & SQL pour la Finance',
      titleEn: 'Python & SQL for Finance',
      subtitle: 'Maitrisez Python et SQL dans le contexte financier',
      subtitleEn: 'Master Python and SQL in the financial context',
      description: "Programme complet pour apprendre la programmation Python, la gestion de bases de donnees SQL et l'analyse de donnees financieres.",
      descriptionEn: 'Complete program to learn Python programming, SQL database management and financial data analysis.',
      icon: 'TrendingUp',
      color: 'green',
      level: 'beginner',
      duration: '10-12 weeks',
      order: 1,
    },
  });
  console.log('✅ Python & Finance pathway created');

  // ============================================================
  // DATA STRUCTURES QUESTIONS (15)
  // ============================================================

  // DS - MCQ 1
  await createMCQ(assessment.id, {
    category: 'DATA_STRUCTURES',
    subcategory: 'Arrays',
    difficulty: 'EASY',
    points: 5,
    title: 'Complexité d\'accès par index',
    description: 'Quelle est la complexité temporelle pour accéder à un élément dans un tableau (array) par son index ?',
    options: [
      { text: 'O(1)', correct: true, explanation: 'L\'accès par index dans un tableau est en temps constant O(1) car l\'adresse mémoire est calculée directement à partir de l\'index.' },
      { text: 'O(n)', correct: false },
      { text: 'O(log n)', correct: false },
      { text: 'O(n²)', correct: false },
    ],
  });

  // DS - MCQ 2
  await createMCQ(assessment.id, {
    category: 'DATA_STRUCTURES',
    subcategory: 'Stacks',
    difficulty: 'EASY',
    points: 5,
    title: 'Principe LIFO',
    description: 'Quelle structure de données utilise le principe LIFO (Last In, First Out) ?',
    options: [
      { text: 'Queue (File)', correct: false },
      { text: 'Stack (Pile)', correct: true, explanation: 'Une pile (Stack) suit le principe LIFO : le dernier élément ajouté est le premier retiré.' },
      { text: 'Array (Tableau)', correct: false },
      { text: 'Linked List (Liste chaînée)', correct: false },
    ],
  });

  // DS - MCQ 3
  await createMCQ(assessment.id, {
    category: 'DATA_STRUCTURES',
    subcategory: 'Trees',
    difficulty: 'MEDIUM',
    points: 10,
    title: 'Plus petit élément dans un BST',
    description: 'Dans un arbre binaire de recherche (BST), où se trouve le plus petit élément ?',
    options: [
      { text: 'À la racine', correct: false },
      { text: 'Au nœud le plus à gauche', correct: true, explanation: 'Dans un BST, le plus petit élément se trouve toujours au nœud le plus à gauche car chaque nœud gauche est plus petit que son parent.' },
      { text: 'Au nœud le plus à droite', correct: false },
      { text: 'Au dernier niveau', correct: false },
    ],
  });

  // DS - MCQ 4
  await createMCQ(assessment.id, {
    category: 'DATA_STRUCTURES',
    subcategory: 'Hash Tables',
    difficulty: 'MEDIUM',
    points: 10,
    title: 'Gestion des collisions',
    description: 'Quelle technique de gestion des collisions dans une table de hachage utilise des listes chaînées ?',
    options: [
      { text: 'Adressage ouvert (Open Addressing)', correct: false },
      { text: 'Chaînage (Chaining)', correct: true, explanation: 'Le chaînage résout les collisions en stockant tous les éléments ayant le même hash dans une liste chaînée au même index.' },
      { text: 'Double hachage', correct: false },
      { text: 'Rehashing linéaire', correct: false },
    ],
  });

  // DS - MCQ 5
  await createMCQ(assessment.id, {
    category: 'DATA_STRUCTURES',
    subcategory: 'Queues',
    difficulty: 'EASY',
    points: 5,
    title: 'Principe FIFO',
    description: 'Quel principe suit une file d\'attente (Queue) ?',
    options: [
      { text: 'LIFO (Last In, First Out)', correct: false },
      { text: 'FIFO (First In, First Out)', correct: true, explanation: 'Une file d\'attente (Queue) suit le principe FIFO : le premier élément ajouté est le premier retiré.' },
      { text: 'FILO (First In, Last Out)', correct: false },
      { text: 'Accès aléatoire', correct: false },
    ],
  });

  // DS - MCQ 6
  await createMCQ(assessment.id, {
    category: 'DATA_STRUCTURES',
    subcategory: 'Graphs',
    difficulty: 'MEDIUM',
    points: 10,
    title: 'Représentation de graphe',
    description: 'Quelle représentation de graphe est la plus efficace en mémoire pour un graphe creux (sparse graph) ?',
    options: [
      { text: 'Matrice d\'adjacence', correct: false },
      { text: 'Liste d\'adjacence', correct: true, explanation: 'Une liste d\'adjacence est plus efficace en mémoire O(V+E) pour les graphes creux car elle ne stocke que les arêtes existantes.' },
      { text: 'Matrice d\'incidence', correct: false },
      { text: 'Aucune différence', correct: false },
    ],
  });

  // DS - MCQ 7
  await createMCQ(assessment.id, {
    category: 'DATA_STRUCTURES',
    subcategory: 'Linked Lists',
    difficulty: 'EASY',
    points: 5,
    title: 'Insertion en tête de liste',
    description: 'Quelle est la complexité temporelle pour insérer un élément en tête d\'une liste chaînée simple ?',
    options: [
      { text: 'O(n)', correct: false },
      { text: 'O(1)', correct: true, explanation: 'L\'insertion en tête d\'une liste chaînée est O(1) car il suffit de créer un nouveau nœud et le faire pointer vers l\'ancienne tête.' },
      { text: 'O(log n)', correct: false },
      { text: 'O(n log n)', correct: false },
    ],
  });

  // DS - MCQ 8
  await createMCQ(assessment.id, {
    category: 'DATA_STRUCTURES',
    subcategory: 'Trees',
    difficulty: 'HARD',
    points: 15,
    title: 'Parcours d\'arbre',
    description: 'Quel parcours d\'arbre binaire visite les nœuds dans l\'ordre : gauche, racine, droite ?',
    options: [
      { text: 'Pré-ordre (Preorder)', correct: false },
      { text: 'Post-ordre (Postorder)', correct: false },
      { text: 'In-ordre (Inorder)', correct: true, explanation: 'Le parcours in-ordre (inorder) visite d\'abord le sous-arbre gauche, puis la racine, puis le sous-arbre droit. Dans un BST, cela donne les éléments triés.' },
      { text: 'Par niveau (Level-order)', correct: false },
    ],
  });

  // DS - Coding 1
  await createCoding(assessment.id, {
    category: 'DATA_STRUCTURES',
    subcategory: 'Linked Lists',
    difficulty: 'MEDIUM',
    points: 20,
    title: 'Inverser une liste chaînée',
    description: 'Implémentez une fonction qui inverse une liste chaînée simple.\n\nEntrée: Une liste d\'entiers séparés par des espaces (représentant la liste chaînée)\nSortie: La liste inversée, éléments séparés par des espaces\n\nExemple:\nEntrée: 1 2 3 4 5\nSortie: 5 4 3 2 1',
    starterCode: {
      javascript: '// Lisez l\'entrée depuis stdin\nconst input = require("fs").readFileSync("/dev/stdin", "utf8").trim();\nconst arr = input.split(" ").map(Number);\n\n// Inversez le tableau\nfunction reverse(arr) {\n  // Votre code ici\n}\n\nconsole.log(reverse(arr).join(" "));',
      python: 'import sys\ninput_data = sys.stdin.read().strip()\narr = list(map(int, input_data.split()))\n\ndef reverse(arr):\n    # Votre code ici\n    pass\n\nprint(" ".join(map(str, reverse(arr))))',
    },
    testCases: [
      { input: '1 2 3 4 5', expectedOutput: '5 4 3 2 1', explanation: 'Inversion simple' },
      { input: '10 20 30', expectedOutput: '30 20 10', explanation: 'Trois éléments' },
      { input: '42', expectedOutput: '42', explanation: 'Un seul élément' },
    ],
    hiddenTestCases: [
      { input: '1 1 1 1', expectedOutput: '1 1 1 1', explanation: 'Éléments identiques' },
      { input: '5 4 3 2 1', expectedOutput: '1 2 3 4 5', explanation: 'Déjà en ordre inverse' },
    ],
    hints: ['Pensez à utiliser trois pointeurs: prev, current et next', 'Parcourez la liste en changeant les liens un par un'],
    constraints: 'La liste contient entre 1 et 10000 éléments. Chaque élément est un entier entre -10^6 et 10^6.',
    expectedComplexity: { time: 'O(n)', space: 'O(1)' },
  });

  // DS - Coding 2
  await createCoding(assessment.id, {
    category: 'DATA_STRUCTURES',
    subcategory: 'Trees',
    difficulty: 'HARD',
    points: 25,
    title: 'Arbre binaire équilibré',
    description: 'Déterminez si un arbre binaire est équilibré. Un arbre est équilibré si pour chaque nœud, la différence de hauteur entre le sous-arbre gauche et droit est au maximum 1.\n\nEntrée: Représentation de l\'arbre en ordre de niveau (BFS), avec "null" pour les nœuds manquants\nSortie: "true" ou "false"\n\nExemple:\nEntrée: 1 2 3 4 5 null null\nSortie: true',
    starterCode: {
      javascript: 'const input = require("fs").readFileSync("/dev/stdin", "utf8").trim();\nconst nodes = input.split(" ").map(v => v === "null" ? null : Number(v));\n\nfunction isBalanced(nodes) {\n  // Votre code ici\n}\n\nconsole.log(isBalanced(nodes) ? "true" : "false");',
      python: 'import sys\ninput_data = sys.stdin.read().strip()\nnodes = [None if v == "null" else int(v) for v in input_data.split()]\n\ndef is_balanced(nodes):\n    # Votre code ici\n    pass\n\nprint("true" if is_balanced(nodes) else "false")',
    },
    testCases: [
      { input: '1 2 3 4 5 null null', expectedOutput: 'true', explanation: 'Arbre équilibré' },
      { input: '1 2 null 3 null null null', expectedOutput: 'false', explanation: 'Arbre déséquilibré' },
    ],
    hiddenTestCases: [
      { input: '1', expectedOutput: 'true', explanation: 'Un seul nœud' },
      { input: '1 2 3', expectedOutput: 'true', explanation: 'Arbre parfait' },
    ],
    hints: ['Calculez la hauteur récursivement', 'Retournez -1 si le sous-arbre est déséquilibré'],
    constraints: 'L\'arbre contient entre 1 et 1000 nœuds.',
    expectedComplexity: { time: 'O(n)', space: 'O(h) où h est la hauteur' },
  });

  // DS - Coding 3
  await createCoding(assessment.id, {
    category: 'DATA_STRUCTURES',
    subcategory: 'Hash Tables',
    difficulty: 'MEDIUM',
    points: 20,
    title: 'Deux sommes (Two Sum)',
    description: 'Trouvez deux indices dans un tableau dont les éléments s\'additionnent pour donner une cible.\n\nEntrée: Première ligne = le tableau d\'entiers séparés par des espaces. Deuxième ligne = la valeur cible.\nSortie: Les deux indices séparés par un espace (0-indexed)\n\nExemple:\nEntrée:\n2 7 11 15\n9\nSortie: 0 1',
    starterCode: {
      javascript: 'const lines = require("fs").readFileSync("/dev/stdin", "utf8").trim().split("\\n");\nconst nums = lines[0].split(" ").map(Number);\nconst target = parseInt(lines[1]);\n\nfunction twoSum(nums, target) {\n  // Votre code ici\n}\n\nconst result = twoSum(nums, target);\nconsole.log(result.join(" "));',
      python: 'import sys\nlines = sys.stdin.read().strip().split("\\n")\nnums = list(map(int, lines[0].split()))\ntarget = int(lines[1])\n\ndef two_sum(nums, target):\n    # Votre code ici\n    pass\n\nresult = two_sum(nums, target)\nprint(" ".join(map(str, result)))',
    },
    testCases: [
      { input: '2 7 11 15\n9', expectedOutput: '0 1', explanation: '2 + 7 = 9' },
      { input: '3 2 4\n6', expectedOutput: '1 2', explanation: '2 + 4 = 6' },
    ],
    hiddenTestCases: [
      { input: '3 3\n6', expectedOutput: '0 1', explanation: 'Éléments identiques' },
      { input: '1 5 3 7 2\n9', expectedOutput: '1 3', explanation: '5 + 7 = 12... non, cherchez 9' },
    ],
    hints: ['Utilisez une table de hachage pour stocker les valeurs déjà vues', 'Pour chaque élément, vérifiez si (target - element) existe dans la map'],
    constraints: '2 ≤ longueur du tableau ≤ 10^4. Il existe exactement une solution.',
    expectedComplexity: { time: 'O(n)', space: 'O(n)' },
  });

  // ============================================================
  // ALGORITHMS QUESTIONS (15)
  // ============================================================

  // ALGO - MCQ 1
  await createMCQ(assessment.id, {
    category: 'ALGORITHMS',
    subcategory: 'Sorting',
    difficulty: 'EASY',
    points: 5,
    title: 'Meilleur cas de QuickSort',
    description: 'Quelle est la complexité temporelle dans le meilleur cas de l\'algorithme QuickSort ?',
    options: [
      { text: 'O(n)', correct: false },
      { text: 'O(n log n)', correct: true, explanation: 'Le meilleur cas de QuickSort est O(n log n), quand le pivot divise le tableau en deux moitiés égales à chaque étape.' },
      { text: 'O(n²)', correct: false },
      { text: 'O(log n)', correct: false },
    ],
  });

  // ALGO - MCQ 2
  await createMCQ(assessment.id, {
    category: 'ALGORITHMS',
    subcategory: 'Sorting',
    difficulty: 'MEDIUM',
    points: 10,
    title: 'Tri stable',
    description: 'Lequel de ces algorithmes de tri est stable ?',
    options: [
      { text: 'QuickSort', correct: false },
      { text: 'HeapSort', correct: false },
      { text: 'MergeSort', correct: true, explanation: 'MergeSort est un algorithme de tri stable : il préserve l\'ordre relatif des éléments ayant des clés égales.' },
      { text: 'Selection Sort', correct: false },
    ],
  });

  // ALGO - MCQ 3
  await createMCQ(assessment.id, {
    category: 'ALGORITHMS',
    subcategory: 'Dynamic Programming',
    difficulty: 'MEDIUM',
    points: 10,
    title: 'Technique d\'optimisation DP',
    description: 'Quelle technique la programmation dynamique utilise-t-elle pour optimiser les problèmes ?',
    options: [
      { text: 'Diviser pour régner uniquement', correct: false },
      { text: 'Mémorisation des sous-problèmes (Memoization)', correct: true, explanation: 'La programmation dynamique optimise en stockant les résultats des sous-problèmes déjà résolus pour éviter les calculs redondants.' },
      { text: 'Force brute optimisée', correct: false },
      { text: 'Algorithme glouton', correct: false },
    ],
  });

  // ALGO - MCQ 4
  await createMCQ(assessment.id, {
    category: 'ALGORITHMS',
    subcategory: 'Searching',
    difficulty: 'EASY',
    points: 5,
    title: 'Recherche binaire - prérequis',
    description: 'Quel est le prérequis pour utiliser la recherche binaire ?',
    options: [
      { text: 'Le tableau doit être trié', correct: true, explanation: 'La recherche binaire nécessite un tableau trié pour fonctionner correctement car elle élimine la moitié des éléments à chaque étape.' },
      { text: 'Le tableau doit contenir des entiers', correct: false },
      { text: 'Le tableau doit avoir une taille paire', correct: false },
      { text: 'Aucun prérequis', correct: false },
    ],
  });

  // ALGO - MCQ 5
  await createMCQ(assessment.id, {
    category: 'ALGORITHMS',
    subcategory: 'Algorithmic Complexity',
    difficulty: 'MEDIUM',
    points: 10,
    title: 'Notation Big-O',
    description: 'Quelle est la complexité temporelle de l\'algorithme suivant ?\n\nfor (int i = 0; i < n; i++)\n  for (int j = i; j < n; j++)\n    // opération O(1)',
    options: [
      { text: 'O(n)', correct: false },
      { text: 'O(n log n)', correct: false },
      { text: 'O(n²)', correct: true, explanation: 'La boucle externe fait n itérations. La boucle interne fait n-i itérations. Le total est n + (n-1) + ... + 1 = n(n+1)/2 = O(n²).' },
      { text: 'O(2^n)', correct: false },
    ],
  });

  // ALGO - MCQ 6
  await createMCQ(assessment.id, {
    category: 'ALGORITHMS',
    subcategory: 'Recursion',
    difficulty: 'MEDIUM',
    points: 10,
    title: 'Cas de base en récursion',
    description: 'Que se passe-t-il si une fonction récursive n\'a pas de cas de base ?',
    options: [
      { text: 'Elle retourne null', correct: false },
      { text: 'Elle provoque un débordement de pile (Stack Overflow)', correct: true, explanation: 'Sans cas de base, la récursion ne s\'arrête jamais, empilant des appels jusqu\'à ce que la pile mémoire soit pleine, provoquant un Stack Overflow.' },
      { text: 'Elle s\'arrête automatiquement', correct: false },
      { text: 'Elle retourne 0', correct: false },
    ],
  });

  // ALGO - MCQ 7
  await createMCQ(assessment.id, {
    category: 'ALGORITHMS',
    subcategory: 'Algorithmic Complexity',
    difficulty: 'HARD',
    points: 15,
    title: 'Complexité amortie',
    description: 'Quelle est la complexité amortie d\'une insertion dans un tableau dynamique (ArrayList/vector) ?',
    options: [
      { text: 'O(1)', correct: true, explanation: 'Bien que le redimensionnement coûte O(n), il ne se produit que rarement. En amortissant sur toutes les insertions, chaque insertion coûte O(1) en moyenne.' },
      { text: 'O(n)', correct: false },
      { text: 'O(log n)', correct: false },
      { text: 'O(n²)', correct: false },
    ],
  });

  // ALGO - Coding 1
  await createCoding(assessment.id, {
    category: 'ALGORITHMS',
    subcategory: 'Searching',
    difficulty: 'EASY',
    points: 15,
    title: 'Recherche binaire',
    description: 'Implémentez la recherche binaire sur un tableau trié.\n\nEntrée: Première ligne = tableau trié d\'entiers. Deuxième ligne = valeur à chercher.\nSortie: L\'index de l\'élément (0-indexed), ou -1 s\'il n\'existe pas.\n\nExemple:\nEntrée:\n1 3 5 7 9 11\n7\nSortie: 3',
    starterCode: {
      javascript: 'const lines = require("fs").readFileSync("/dev/stdin", "utf8").trim().split("\\n");\nconst arr = lines[0].split(" ").map(Number);\nconst target = parseInt(lines[1]);\n\nfunction binarySearch(arr, target) {\n  // Votre code ici\n}\n\nconsole.log(binarySearch(arr, target));',
      python: 'import sys\nlines = sys.stdin.read().strip().split("\\n")\narr = list(map(int, lines[0].split()))\ntarget = int(lines[1])\n\ndef binary_search(arr, target):\n    # Votre code ici\n    pass\n\nprint(binary_search(arr, target))',
    },
    testCases: [
      { input: '1 3 5 7 9 11\n7', expectedOutput: '3', explanation: '7 est à l\'index 3' },
      { input: '2 4 6 8 10\n5', expectedOutput: '-1', explanation: '5 n\'est pas dans le tableau' },
      { input: '1\n1', expectedOutput: '0', explanation: 'Un seul élément' },
    ],
    hiddenTestCases: [
      { input: '1 2 3 4 5 6 7 8 9 10\n1', expectedOutput: '0', explanation: 'Premier élément' },
      { input: '1 2 3 4 5 6 7 8 9 10\n10', expectedOutput: '9', explanation: 'Dernier élément' },
    ],
    hints: ['Maintenez deux pointeurs: gauche et droite', 'Calculez le milieu et comparez avec la cible'],
    constraints: '1 ≤ taille du tableau ≤ 10^6. Le tableau est trié en ordre croissant.',
    expectedComplexity: { time: 'O(log n)', space: 'O(1)' },
  });

  // ALGO - Coding 2
  await createCoding(assessment.id, {
    category: 'ALGORITHMS',
    subcategory: 'Dynamic Programming',
    difficulty: 'MEDIUM',
    points: 20,
    title: 'Fibonacci avec mémorisation',
    description: 'Calculez le n-ième nombre de Fibonacci en utilisant la mémorisation (programmation dynamique).\n\nEntrée: Un entier n\nSortie: Le n-ième nombre de Fibonacci\n\nF(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2)\n\nExemple:\nEntrée: 10\nSortie: 55',
    starterCode: {
      javascript: 'const n = parseInt(require("fs").readFileSync("/dev/stdin", "utf8").trim());\n\nfunction fibonacci(n) {\n  // Votre code ici - utilisez la mémorisation\n}\n\nconsole.log(fibonacci(n));',
      python: 'import sys\nn = int(sys.stdin.read().strip())\n\ndef fibonacci(n):\n    # Votre code ici - utilisez la mémorisation\n    pass\n\nprint(fibonacci(n))',
    },
    testCases: [
      { input: '10', expectedOutput: '55', explanation: 'F(10) = 55' },
      { input: '0', expectedOutput: '0', explanation: 'F(0) = 0' },
      { input: '1', expectedOutput: '1', explanation: 'F(1) = 1' },
    ],
    hiddenTestCases: [
      { input: '20', expectedOutput: '6765', explanation: 'F(20) = 6765' },
      { input: '30', expectedOutput: '832040', explanation: 'F(30) = 832040' },
    ],
    hints: ['Créez un tableau/dictionnaire pour stocker les résultats', 'Approche bottom-up: remplissez de F(0) à F(n)'],
    constraints: '0 ≤ n ≤ 40',
    expectedComplexity: { time: 'O(n)', space: 'O(n)' },
  });

  // ALGO - Coding 3
  await createCoding(assessment.id, {
    category: 'ALGORITHMS',
    subcategory: 'Sorting',
    difficulty: 'MEDIUM',
    points: 20,
    title: 'Tri fusion (Merge Sort)',
    description: 'Implémentez l\'algorithme de tri fusion (Merge Sort).\n\nEntrée: Un tableau d\'entiers séparés par des espaces\nSortie: Le tableau trié en ordre croissant\n\nExemple:\nEntrée: 38 27 43 3 9 82 10\nSortie: 3 9 10 27 38 43 82',
    starterCode: {
      javascript: 'const input = require("fs").readFileSync("/dev/stdin", "utf8").trim();\nconst arr = input.split(" ").map(Number);\n\nfunction mergeSort(arr) {\n  // Votre code ici\n}\n\nconsole.log(mergeSort(arr).join(" "));',
      python: 'import sys\ninput_data = sys.stdin.read().strip()\narr = list(map(int, input_data.split()))\n\ndef merge_sort(arr):\n    # Votre code ici\n    pass\n\nprint(" ".join(map(str, merge_sort(arr))))',
    },
    testCases: [
      { input: '38 27 43 3 9 82 10', expectedOutput: '3 9 10 27 38 43 82', explanation: 'Tri standard' },
      { input: '5 4 3 2 1', expectedOutput: '1 2 3 4 5', explanation: 'Ordre inverse' },
    ],
    hiddenTestCases: [
      { input: '1', expectedOutput: '1', explanation: 'Un seul élément' },
      { input: '3 3 3', expectedOutput: '3 3 3', explanation: 'Éléments identiques' },
      { input: '1 2 3 4 5', expectedOutput: '1 2 3 4 5', explanation: 'Déjà trié' },
    ],
    hints: ['Divisez le tableau en deux moitiés', 'Fusionnez les deux moitiés triées'],
    constraints: '1 ≤ taille ≤ 10^5. -10^6 ≤ éléments ≤ 10^6.',
    expectedComplexity: { time: 'O(n log n)', space: 'O(n)' },
  });

  // ALGO - Coding 4
  await createCoding(assessment.id, {
    category: 'ALGORITHMS',
    subcategory: 'Recursion',
    difficulty: 'EASY',
    points: 15,
    title: 'Factorielle récursive',
    description: 'Calculez la factorielle d\'un nombre en utilisant la récursion.\n\nEntrée: Un entier n\nSortie: n! (n factorielle)\n\nExemple:\nEntrée: 5\nSortie: 120',
    starterCode: {
      javascript: 'const n = parseInt(require("fs").readFileSync("/dev/stdin", "utf8").trim());\n\nfunction factorial(n) {\n  // Votre code ici (récursif)\n}\n\nconsole.log(factorial(n));',
      python: 'import sys\nn = int(sys.stdin.read().strip())\n\ndef factorial(n):\n    # Votre code ici (récursif)\n    pass\n\nprint(factorial(n))',
    },
    testCases: [
      { input: '5', expectedOutput: '120', explanation: '5! = 120' },
      { input: '0', expectedOutput: '1', explanation: '0! = 1' },
      { input: '1', expectedOutput: '1', explanation: '1! = 1' },
    ],
    hiddenTestCases: [
      { input: '10', expectedOutput: '3628800', explanation: '10! = 3628800' },
    ],
    hints: ['Cas de base: 0! = 1', 'Cas récursif: n! = n * (n-1)!'],
    constraints: '0 ≤ n ≤ 20',
    expectedComplexity: { time: 'O(n)', space: 'O(n)' },
  });

  // ============================================================
  // OOP QUESTIONS (10)
  // ============================================================

  // OOP - MCQ 1
  await createMCQ(assessment.id, {
    category: 'OOP',
    subcategory: 'SOLID Principles',
    difficulty: 'MEDIUM',
    points: 10,
    title: 'Principe de Responsabilité Unique',
    description: 'Quel principe SOLID stipule qu\'une classe ne doit avoir qu\'une seule raison de changer ?',
    options: [
      { text: 'Open/Closed Principle', correct: false },
      { text: 'Single Responsibility Principle', correct: true, explanation: 'Le SRP (Single Responsibility Principle) stipule qu\'une classe doit avoir une seule responsabilité et donc une seule raison de changer.' },
      { text: 'Liskov Substitution Principle', correct: false },
      { text: 'Interface Segregation Principle', correct: false },
    ],
  });

  // OOP - MCQ 2
  await createMCQ(assessment.id, {
    category: 'OOP',
    subcategory: 'Encapsulation',
    difficulty: 'EASY',
    points: 5,
    title: 'Abstraction vs Encapsulation',
    description: 'Quelle est la principale différence entre l\'abstraction et l\'encapsulation ?',
    options: [
      { text: 'L\'abstraction cache la complexité, l\'encapsulation cache les données', correct: true, explanation: 'L\'abstraction montre uniquement les fonctionnalités essentielles en cachant la complexité. L\'encapsulation regroupe les données et méthodes et restreint l\'accès direct.' },
      { text: 'Ce sont des synonymes', correct: false },
      { text: 'L\'encapsulation cache la complexité, l\'abstraction cache les données', correct: false },
      { text: 'Elles n\'ont aucun rapport', correct: false },
    ],
  });

  // OOP - MCQ 3
  await createMCQ(assessment.id, {
    category: 'OOP',
    subcategory: 'Inheritance',
    difficulty: 'MEDIUM',
    points: 10,
    title: 'Héritage multiple',
    description: 'Quel type d\'héritage n\'est PAS directement supporté en Java ?',
    options: [
      { text: 'Héritage simple', correct: false },
      { text: 'Héritage multiple de classes', correct: true, explanation: 'Java ne supporte pas l\'héritage multiple de classes (une classe ne peut étendre qu\'une seule classe). Cependant, il supporte l\'implémentation de multiples interfaces.' },
      { text: 'Héritage hiérarchique', correct: false },
      { text: 'Héritage multiniveau', correct: false },
    ],
  });

  // OOP - MCQ 4
  await createMCQ(assessment.id, {
    category: 'OOP',
    subcategory: 'Polymorphism',
    difficulty: 'MEDIUM',
    points: 10,
    title: 'Types de polymorphisme',
    description: 'Quelle est la différence entre le polymorphisme de compilation (overloading) et d\'exécution (overriding) ?',
    options: [
      { text: 'L\'overloading change le type de retour, l\'overriding change les paramètres', correct: false },
      { text: 'L\'overloading a plusieurs méthodes avec le même nom mais des paramètres différents, l\'overriding redéfinit une méthode de la classe parent', correct: true, explanation: 'L\'overloading (surcharge) crée plusieurs méthodes avec le même nom mais des signatures différentes. L\'overriding (redéfinition) fournit une implémentation spécifique d\'une méthode héritée.' },
      { text: 'Ce sont des synonymes', correct: false },
      { text: 'L\'overriding ne peut se faire qu\'avec des interfaces', correct: false },
    ],
  });

  // OOP - MCQ 5
  await createMCQ(assessment.id, {
    category: 'OOP',
    subcategory: 'SOLID Principles',
    difficulty: 'HARD',
    points: 15,
    title: 'Principe Ouvert/Fermé',
    description: 'Selon le principe Open/Closed, les entités logicielles doivent être :',
    options: [
      { text: 'Ouvertes à la modification, fermées à l\'extension', correct: false },
      { text: 'Ouvertes à l\'extension, fermées à la modification', correct: true, explanation: 'Le principe OCP stipule que les classes doivent être ouvertes à l\'extension (on peut ajouter de nouvelles fonctionnalités) mais fermées à la modification (sans changer le code existant).' },
      { text: 'Fermées à tout changement', correct: false },
      { text: 'Ouvertes à tout changement', correct: false },
    ],
  });

  // OOP - Coding 1
  await createCoding(assessment.id, {
    category: 'OOP',
    subcategory: 'Inheritance',
    difficulty: 'MEDIUM',
    points: 20,
    title: 'Hiérarchie de véhicules',
    description: 'Créez une hiérarchie de classes pour des véhicules.\n\nEntrée: Le type de véhicule (car, truck, motorcycle)\nSortie: Les caractéristiques du véhicule au format "Type: X, Wheels: Y, Engine: Z"\n\nExemple:\nEntrée: car\nSortie: Type: Car, Wheels: 4, Engine: Gasoline',
    starterCode: {
      javascript: 'const type = require("fs").readFileSync("/dev/stdin", "utf8").trim();\n\nclass Vehicle {\n  // Définissez la classe de base\n}\n\nclass Car extends Vehicle {\n  // Votre code\n}\n\nclass Truck extends Vehicle {\n  // Votre code\n}\n\nclass Motorcycle extends Vehicle {\n  // Votre code\n}\n\n// Créez le véhicule approprié et affichez ses caractéristiques\n',
      python: 'import sys\nvehicle_type = sys.stdin.read().strip()\n\nclass Vehicle:\n    # Définissez la classe de base\n    pass\n\nclass Car(Vehicle):\n    # Votre code\n    pass\n\nclass Truck(Vehicle):\n    # Votre code\n    pass\n\nclass Motorcycle(Vehicle):\n    # Votre code\n    pass\n\n# Créez le véhicule approprié et affichez ses caractéristiques\n',
    },
    testCases: [
      { input: 'car', expectedOutput: 'Type: Car, Wheels: 4, Engine: Gasoline', explanation: 'Voiture standard' },
      { input: 'truck', expectedOutput: 'Type: Truck, Wheels: 6, Engine: Diesel', explanation: 'Camion' },
      { input: 'motorcycle', expectedOutput: 'Type: Motorcycle, Wheels: 2, Engine: Gasoline', explanation: 'Moto' },
    ],
    hiddenTestCases: [],
    hints: ['Créez une classe Vehicle avec les propriétés communes', 'Chaque sous-classe redéfinit les propriétés spécifiques'],
    constraints: 'L\'entrée sera toujours car, truck ou motorcycle.',
    expectedComplexity: { time: 'O(1)', space: 'O(1)' },
  });

  // OOP - Coding 2
  await createCoding(assessment.id, {
    category: 'OOP',
    subcategory: 'Abstraction',
    difficulty: 'HARD',
    points: 25,
    title: 'Pattern Observer',
    description: 'Implémentez un système de notification simple basé sur le pattern Observer.\n\nEntrée: Commandes séparées par des retours à la ligne:\n- "subscribe NAME" - ajouter un observateur\n- "unsubscribe NAME" - retirer un observateur\n- "notify MESSAGE" - notifier tous les observateurs\n\nSortie: Pour chaque notify, afficher "NAME received: MESSAGE" pour chaque observateur abonné, un par ligne, dans l\'ordre d\'abonnement.\n\nExemple:\nEntrée:\nsubscribe Alice\nsubscribe Bob\nnotify Hello\nunsubscribe Alice\nnotify World\n\nSortie:\nAlice received: Hello\nBob received: Hello\nBob received: World',
    starterCode: {
      javascript: 'const input = require("fs").readFileSync("/dev/stdin", "utf8").trim();\nconst commands = input.split("\\n");\n\n// Implémentez le pattern Observer ici\n',
      python: 'import sys\ncommands = sys.stdin.read().strip().split("\\n")\n\n# Implémentez le pattern Observer ici\n',
    },
    testCases: [
      {
        input: 'subscribe Alice\nsubscribe Bob\nnotify Hello\nunsubscribe Alice\nnotify World',
        expectedOutput: 'Alice received: Hello\nBob received: Hello\nBob received: World',
        explanation: 'Observer pattern basique',
      },
    ],
    hiddenTestCases: [
      {
        input: 'subscribe X\nnotify Test\nunsubscribe X\nnotify Empty',
        expectedOutput: 'X received: Test',
        explanation: 'Notification sans observateurs',
      },
    ],
    hints: ['Créez une classe Subject/EventEmitter', 'Maintenez une liste d\'observateurs', 'subscribe ajoute, unsubscribe retire, notify itère'],
    constraints: 'Les noms sont uniques. Les commandes sont toujours valides.',
    expectedComplexity: { time: 'O(n*m) où n=commandes, m=observateurs', space: 'O(m)' },
  });

  // ============================================================
  // CRITICAL THINKING QUESTIONS (8)
  // ============================================================

  // CT - 1: Scenario-based ethical reasoning
  await createMCQ(assessment.id, {
    category: 'CRITICAL_THINKING',
    subcategory: 'Ethics',
    difficulty: 'MEDIUM',
    points: 10,
    title: 'Dilemme de code review',
    description: "Vous faites une code review et decouvrez qu'un collegue senior a introduit un bug critique dans un module de paiement. La deadline est dans 2 heures et corriger le bug retarderait la livraison de 1 jour. Votre manager insiste pour livrer a temps. Quelle est la meilleure approche ?",
    options: [
      { text: "Signaler le bug immediatement a l'equipe, proposer un correctif, et negocier un delai avec le manager en expliquant le risque financier", correct: true, explanation: "La transparence et la priorisation de la qualite sur les deadlines est essentielle, surtout pour un module de paiement ou les consequences d'un bug peuvent etre graves." },
      { text: "Ignorer le bug et livrer a temps, on corrigera en hotfix", correct: false },
      { text: "Corriger silencieusement le bug sans en informer personne", correct: false },
      { text: "Envoyer un email au collegue pour qu'il corrige lui-meme", correct: false },
    ],
  });

  // CT - 2: Prioritization under pressure
  await createMCQ(assessment.id, {
    category: 'CRITICAL_THINKING',
    subcategory: 'Prioritization',
    difficulty: 'HARD',
    points: 15,
    title: 'Gestion de crise en production',
    description: "Un vendredi a 17h, trois incidents surviennent simultanement:\n\n1. L'API de paiement retourne des erreurs 500 pour 10% des utilisateurs\n2. Un rapport montre une fuite de donnees potentielle dans les logs\n3. Le CEO demande une demo pour un investisseur lundi matin\n\nVous etes le seul developpeur disponible. Comment priorisez-vous ?",
    options: [
      { text: "2 (fuite de donnees) > 1 (API paiement) > 3 (demo) - La securite des donnees est la priorite absolue, suivie de l'impact utilisateur", correct: true, explanation: "Une fuite de donnees potentielle est un incident de securite critique qui peut avoir des consequences legales (RGPD). L'API de paiement impacte directement le revenu. La demo peut etre replanifiee." },
      { text: "1 > 3 > 2 - L'argent d'abord, puis le business, la securite peut attendre", correct: false },
      { text: "3 > 1 > 2 - Le CEO passe en premier", correct: false },
      { text: "Traiter les trois en parallele en faisant du multitasking", correct: false },
    ],
  });

  // CT - 3: Identifying hidden assumptions
  await createMCQ(assessment.id, {
    category: 'CRITICAL_THINKING',
    subcategory: 'Analysis',
    difficulty: 'MEDIUM',
    points: 10,
    title: 'Biais de survivant',
    description: "Votre equipe analyse les performances: 'Les 5 derniers projets livres a temps utilisaient tous React. On devrait donc toujours utiliser React pour respecter les deadlines.'\n\nQuel est le probleme principal de ce raisonnement ?",
    options: [
      { text: "Biais de survivant: on ignore les projets React qui ont echoue ou ete en retard, et on ne considere pas les projets reussis avec d'autres technologies", correct: true, explanation: "Le biais de survivant consiste a tirer des conclusions uniquement a partir des cas de succes visibles, en ignorant les echecs qui ne sont pas comptabilises." },
      { text: "L'echantillon de 5 projets est suffisant pour conclure", correct: false },
      { text: "React est effectivement le meilleur framework pour les deadlines", correct: false },
      { text: "Le probleme est que l'equipe n'utilise pas assez de frameworks differents", correct: false },
    ],
  });

  // CT - 4: Evaluating trade-offs
  await createMCQ(assessment.id, {
    category: 'CRITICAL_THINKING',
    subcategory: 'Trade-offs',
    difficulty: 'HARD',
    points: 15,
    title: 'Dette technique vs. velocite',
    description: "Votre startup a leve des fonds et doit livrer un MVP en 3 mois. L'architecte propose deux approches:\n\nA) Architecture microservices propre: 5 mois, scalable, maintenable\nB) Monolithe rapide: 2 mois, dette technique elevee, refactoring necessaire plus tard\n\nLe CTO vous demande votre avis. Quel raisonnement est le plus pertinent ?",
    options: [
      { text: "B avec un plan de refactoring documente - Le MVP doit valider l'idee avant d'investir dans l'architecture. Sans product-market fit, une architecture parfaite ne sert a rien", correct: true, explanation: "Dans le contexte startup avec runway limite, valider le marche est prioritaire. La dette technique est acceptable si elle est consciente, documentee et planifiee pour etre remboursee." },
      { text: "A car une bonne architecture des le depart evite tous les problemes futurs", correct: false },
      { text: "B sans plan de refactoring, on verra plus tard", correct: false },
      { text: "Ni A ni B, utiliser un no-code tool a la place", correct: false },
    ],
  });

  // CT - 5: Communication and empathy
  await createMCQ(assessment.id, {
    category: 'CRITICAL_THINKING',
    subcategory: 'Communication',
    difficulty: 'EASY',
    points: 5,
    title: 'Feedback constructif',
    description: "Un junior dans votre equipe soumet du code avec plusieurs problemes de qualite. C'est sa premiere semaine. Comment reagissez-vous ?",
    options: [
      { text: "Faire une review detaillee avec des commentaires educatifs, expliquer le 'pourquoi' de chaque suggestion, et proposer un moment de pair programming", correct: true, explanation: "L'accompagnement bienveillant et educatif favorise l'apprentissage et la confiance. Expliquer le raisonnement derriere les standards aide a former l'esprit critique du junior." },
      { text: "Rejeter la PR avec un commentaire 'A refaire, ne respecte pas les standards'", correct: false },
      { text: "Corriger le code vous-meme pour aller plus vite", correct: false },
      { text: "Accepter le code tel quel pour ne pas decourager le junior", correct: false },
    ],
  });

  // CT - 6: Root cause analysis
  await createMCQ(assessment.id, {
    category: 'CRITICAL_THINKING',
    subcategory: 'Root Cause',
    difficulty: 'MEDIUM',
    points: 10,
    title: 'Les 5 Pourquoi',
    description: "Un bug en production fait planter l'application toutes les nuits a 3h du matin. L'equipe applique la methode des '5 Pourquoi':\n\n1. Pourquoi le crash ? -> Memoire saturee\n2. Pourquoi memoire saturee ? -> Un cron job charge toute la table users en memoire\n3. Pourquoi charge tout ? -> La requete n'a pas de LIMIT\n4. Pourquoi pas de LIMIT ? -> Le developpeur ne savait pas que la table avait grandi\n5. Pourquoi ne savait pas ? -> ???\n\nQuelle est la cause racine la plus probable au 5eme 'Pourquoi' ?",
    options: [
      { text: "Absence de monitoring/alerting sur la taille des tables et la consommation memoire, et manque de documentation sur les contraintes de performance", correct: true, explanation: "La vraie cause racine est systemique: l'absence d'outils de monitoring et de documentation qui auraient alerte l'equipe avant que le probleme ne survienne." },
      { text: "Le developpeur est incompetent", correct: false },
      { text: "La base de donnees est mal configuree", correct: false },
      { text: "Le cron job aurait du etre desactive", correct: false },
    ],
  });

  // CT - 7: Self-awareness
  await createMCQ(assessment.id, {
    category: 'CRITICAL_THINKING',
    subcategory: 'Self-Awareness',
    difficulty: 'EASY',
    points: 5,
    title: 'Syndrome de l\'imposteur vs. Dunning-Kruger',
    description: "Apres 6 mois en tant que developpeur junior, vous vous sentez incapable par rapport a vos collegues seniors qui semblent tout savoir. Quelle est la reaction la plus mature ?",
    options: [
      { text: "Reconnaitre que c'est normal de se sentir ainsi en debut de carriere, identifier ses lacunes specifiques, et etablir un plan d'apprentissage cible tout en valorisant ses progres", correct: true, explanation: "La conscience de ses limites est un signe d'intelligence emotionnelle. L'approche constructive est de transformer ce sentiment en moteur d'apprentissage structure." },
      { text: "Travailler 80h par semaine pour rattraper les seniors", correct: false },
      { text: "Changer de carriere car le developpement n'est pas fait pour vous", correct: false },
      { text: "Ignorer le sentiment et faire semblant de tout maitriser", correct: false },
    ],
  });

  // CT - 8: Systems thinking
  await createMCQ(assessment.id, {
    category: 'CRITICAL_THINKING',
    subcategory: 'Systems Thinking',
    difficulty: 'HARD',
    points: 15,
    title: 'Impact en cascade',
    description: "Votre equipe decide de migrer la base de donnees de MySQL vers PostgreSQL pendant un week-end. Quels impacts indirects faut-il anticiper au-dela de la migration technique elle-meme ?",
    options: [
      { text: "Les ORM/requetes specifiques a MySQL, les backups/monitoring, les scripts de deploiement CI/CD, la documentation, les environnements de dev/staging, et les equipes tierces qui consomment la DB", correct: true, explanation: "La pensee systemique implique de considerer tous les composants connectes au systeme modifie: code applicatif, infrastructure, processus humains, et dependances externes." },
      { text: "Juste exporter et reimporter les donnees suffit", correct: false },
      { text: "Seules les requetes SQL doivent etre adaptees", correct: false },
      { text: "Il suffit de changer la connection string dans le .env", correct: false },
    ],
  });

  // ============================================================
  // LOGICAL REASONING QUESTIONS (8)
  // ============================================================

  // LR - 1: Pattern recognition
  await createMCQ(assessment.id, {
    category: 'LOGICAL_REASONING',
    subcategory: 'Patterns',
    difficulty: 'EASY',
    points: 5,
    title: 'Sequence logique',
    description: "Trouvez le prochain element de la sequence:\n\n2, 6, 14, 30, 62, ?\n\nIndice: observez la relation entre chaque nombre et le suivant.",
    options: [
      { text: '126', correct: true, explanation: 'Chaque nombre est le double du precedent + 2: 2*2+2=6, 6*2+2=14, 14*2+2=30, 30*2+2=62, 62*2+2=126' },
      { text: '94', correct: false },
      { text: '124', correct: false },
      { text: '130', correct: false },
    ],
  });

  // LR - 2: Deductive reasoning
  await createMCQ(assessment.id, {
    category: 'LOGICAL_REASONING',
    subcategory: 'Deduction',
    difficulty: 'MEDIUM',
    points: 10,
    title: 'Deduction logique',
    description: "Trois developpeurs (Alice, Bob, Charlie) travaillent sur trois langages differents (Python, Java, Rust) dans trois equipes differentes (Backend, Frontend, DevOps).\n\n- Alice ne travaille pas en Backend\n- Le developpeur Python est en DevOps\n- Bob travaille en Frontend\n- Charlie ne connait pas Python\n\nQui travaille en Backend et avec quel langage ?",
    options: [
      { text: 'Charlie en Backend avec Java ou Rust (pas Python car il ne le connait pas, et le dev Python est en DevOps)', correct: true, explanation: "Bob est en Frontend, Alice n'est pas en Backend, donc Charlie est en Backend. Le dev Python est en DevOps et Charlie ne connait pas Python, donc Charlie utilise Java ou Rust." },
      { text: 'Alice en Backend avec Python', correct: false },
      { text: 'Bob en Backend avec Java', correct: false },
      { text: 'Alice en Backend avec Rust', correct: false },
    ],
  });

  // LR - 3: Logical fallacies
  await createMCQ(assessment.id, {
    category: 'LOGICAL_REASONING',
    subcategory: 'Fallacies',
    difficulty: 'MEDIUM',
    points: 10,
    title: 'Identifier le sophisme',
    description: "Un collegue argumente: 'Google utilise Kubernetes en production. Si on veut reussir comme Google, on doit absolument utiliser Kubernetes.'\n\nQuel type de raisonnement fallacieux est-ce ?",
    options: [
      { text: "Faux raisonnement par analogie / Appel a l'autorite: le succes de Google ne vient pas de Kubernetes, et leur contexte (echelle, ressources, equipes) est radicalement different", correct: true, explanation: "C'est un melange d'appel a l'autorite et de fausse causalite. Le succes de Google est du a de multiples facteurs, pas uniquement a un choix technologique specifique." },
      { text: "C'est un raisonnement parfaitement valide", correct: false },
      { text: "C'est juste une question de preference personnelle", correct: false },
      { text: "Le probleme est que Kubernetes est trop complexe", correct: false },
    ],
  });

  // LR - 4: Conditional logic
  await createMCQ(assessment.id, {
    category: 'LOGICAL_REASONING',
    subcategory: 'Conditional Logic',
    difficulty: 'EASY',
    points: 5,
    title: 'Contraposee logique',
    description: "Si l'affirmation suivante est VRAIE:\n\n'Si un programme compile sans erreur, alors il n'a pas d'erreur de syntaxe.'\n\nLaquelle de ces affirmations est NECESSAIREMENT vraie ?",
    options: [
      { text: "Si un programme a une erreur de syntaxe, alors il ne compile pas sans erreur (contraposee)", correct: true, explanation: "La contraposee d'une implication est toujours logiquement equivalente. Si P implique Q, alors non-Q implique non-P." },
      { text: "Si un programme n'a pas d'erreur de syntaxe, il compile sans erreur", correct: false },
      { text: "Si un programme ne compile pas, il a une erreur de syntaxe", correct: false },
      { text: "Un programme qui compile n'a aucun bug", correct: false },
    ],
  });

  // LR - 5: Estimation and reasoning
  await createMCQ(assessment.id, {
    category: 'LOGICAL_REASONING',
    subcategory: 'Estimation',
    difficulty: 'HARD',
    points: 15,
    title: 'Estimation de Fermi',
    description: "Vous devez estimer le nombre de requetes HTTP que recoit Google Search par seconde dans le monde. Votre raisonnement:\n\n- Population mondiale: ~8 milliards\n- Utilisateurs internet actifs: ~5 milliards\n- % qui utilisent Google: ~85% -> ~4.25 milliards\n- Recherches par utilisateur par jour: ~3-5\n- Total par jour: ~4.25B * 4 = ~17 milliards\n- Par seconde: 17B / 86400 = ?\n\nQuel est l'ordre de grandeur le plus proche ?",
    options: [
      { text: '~200 000 requetes/seconde (environ 200K QPS)', correct: true, explanation: '17 milliards / 86400 secondes = ~196 759, soit environ 200 000 requetes par seconde. Le chiffre reel de Google est estime entre 100K et 300K QPS.' },
      { text: '~2 000 requetes/seconde', correct: false },
      { text: '~2 millions requetes/seconde', correct: false },
      { text: '~20 000 requetes/seconde', correct: false },
    ],
  });

  // LR - 6: Debugging logic
  await createMCQ(assessment.id, {
    category: 'LOGICAL_REASONING',
    subcategory: 'Debugging',
    difficulty: 'MEDIUM',
    points: 10,
    title: 'Elimination systematique',
    description: "Un bug n'apparait que le lundi matin. Vous avez identifie 4 hypotheses:\n\nA) Un cron job qui tourne le dimanche soir\nB) Un cache qui expire tous les 7 jours\nC) Un fichier de config qui est ecrase par le deploiement du vendredi\nD) Un probleme lie au fuseau horaire UTC vs local\n\nVous decouvrez que le bug apparait aussi quand vous changez manuellement la date du serveur au lundi. Quelles hypotheses cela elimine-t-il ?",
    options: [
      { text: "Cela elimine C (deploiement vendredi) car changer la date ne declenche pas de deploiement. A, B et D restent possibles car ils sont lies au temps", correct: true, explanation: "Si le bug se reproduit uniquement en changeant la date, le probleme est lie au temps/calendrier, pas a un evenement externe comme un deploiement." },
      { text: "Cela elimine toutes les hypotheses", correct: false },
      { text: "Cela confirme D uniquement", correct: false },
      { text: "Cela ne donne aucune information utile", correct: false },
    ],
  });

  // LR - 7: Probability and risk
  await createMCQ(assessment.id, {
    category: 'LOGICAL_REASONING',
    subcategory: 'Probability',
    difficulty: 'HARD',
    points: 15,
    title: 'Paradoxe de Monty Hall adapte',
    description: "Trois serveurs (A, B, C) ont un probleme. Vous pensez que c'est le serveur A (1 chance sur 3). Votre collegue, qui connait la reponse, vous revele que le serveur C n'a PAS de probleme.\n\nDevriez-vous changer votre choix pour le serveur B ?",
    options: [
      { text: "Oui, changer pour B donne 2/3 de chances d'avoir raison (contre 1/3 en restant sur A)", correct: true, explanation: "C'est le paradoxe de Monty Hall. Le choix initial avait 1/3 de chances. L'elimination d'une mauvaise option transfere sa probabilite a l'autre option non choisie, donnant 2/3 a B." },
      { text: "Non, chaque serveur a maintenant 50/50", correct: false },
      { text: "Ca ne change rien, rester sur A", correct: false },
      { text: "Impossible a determiner sans plus d'informations", correct: false },
    ],
  });

  // LR - 8: Abstract reasoning
  await createMCQ(assessment.id, {
    category: 'LOGICAL_REASONING',
    subcategory: 'Abstract',
    difficulty: 'MEDIUM',
    points: 10,
    title: 'Raisonnement par analogie',
    description: "Completez l'analogie:\n\nGit est au code source ce que ___ est a une base de donnees.\n\nChoisissez l'analogie la plus precise.",
    options: [
      { text: "Les migrations (schema versioning) - car elles tracent l'historique des changements de structure, permettent de revenir en arriere, et documentent l'evolution", correct: true, explanation: "Les migrations sont l'equivalent du versioning Git pour les bases de donnees: historique des changements, rollback possible, et traçabilite." },
      { text: "Les backups - car ils sauvegardent les donnees", correct: false },
      { text: "Les index - car ils optimisent les performances", correct: false },
      { text: "Les triggers - car ils automatisent des actions", correct: false },
    ],
  });

  console.log('✅ All questions seeded!');
  console.log('📊 Total questions created: 55+');
}

// Helper functions
async function createMCQ(assessmentId: string, data: {
  category: string;
  subcategory: string;
  difficulty: string;
  points: number;
  title: string;
  description: string;
  options: { text: string; correct: boolean; explanation?: string }[];
}) {
  await prisma.question.create({
    data: {
      assessmentId,
      category: data.category as any,
      subcategory: data.subcategory,
      type: 'MULTIPLE_CHOICE',
      difficulty: data.difficulty as any,
      points: data.points,
      title: data.title,
      description: data.description,
      options: {
        create: data.options.map((opt, i) => ({
          optionText: opt.text,
          isCorrect: opt.correct,
          explanation: opt.explanation || null,
          order: i,
        })),
      },
    },
  });
}

async function createCoding(assessmentId: string, data: {
  category: string;
  subcategory: string;
  difficulty: string;
  points: number;
  title: string;
  description: string;
  starterCode: Record<string, string>;
  testCases: { input: string; expectedOutput: string; explanation?: string }[];
  hiddenTestCases: { input: string; expectedOutput: string; explanation?: string }[];
  hints: string[];
  constraints: string;
  expectedComplexity: { time: string; space: string };
}) {
  await prisma.question.create({
    data: {
      assessmentId,
      category: data.category as any,
      subcategory: data.subcategory,
      type: 'CODING',
      difficulty: data.difficulty as any,
      points: data.points,
      title: data.title,
      description: data.description,
      codingChallenge: {
        create: {
          starterCode: data.starterCode,
          solutionCode: {},
          testCases: data.testCases,
          hiddenTestCases: data.hiddenTestCases,
          hints: data.hints,
          constraints: data.constraints,
          expectedComplexity: data.expectedComplexity,
        },
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('🎉 Seeding complete!');
  })
  .catch(async (e) => {
    console.error('❌ Seeding error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
