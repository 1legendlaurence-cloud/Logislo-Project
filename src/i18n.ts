import { Role } from "./context/Demo";

export type Language = "en" | "fr" | "zh";

export const LANGUAGE_LABELS: Record<Language, { native: string; short: string }> = {
  en: { native: "English", short: "EN" },
  fr: { native: "Français", short: "FR" },
  zh: { native: "中文", short: "中文" },
};

export interface TutoLesson {
  id: string;
  step: number;
  screenId: string;
  sectionTag: Record<Language, string>;
  title: Record<Language, string>;
  text: Record<Language, string>;
  actionLabel: Record<Language, string>;
}

export const TUTO_LESSONS_BY_ROLE: Record<Role, TutoLesson[]> = {
  Owner: [
    {
      id: "owner-1",
      step: 1,
      screenId: "07",
      sectionTag: {
        en: "Routes & Pricing",
        fr: "Routes & Tarifs",
        zh: "路线与价格",
      },
      title: {
        en: "Set your route & rates",
        fr: "Définir votre route et vos tarifs",
        zh: "设置您的路线和运费",
      },
      text: {
        en: "Tap a route to set your price per kg, CBM rate, deposit %, and free storage days.",
        fr: "Appuyez sur une route pour fixer le prix par kg, le tarif CBM, l'acompte et le stockage.",
        zh: "点击路线以设置每公斤价格、立方米费率、定金比例和免费仓储天数。",
      },
      actionLabel: {
        en: "Open Route Settings",
        fr: "Ouvrir les tarifs",
        zh: "打开路线设置",
      },
    },
    {
      id: "owner-2",
      step: 2,
      screenId: "11",
      sectionTag: {
        en: "Team Setup",
        fr: "Équipe",
        zh: "团队管理",
      },
      title: {
        en: "Add your staff",
        fr: "Ajouter votre personnel",
        zh: "添加您的员工",
      },
      text: {
        en: "Tap + to invite Front desk or Warehouse staff and share their login on WhatsApp.",
        fr: "Appuyez sur + pour ajouter un agent d'accueil ou d'entrepôt et envoyer ses accès sur WhatsApp.",
        zh: "点击 + 邀请前台或仓库员工，并通过 WhatsApp 发送登录信息。",
      },
      actionLabel: {
        en: "Go to Staff",
        fr: "Voir le personnel",
        zh: "前往员工页面",
      },
    },
    {
      id: "owner-3",
      step: 3,
      screenId: "16",
      sectionTag: {
        en: "Owner Home",
        fr: "Accueil Propriétaire",
        zh: "店主主页",
      },
      title: {
        en: "Monitor daily cargo",
        fr: "Suivre l'activité du jour",
        zh: "查看每日货运概况",
      },
      text: {
        en: "Check live shipment counts, active containers, and revenue on your Home screen.",
        fr: "Consultez les colis en cours, les conteneurs actifs et les revenus sur votre écran d'accueil.",
        zh: "在主页实时查看货物数量、活跃集装箱和今日收入。",
      },
      actionLabel: {
        en: "View Home",
        fr: "Voir l'accueil",
        zh: "查看主页",
      },
    },
    {
      id: "owner-4",
      step: 4,
      screenId: "32",
      sectionTag: {
        en: "Containers",
        fr: "Conteneurs",
        zh: "集装箱管理",
      },
      title: {
        en: "Track containers & profit",
        fr: "Suivre les conteneurs et le profit",
        zh: "跟踪集装箱与利润",
      },
      text: {
        en: "Open any container to check loaded boxes, shipping cost, and net profit.",
        fr: "Ouvrez un conteneur pour vérifier les colis chargés, le coût et le bénéfice net.",
        zh: "打开任意集装箱，查看已装箱数、运输成本和净利润。",
      },
      actionLabel: {
        en: "Open Containers",
        fr: "Voir les conteneurs",
        zh: "打开集装箱",
      },
    },
    {
      id: "owner-5",
      step: 5,
      screenId: "39",
      sectionTag: {
        en: "Payments & Cashflow",
        fr: "Paiements & Trésorerie",
        zh: "收款与账单",
      },
      title: {
        en: "Review client payments",
        fr: "Vérifier les paiements clients",
        zh: "核对客户付款",
      },
      text: {
        en: "See all Paid, Deposit paid, and Unpaid shipments before goods are released.",
        fr: "Suivez les colis payés, acomptes reçus et soldes impayés avant la remise des marchandises.",
        zh: "在放货前查看所有已付清、已付定金和未付款的货物。",
      },
      actionLabel: {
        en: "View Payments",
        fr: "Voir les paiements",
        zh: "查看付款记录",
      },
    },
  ],
  Manager: [
    {
      id: "manager-1",
      step: 1,
      screenId: "17",
      sectionTag: {
        en: "Daily Overview",
        fr: "Aperçu du jour",
        zh: "每日概览",
      },
      title: {
        en: "Check daily tasks",
        fr: "Vérifier les tâches du jour",
        zh: "查看今日任务",
      },
      text: {
        en: "Review expected pre-alerts, arrived shipments, and pending client balances.",
        fr: "Consultez les pré-alertes attendues, les colis arrivés et les soldes clients en attente.",
        zh: "查看预计到达的预报单、已到货物和待收客户尾款。",
      },
      actionLabel: {
        en: "Go to Home",
        fr: "Aller à l'accueil",
        zh: "前往主页",
      },
    },
    {
      id: "manager-2",
      step: 2,
      screenId: "19",
      sectionTag: {
        en: "Clients",
        fr: "Clients",
        zh: "客户目录",
      },
      title: {
        en: "Manage client codes",
        fr: "Gérer les codes clients",
        zh: "管理客户代码",
      },
      text: {
        en: "Tap + to register a client and generate their unique shipping mark code.",
        fr: "Appuyez sur + pour enregistrer un client et créer son code d'expédition unique.",
        zh: "点击 + 注册客户并生成专属运输唛头代码。",
      },
      actionLabel: {
        en: "Open Clients",
        fr: "Ouvrir Clients",
        zh: "打开客户列表",
      },
    },
    {
      id: "manager-3",
      step: 3,
      screenId: "24",
      sectionTag: {
        en: "Pre-alerts",
        fr: "Pré-alertes",
        zh: "新建预报",
      },
      title: {
        en: "Create a pre-alert",
        fr: "Créer une pré-alerte",
        zh: "创建货运预报",
      },
      text: {
        en: "Select a client and enter weight or CBM to calculate shipping and deposit fees.",
        fr: "Choisissez un client et saisissez le poids ou CBM pour calculer les frais et l'acompte.",
        zh: "选择客户并输入重量或体积，自动计算运费和定金。",
      },
      actionLabel: {
        en: "New Pre-alert",
        fr: "Nouvelle pré-alerte",
        zh: "新建预报",
      },
    },
    {
      id: "manager-4",
      step: 4,
      screenId: "32",
      sectionTag: {
        en: "Containers",
        fr: "Conteneurs",
        zh: "集装箱状态",
      },
      title: {
        en: "Update container status",
        fr: "Mettre à jour les conteneurs",
        zh: "更新集装箱状态",
      },
      text: {
        en: "Advance containers from Open to In transit and Arrived to update all loaded cargo.",
        fr: "Passez le conteneur de Ouvert à En transit puis Arrivé pour mettre à jour tous les colis.",
        zh: "将集装箱状态从装柜中更新为运输中或已到达，自动同步箱内所有货物。",
      },
      actionLabel: {
        en: "Open Containers",
        fr: "Voir les conteneurs",
        zh: "打开集装箱",
      },
    },
    {
      id: "manager-5",
      step: 5,
      screenId: "39",
      sectionTag: {
        en: "Payments & Release",
        fr: "Paiements & Retrait",
        zh: "收款与放货",
      },
      title: {
        en: "Confirm payment & release",
        fr: "Confirmer le paiement et la remise",
        zh: "确认收款并放货",
      },
      text: {
        en: "Record client payments so arrived shipments unlock for collection.",
        fr: "Enregistrez les paiements pour débloquer la remise des colis arrivés.",
        zh: "记录客户付款，结清尾款后即可解锁放货。",
      },
      actionLabel: {
        en: "Open Payments",
        fr: "Voir les paiements",
        zh: "打开收款页面",
      },
    },
  ],
  "Front desk": [
    {
      id: "frontdesk-1",
      step: 1,
      screenId: "20",
      sectionTag: {
        en: "Client Registration",
        fr: "Inscription Client",
        zh: "新增客户",
      },
      title: {
        en: "Add a new client",
        fr: "Ajouter un nouveau client",
        zh: "添加新客户",
      },
      text: {
        en: "Enter the client's name and WhatsApp number to create their client code.",
        fr: "Saisissez le nom et le numéro WhatsApp du client pour générer son code client.",
        zh: "输入客户姓名和 WhatsApp 号码以生成客户专属代码。",
      },
      actionLabel: {
        en: "Add Client",
        fr: "Ajouter un client",
        zh: "添加客户",
      },
    },
    {
      id: "frontdesk-2",
      step: 2,
      screenId: "24",
      sectionTag: {
        en: "New Pre-alert",
        fr: "Nouvelle Pré-alerte",
        zh: "创建预报单",
      },
      title: {
        en: "Log expected cargo",
        fr: "Enregistrer un colis attendu",
        zh: "登记预计到达货物",
      },
      text: {
        en: "Pick the client, enter cargo weight or CBM, and share the tracking link on WhatsApp.",
        fr: "Choisissez le client, entrez le poids ou CBM et partagez le lien de suivi sur WhatsApp.",
        zh: "选择客户，输入货物重量或体积，并通过 WhatsApp 发送跟踪链接。",
      },
      actionLabel: {
        en: "Create Pre-alert",
        fr: "Créer une pré-alerte",
        zh: "创建预报",
      },
    },
    {
      id: "frontdesk-3",
      step: 3,
      screenId: "40",
      sectionTag: {
        en: "Record Payment",
        fr: "Enregistrer un paiement",
        zh: "登记收款",
      },
      title: {
        en: "Record deposit or balance",
        fr: "Encaisser un acompte ou solde",
        zh: "记录定金或尾款",
      },
      text: {
        en: "Choose Deposit, Balance, or Storage and save Cash or Mobile money payment.",
        fr: "Sélectionnez Acompte, Solde ou Stockage et validez le paiement en Espèces ou Mobile money.",
        zh: "选择定金、尾款或仓储费，保存现金或移动支付记录。",
      },
      actionLabel: {
        en: "Record Payment",
        fr: "Saisir un paiement",
        zh: "登记付款",
      },
    },
    {
      id: "frontdesk-4",
      step: 4,
      screenId: "41",
      sectionTag: {
        en: "Final Bill",
        fr: "Facture Finale",
        zh: "最终账单",
      },
      title: {
        en: "Check the final bill",
        fr: "Vérifier la facture finale",
        zh: "核对最终账单",
      },
      text: {
        en: "Review shipping fee, deposit paid, storage days, and remaining balance with the client.",
        fr: "Vérifiez les frais de port, l'acompte versé, le stockage et le reste à payer avec le client.",
        zh: "与客户核对运费、已付定金、仓储费及剩余应付尾款。",
      },
      actionLabel: {
        en: "View Final Bill",
        fr: "Voir la facture",
        zh: "查看账单",
      },
    },
    {
      id: "frontdesk-5",
      step: 5,
      screenId: "44",
      sectionTag: {
        en: "Release Goods",
        fr: "Remise des colis",
        zh: "放货签收",
      },
      title: {
        en: "Release paid cargo",
        fr: "Remettre le colis au client",
        zh: "放行已付清货物",
      },
      text: {
        en: "Once balance is 0, enter the collector's name to mark the shipment Collected.",
        fr: "Une fois le solde à 0, entrez le nom du réceptionnaire pour valider le retrait.",
        zh: "当尾款为 0 时，输入提货人姓名即可完成放货。",
      },
      actionLabel: {
        en: "Release Goods",
        fr: "Remettre le colis",
        zh: "前往放货",
      },
    },
  ],
  "Warehouse worker": [
    {
      id: "warehouse-1",
      step: 1,
      screenId: "18",
      sectionTag: {
        en: "Warehouse Home",
        fr: "Accueil Entrepôt",
        zh: "仓库主页",
      },
      title: {
        en: "Check expected packages",
        fr: "Voir les colis attendus",
        zh: "查看待收包裹",
      },
      text: {
        en: "View expected pre-alerts waiting to arrive at the warehouse today.",
        fr: "Consultez la liste des pré-alertes attendues à l'entrepôt aujourd'hui.",
        zh: "查看今天预计到达仓库的客户预报包裹。",
      },
      actionLabel: {
        en: "Warehouse Home",
        fr: "Accueil entrepôt",
        zh: "打开仓库主页",
      },
    },
    {
      id: "warehouse-2",
      step: 2,
      screenId: "28",
      sectionTag: {
        en: "Receive Cargo",
        fr: "Réception Colis",
        zh: "收货入库",
      },
      title: {
        en: "Receive & weigh boxes",
        fr: "Réceptionner et peser les cartons",
        zh: "清点并称重入库",
      },
      text: {
        en: "Enter the actual box count, weight in kg, and CBM to mark cargo as Received.",
        fr: "Saisissez le nombre de cartons, le poids en kg et le CBM pour valider la réception.",
        zh: "输入实际箱数、公斤重量和体积，将货物标记为已入库。",
      },
      actionLabel: {
        en: "Receive Cargo",
        fr: "Réceptionner",
        zh: "收货入库",
      },
    },
    {
      id: "warehouse-3",
      step: 3,
      screenId: "54",
      sectionTag: {
        en: "Box Label",
        fr: "Étiquette QR",
        zh: "打印箱贴",
      },
      title: {
        en: "Print & stick QR label",
        fr: "Imprimer l'étiquette QR",
        zh: "打印并粘贴二维码标签",
      },
      text: {
        en: "Preview the label with client code and QR, then attach it clearly on each box.",
        fr: "Affichez l'étiquette avec le code client et le QR, puis collez-la sur chaque carton.",
        zh: "预览带有客户代码和二维码的标签，并贴在每个箱子上。",
      },
      actionLabel: {
        en: "Preview Label",
        fr: "Voir l'étiquette",
        zh: "预览标签",
      },
    },
    {
      id: "warehouse-4",
      step: 4,
      screenId: "59",
      sectionTag: {
        en: "Unmatched Cargo",
        fr: "Colis sans nom",
        zh: "无主货物登记",
      },
      title: {
        en: "Log unmatched boxes",
        fr: "Signaler un colis non identifié",
        zh: "登记无主包裹",
      },
      text: {
        en: "If a package arrives without a clear client code, log its markings and weight here.",
        fr: "Si un colis arrive sans code client clair, notez ses marques et son poids ici.",
        zh: "如果包裹没有清晰的客户代码，请在此登记箱上唛头和重量。",
      },
      actionLabel: {
        en: "Log Unmatched",
        fr: "Saisir colis sans nom",
        zh: "登记无主货物",
      },
    },
    {
      id: "warehouse-5",
      step: 5,
      screenId: "35",
      sectionTag: {
        en: "Load Container",
        fr: "Chargement Conteneur",
        zh: "装柜操作",
      },
      title: {
        en: "Load boxes into container",
        fr: "Charger dans le conteneur",
        zh: "将货物装入集装箱",
      },
      text: {
        en: "Tick received shipments to assign them into the open container before sealing.",
        fr: "Cochez les colis reçus pour les ajouter au conteneur ouvert avant fermeture.",
        zh: "勾选已入库的货物，在封柜前将它们装入当前集装箱。",
      },
      actionLabel: {
        en: "Load Container",
        fr: "Charger conteneur",
        zh: "前往装柜",
      },
    },
  ],
};

const UI_STRINGS: Record<string, Record<Language, string>> = {
  // Navigation
  Home: { en: "Home", fr: "Accueil", zh: "主页" },
  Clients: { en: "Clients", fr: "Clients", zh: "客户" },
  Scan: { en: "Scan", fr: "Scanner", zh: "扫码" },
  Shipments: { en: "Shipments", fr: "Colis", zh: "货物" },
  Payments: { en: "Payments", fr: "Paiements", zh: "收款" },
  Containers: { en: "Containers", fr: "Conteneurs", zh: "集装箱" },
  More: { en: "More", fr: "Plus", zh: "更多" },

  // Settings & Account
  Settings: { en: "Settings", fr: "Paramètres", zh: "设置" },
  Account: { en: "Account", fr: "Compte", zh: "账户" },
  Profile: { en: "Profile", fr: "Profil", zh: "个人资料" },
  Agency: { en: "Agency", fr: "Agence", zh: "货运代理" },
  Routes: { en: "Routes", fr: "Routes", zh: "路线" },
  Staff: { en: "Staff", fr: "Personnel", zh: "员工" },
  Plan: { en: "Plan", fr: "Forfait", zh: "套餐" },
  Language: { en: "Language", fr: "Langue", zh: "语言" },
  Tuto: { en: "Tuto (Guided lessons)", fr: "Tuto (Guide pas à pas)", zh: "Tuto (新手教程)" },
  "Tuto subtitle": {
    en: "Step-by-step lessons for your role",
    fr: "Leçons progressives pour votre profil",
    zh: "针对您角色的分步操作指南",
  },
  "Start Tuto": { en: "Start Tuto", fr: "Lancer le Tuto", zh: "开始教程" },
  "Resume Tuto": { en: "Resume Tuto", fr: "Reprendre", zh: "继续教程" },
  "Reset progress": { en: "Reset", fr: "Réinitialiser", zh: "重置" },
  Lesson: { en: "Lesson", fr: "Leçon", zh: "第" },
  of: { en: "of", fr: "sur", zh: "课 / 共" },
  Completed: { en: "Completed", fr: "Terminé", zh: "已完成" },
  "Next lesson": { en: "Next lesson", fr: "Leçon suivante", zh: "下一课" },
  "Previous": { en: "Prev", fr: "Préc.", zh: "上一课" },
  "Finish Tuto": { en: "Finish Tuto", fr: "Terminer", zh: "完成教程" },
  "Show guide on screen": {
    en: "Go to screen",
    fr: "Aller à l'écran",
    zh: "前往该页面",
  },
  "Hide guide": { en: "Hide", fr: "Masquer", zh: "隐藏" },
  "Warehouse list": { en: "Warehouse list", fr: "Liste entrepôt", zh: "仓库清单" },
  Unmatched: { en: "Unmatched", fr: "Colis sans nom", zh: "无主货物" },
  Dashboard: { en: "Dashboard", fr: "Tableau de bord", zh: "数据看板" },
  Tools: { en: "Tools", fr: "Outils", zh: "工具" },
  "Log out": { en: "Log out", fr: "Déconnexion", zh: "退出登录" },
  "Switch role view": {
    en: "Switch role view",
    fr: "Changer de profil",
    zh: "切换角色视图",
  },

  // Roles
  Owner: { en: "Owner", fr: "Propriétaire", zh: "店主" },
  Manager: { en: "Manager", fr: "Gestionnaire", zh: "经理" },
  "Front desk": { en: "Front desk", fr: "Accueil", zh: "前台" },
  "Warehouse worker": { en: "Warehouse worker", fr: "Entrepôt", zh: "仓库员" },
  Warehouse: { en: "Warehouse", fr: "Entrepôt", zh: "仓库" },

  // Common Screen Titles
  "Route settings": { en: "Route settings", fr: "Tarifs de la route", zh: "路线设置" },
  "Create route": { en: "Create route", fr: "Nouvelle route", zh: "创建路线" },
  "Add staff": { en: "Add staff", fr: "Ajouter un membre", zh: "添加员工" },
  "Add client": { en: "Add client", fr: "Nouveau client", zh: "添加客户" },
  "Edit client": { en: "Edit client", fr: "Modifier client", zh: "编辑客户" },
  "New pre-alert": { en: "New pre-alert", fr: "Nouvelle pré-alerte", zh: "新建预报" },
  "Edit shipment": { en: "Edit shipment", fr: "Modifier colis", zh: "编辑货物" },
  Receive: { en: "Receive", fr: "Réception", zh: "收货入库" },
  "New container": { en: "New container", fr: "Nouveau conteneur", zh: "新建集装箱" },
  "Add to container": { en: "Add to container", fr: "Ajouter au conteneur", zh: "装入集装箱" },
  "Record payment": { en: "Record payment", fr: "Saisir un paiement", zh: "记录付款" },
  "Final bill": { en: "Final bill", fr: "Facture finale", zh: "最终账单" },
  "Payment detail": { en: "Payment detail", fr: "Détail paiement", zh: "付款详情" },
  "Release goods": { en: "Release goods", fr: "Remise des colis", zh: "放行货物" },
  "Label preview": { en: "Label preview", fr: "Aperçu étiquette", zh: "标签预览" },
  "Log unmatched": { en: "Log unmatched", fr: "Colis non identifié", zh: "登记无主货物" },
};

export function tr(lang: Language, key: string): string {
  const entry = UI_STRINGS[key];
  if (!entry) return key;
  return entry[lang] || entry.en || key;
}
