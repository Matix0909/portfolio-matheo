/* =====================================================================
   PROJETS — POUR AJOUTER UN PROJET, COPIE UN BLOC { ... }
   ---------------------------------------------------------------------
   id          : identifiant unique sans espace ni accent (sert au lien)
   titre       : nom du projet
   domaine     : "reseau" | "systeme" | "virtualisation" | "securite" | "bdd" | "autre"
                 (change la couleur et l'icône)
   statut      : "Terminé" ou "En cours"
   annee       : ex "2025 — 2026"
   contexte    : ex "BTS SIO — TP", "Stage", "Projet perso"
   duree       : ex "3 semaines"
   role        : ex "Seul", "En binôme"
   resume      : 1 à 2 phrases (affiché sur la carte)
   stack       : technos, ex ["Cisco", "VLAN", "Packet Tracer"]
   image       : optionnel — image de couverture, ex "img/vlan.png"
                 (sinon un visuel réseau est généré automatiquement)
   vedette     : true = carte en grand (quand ça tombe juste dans la grille)

   Détail du projet (tout est optionnel, les parties vides sont cachées) :
   objectif    : texte
   etapes      : [{ titre: "...", texte: "..." }, ...]
   resultats   : ["...", "..."]
   competences : compétences BTS mobilisées, ex ["Gérer le patrimoine informatique"]
   documents   : [{ nom: "Procédure (PDF)", lien: "docs/procedure.pdf" }]
   images      : [{ src: "img/capture.png", legende: "..." }]
   ===================================================================== */

var PROJETS = [
  {
    id: "refonte-reseau-ecole",
    titre: "Refonte réseau d'un site école",
    domaine: "reseau",
    statut: "Terminé",
    annee: "2025 — 2026",
    contexte: "BTS SIO — TP",
    duree: "",
    role: "",
    resume: "Segmentation en VLAN par service, routage inter-VLAN et plan d'adressage complet sous Packet Tracer.",
    stack: ["VLAN", "Routage inter-VLAN", "VLSM", "Packet Tracer"],
    image: "",
    vedette: true,
    objectif: "Segmenter le réseau d'un site école en VLAN par service, mettre en place le routage inter-VLAN et concevoir un plan d'adressage complet.",
    etapes: [],
    resultats: [],
    competences: [],
    documents: [],
    images: []
  },
  {
    id: "deploiement-active-directory",
    titre: "Déploiement Active Directory",
    domaine: "systeme",
    statut: "Terminé",
    annee: "2025 — 2026",
    contexte: "BTS SIO — TP",
    duree: "",
    role: "",
    resume: "Mise en place d'un domaine, gestion des utilisateurs et stratégies de groupe pour un parc de postes simulé.",
    stack: ["Windows Server", "AD DS", "GPO", "DNS"],
    image: "",
    vedette: false,
    objectif: "Mettre en place un domaine Active Directory, gérer les utilisateurs et appliquer des stratégies de groupe sur un parc de postes simulé.",
    etapes: [],
    resultats: [],
    competences: [],
    documents: [],
    images: []
  },
  {
    id: "infra-virtualisee-proxmox",
    titre: "Infrastructure virtualisée de test",
    domaine: "virtualisation",
    statut: "Terminé",
    annee: "2025 — 2026",
    contexte: "BTS SIO — TP",
    duree: "",
    role: "",
    resume: "Cluster Proxmox avec VM de services (DNS, DHCP, supervision) pour reproduire une infra en conditions réelles.",
    stack: ["Proxmox", "DNS", "DHCP", "Zabbix"],
    image: "",
    vedette: false,
    objectif: "Monter un cluster Proxmox hébergeant des VM de services (DNS, DHCP, supervision) afin de reproduire une infrastructure en conditions réelles.",
    etapes: [],
    resultats: [],
    competences: [],
    documents: [],
    images: []
  },
  {
    id: "bases-de-donnees-phpmyadmin",
    titre: "Bases de données avec phpMyAdmin",
    domaine: "bdd",
    statut: "Terminé",
    annee: "2025 — 2026",
    contexte: "BTS SIO — TP",
    duree: "",
    role: "",
    resume: "Conception et administration de bases MySQL / MariaDB via phpMyAdmin : tables, relations, requêtes SQL, comptes et sauvegardes.",
    stack: ["MySQL / MariaDB", "phpMyAdmin", "SQL", "Apache", "PHP"],
    image: "",
    vedette: true,
    objectif: "Mettre en place un serveur de bases de données administrable depuis phpMyAdmin, concevoir une base relationnelle propre et sécuriser son accès (comptes, droits, sauvegardes).",
    etapes: [
      { titre: "Installation du serveur", texte: "Mise en place de la pile Apache + PHP + MySQL/MariaDB, puis installation et configuration de phpMyAdmin." },
      { titre: "Modélisation", texte: "Création de la base et des tables avec les bons types de données, clés primaires et clés étrangères pour relier les tables." },
      { titre: "Requêtes SQL", texte: "Insertion de jeux de données, puis requêtes SELECT avec jointures, filtres, tris et regroupements." },
      { titre: "Utilisateurs et droits", texte: "Création de comptes dédiés avec uniquement les privilèges nécessaires (principe du moindre privilège), sans utiliser le compte root." },
      { titre: "Sauvegarde et restauration", texte: "Export de la base en .sql et test de restauration par import pour valider les sauvegardes." }
    ],
    resultats: [
      "Serveur MySQL/MariaDB administrable via phpMyAdmin",
      "Base relationnelle avec contraintes d'intégrité",
      "Comptes utilisateurs aux droits limités",
      "Procédure de sauvegarde / restauration testée"
    ],
    competences: [
      "Gérer le patrimoine informatique",
      "Mettre à disposition des utilisateurs un service informatique",
      "Travailler en mode projet"
    ],
    documents: [],
    images: []
  }
];
/* ======================= FIN DES PROJETS ============================= */
