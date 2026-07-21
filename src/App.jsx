import React, { useState, useMemo, useEffect, useRef } from "react";

/* ============================== PERSISTENCE ============================== */
// Saves state to the browser so progress survives reloads and offline use.
const STORE_PREFIX = "lebanonDrive:";
function usePersistentState(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const raw = localStorage.getItem(STORE_PREFIX + key);
      return raw != null ? JSON.parse(raw) : initial;
    } catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(STORE_PREFIX + key, JSON.stringify(val)); } catch {}
  }, [key, val]);
  return [val, setVal];
}
function clearAllProgress() {
  try {
    Object.keys(localStorage).filter(k => k.startsWith(STORE_PREFIX)).forEach(k => localStorage.removeItem(k));
  } catch {}
}
// Returns today's date as YYYY-MM-DD (local).
const todayKey = () => new Date().toISOString().slice(0, 10);
import {
  Home, Signpost, ListChecks, Wrench, Mic, GraduationCap, AlertTriangle,
  BarChart3, Search, Star, Check, X, ChevronRight, ChevronLeft, RotateCcw,
  Flag, Clock, Award, Flame, Target, BookOpen, Car, Bike, Truck, Fuel,
  Gauge, Droplets, Battery, Lightbulb, Eye, EyeOff, Play,
  Languages, ArrowRight, ArrowLeft, ArrowUp, Ban, Cross, Bed, Utensils,
  ParkingCircle, VolumeX, Construction, Waves, Mountain, Wind, School,
  Baby, Users, PersonStanding, CornerUpRight, CornerUpLeft, TramFront,
  RefreshCw, ThumbsUp, Trophy, Zap, ShieldCheck, Info,
  ArrowDown, ArrowUpDown, Snowflake, Bus, Anchor, Footprints, Dog,
  Merge, Split, Milestone, CornerDownRight, Waypoints, Plane, Ship,
  Train, Umbrella, Thermometer, Phone, MapPin,
} from "lucide-react";

/* ============================== i18n ============================== */
const T = {
  en: {
    dir: "ltr", appName: "Lebanon Drive", tagline: "Theory exam prep",
    home: "Home", signs: "Road Signs", theory: "Theory", practical: "Car Check",
    oral: "Oral", mock: "Mock Exam", mistakes: "Mistakes", progress: "Progress",
    welcome: "Ready to drive?", overall: "Overall mastery", streak: "Day streak",
    answered: "Answered", accuracy: "Accuracy", saved: "Saved mistakes",
    goal: "Daily goal", continue: "Continue studying", quickQuiz: "Quick quiz",
    startMock: "Start mock exam", topics: "Topics", learn: "Learn",
    flashcards: "Flashcards", signQuiz: "Sign quiz", reverseQuiz: "Reverse quiz",
    match: "Match", searchSigns: "Search signs…", all: "All", learned: "Learned",
    notLearned: "New", meaning: "Meaning", action: "What to do", category: "Category",
    reveal: "Reveal answer", next: "Next", prev: "Back", correct: "Correct",
    incorrect: "Incorrect", explanation: "Why", favourite: "Favourite",
    licence: "Licence", question: "Question", of: "of", finish: "Finish exam",
    score: "Score", pass: "Pass", fail: "Fail", retake: "Retake",
    reviewMistakes: "Review mistakes", timeTaken: "Time", weak: "Weak areas",
    practiseMistakes: "Practise my mistakes", noMistakes: "No mistakes yet — nice.",
    mastered: "Mastered", attempts: "Wrong ×", selfEval: "How did you do?",
    partial: "Partial", showModel: "Show model answer", yourAnswer: "Type your answer…",
    warningSigns: "Warning signs", immediate: "Do immediately", avoid: "Avoid",
    summary: "Remember", official: "Official (from exam PDF)",
    practicalKnowledge: "Practical driving knowledge", checkManual: "Always check the vehicle owner's manual.",
    chooseLen: "Choose length", mixed: "Mixed", signsOnly: "Signs only",
    theoryOnly: "Theory only", full: "Full", start: "Start", flag: "Flag",
    submitConfirm: "Finish and see your score?", cancel: "Cancel", yes: "Finish",
    bestScore: "Best score", avgScore: "Average", history: "Exam history",
    strongest: "Strongest", weakest: "Weakest", recent: "Recent activity",
    curatedNote: "Curated verified subset of the official bank.",
    tyreReader: "Tyre size reader", dipstick: "Oil dipstick", tapToFlip: "Tap card to flip",
    resetProgress: "Reset all progress", resetConfirm: "Reset all progress? This cannot be undone.", noData: "Nothing here yet.",
  },
  ar: {
    dir: "rtl", appName: "لبنان درايف", tagline: "تحضير الامتحان النظري",
    home: "الرئيسية", signs: "الإشارات", theory: "النظري", practical: "فحص السيارة",
    oral: "الشفهي", mock: "امتحان تجريبي", mistakes: "الأخطاء", progress: "التقدّم",
    welcome: "جاهز للقيادة؟", overall: "نسبة الإتقان", streak: "أيام متتالية",
    answered: "أُجيب عنها", accuracy: "الدقة", saved: "أخطاء محفوظة",
    goal: "الهدف اليومي", continue: "تابع الدراسة", quickQuiz: "اختبار سريع",
    startMock: "ابدأ امتحاناً تجريبياً", topics: "المواضيع", learn: "تعلّم",
    flashcards: "بطاقات", signQuiz: "اختبار الإشارات", reverseQuiz: "اختبار عكسي",
    match: "توصيل", searchSigns: "ابحث عن إشارة…", all: "الكل", learned: "مُتعلَّمة",
    notLearned: "جديدة", meaning: "المعنى", action: "ماذا تفعل", category: "الفئة",
    reveal: "أظهر الجواب", next: "التالي", prev: "السابق", correct: "صحيح",
    incorrect: "خطأ", explanation: "الشرح", favourite: "المفضّلة",
    licence: "الرخصة", question: "سؤال", of: "من", finish: "إنهاء الامتحان",
    score: "النتيجة", pass: "ناجح", fail: "راسب", retake: "أعد المحاولة",
    reviewMistakes: "راجع الأخطاء", timeTaken: "الوقت", weak: "نقاط الضعف",
    practiseMistakes: "تدرّب على أخطائي", noMistakes: "لا أخطاء بعد — أحسنت.",
    mastered: "مُتقن", attempts: "أخطاء ×", selfEval: "كيف كان أداؤك؟",
    partial: "جزئي", showModel: "أظهر الجواب النموذجي", yourAnswer: "اكتب جوابك…",
    warningSigns: "علامات التحذير", immediate: "افعل فوراً", avoid: "تجنّب",
    summary: "تذكّر", official: "رسمي (من ملف الامتحان)",
    practicalKnowledge: "معرفة عملية بالقيادة", checkManual: "راجع دائماً دليل مالك المركبة.",
    chooseLen: "اختر الطول", mixed: "مختلط", signsOnly: "إشارات فقط",
    theoryOnly: "نظري فقط", full: "كامل", start: "ابدأ", flag: "علّم",
    submitConfirm: "إنهاء وعرض النتيجة؟", cancel: "إلغاء", yes: "إنهاء",
    bestScore: "أفضل نتيجة", avgScore: "المعدّل", history: "سجل الامتحانات",
    strongest: "الأقوى", weakest: "الأضعف", recent: "النشاط الأخير",
    curatedNote: "مجموعة مُختارة ومُتحقّق منها من البنك الرسمي.",
    tyreReader: "قارئ مقاس الإطار", dipstick: "مقياس الزيت", tapToFlip: "اضغط البطاقة للقلب",
    resetProgress: "إعادة ضبط التقدّم", resetConfirm: "إعادة ضبط كل التقدّم؟ لا يمكن التراجع.", noData: "لا شيء هنا بعد.",
  },
  fr: {
    dir: "ltr", appName: "Lebanon Drive", tagline: "Prép. examen théorique",
    home: "Accueil", signs: "Panneaux", theory: "Théorie", practical: "Contrôle",
    oral: "Oral", mock: "Examen blanc", mistakes: "Erreurs", progress: "Progrès",
    welcome: "Prêt à conduire ?", overall: "Maîtrise globale", streak: "Jours de suite",
    answered: "Répondu", accuracy: "Précision", saved: "Erreurs gardées",
    goal: "Objectif du jour", continue: "Continuer", quickQuiz: "Quiz rapide",
    startMock: "Examen blanc", topics: "Thèmes", learn: "Apprendre",
    flashcards: "Cartes", signQuiz: "Quiz panneaux", reverseQuiz: "Quiz inversé",
    match: "Associer", searchSigns: "Chercher…", all: "Tous", learned: "Appris",
    notLearned: "Nouveau", meaning: "Signification", action: "À faire", category: "Catégorie",
    reveal: "Révéler", next: "Suivant", prev: "Retour", correct: "Correct",
    incorrect: "Incorrect", explanation: "Pourquoi", favourite: "Favori",
    licence: "Permis", question: "Question", of: "sur", finish: "Terminer",
    score: "Score", pass: "Réussi", fail: "Échoué", retake: "Recommencer",
    reviewMistakes: "Revoir erreurs", timeTaken: "Temps", weak: "Points faibles",
    practiseMistakes: "Réviser mes erreurs", noMistakes: "Aucune erreur — bravo.",
    mastered: "Maîtrisé", attempts: "Faux ×", selfEval: "Votre résultat ?",
    partial: "Partiel", showModel: "Réponse modèle", yourAnswer: "Votre réponse…",
    warningSigns: "Signes", immediate: "Immédiat", avoid: "Éviter",
    summary: "Retenir", official: "Officiel (PDF)",
    practicalKnowledge: "Connaissance pratique", checkManual: "Consultez le manuel du véhicule.",
    chooseLen: "Longueur", mixed: "Mixte", signsOnly: "Panneaux", theoryOnly: "Théorie",
    full: "Complet", start: "Démarrer", flag: "Marquer",
    submitConfirm: "Terminer et voir le score ?", cancel: "Annuler", yes: "Terminer",
    bestScore: "Meilleur", avgScore: "Moyenne", history: "Historique",
    strongest: "Le plus fort", weakest: "Le plus faible", recent: "Activité récente",
    curatedNote: "Sous-ensemble vérifié de la banque officielle.",
    tyreReader: "Lecteur de pneu", dipstick: "Jauge d'huile", tapToFlip: "Touchez pour retourner",
    resetProgress: "Réinitialiser", resetConfirm: "Tout réinitialiser ? Action irréversible.", noData: "Rien ici.",
  },
};

/* ============================== SIGN DATA (from Road Signs PDF) ============================== */
// frame: warn | yield | prohibit | prohibitSolid | mandatory | stop | diamond | info | end
const SIGNS = [
  // ---- Warning ----
  { id: 1, cat: "warn", frame: "warn", icon: CornerUpRight, ar: "منعطف لليمين", en: "Right-hand bend", fr: "Virage à droite", meaning: "The road bends sharply to the right ahead.", action: "Slow down and keep right." },
  { id: 2, cat: "warn", frame: "warn", icon: CornerUpLeft, ar: "منعطف لليسار", en: "Left-hand bend", fr: "Virage à gauche", meaning: "The road bends sharply to the left ahead.", action: "Slow down and keep your lane." },
  { id: 5, cat: "warn", frame: "warn", icon: Waves, ar: "انخفاضات", en: "Uneven road", fr: "Cassis", meaning: "Dips or bumps in the road surface ahead.", action: "Reduce speed to avoid losing control." },
  { id: 6, cat: "warn", frame: "warn", icon: Mountain, ar: "مطب تخفيض سرعة", en: "Speed hump", fr: "Dispositif surélevé", meaning: "A raised speed hump is ahead.", action: "Slow right down before it." },
  { id: 10, cat: "warn", frame: "warn", icon: Lightbulb, ar: "إشارات كهربائية", en: "Light signals", fr: "Annonce de feux", meaning: "Traffic lights are ahead.", action: "Be ready to stop." },
  { id: 11, cat: "warn", frame: "warn", icon: RefreshCw, ar: "حركة سير في كلا الاتجاهين", en: "Two-way traffic", fr: "Circulation deux sens", meaning: "Oncoming traffic shares the road ahead.", action: "Keep right, don't overtake blindly." },
  { id: 12, cat: "warn", frame: "warn", icon: Mountain, ar: "خطر انهيارات", en: "Risk of rock fall", fr: "Chutes de pierres", meaning: "Falling rocks possible ahead.", action: "Watch the road surface, keep distance from the slope." },
  { id: 14, cat: "warn", frame: "warn", icon: ArrowRight, ar: "إنحدار خطر", en: "Steep hill (descent)", fr: "Descente dangereuse", meaning: "A steep downhill grade is ahead.", action: "Shift to a low gear; don't ride the brakes." },
  { id: 15, cat: "warn", frame: "warn", icon: Wind, ar: "رياح جانبية", en: "Cross wind", fr: "Vent latéral", meaning: "Strong side winds ahead.", action: "Grip the wheel firmly, slow down." },
  { id: 16, cat: "warn", frame: "warn", icon: AlertTriangle, ar: "عبور حيوانات", en: "Animal crossing", fr: "Traversée de bétail", meaning: "Animals may cross the road.", action: "Slow down, be ready to stop." },
  { id: 18, cat: "warn", frame: "warn", icon: Construction, ar: "أشغال", en: "Road works", fr: "Travaux", meaning: "Roadworks ahead.", action: "Slow down, watch for workers and equipment." },
  { id: 20, cat: "warn", frame: "warn", icon: Car, ar: "طريق منزلق", en: "Slippery road", fr: "Chaussée glissante", meaning: "Surface may be slippery.", action: "Reduce speed, avoid harsh braking." },
  { id: 21, cat: "warn", frame: "warn", icon: TramFront, ar: "تقاطع سكة حديد بحواجز", en: "Railway crossing with gates", fr: "Passage à niveau avec barrières", meaning: "Gated level crossing ahead.", action: "Prepare to stop when gates close." },
  { id: 23, cat: "warn", frame: "warn", icon: Baby, ar: "ممر أطفال", en: "Children crossing", fr: "Enfants", meaning: "Area frequently used by children.", action: "Slow down, expect sudden movement." },
  { id: 24, cat: "warn", frame: "warn", icon: School, ar: "انتبه مدرسة", en: "School area", fr: "Zone scolaire", meaning: "School zone ahead.", action: "Slow down, give way to children." },
  { id: 25, cat: "warn", frame: "warn", icon: PersonStanding, ar: "ممر مشاة", en: "Pedestrian walkway", fr: "Passage piétons", meaning: "Pedestrian crossing ahead.", action: "Slow down, give way to pedestrians." },
  { id: 26, cat: "warn", frame: "warn", icon: AlertTriangle, ar: "خطر غير محدد", en: "Undefined hazard", fr: "Danger non défini", meaning: "General danger not covered by other signs.", action: "Slow down and stay alert." },
  // ---- Priority ----
  { id: 27, cat: "priority", frame: "stop", text: "STOP", ar: "توقف عند التقاطع", en: "Stop at junction", fr: "Arrêt à l'intersection", meaning: "You must come to a complete stop.", action: "Stop fully, give way, then proceed." },
  { id: 28, cat: "priority", frame: "yield", ar: "افسح الطريق", en: "Give way", fr: "Cédez le passage", meaning: "Give way to traffic on the main road.", action: "Slow, yield, proceed when clear." },
  { id: 29, cat: "priority", frame: "warn", icon: RotateCcw, ar: "حركة سير دائرية", en: "Roundabout", fr: "Carrefour giratoire", meaning: "A roundabout is ahead.", action: "Give way to traffic already on it." },
  { id: 32, cat: "priority", frame: "diamond", ar: "طريق أفضلية", en: "Priority road", fr: "Route prioritaire", meaning: "You are on the priority road.", action: "You have right of way; stay alert at junctions." },
  { id: 33, cat: "priority", frame: "diamond", strike: true, ar: "نهاية طريق أفضلية", en: "End of priority road", fr: "Fin de route prioritaire", meaning: "Your priority ends.", action: "Give way at the next junction." },
  // ---- Prohibition ----
  { id: 34, cat: "prohibit", frame: "prohibitSolid", ar: "ممنوع مرور عموم المركبات", en: "Vehicles prohibited", fr: "Circulation interdite", meaning: "No vehicles in both directions.", action: "Do not enter with a vehicle." },
  { id: 35, cat: "prohibit", frame: "prohibitSolid", text: "—", ar: "ممنوع الدخول", en: "No entry", fr: "Sens interdit", meaning: "Entry is forbidden.", action: "Do not enter; find another route." },
  { id: 36, cat: "prohibit", frame: "prohibit", icon: CornerUpLeft, ar: "ممنوع الاتجاه لليسار", en: "No left turn", fr: "Interdiction de tourner à gauche", meaning: "Left turns are forbidden.", action: "Continue straight or turn right." },
  { id: 37, cat: "prohibit", frame: "prohibit", icon: CornerUpRight, ar: "ممنوع الاتجاه لليمين", en: "No right turn", fr: "Interdiction de tourner à droite", meaning: "Right turns are forbidden.", action: "Continue straight or turn left." },
  { id: 38, cat: "prohibit", frame: "prohibit", icon: RotateCcw, ar: "ممنوع الالتفاف", en: "No U-turns", fr: "Interdiction de demi-tour", meaning: "U-turns are forbidden.", action: "Do not turn back here." },
  { id: 39, cat: "prohibit", frame: "prohibit", icon: Car, ar: "ممنوع التجاوز", en: "No overtaking", fr: "Interdiction de dépasser", meaning: "Overtaking is forbidden.", action: "Stay in your lane." },
  { id: 42, cat: "prohibit", frame: "prohibit", icon: Truck, ar: "ممنوع دخول الشاحنات", en: "No trucks", fr: "Accès interdit aux camions", meaning: "Goods vehicles forbidden.", action: "Trucks must not enter." },
  { id: 43, cat: "prohibit", frame: "prohibit", icon: PersonStanding, ar: "ممنوع دخول المشاة", en: "No pedestrians", fr: "Accès interdit aux piétons", meaning: "Pedestrians forbidden.", action: "Do not walk here." },
  { id: 44, cat: "prohibit", frame: "prohibit", icon: Bike, ar: "ممنوع دخول الدراجات الهوائية", en: "No cycles", fr: "Accès interdit aux cycles", meaning: "Bicycles forbidden.", action: "Cyclists must not enter." },
  { id: 49, cat: "prohibit", frame: "prohibit", icon: Bike, ar: "ممنوع دخول الدراجات الآلية", en: "No motorcycles", fr: "Accès interdit aux cyclomoteurs", meaning: "Motorcycles/mopeds forbidden.", action: "Do not enter on a motorcycle." },
  { id: 55, cat: "prohibit", frame: "prohibit", text: "50", ar: "أقصى سرعة مسموح بها", en: "Speed limit", fr: "Limitation de vitesse", meaning: "Maximum speed (e.g. 50 km/h).", action: "Do not exceed the number shown." },
  { id: 57, cat: "prohibit", frame: "prohibit", icon: VolumeX, ar: "ممنوع استعمال المنبه", en: "Use of horn prohibited", fr: "Signaux sonores interdits", meaning: "Sounding the horn is forbidden.", action: "Do not use the horn here." },
  { id: 61, cat: "parking", frame: "prohibit", icon: ParkingCircle, ar: "ممنوع الوقوف", en: "No parking", fr: "Stationnement interdit", meaning: "Parking is forbidden.", action: "Do not park; brief stops may be allowed." },
  { id: 62, cat: "parking", frame: "prohibit", icon: X, ar: "ممنوع التوقف والوقوف", en: "No stopping or parking", fr: "Arrêt et stationnement interdits", meaning: "Stopping and parking forbidden.", action: "Do not stop at all here." },
  // ---- Mandatory ----
  { id: 64, cat: "mandatory", frame: "mandatory", icon: ArrowRight, ar: "اتجاه سير اجباري إلى اليمين", en: "Turn right ahead", fr: "Obligation de tourner à droite", meaning: "You must turn right.", action: "Turn right at the sign." },
  { id: 65, cat: "mandatory", frame: "mandatory", icon: ArrowLeft, ar: "اتجاه سير اجباري إلى اليسار", en: "Turn left ahead", fr: "Obligation de tourner à gauche", meaning: "You must turn left.", action: "Turn left at the sign." },
  { id: 66, cat: "mandatory", frame: "mandatory", icon: ArrowRight, ar: "الزم اليمين", en: "Keep to the right", fr: "Contournement par la droite", meaning: "Pass this obstacle on the right.", action: "Keep right." },
  { id: 67, cat: "mandatory", frame: "mandatory", icon: ArrowLeft, ar: "الزم اليسار", en: "Keep to the left", fr: "Contournement par la gauche", meaning: "Pass this obstacle on the left.", action: "Keep left." },
  { id: 68, cat: "mandatory", frame: "mandatory", icon: ArrowUp, ar: "اتجاه اجباري مستقيم", en: "Straight ahead only", fr: "Direction obligatoire tout droit", meaning: "You must go straight.", action: "Continue straight." },
  { id: 74, cat: "mandatory", frame: "mandatory", icon: Bike, ar: "ممر للدراجات الهوائية", en: "Cycle track", fr: "Piste obligatoire pour cycles", meaning: "Reserved cycle path.", action: "Cyclists must use this path." },
  { id: 75, cat: "mandatory", frame: "mandatory", icon: PersonStanding, ar: "مسار إلزامي للمشاة", en: "Use footpath", fr: "Chemin obligatoire piétons", meaning: "Reserved pedestrian path.", action: "Pedestrians must use it." },
  { id: 77, cat: "mandatory", frame: "mandatory", text: "30", ar: "أدنى سرعة الزامية", en: "Minimum speed", fr: "Vitesse minimale", meaning: "You must go at least this speed.", action: "Do not drive slower than shown." },
  // ---- End of prohibition ----
  { id: 80, cat: "end", frame: "end", ar: "انتهاء جميع القيود", en: "End of all restrictions", fr: "Fin des interdictions", meaning: "Previous restrictions no longer apply.", action: "Resume normal rules." },
  { id: 81, cat: "end", frame: "end", text: "60", ar: "انتهاء حد السرعة", en: "End of speed limit", fr: "Fin de limitation", meaning: "The speed limit ends.", action: "Return to the default limit." },
  { id: 82, cat: "end", frame: "end", icon: Car, ar: "انتهاء منع التجاوز", en: "End of no-overtaking", fr: "Fin d'interdiction de dépasser", meaning: "Overtaking is allowed again.", action: "You may overtake safely." },
  // ---- Info / Guide ----
  { id: 91, cat: "info", frame: "info", text: "P", ar: "موقف", en: "Parking", fr: "Stationnement", meaning: "Parking area.", action: "You may park here." },
  { id: 97, cat: "info", frame: "info", icon: TramFront, ar: "موقف باصات", en: "Bus stop", fr: "Arrêt d'autobus", meaning: "Bus stop.", action: "Do not block the stop." },
  { id: 99, cat: "info", frame: "info", icon: ArrowUp, ar: "اتجاه السير الى الأمام", en: "One-way traffic", fr: "Sens unique", meaning: "One-way street ahead.", action: "Travel only in the arrow's direction." },
  { id: 100, cat: "info", frame: "info", ar: "طريق غير نافذ", en: "No through road", fr: "Impasse", meaning: "Dead-end street.", action: "Expect to turn around." },
  { id: 106, cat: "info", frame: "info", icon: Car, ar: "بداية طريق سريع", en: "Beginning of highway", fr: "Début d'autoroute", meaning: "Highway rules start here.", action: "Highway speeds and rules apply." },
  { id: 107, cat: "info", frame: "info", strike: true, icon: Car, ar: "نهاية طريق سريع", en: "End of highway", fr: "Fin d'autoroute", meaning: "Highway ends.", action: "Adjust to normal road rules." },
  { id: 108, cat: "info", frame: "info", text: "H", ar: "مستشفى", en: "Hospital", fr: "Hôpital", meaning: "Hospital nearby.", action: "Keep noise down; watch for ambulances." },
  { id: 109, cat: "info", frame: "info", icon: Gauge, ar: "نفق", en: "Tunnel (>500 m)", fr: "Tunnel", meaning: "Long tunnel ahead.", action: "Turn on dipped lights, keep distance." },
  { id: 111, cat: "info", frame: "info", icon: Cross, ar: "إسعافات أولية", en: "First aid post", fr: "Poste de secours", meaning: "First aid available.", action: "Note the location in emergencies." },
  { id: 118, cat: "info", frame: "info", icon: Utensils, ar: "مطعم", en: "Restaurant", fr: "Restaurant", meaning: "Restaurant nearby.", action: "Service available." },
  { id: 120, cat: "info", frame: "info", icon: Fuel, ar: "محطة وقود", en: "Fuel station", fr: "Station-service", meaning: "Fuel station nearby.", action: "Refuel here." },
  { id: 121, cat: "info", frame: "info", icon: Bed, ar: "فندق", en: "Hotel / Motel", fr: "Hôtel ou motel", meaning: "Accommodation nearby.", action: "Lodging available." },

  /* ===== Additional standard signs (common Lebanese / Vienna-convention set) ===== */
  // ---- Warning ----
  { id: 3, cat: "warn", frame: "warn", icon: CornerDownRight, ar: "منعطفات متتالية أولها لليمين", en: "Double bend, first right", fr: "Virages, premier à droite", meaning: "A series of bends, the first to the right.", action: "Slow down before the bends." },
  { id: 4, cat: "warn", frame: "warn", icon: CornerUpLeft, ar: "منعطفات متتالية أولها لليسار", en: "Double bend, first left", fr: "Virages, premier à gauche", meaning: "A series of bends, the first to the left.", action: "Slow down before the bends." },
  { id: 7, cat: "warn", frame: "warn", icon: Merge, ar: "ضيق في الطريق", en: "Road narrows", fr: "Chaussée rétrécie", meaning: "The road narrows ahead.", action: "Slow down and be ready to give way." },
  { id: 8, cat: "warn", frame: "warn", icon: ArrowUp, ar: "إنحدار صاعد", en: "Steep ascent", fr: "Montée dangereuse", meaning: "A steep uphill grade is ahead.", action: "Keep momentum; watch slow vehicles." },
  { id: 9, cat: "warn", frame: "warn", icon: Snowflake, ar: "طريق زلق بسبب الثلج", en: "Ice / snow", fr: "Chaussée glissante (verglas)", meaning: "Road may be icy or snowy.", action: "Slow right down; avoid sudden inputs." },
  { id: 13, cat: "warn", frame: "warn", icon: Train, ar: "تقاطع سكة حديد بدون حواجز", en: "Railway crossing (no gates)", fr: "Passage à niveau sans barrières", meaning: "Ungated level crossing ahead.", action: "Look, listen, and give way to trains." },
  { id: 17, cat: "warn", frame: "warn", icon: Anchor, ar: "رصيف أو ضفة نهر", en: "Quay or river bank", fr: "Quai ou berge", meaning: "Road runs alongside water.", action: "Keep away from the edge." },
  { id: 19, cat: "warn", frame: "warn", icon: Waypoints, ar: "تقاطع طرق", en: "Crossroads", fr: "Intersection", meaning: "A crossroads is ahead.", action: "Slow down and check all directions." },
  { id: 22, cat: "warn", frame: "warn", icon: Bike, ar: "عبور دراجات هوائية", en: "Cyclists crossing", fr: "Traversée de cyclistes", meaning: "Cyclists may cross ahead.", action: "Slow down and give way." },
  { id: 30, cat: "warn", frame: "warn", icon: Plane, ar: "طيران منخفض", en: "Low-flying aircraft", fr: "Avions à basse altitude", meaning: "Low aircraft or sudden noise possible.", action: "Stay focused; don't be startled." },
  // ---- Priority ----
  { id: 31, cat: "priority", frame: "warn", icon: Merge, ar: "تقاطع مع طريق فرعي", en: "Side road junction", fr: "Route secondaire", meaning: "A minor road joins ahead.", action: "Watch for vehicles emerging." },
  // ---- Prohibition ----
  { id: 40, cat: "prohibit", frame: "prohibit", icon: Truck, ar: "ممنوع تجاوز الشاحنات", en: "No overtaking by trucks", fr: "Interdiction de dépasser (camions)", meaning: "Goods vehicles must not overtake.", action: "Trucks stay in lane." },
  { id: 41, cat: "prohibit", frame: "prohibit", icon: Bus, ar: "ممنوع دخول الحافلات", en: "No buses", fr: "Accès interdit aux autobus", meaning: "Buses are forbidden.", action: "Buses must not enter." },
  { id: 47, cat: "prohibit", frame: "prohibit", text: "3.5m", ar: "ممنوع تجاوز الارتفاع", en: "Height limit", fr: "Hauteur limitée", meaning: "Vehicles over the height shown are forbidden.", action: "Do not enter if you are taller." },
  { id: 48, cat: "prohibit", frame: "prohibit", text: "2m", ar: "ممنوع تجاوز العرض", en: "Width limit", fr: "Largeur limitée", meaning: "Vehicles over the width shown are forbidden.", action: "Do not enter if you are wider." },
  { id: 52, cat: "prohibit", frame: "prohibit", text: "10t", ar: "ممنوع تجاوز الوزن", en: "Weight limit", fr: "Poids limité", meaning: "Vehicles over the weight shown are forbidden.", action: "Do not enter if you are heavier." },
  { id: 53, cat: "prohibit", frame: "prohibit", icon: AlertTriangle, ar: "ممنوع نقل المواد الخطرة", en: "No dangerous goods", fr: "Interdit aux matières dangereuses", meaning: "Vehicles carrying dangerous goods forbidden.", action: "Find an approved route." },
  { id: 58, cat: "prohibit", frame: "prohibit", icon: RotateCcw, ar: "ممنوع الدوران", en: "No turning", fr: "Interdiction de tourner", meaning: "Turning is forbidden here.", action: "Continue as directed." },
  // ---- Parking ----
  { id: 63, cat: "parking", frame: "info", icon: Clock, ar: "وقوف محدد بوقت", en: "Time-limited parking", fr: "Stationnement à durée limitée", meaning: "Parking allowed for a limited time.", action: "Display your arrival time if required." },
  // ---- Mandatory ----
  { id: 69, cat: "mandatory", frame: "mandatory", icon: ArrowUpDown, ar: "اتجاه اجباري يمين أو يسار", en: "Turn left or right", fr: "Direction obligatoire à droite ou à gauche", meaning: "You must turn left or right.", action: "Choose one of the two directions." },
  { id: 71, cat: "mandatory", frame: "mandatory", icon: RotateCcw, ar: "الدوران إلزامي", en: "Roundabout (mandatory)", fr: "Sens giratoire obligatoire", meaning: "You must follow the roundabout.", action: "Give way and circulate." },
  { id: 76, cat: "mandatory", frame: "mandatory", icon: Snowflake, ar: "سلاسل ثلج إلزامية", en: "Snow chains required", fr: "Chaînes à neige obligatoires", meaning: "Snow chains must be fitted.", action: "Fit chains before proceeding." },
  { id: 78, cat: "mandatory", frame: "mandatory", icon: ArrowUp, ar: "اتجاه اجباري للشاحنات", en: "Trucks: direction", fr: "Direction obligatoire (camions)", meaning: "Goods vehicles must follow this direction.", action: "Trucks obey the arrow." },
  // ---- End of restriction ----
  { id: 83, cat: "end", frame: "end", icon: VolumeX, ar: "انتهاء منع استعمال المنبه", en: "End of no-horn zone", fr: "Fin d'interdiction de klaxon", meaning: "The horn restriction ends.", action: "Normal rules resume." },
  { id: 84, cat: "end", frame: "end", text: "30", ar: "انتهاء السرعة الدنيا", en: "End of minimum speed", fr: "Fin de vitesse minimale", meaning: "Minimum-speed rule ends.", action: "Normal rules resume." },
  // ---- Info / Guide / Service ----
  { id: 92, cat: "info", frame: "info", icon: PersonStanding, ar: "ممر مشاة (إرشادي)", en: "Pedestrian crossing", fr: "Passage pour piétons", meaning: "A marked pedestrian crossing.", action: "Give way to pedestrians on it." },
  { id: 98, cat: "info", frame: "info", icon: Car, ar: "موقف سيارات أجرة", en: "Taxi rank", fr: "Station de taxis", meaning: "Taxi rank.", action: "Keep it clear for taxis." },
  { id: 110, cat: "info", frame: "info", icon: Phone, ar: "هاتف", en: "Telephone", fr: "Téléphone", meaning: "Emergency/public telephone.", action: "Note it for emergencies." },
  { id: 112, cat: "info", frame: "info", icon: Wrench, ar: "ورشة تصليح", en: "Garage / repairs", fr: "Atelier de réparation", meaning: "Vehicle repair service.", action: "Assistance available." },
  { id: 116, cat: "info", frame: "info", icon: Utensils, ar: "منطقة استراحة", en: "Rest area", fr: "Aire de repos", meaning: "Rest area ahead.", action: "A place to stop and rest." },
  { id: 119, cat: "info", frame: "info", icon: Plane, ar: "مطار", en: "Airport", fr: "Aéroport", meaning: "Airport nearby.", action: "Follow for the airport." },
  { id: 122, cat: "info", frame: "info", icon: Info, ar: "مركز معلومات", en: "Information point", fr: "Point d'information", meaning: "Tourist/road information.", action: "Information available." },
  { id: 123, cat: "info", frame: "info", icon: ShieldCheck, ar: "مركز شرطة", en: "Police", fr: "Police", meaning: "Police station nearby.", action: "Note the location." },
  { id: 124, cat: "info", frame: "info", icon: Thermometer, ar: "ماء صالح للشرب", en: "Drinking water", fr: "Eau potable", meaning: "Drinking water available.", action: "Refill here." },
  // ---- Directional ----
  { id: 126, cat: "info", frame: "info", icon: Signpost, ar: "لوحة اتجاه", en: "Direction sign", fr: "Panneau de direction", meaning: "Shows directions to destinations.", action: "Follow for your destination." },
  { id: 130, cat: "info", frame: "info", icon: MapPin, ar: "تأكيد المسار", en: "Route confirmation", fr: "Confirmation d'itinéraire", meaning: "Confirms you're on the right route.", action: "Continue on this route." },
  { id: 133, cat: "info", frame: "info", icon: Milestone, ar: "لوحة مسافات (كم)", en: "Distance marker", fr: "Borne kilométrique", meaning: "Distance to the next place.", action: "Use it to judge distance." },
  // ---- Delineators ----
  { id: 136, cat: "warn", frame: "warn", icon: CornerDownRight, ar: "لوحة توجيه المنعطف", en: "Chevron (bend marker)", fr: "Balise de virage", meaning: "Marks the direction of a sharp bend.", action: "Follow the chevrons through the bend." },
  { id: 138, cat: "warn", frame: "warn", icon: Milestone, ar: "علامة حافة الطريق", en: "Edge marker post", fr: "Balise de bord de route", meaning: "Marks the road edge.", action: "Stay within the markers." },
];

const CATS = {
  warn: { en: "Warning", ar: "تحذيرية", fr: "Danger", color: "#DC2626" },
  priority: { en: "Priority", ar: "أفضلية", fr: "Priorité", color: "#D97706" },
  prohibit: { en: "Prohibition", ar: "منع", fr: "Interdiction", color: "#B91C1C" },
  parking: { en: "Parking", ar: "وقوف", fr: "Stationnement", color: "#2563EB" },
  mandatory: { en: "Mandatory", ar: "إلزامية", fr: "Obligation", color: "#1D4ED8" },
  end: { en: "End of restriction", ar: "نهاية المنع", fr: "Fin d'interdiction", color: "#334155" },
  info: { en: "Information", ar: "إرشادية", fr: "Information", color: "#1E3A8A" },
};

/* ============================== THEORY QUESTIONS (verified subset from Exam PDF) ============================== */
// correct = index of correct answer (from the TRUE/FALSE status columns)
const THEORY = [
  { id: 1, type: "Safety", cat: "G", en: "When entering a tunnel while driving during the day, you should:", ar: "عند دخولك في نفق أثناء القيادة نهاراً، عليك:", opts: ["Turn on dipped headlights and increase speed", "Turn on dipped headlights and reduce speed", "Use the horn"], oa: ["تشغيل الإضاءة المنخفضة وزيادة السرعة", "تشغيل الإضاءة المنخفضة وتخفيف السرعة", "استعمال الزمور"], correct: 1, exp: "In a tunnel, switch on dipped lights and ease off the speed." },
  { id: 2, type: "Safety", cat: "G", en: "When driving at night behind another vehicle, you should:", ar: "عند قيادتك أثناء الليل خلف مركبة أخرى، عليك:", opts: ["Use dipped (low-beam) headlights", "Use high beam", "Use no lights"], oa: ["تشغيل الإضاءة المنخفضة", "استعمال الإضاءة العالية", "عدم استعمال الضوء"], correct: 0, exp: "Low beam avoids dazzling the driver ahead through their mirrors." },
  { id: 3, type: "Safety", cat: "G", en: "If a vehicle appears from the opposite direction while you use high beam at night, you should:", ar: "عند ظهور مركبة من الجهة المعاكسة أثناء استعمالك الإضاءة العالية ليلاً، عليك:", opts: ["Switch to dipped beam", "Turn lights off completely", "Flash between high and low beam"], oa: ["الانتقال إلى ضوء التلاقي", "إطفاء الضوء نهائياً", "تقطيع الضوء بالتبديل"], correct: 0, exp: "Dip your lights so you don't blind the oncoming driver." },
  { id: 4, type: "Safety", cat: "G", en: "When filling your fuel tank, you should:", ar: "عند تعبئة خزان مركبتك بالوقود، عليك:", opts: ["Keep the engine running", "Not worry, there is no danger", "Turn off the vehicle's engine"], oa: ["إبقاء المحرك شغالاً", "عدم الاهتمام لعدم وجود خطر", "إطفاء محرك المركبة"], correct: 2, exp: "Always switch the engine off while refuelling." },
  { id: 5, type: "Law", cat: "G", en: "When the light turns from green to amber as your vehicle is crossing the intersection, you should:", ar: "عندما تتحول الإشارة من الأخضر إلى الأصفر لحظة عبور مركبتك للتقاطع، عليك:", opts: ["Stop immediately in the middle", "Continue carefully", "Fix your gaze on the signal"], oa: ["التوقف فوراً وسط التقاطع", "متابعة سيرك بانتباه", "تركيز نظرك على الإشارة"], correct: 1, exp: "If you're already in the junction, clear it carefully." },
  { id: 6, type: "Safety", cat: "G", en: "When you feel very drowsy while driving, you should:", ar: "عند شعورك بالنعاس الشديد أثناء القيادة، عليك:", opts: ["Take stimulants and keep going", "Ignore it, it will pass", "Stop in a safe place to rest"], oa: ["تناول أدوية منشّطة والمتابعة", "عدم الاهتمام", "التوقف في مكان آمن للراحة"], correct: 2, exp: "Fatigue only cures with rest — pull over safely." },
  { id: 7, type: "Law", cat: "G", en: "At a junction with a policeman directing traffic, traffic lights, and a fixed sign, you must obey:", ar: "عند تقاطع فيه شرطي ينظّم السير وإشارة ضوئية وإشارة ثابتة، عليك الالتزام بـ:", opts: ["The traffic policeman's instructions", "The traffic light only", "The fixed sign only"], oa: ["تعليمات شرطي السير", "الإشارة الضوئية فقط", "الإشارة الثابتة فقط"], correct: 0, exp: "The policeman overrides both lights and signs." },
  { id: 8, type: "Safety", cat: "BC", en: "As soon as the driver sits behind the wheel, they should first:", ar: "فور جلوس السائق خلف المقود، عليه أولاً أن:", opts: ["Belt up, adjust mirrors, then seat", "Belt up, adjust seat, then mirrors", "Adjust seat, adjust mirrors, then belt up"], oa: ["ربط الحزام ثم المرايا ثم المقعد", "ربط الحزام ثم المقعد ثم المرايا", "تعديل المقعد ثم المرايا ثم ربط الحزام"], correct: 2, exp: "Seat first, then mirrors (they depend on seat position), then belt." },
  { id: 9, type: "Safety", cat: "G", en: "Each day before setting off for the first time, the driver should:", ar: "كل يوم قبل الانطلاق لأول مرة، على السائق أن:", opts: ["Do a routine check of the vehicle's systems", "Not check anything if the engine runs", "Listen to the weather forecast"], oa: ["إجراء فحص روتيني لأنظمة المركبة", "عدم الفحص طالما المحرك يعمل", "الاستماع لنشرة الأحوال"], correct: 0, exp: "A quick daily walk-around check prevents surprises." },
  { id: 10, type: "Safety", cat: "G", en: "It is acceptable for the driver while driving to:", ar: "لا بأس على السائق أثناء القيادة أن:", opts: ["Read the newspaper", "Use the phone", "Listen to the radio at low volume"], oa: ["قراءة الصحيفة", "استعمال الهاتف", "الاستماع للراديو بصوت منخفض"], correct: 2, exp: "Low-volume radio is fine; the others are dangerous distractions." },
  { id: 11, type: "Safety", cat: "BC", en: "The driver and passengers should fasten their seatbelts:", ar: "على السائق والركاب ربط حزام الأمان:", opts: ["Before starting the engine", "Before moving off", "Within a minute of moving off"], oa: ["قبل تشغيل المحرك", "قبل الانطلاق", "خلال دقيقة من الانطلاق"], correct: 0, exp: "Belt up before you even start the engine." },
  { id: 12, type: "Safety", cat: "BC", en: "The purpose of the headrest at the top of the seat is to:", ar: "الهدف من مسند الرأس أعلى المقعد هو:", opts: ["Rest the head during the trip", "Prevent neck injury in a rear-end crash", "Use it as a pillow on long trips"], oa: ["إراحة الرأس", "منع إصابة الرقبة في صدمة خلفية", "استعماله كوسادة"], correct: 1, exp: "It protects the neck from whiplash in a rear impact." },
  { id: 13, type: "Safety", cat: "G", en: "A driver's ability to concentrate decreases because of:", ar: "تقلّ قدرة السائق على التركيز بسبب:", opts: ["Being energetic and active", "Fatigue and drowsiness", "Driving inside the city"], oa: ["الحيوية والنشاط", "الإرهاق والنعاس", "القيادة داخل المدينة"], correct: 1, exp: "Tiredness and sleepiness are the main concentration killers." },
  { id: 14, type: "Safety", cat: "G", en: "Using a mobile phone while driving affects driving in a way that is:", ar: "استخدام الهاتف الخلوي أثناء القيادة يؤثر بشكل:", opts: ["Positive", "Negative", "Both positive and negative"], oa: ["إيجابي", "سلبي", "سلبي وإيجابي"], correct: 1, exp: "Phone use is a clear negative — it splits your attention." },
  { id: 16, type: "Safety", cat: "G", en: "Driving under the influence of sleeping medication is:", ar: "القيادة تحت تأثير الأدوية المنوّمة تكون:", opts: ["Dangerous", "Not dangerous", "Less tiring"], oa: ["خطيرة", "غير خطيرة", "أقل تعباً"], correct: 0, exp: "Sedating medication makes driving dangerous." },
  { id: 28, type: "Safety", cat: "BC", en: "A benefit of ABS in modern vehicles during hard braking is that it:", ar: "من حسنات نظام ABS عند الفرملة الشديدة أنه:", opts: ["Prevents wheel lock and lets you steer", "Does not prevent wheel lock", "Only prevents wheel lock, no steering"], oa: ["يمنع انغلاق العجلات ويسمح بالتوجيه", "لا يمنع الانغلاق", "يمنع الانغلاق فقط"], correct: 0, exp: "ABS keeps wheels turning so you can still steer while braking hard." },
  { id: 29, type: "Safety", cat: "G", en: "If your vehicle starts to skid, you should quickly:", ar: "عند انزلاق مركبتك، عليك بسرعة أن:", opts: ["Increase speed", "Ease off the accelerator, don't brake, and steer into the skid", "Brake hard"], oa: ["زيادة السرعة", "رفع القدم عن الوقود وعدم الفرملة والتوجيه نحو الانزلاق", "الفرملة بشدة"], correct: 1, exp: "Off the gas, no braking, steer gently the way the rear is sliding." },
  { id: 30, type: "Safety", cat: "G", en: "Keeping a safety gap between you and the vehicle ahead lets you:", ar: "ترك مسافة أمان مع المركبة أمامك يمكّنك من:", opts: ["Avoid hitting it if it stops suddenly", "Enjoy the scenery", "Read its plate"], oa: ["تفادي الاصطدام إذا توقفت فجأة", "الاستمتاع بالمناظر", "قراءة لوحتها"], correct: 0, exp: "The gap is your reaction and stopping space." },
  { id: 50, type: "Safety", cat: "G", en: "To control your vehicle on downhill grades, you should mainly rely on:", ar: "للسيطرة على المركبة على المنحدرات، اعتمد أساساً على:", opts: ["A low gear", "The handbrake", "The main brakes only"], oa: ["ترس منخفض", "فرامل اليد", "الفرامل الرئيسية فقط"], correct: 0, exp: "Engine braking in a low gear saves your brakes from overheating." },
  { id: 74, type: "Safety", cat: "A", en: "Real protection for a motorcyclist comes from:", ar: "الحماية الحقيقية لسائق الدراجة النارية تكون بـ:", opts: ["Wearing proper motorcycle gear", "Riding on the rear tyre only", "Having insurance"], oa: ["ارتداء ملابس الدراجات المخصّصة", "القيادة على الإطار الخلفي", "وجود تأمين"], correct: 0, exp: "Protective gear (helmet, jacket, gloves, boots) is the real safety." },
  { id: 101, type: "ED", cat: "G", en: "An environmental benefit of eco-friendly driving is:", ar: "من الفوائد البيئية للقيادة الصديقة للبيئة:", opts: ["Lower harmful air-pollutant emissions", "More greenhouse gases", "Reducing traffic jams"], oa: ["تخفيض ملوثات الهواء", "زيادة الغازات الدفيئة", "الحد من الازدحام"], correct: 0, exp: "Smooth eco-driving cuts harmful emissions." },
  { id: 104, type: "ED", cat: "G", en: "The tool used to keep a steady speed on the highway is:", ar: "الأداة لمراقبة السرعة على الطريق السريع هي:", opts: ["Cruise control", "Regular stop-and-go", "Sudden braking"], oa: ["مثبّت السرعة", "الإقلاع والتوقف بانتظام", "الضغط المفاجئ على الفرامل"], correct: 0, exp: "Cruise control holds a constant, fuel-efficient speed." },
  { id: 113, type: "ED", cat: "G", en: "When the car stays still for more than a minute, you should:", ar: "عند توقف السيارة لأكثر من دقيقة، عليك:", opts: ["Turn off the engine", "Put gearbox in N", "Rev the engine"], oa: ["إطفاء المحرك", "وضع الفتيس على N", "زيادة الدوران"], correct: 0, exp: "Switching off saves fuel and cuts emissions when idling long." },
];

const TYPE_LABEL = {
  Safety: { en: "Safety", ar: "سلامة", fr: "Sécurité" },
  Law: { en: "Law", ar: "قانون", fr: "Loi" },
  ED: { en: "Eco-driving", ar: "قيادة صديقة للبيئة", fr: "Éco-conduite" },
  Signs: { en: "Signs", ar: "إشارات", fr: "Panneaux" },
};

/* ============================== PRACTICAL CAR CHECK (practical knowledge) ============================== */
const CAR_ITEMS = [
  { ar: "دولاب سبير", en: "Spare tyre", why: "To replace a punctured tyre on the road.", where: "Under the boot floor or mounted underneath.", check: "Inflated, tread intact, no cracks." },
  { ar: "مثلث تحذير", en: "Warning triangle", why: "To warn other drivers when you break down.", where: "In the boot.", check: "Legs unfold and it stands up straight." },
  { ar: "طفاية حريق", en: "Fire extinguisher", why: "To put out a small vehicle fire.", where: "Boot or under a seat.", check: "Gauge in the green, not expired." },
  { ar: "كريك", en: "Jack", why: "To lift the car to change a wheel.", where: "With the spare tyre.", check: "Winds up and down smoothly." },
  { ar: "مفتاح دواليب", en: "Wheel wrench", why: "To loosen and tighten wheel nuts.", where: "With the jack and spare.", check: "Fits your wheel nuts." },
  { ar: "دفتر السيارة", en: "Vehicle registration", why: "Legally required proof of registration.", where: "Glovebox / with you.", check: "Valid and matches the plate." },
  { ar: "دفتر السواقة", en: "Driving licence", why: "Legally required to drive.", where: "On your person.", check: "Valid, correct category, not expired." },
  { ar: "بوليصة التأمين", en: "Insurance document", why: "Legally required proof of insurance.", where: "Glovebox.", check: "In force and current." },
  { ar: "سترة عاكسة", en: "Reflective vest", why: "So you're visible when outside the car at night.", where: "Cabin, within reach.", check: "Reflective strips intact." },
  { ar: "حقيبة إسعافات أولية", en: "First-aid kit", why: "To treat minor injuries.", where: "Boot or cabin.", check: "Sealed, items not expired." },
];

const TYRE = [
  { part: "205", label: "Width", detail: "Tyre width in millimetres (tread width)." },
  { part: "55", label: "Aspect ratio", detail: "Sidewall height as a percentage of the width (55% of 205 mm)." },
  { part: "R", label: "Construction", detail: "Radial-ply construction." },
  { part: "16", label: "Rim diameter", detail: "Wheel-rim diameter in inches." },
];
const TYRE_EXTRA = [
  "Load index & speed rating follow the size (e.g. 91V).",
  "DOT code gives the manufacturing week/year — check the tyre's age.",
  "Find the correct pressure on the driver-door sticker, the fuel-door label, or the owner's manual — not the number moulded on the sidewall (that's the maximum).",
  "Check tread depth, cuts, bulges, cracks, uneven wear and sidewall damage. Don't forget the spare and the valve.",
];

const OIL_STEPS = [
  "Park on level ground.", "Switch off the engine.", "Wait a few minutes for oil to settle.",
  "Open the bonnet safely.", "Locate the oil dipstick.", "Pull it out.", "Wipe it clean.",
  "Reinsert it fully.", "Remove it again.", "Check the film is between MIN and MAX.",
];
const OIL_WARN = [
  "Don't overfill.", "Very low oil can damage the engine.",
  "Milky oil can mean coolant contamination.", "Metal particles can mean internal damage.",
  "A red oil-pressure light may mean stop the engine immediately.",
];

const FLUIDS = [
  { icon: Droplets, title: "Coolant", ar: "سائل التبريد", points: ["Check only when the engine is cold.", "Level between MIN and MAX on the expansion tank.", "Never open a hot radiator or coolant cap.", "Low coolant can mean a leak; overheating needs immediate attention."] },
  { icon: ShieldCheck, title: "Brake fluid", ar: "سائل الفرامل", points: ["Reservoir level between MIN and MAX.", "Low level can mean worn pads or a leak.", "Never ignore a brake warning light.", "Use only the fluid the manufacturer specifies."] },
  { icon: Battery, title: "Battery", ar: "البطارية", points: ["Terminals clean, no corrosion.", "Battery mounted securely.", "Slow cranking = weak battery.", "Handle safely; avoid sparks near it."] },
  { icon: Droplets, title: "Other checks", ar: "فحوصات أخرى", points: ["Washer fluid, power-steering & transmission fluid (where fitted).", "Belts and hoses for wear.", "Visible leaks or loose wires under the bonnet."] },
];

const LIGHTS = ["Low beam", "High beam", "Brake lights", "Indicators", "Hazard lights", "Reverse lights", "Fog lights", "Number-plate lights", "Horn", "Wipers & washers", "Handbrake", "Mirrors & seat"];

/* ============================== ORAL QUESTIONS (practical knowledge) ============================== */
const ORAL = [
  { q: "What must be inside the vehicle?", a: "Spare tyre, jack, wheel wrench, warning triangle, fire extinguisher, reflective vest, first-aid kit, plus registration, licence and insurance documents." },
  { q: "What documents must the driver carry?", a: "Valid driving licence, vehicle registration (دفتر السيارة) and insurance policy (بوليصة التأمين)." },
  { q: "How do you check engine-oil level?", a: "Park level, engine off, wait, pull the dipstick, wipe, reinsert fully, pull again and read — the film should sit between MIN and MAX." },
  { q: "How do you read tyre dimensions (e.g. 205/55 R16)?", a: "205 = width in mm, 55 = sidewall height as % of width, R = radial, 16 = rim diameter in inches." },
  { q: "Where do you find the correct tyre pressure?", a: "Driver-door sticker, fuel-door label, or the owner's manual — not the maximum number on the sidewall." },
  { q: "How do you check tyre tread?", a: "Look at the tread-wear indicators or measure depth; check for even wear, cuts, bulges and cracks." },
  { q: "How do you inspect the spare tyre?", a: "Confirm it's inflated, the tread is good, and there are no cracks or damage." },
  { q: "How do you check coolant level?", a: "Only when cold — the expansion-tank level should be between MIN and MAX. Never open a hot cap." },
  { q: "Why must you not open the coolant cap when hot?", a: "The system is pressurised and hot; opening it can spray boiling coolant and scald you." },
  { q: "How do you check brake fluid?", a: "Read the reservoir; level should be between MIN and MAX. Low level may mean worn pads or a leak." },
  { q: "How do you inspect the battery?", a: "Check clean terminals, no corrosion, secure mounting; slow cranking signals a weak battery." },
  { q: "What should you check before starting a journey?", a: "Tyres & pressures, lights, mirrors, fluids, brakes, seatbelt, documents and that required items are on board." },
  { q: "What does ABS do?", a: "It stops the wheels locking under hard braking so you keep steering control." },
  { q: "What should you do if the engine overheats?", a: "Ease off, pull over safely, switch off, and let it cool before opening anything." },
  { q: "What should you do during brake failure?", a: "Pump the pedal, shift down to use engine braking, use the handbrake gently, and steer to a safe stop." },
  { q: "What should you do during a tyre blowout?", a: "Hold the wheel firmly, ease off the accelerator, don't brake hard, and steer straight to a controlled stop." },
  { q: "What should you do if the accelerator sticks?", a: "Shift to neutral, brake to slow, steer off the road, then switch off the engine." },
  { q: "What should you do after an accident?", a: "Stop, secure the scene (triangle, hazards), help the injured, and report as required. Never leave the scene." },
  { q: "How do you place the warning triangle safely?", a: "Well behind the vehicle so approaching traffic sees it in time — further back on fast roads." },
  { q: "How do you test brake lights alone?", a: "Reverse close to a wall or reflective surface and watch the red glow, or ask someone / use a phone camera." },
];

/* ============================== EMERGENCY SCENARIOS ============================== */
const EMERGENCIES = [
  { title: "Tyre blowout", icon: AlertTriangle, warn: ["Loud bang", "Sudden pull to one side", "Vibration"], now: ["Grip the wheel firmly", "Ease off the accelerator", "Steer straight", "Brake gently once controlled"], avoid: ["Braking hard", "Sudden steering"], sum: "Hold straight, slow gently, stop off the road." },
  { title: "Brake failure", icon: Ban, warn: ["Soft or sinking pedal", "Brake warning light"], now: ["Pump the pedal", "Shift to a low gear", "Use the handbrake gently", "Steer to a safe stop"], avoid: ["Yanking the handbrake", "Switching off the engine while moving"], sum: "Engine-brake down, handbrake gently, steer to safety." },
  { title: "Engine overheating", icon: Gauge, warn: ["Temperature gauge high", "Steam from the bonnet"], now: ["Ease off", "Pull over safely", "Switch off", "Let it cool"], avoid: ["Opening a hot coolant cap", "Driving on while hot"], sum: "Stop, switch off, cool down before touching anything." },
  { title: "Oil-pressure warning", icon: Droplets, warn: ["Red oil light", "Odd engine noise"], now: ["Pull over safely", "Switch off the engine", "Check oil when safe"], avoid: ["Continuing to drive"], sum: "Red oil light = stop the engine soon." },
  { title: "Skidding", icon: RotateCcw, warn: ["Loss of grip", "Rear sliding out"], now: ["Ease off the accelerator", "Steer into the skid", "Avoid braking"], avoid: ["Braking hard", "Sudden inputs"], sum: "Off the gas, steer where the rear goes, no braking." },
  { title: "Heavy rain / aquaplaning", icon: Waves, warn: ["Steering goes light", "Spray reduces vision"], now: ["Ease off gently", "Hold the wheel steady", "Increase following distance"], avoid: ["Braking or turning sharply"], sum: "Slow smoothly, keep straight, wait for grip to return." },
  { title: "Fog", icon: Wind, warn: ["Reduced visibility"], now: ["Slow down", "Use dipped + fog lights", "Increase distance"], avoid: ["High beam (it reflects back)", "Following too closely"], sum: "Slow, fog lights on, big gap ahead." },
  { title: "Stuck accelerator", icon: Zap, warn: ["Car keeps speeding up"], now: ["Shift to neutral", "Brake to slow", "Steer off the road", "Switch off once stopped"], avoid: ["Switching off while steering-locked"], sum: "Neutral, brake, pull over, then off." },
  { title: "Motorway breakdown", icon: Car, warn: ["Warning light", "Loss of power"], now: ["Move to the hard shoulder", "Hazards on", "Triangle well back", "Exit away from traffic"], avoid: ["Standing on the traffic side"], sum: "Off the lane, hazards + triangle, stay clear of traffic." },
  { title: "After a collision", icon: ShieldCheck, warn: ["Impact occurred"], now: ["Stop and secure the scene", "Help the injured", "Exchange details", "Report as required"], avoid: ["Leaving the scene"], sum: "Stop, secure, help, report — never leave." },
];

const TOPICS = [
  { key: "warn", label: { en: "Road signs", ar: "الإشارات", fr: "Panneaux" }, icon: Signpost },
  { key: "Law", label: { en: "Traffic laws", ar: "قوانين السير", fr: "Lois" }, icon: ListChecks },
  { key: "Safety", label: { en: "Safety", ar: "السلامة", fr: "Sécurité" }, icon: ShieldCheck },
  { key: "ED", label: { en: "Eco-driving", ar: "قيادة صديقة", fr: "Éco" }, icon: Droplets },
  { key: "practical", label: { en: "Vehicle inspection", ar: "فحص المركبة", fr: "Contrôle" }, icon: Wrench },
  { key: "oral", label: { en: "Oral questions", ar: "الشفهي", fr: "Oral" }, icon: Mic },
  { key: "emergency", label: { en: "Emergencies", ar: "الطوارئ", fr: "Urgences" }, icon: AlertTriangle },
  { key: "A", label: { en: "Motorcycle", ar: "الدراجة النارية", fr: "Moto" }, icon: Bike },
  { key: "C", label: { en: "Heavy vehicles", ar: "المركبات الثقيلة", fr: "Poids lourds" }, icon: Truck },
];

/* ============================== SIGN GRAPHIC ============================== */
function SignGraphic({ sign, size = 96 }) {
  const Icon = sign.icon;
  const iconColor = ["mandatory", "info", "prohibitSolid", "stop"].includes(sign.frame) ? "#fff" : "#111";
  const textColor = sign.frame === "diamond" ? "#111"
    : ["stop", "prohibitSolid", "info", "mandatory", "end"].includes(sign.frame) ? (sign.frame === "end" ? "#111" : "#fff") : "#111";
  // icon placement: triangles push the symbol lower
  const iconSize = Math.round(size * (sign.frame === "warn" ? 0.34 : 0.42));
  const offsetY = sign.frame === "warn" ? size * 0.08 : sign.frame === "yield" ? -size * 0.05 : 0;

  return (
    <div style={{ width: size, height: size, position: "relative" }} className="grid place-items-center">
      <svg viewBox="0 0 100 100" width={size} height={size} aria-label={sign.en}>
        {sign.frame === "warn" && <polygon points="50,10 91,84 9,84" fill="#fff" stroke="#DC2626" strokeWidth="8" strokeLinejoin="round" />}
        {sign.frame === "yield" && <polygon points="10,16 90,16 50,88" fill="#fff" stroke="#DC2626" strokeWidth="9" strokeLinejoin="round" />}
        {sign.frame === "prohibit" && <circle cx="50" cy="50" r="44" fill="#fff" stroke="#DC2626" strokeWidth="9" />}
        {sign.frame === "prohibitSolid" && <>
          <circle cx="50" cy="50" r="46" fill="#B91C1C" />
          {sign.text === "—" && <rect x="24" y="43" width="52" height="14" rx="2" fill="#fff" />}
        </>}
        {sign.frame === "mandatory" && <circle cx="50" cy="50" r="46" fill="#1D4ED8" />}
        {sign.frame === "stop" && <polygon points="31,5 69,5 95,31 95,69 69,95 31,95 5,69 5,31" fill="#C1121F" stroke="#fff" strokeWidth="4" />}
        {sign.frame === "diamond" && <polygon points="50,5 95,50 50,95 5,50" fill="#facc15" stroke="#111" strokeWidth="7" strokeLinejoin="round" />}
        {sign.frame === "info" && <rect x="7" y="7" width="86" height="86" rx="9" fill="#1E3A8A" />}
        {sign.frame === "end" && <circle cx="50" cy="50" r="46" fill="#fff" stroke="#111" strokeWidth="4" />}
        {/* text-based content */}
        {sign.text && sign.text !== "—" && <text x="50" y={sign.frame === "warn" ? 62 : 50} textAnchor="middle" dominantBaseline="central"
          fontSize={sign.text.length > 2 ? 30 : 42} fontWeight="900" fill={textColor} fontFamily="Arial, sans-serif">{sign.text}</text>}
        {/* strike-through for "end / no longer" signs */}
        {sign.frame === "end" && <line x1="20" y1="80" x2="80" y2="20" stroke="#111" strokeWidth="8" />}
        {sign.strike && <line x1="14" y1="86" x2="86" y2="14" stroke={sign.cat === "info" || sign.cat === "priority" ? "#B91C1C" : "#111"} strokeWidth="7" />}
      </svg>
      {Icon && !sign.text && (
        <div className="absolute inset-0 grid place-items-center pointer-events-none" style={{ transform: `translateY(${offsetY}px)` }}>
          <Icon size={iconSize} color={iconColor} strokeWidth={2.3} />
        </div>
      )}
    </div>
  );
}

/* ============================== SMALL UI ============================== */
function Ring({ value, size = 64, stroke = 7, color = "#DC2626" }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, off = c - (value / 100) * c;
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: "stroke-dashoffset .5s" }} />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fontSize={size / 4} fontWeight="700" fill="#0f172a">{Math.round(value)}%</text>
    </svg>
  );
}
function Bar({ value, color = "#DC2626" }) {
  return <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
    <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} /></div>;
}
function Stat({ icon: Icon, label, value, color = "#DC2626" }) {
  return <div className="rounded-2xl bg-white border border-slate-200 p-4 flex items-center gap-3">
    <div className="rounded-xl p-2.5" style={{ background: color + "18" }}><Icon size={20} color={color} /></div>
    <div><div className="text-xs text-slate-500">{label}</div><div className="text-xl font-bold text-slate-900">{value}</div></div>
  </div>;
}
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4" onClick={onClose}>
    <div className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[88vh] overflow-y-auto" onClick={e => e.stopPropagation()}>{children}</div>
  </div>;
}

/* ============================== ROOT APP ============================== */
export default function App() {
  const [lang, setLang] = usePersistentState("lang", "en");
  const t = T[lang]; const rtl = lang === "ar";
  const [tab, setTab] = useState("home");

  // central study state — persisted to the browser (survives reloads / works offline)
  const [answers, setAnswers] = usePersistentState("answers", {});     // qid -> {correct, count, ts}
  const [signState, setSignState] = usePersistentState("signState", {}); // signId -> {learned, fav}
  const [favQ, setFavQ] = usePersistentState("favQ", {});             // qid -> bool
  const [exams, setExams] = usePersistentState("exams", []);          // {score,total,ts,mode}
  const [oralDone, setOralDone] = usePersistentState("oralDone", {});  // idx -> 'correct'|'partial'|'incorrect'
  const [streak, setStreak] = usePersistentState("streak", { count: 0, last: null });

  // Update the daily streak once per session, on first load.
  useEffect(() => {
    const today = todayKey();
    setStreak(s => {
      if (s.last === today) return s;
      const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      return { count: s.last === y ? (s.count || 0) + 1 : 1, last: today };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recordAnswer = (qid, correct, type) => setAnswers(a => {
    const p = a[qid] || { count: 0 };
    return { ...a, [qid]: { correct, type, count: correct ? p.count : (p.count || 0) + 1, ts: Date.now() } };
  });

  const resetAll = () => {
    if (!window.confirm(t.resetConfirm)) return;
    clearAllProgress();
    setAnswers({}); setSignState({}); setFavQ({}); setExams([]); setOralDone({});
    setStreak({ count: 0, last: todayKey() });
  };

  // derived stats
  const totalAnswered = Object.keys(answers).length;
  const correctCount = Object.values(answers).filter(a => a.correct).length;
  const accuracy = totalAnswered ? Math.round((correctCount / totalAnswered) * 100) : 0;
  const mistakes = Object.entries(answers).filter(([, a]) => !a.correct);
  const learnedSigns = Object.values(signState).filter(s => s.learned).length;
  const signPct = Math.round((learnedSigns / SIGNS.length) * 100);
  const theoryPct = THEORY.length ? Math.round((Object.keys(answers).filter(k => THEORY.some(q => q.id === +k) && answers[k].correct).length / THEORY.length) * 100) : 0;
  const overall = Math.round((signPct + theoryPct) / 2);

  const nav = [
    { key: "home", icon: Home }, { key: "signs", icon: Signpost }, { key: "theory", icon: ListChecks },
    { key: "practical", icon: Wrench }, { key: "oral", icon: Mic }, { key: "mock", icon: GraduationCap },
    { key: "mistakes", icon: AlertTriangle }, { key: "progress", icon: BarChart3 },
  ];

  const shared = { t, lang, rtl, answers, recordAnswer, signState, setSignState, favQ, setFavQ, exams, setExams, oralDone, setOralDone, setTab, resetAll, stats: { totalAnswered, correctCount, accuracy, mistakes, learnedSigns, signPct, theoryPct, overall, streak: streak.count } };

  return (
    <div dir={t.dir} className="min-h-screen bg-slate-50 text-slate-900" style={{ fontFamily: rtl ? "'Segoe UI', Tahoma, sans-serif" : "'Inter', system-ui, sans-serif" }}>
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-red-600 text-white w-9 h-9 grid place-items-center font-black">L</div>
            <div className="leading-tight">
              <div className="font-bold text-sm">{t.appName}</div>
              <div className="text-[10px] text-slate-500">{t.tagline}</div>
            </div>
          </div>
          {/* desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {nav.map(n => <button key={n.key} onClick={() => setTab(n.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${tab === n.key ? "bg-red-50 text-red-700" : "text-slate-600 hover:bg-slate-100"}`}>{t[n.key]}</button>)}
          </nav>
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
            {["en", "ar", "fr"].map(l => <button key={l} onClick={() => setLang(l)}
              className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${lang === l ? "bg-white shadow text-red-700" : "text-slate-500"}`}>{l}</button>)}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-28 md:pb-10 pt-4">
        {tab === "home" && <HomeView {...shared} />}
        {tab === "signs" && <SignsView {...shared} />}
        {tab === "theory" && <TheoryView {...shared} pool={THEORY} />}
        {tab === "practical" && <PracticalView {...shared} />}
        {tab === "oral" && <OralView {...shared} />}
        {tab === "mock" && <MockView {...shared} />}
        {tab === "mistakes" && <MistakesView {...shared} />}
        {tab === "progress" && <ProgressView {...shared} />}
      </main>

      {/* bottom nav (mobile) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200">
        <div className="grid grid-cols-8">
          {nav.map(n => { const I = n.icon; return (
            <button key={n.key} onClick={() => setTab(n.key)} className={`py-2 flex flex-col items-center gap-0.5 ${tab === n.key ? "text-red-600" : "text-slate-400"}`}>
              <I size={19} /><span className="text-[8px] font-medium leading-none">{t[n.key]}</span>
            </button>); })}
        </div>
      </nav>
    </div>
  );
}

/* ============================== HOME ============================== */
function HomeView({ t, lang, rtl, stats, setTab, exams, answers }) {
  const topicPct = (type) => {
    const qs = THEORY.filter(q => q.type === type);
    const done = qs.filter(q => answers[q.id]);
    if (!done.length) return 0;
    return Math.round((done.filter(q => answers[q.id].correct).length / done.length) * 100);
  };
  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-gradient-to-br from-red-600 to-red-800 text-white p-6 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 opacity-15"><Car size={140} /></div>
        <div className="relative flex items-center gap-5">
          <Ring value={stats.overall} size={84} color="#fff" />
          <div>
            <div className="text-xs opacity-80">{t.overall}</div>
            <div className="text-2xl font-bold">{t.welcome}</div>
            <div className="text-sm opacity-90 mt-1">{stats.learnedSigns}/{SIGNS.length} {t.signs} · {stats.accuracy}% {t.accuracy}</div>
          </div>
        </div>
        <div className="relative grid grid-cols-3 gap-2 mt-5">
          <button onClick={() => setTab("theory")} className="bg-white/15 hover:bg-white/25 rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-1"><BookOpen size={16} />{t.continue}</button>
          <button onClick={() => setTab("theory")} className="bg-white/15 hover:bg-white/25 rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-1"><Zap size={16} />{t.quickQuiz}</button>
          <button onClick={() => setTab("mock")} className="bg-white text-red-700 rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-1"><GraduationCap size={16} />{t.startMock}</button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat icon={Flame} label={t.streak} value={stats.streak} color="#EA580C" />
        <Stat icon={Target} label={t.answered} value={stats.totalAnswered} color="#2563EB" />
        <Stat icon={Check} label={t.accuracy} value={stats.accuracy + "%"} color="#16A34A" />
        <Stat icon={AlertTriangle} label={t.saved} value={stats.mistakes.length} color="#DC2626" />
      </div>

      <div>
        <h2 className="font-bold text-lg mb-3">{t.topics}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TOPICS.map(tp => {
            const I = tp.icon;
            const pct = tp.key === "warn" ? stats.signPct
              : ["Law", "Safety", "ED"].includes(tp.key) ? topicPct(tp.key)
              : 0;
            return <button key={tp.key} onClick={() => setTab(tp.key === "warn" ? "signs" : tp.key === "practical" ? "practical" : tp.key === "oral" ? "oral" : ["A", "C", "emergency"].includes(tp.key) ? "practical" : "theory")}
              className="text-start rounded-2xl bg-white border border-slate-200 p-4 hover:border-red-300 transition">
              <div className="flex items-center justify-between mb-3">
                <div className="rounded-xl bg-slate-100 p-2"><I size={18} className="text-slate-700" /></div>
                <span className="text-xs font-bold text-slate-400">{pct}%</span>
              </div>
              <div className="font-semibold text-sm mb-2">{tp.label[lang]}</div>
              <Bar value={pct} />
            </button>;
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================== SIGNS ============================== */
function SignsView({ t, lang, rtl, signState, setSignState, recordAnswer }) {
  const [mode, setMode] = useState("learn"); // learn|flash|quiz|reverse|match
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [detail, setDetail] = useState(null);

  const filtered = useMemo(() => SIGNS.filter(s =>
    (cat === "all" || s.cat === cat) &&
    (!q || s.en.toLowerCase().includes(q.toLowerCase()) || s.ar.includes(q) || s.fr.toLowerCase().includes(q.toLowerCase()))
  ), [q, cat]);

  const toggle = (id, key) => setSignState(st => ({ ...st, [id]: { ...st[id], [key]: !st[id]?.[key] } }));

  const modes = [["learn", t.learn, BookOpen], ["flash", t.flashcards, RotateCcw], ["quiz", t.signQuiz, ListChecks], ["reverse", t.reverseQuiz, RefreshCw], ["match", t.match, Target]];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {modes.map(([k, label, I]) => <button key={k} onClick={() => setMode(k)}
          className={`shrink-0 px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 ${mode === k ? "bg-red-600 text-white" : "bg-white border border-slate-200 text-slate-600"}`}>
          <I size={15} />{label}</button>)}
      </div>

      {mode === "learn" && <>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3">
          <Search size={16} className="text-slate-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={t.searchSigns} className="flex-1 py-2.5 text-sm outline-none bg-transparent" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Chip active={cat === "all"} onClick={() => setCat("all")}>{t.all}</Chip>
          {Object.entries(CATS).map(([k, c]) => <Chip key={k} active={cat === k} onClick={() => setCat(k)} color={c.color}>{c[lang]}</Chip>)}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map(s => <button key={s.id} onClick={() => setDetail(s)} className="rounded-2xl bg-white border border-slate-200 p-3 hover:border-red-300 relative">
            {signState[s.id]?.learned && <span className="absolute top-2 end-2 text-green-600"><Check size={16} /></span>}
            {signState[s.id]?.fav && <span className="absolute top-2 start-2 text-amber-500"><Star size={14} fill="currentColor" /></span>}
            <div className="grid place-items-center"><SignGraphic sign={s} size={84} /></div>
            <div className="text-xs font-semibold mt-2 text-center leading-tight">{lang === "ar" ? s.ar : lang === "fr" ? s.fr : s.en}</div>
          </button>)}
        </div>
      </>}

      {mode === "flash" && <Flashcards signs={filtered.length ? filtered : SIGNS} t={t} lang={lang} onLearn={id => toggle(id, "learned")} />}
      {mode === "quiz" && <SignQuiz reverse={false} t={t} lang={lang} rec={recordAnswer} />}
      {mode === "reverse" && <SignQuiz reverse={true} t={t} lang={lang} rec={recordAnswer} />}
      {mode === "match" && <MatchGame t={t} lang={lang} />}

      <Modal open={!!detail} onClose={() => setDetail(null)}>
        {detail && <div className="p-6">
          <div className="flex items-start gap-4">
            <SignGraphic sign={detail} size={96} />
            <div className="flex-1">
              <div className="text-xs font-bold uppercase tracking-wide" style={{ color: CATS[detail.cat].color }}>{CATS[detail.cat][lang]}</div>
              <div className="font-bold text-lg leading-tight">{lang === "ar" ? detail.ar : lang === "fr" ? detail.fr : detail.en}</div>
              <div className="text-sm text-slate-500 mt-0.5" dir="rtl">{detail.ar}</div>
              <div className="text-xs text-slate-400">{detail.en} · {detail.fr}</div>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <Field label={t.meaning}>{detail.meaning}</Field>
            <Field label={t.action}>{detail.action}</Field>
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={() => toggle(detail.id, "learned")} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 ${signState[detail.id]?.learned ? "bg-green-600 text-white" : "bg-slate-100 text-slate-700"}`}><Check size={16} />{signState[detail.id]?.learned ? t.learned : t.notLearned}</button>
            <button onClick={() => toggle(detail.id, "fav")} className={`px-4 py-2.5 rounded-xl ${signState[detail.id]?.fav ? "bg-amber-400 text-white" : "bg-slate-100 text-slate-700"}`}><Star size={16} fill={signState[detail.id]?.fav ? "currentColor" : "none"} /></button>
          </div>
          <div className="flex justify-between mt-4 text-sm">
            <button onClick={() => { const i = SIGNS.findIndex(x => x.id === detail.id); setDetail(SIGNS[(i - 1 + SIGNS.length) % SIGNS.length]); }} className="flex items-center gap-1 text-slate-500"><ChevronLeft size={16} />{t.prev}</button>
            <button onClick={() => { const i = SIGNS.findIndex(x => x.id === detail.id); setDetail(SIGNS[(i + 1) % SIGNS.length]); }} className="flex items-center gap-1 text-slate-500">{t.next}<ChevronRight size={16} /></button>
          </div>
        </div>}
      </Modal>
    </div>
  );
}
function Chip({ active, onClick, children, color = "#DC2626" }) {
  return <button onClick={onClick} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border ${active ? "text-white border-transparent" : "bg-white border-slate-200 text-slate-600"}`} style={active ? { background: color } : {}}>{children}</button>;
}
function Field({ label, children }) {
  return <div className="rounded-xl bg-slate-50 p-3"><div className="text-[11px] font-bold uppercase text-slate-400 mb-0.5">{label}</div><div className="text-sm text-slate-700">{children}</div></div>;
}

function Flashcards({ signs, t, lang, onLearn }) {
  const [i, setI] = useState(0); const [flip, setFlip] = useState(false);
  const s = signs[i % signs.length];
  const nm = lang === "ar" ? s.ar : lang === "fr" ? s.fr : s.en;
  return <div className="flex flex-col items-center">
    <div className="text-xs text-slate-400 mb-2">{i + 1} {t.of} {signs.length} · {t.tapToFlip}</div>
    <button onClick={() => setFlip(f => !f)} className="w-full max-w-sm rounded-3xl bg-white border-2 border-slate-200 p-8 min-h-[280px] grid place-items-center">
      {!flip ? <SignGraphic sign={s} size={150} /> :
        <div className="text-center space-y-3">
          <div className="font-bold text-lg">{nm}</div>
          <div className="text-sm text-slate-600">{s.meaning}</div>
          <div className="rounded-xl bg-red-50 text-red-700 text-sm p-2 font-medium">{s.action}</div>
        </div>}
    </button>
    <div className="flex gap-2 mt-4 w-full max-w-sm">
      <button onClick={() => { setFlip(false); setI(x => (x - 1 + signs.length) % signs.length); }} className="flex-1 py-2.5 rounded-xl bg-white border border-slate-200 font-semibold text-sm">{t.prev}</button>
      <button onClick={() => onLearn(s.id)} className="px-4 py-2.5 rounded-xl bg-green-600 text-white"><Check size={18} /></button>
      <button onClick={() => { setFlip(false); setI(x => (x + 1) % signs.length); }} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm">{t.next}</button>
    </div>
  </div>;
}

function SignQuiz({ reverse, t, lang, rec }) {
  const build = () => {
    const s = SIGNS[Math.floor(Math.random() * SIGNS.length)];
    const others = SIGNS.filter(x => x.id !== s.id).sort(() => Math.random() - 0.5).slice(0, 3);
    const opts = [s, ...others].sort(() => Math.random() - 0.5);
    return { s, opts };
  };
  const [{ s, opts }, setCard] = useState(build);
  const [picked, setPicked] = useState(null);
  const nm = x => lang === "ar" ? x.ar : lang === "fr" ? x.fr : x.en;
  const next = () => { setPicked(null); setCard(build()); };
  const choose = (o) => { if (picked) return; setPicked(o); rec("sign-" + s.id, o.id === s.id, "Signs"); };

  return <div className="max-w-md mx-auto">
    <div className="rounded-3xl bg-white border border-slate-200 p-6">
      {!reverse
        ? <div className="grid place-items-center mb-4"><SignGraphic sign={s} size={130} /></div>
        : <div className="text-center mb-4"><div className="text-xs font-bold uppercase text-slate-400 mb-1">{t.meaning}</div><div className="font-semibold">{s.meaning}</div></div>}
      <div className="grid grid-cols-1 gap-2">
        {opts.map(o => {
          const isCorrect = o.id === s.id, chosen = picked?.id === o.id;
          const cls = !picked ? "bg-slate-50 border-slate-200 hover:border-red-300"
            : isCorrect ? "bg-green-50 border-green-500 text-green-800"
            : chosen ? "bg-red-50 border-red-500 text-red-800" : "bg-slate-50 border-slate-200 opacity-60";
          return <button key={o.id} onClick={() => choose(o)} className={`rounded-xl border-2 p-3 text-start text-sm font-medium flex items-center gap-3 ${cls}`}>
            {reverse ? <SignGraphic sign={o} size={44} /> : <span className="flex-1">{nm(o)}</span>}
            {reverse && <span className="flex-1">{nm(o)}</span>}
            {picked && isCorrect && <Check size={18} className="text-green-600" />}
            {picked && chosen && !isCorrect && <X size={18} className="text-red-600" />}
          </button>;
        })}
      </div>
      {picked && <button onClick={next} className="w-full mt-4 py-3 rounded-xl bg-red-600 text-white font-semibold flex items-center justify-center gap-1">{t.next}<ChevronRight size={18} /></button>}
    </div>
  </div>;
}

function MatchGame({ t, lang }) {
  const pool = useMemo(() => SIGNS.slice().sort(() => Math.random() - 0.5).slice(0, 5), []);
  const [names] = useState(() => pool.slice().sort(() => Math.random() - 0.5));
  const [pickSign, setPickSign] = useState(null);
  const [matched, setMatched] = useState({});
  const nm = x => lang === "ar" ? x.ar : lang === "fr" ? x.fr : x.en;
  const tryMatch = (nameSign) => {
    if (!pickSign) return;
    if (pickSign.id === nameSign.id) setMatched(m => ({ ...m, [pickSign.id]: true }));
    setPickSign(null);
  };
  const done = Object.keys(matched).length === pool.length;
  return <div className="max-w-lg mx-auto">
    {done && <div className="rounded-xl bg-green-50 text-green-700 p-3 text-center font-semibold mb-3 flex items-center justify-center gap-2"><Trophy size={18} />{t.correct}!</div>}
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        {pool.map(s => <button key={s.id} disabled={matched[s.id]} onClick={() => setPickSign(s)}
          className={`w-full rounded-xl border-2 p-2 grid place-items-center ${matched[s.id] ? "border-green-500 bg-green-50" : pickSign?.id === s.id ? "border-red-500 bg-red-50" : "border-slate-200 bg-white"}`}>
          <SignGraphic sign={s} size={60} /></button>)}
      </div>
      <div className="space-y-2">
        {names.map(s => <button key={s.id} disabled={matched[s.id]} onClick={() => tryMatch(s)}
          className={`w-full rounded-xl border-2 p-3 text-sm font-medium text-start min-h-[76px] flex items-center ${matched[s.id] ? "border-green-500 bg-green-50 text-green-800" : "border-slate-200 bg-white"}`}>
          {nm(s)}</button>)}
      </div>
    </div>
  </div>;
}

/* ============================== THEORY ============================== */
function TheoryView({ t, lang, rtl, pool, answers, recordAnswer, favQ, setFavQ }) {
  const [type, setType] = useState("all");
  const [filter, setFilter] = useState("all"); // all|correct|incorrect|unanswered|fav
  const list = useMemo(() => pool.filter(q =>
    (type === "all" || q.type === type) &&
    (filter === "all"
      || (filter === "correct" && answers[q.id]?.correct)
      || (filter === "incorrect" && answers[q.id] && !answers[q.id].correct)
      || (filter === "unanswered" && !answers[q.id])
      || (filter === "fav" && favQ[q.id]))
  ), [type, filter, answers, favQ, pool]);
  const [i, setI] = useState(0);
  useEffect(() => setI(0), [type, filter]);
  const q = list[i];

  return <div className="space-y-4">
    <div className="rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs p-2.5 flex items-center gap-2"><Info size={14} />{t.official} — {t.curatedNote}</div>
    <div className="flex gap-2 overflow-x-auto pb-1">
      <Chip active={type === "all"} onClick={() => setType("all")}>{t.all}</Chip>
      {["Safety", "Law", "ED", "Signs"].map(k => <Chip key={k} active={type === k} onClick={() => setType(k)}>{TYPE_LABEL[k][lang]}</Chip>)}
    </div>
    <div className="flex gap-2 overflow-x-auto pb-1">
      {[["all", t.all], ["correct", t.correct], ["incorrect", t.incorrect], ["unanswered", t.notLearned], ["fav", t.favourite]].map(([k, l]) =>
        <Chip key={k} active={filter === k} onClick={() => setFilter(k)} color="#2563EB">{l}</Chip>)}
    </div>

    {!q ? <div className="text-center text-slate-400 py-16">{t.noData}</div> :
      <QuestionCard key={q.id + filter} q={q} t={t} lang={lang} rtl={rtl}
        prev={answers[q.id]} onAnswer={c => recordAnswer(q.id, c, q.type)}
        fav={!!favQ[q.id]} onFav={() => setFavQ(f => ({ ...f, [q.id]: !f[q.id] }))}
        index={i} total={list.length}
        onPrev={() => setI(x => Math.max(0, x - 1))} onNext={() => setI(x => Math.min(list.length - 1, x + 1))} />}
  </div>;
}

function QuestionCard({ q, t, lang, rtl, onAnswer, fav, onFav, index, total, onPrev, onNext }) {
  // shuffle options but track correct
  const [order] = useState(() => q.opts.map((_, i) => i).sort(() => Math.random() - 0.5));
  const [picked, setPicked] = useState(null);
  const en = lang !== "ar";
  const qText = lang === "ar" ? q.ar : q.en;
  const optText = (i) => lang === "ar" ? q.oa[i] : q.opts[i];
  const choose = (origIdx) => { if (picked !== null) return; setPicked(origIdx); onAnswer(origIdx === q.correct); };

  return <div className="rounded-3xl bg-white border border-slate-200 p-5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-bold text-slate-400">{t.question} {index + 1} {t.of} {total}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{t.licence}: {q.cat}</span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#DC262618", color: "#DC2626" }}>{TYPE_LABEL[q.type][lang]}</span>
        <button onClick={onFav} className={fav ? "text-amber-500" : "text-slate-300"}><Star size={18} fill={fav ? "currentColor" : "none"} /></button>
      </div>
    </div>
    <div className="font-semibold text-[15px] mb-4" dir={lang === "ar" ? "rtl" : "ltr"}>{qText}</div>
    <div className="space-y-2" dir={lang === "ar" ? "rtl" : "ltr"}>
      {order.map(oi => {
        const isCorrect = oi === q.correct, chosen = picked === oi;
        const cls = picked === null ? "bg-slate-50 border-slate-200 hover:border-red-300"
          : isCorrect ? "bg-green-50 border-green-500 text-green-800"
          : chosen ? "bg-red-50 border-red-500 text-red-800" : "bg-slate-50 border-slate-200 opacity-60";
        return <button key={oi} onClick={() => choose(oi)} className={`w-full rounded-xl border-2 p-3 text-start text-sm font-medium flex items-center gap-2 ${cls}`}>
          <span className="flex-1">{optText(oi)}</span>
          {picked !== null && isCorrect && <Check size={18} className="text-green-600 shrink-0" />}
          {picked !== null && chosen && !isCorrect && <X size={18} className="text-red-600 shrink-0" />}
        </button>;
      })}
    </div>
    {picked !== null && <div className="mt-4 rounded-xl bg-blue-50 border border-blue-200 p-3">
      <div className="text-[11px] font-bold uppercase text-blue-500 mb-0.5">{t.explanation}</div>
      <div className="text-sm text-blue-900">{q.exp}</div>
    </div>}
    <div className="flex justify-between mt-4">
      <button onClick={onPrev} disabled={index === 0} className="px-4 py-2 rounded-xl bg-slate-100 text-sm font-semibold disabled:opacity-40 flex items-center gap-1"><ChevronLeft size={16} />{t.prev}</button>
      <button onClick={onNext} disabled={index >= total - 1} className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold disabled:opacity-40 flex items-center gap-1">{t.next}<ChevronRight size={16} /></button>
    </div>
  </div>;
}

/* ============================== PRACTICAL ============================== */
function PracticalView({ t, lang }) {
  const [sec, setSec] = useState("items");
  const secs = [["items", t.practical, Car], ["tyre", t.tyreReader, Gauge], ["oil", t.dipstick, Droplets], ["fluids", "Fluids & battery", Battery], ["lights", "Lights & controls", Lightbulb], ["emergency", t.warningSigns, AlertTriangle]];
  return <div className="space-y-4">
    <div className="rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs p-2.5 flex items-center gap-2"><Info size={14} />{t.practicalKnowledge}. {t.checkManual}</div>
    <div className="flex gap-2 overflow-x-auto pb-1">
      {secs.map(([k, l, I]) => <button key={k} onClick={() => setSec(k)} className={`shrink-0 px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 ${sec === k ? "bg-red-600 text-white" : "bg-white border border-slate-200 text-slate-600"}`}><I size={15} />{l}</button>)}
    </div>
    {sec === "items" && <div className="grid sm:grid-cols-2 gap-3">
      {CAR_ITEMS.map((it, i) => <div key={i} className="rounded-2xl bg-white border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="font-bold">{it.en}</div>
          <div className="text-sm text-slate-500" dir="rtl">{it.ar}</div>
        </div>
        <div className="mt-2 space-y-1.5 text-sm">
          <div><span className="text-slate-400 text-xs">Why: </span>{it.why}</div>
          <div><span className="text-slate-400 text-xs">Where: </span>{it.where}</div>
          <div><span className="text-slate-400 text-xs">Check: </span>{it.check}</div>
        </div>
      </div>)}
    </div>}
    {sec === "tyre" && <TyreReader t={t} />}
    {sec === "oil" && <Dipstick t={t} />}
    {sec === "fluids" && <div className="grid sm:grid-cols-2 gap-3">
      {FLUIDS.map((f, i) => { const I = f.icon; return <div key={i} className="rounded-2xl bg-white border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-2"><div className="rounded-lg bg-red-50 p-2"><I size={18} className="text-red-600" /></div><div className="font-bold">{f.title}</div><div className="text-xs text-slate-400" dir="rtl">{f.ar}</div></div>
        <ul className="space-y-1.5">{f.points.map((p, j) => <li key={j} className="text-sm flex gap-2"><span className="text-red-500 mt-1">•</span>{p}</li>)}</ul>
      </div>; })}
    </div>}
    {sec === "lights" && <Checklist items={LIGHTS} title="Pre-drive lights & controls check" />}
    {sec === "emergency" && <div className="grid sm:grid-cols-2 gap-3">{EMERGENCIES.map((e, i) => <EmergencyCard key={i} e={e} t={t} />)}</div>}
  </div>;
}

function TyreReader({ t }) {
  const [active, setActive] = useState(0);
  return <div className="space-y-4">
    <div className="rounded-3xl bg-slate-900 text-white p-6">
      <div className="text-center text-3xl sm:text-4xl font-black tracking-wider mb-4 flex justify-center gap-1 flex-wrap">
        {TYRE.map((p, i) => <button key={i} onMouseEnter={() => setActive(i)} onClick={() => setActive(i)}
          className={`px-2 rounded-lg transition ${active === i ? "bg-red-600" : "hover:bg-white/10"}`}>{p.part}</button>)}
      </div>
      <div className="rounded-2xl bg-white/10 p-4 text-center">
        <div className="text-red-300 font-bold text-sm mb-1">{TYRE[active].label}</div>
        <div className="text-sm opacity-90">{TYRE[active].detail}</div>
      </div>
      <div className="text-[11px] opacity-60 text-center mt-3">Tap each part of 205/55 R16</div>
    </div>
    <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-2">
      {TYRE_EXTRA.map((x, i) => <div key={i} className="text-sm flex gap-2"><span className="text-red-500 mt-1">•</span>{x}</div>)}
    </div>
  </div>;
}

function Dipstick({ t }) {
  const [level, setLevel] = useState(60); // 0-100
  const status = level < 30 ? { txt: "Below MIN — top up", col: "#DC2626" } : level > 85 ? { txt: "Above MAX — overfilled", col: "#EA580C" } : { txt: "Correct level", col: "#16A34A" };
  return <div className="grid sm:grid-cols-2 gap-4">
    <div className="rounded-3xl bg-white border border-slate-200 p-6 flex flex-col items-center">
      <div className="text-sm font-semibold mb-3">{t.dipstick}</div>
      <div className="relative h-56 w-16 rounded-full bg-slate-100 border-2 border-slate-300 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 transition-all" style={{ height: `${level}%`, background: "linear-gradient(#fbbf24,#b45309)" }} />
        <div className="absolute inset-x-0 border-t-2 border-dashed border-slate-400" style={{ bottom: "30%" }}><span className="absolute -left-9 -top-2 text-[10px] font-bold text-slate-500">MIN</span></div>
        <div className="absolute inset-x-0 border-t-2 border-dashed border-slate-400" style={{ bottom: "85%" }}><span className="absolute -left-10 -top-2 text-[10px] font-bold text-slate-500">MAX</span></div>
      </div>
      <input type="range" min="0" max="100" value={level} onChange={e => setLevel(+e.target.value)} className="w-40 mt-4 accent-red-600" />
      <div className="mt-2 text-sm font-bold px-3 py-1 rounded-full" style={{ background: status.col + "18", color: status.col }}>{status.txt}</div>
    </div>
    <div className="space-y-3">
      <div className="rounded-2xl bg-white border border-slate-200 p-4">
        <div className="font-bold text-sm mb-2">How to check</div>
        <ol className="space-y-1.5">{OIL_STEPS.map((s, i) => <li key={i} className="text-sm flex gap-2"><span className="w-5 h-5 shrink-0 grid place-items-center rounded-full bg-red-100 text-red-700 text-[11px] font-bold">{i + 1}</span>{s}</li>)}</ol>
      </div>
      <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
        <div className="font-bold text-sm text-red-700 mb-2">Warnings</div>
        <ul className="space-y-1.5">{OIL_WARN.map((w, i) => <li key={i} className="text-sm text-red-900 flex gap-2"><AlertTriangle size={14} className="mt-0.5 shrink-0" />{w}</li>)}</ul>
      </div>
    </div>
  </div>;
}

function Checklist({ items, title }) {
  const [done, setDone] = useState({});
  const n = Object.values(done).filter(Boolean).length;
  return <div className="rounded-2xl bg-white border border-slate-200 p-4">
    <div className="flex items-center justify-between mb-3">
      <div className="font-bold text-sm">{title}</div>
      <span className="text-xs font-bold text-slate-400">{n}/{items.length}</span>
    </div>
    <Bar value={(n / items.length) * 100} />
    <div className="grid sm:grid-cols-2 gap-2 mt-3">
      {items.map((it, i) => <button key={i} onClick={() => setDone(d => ({ ...d, [i]: !d[i] }))}
        className={`flex items-center gap-2 p-2.5 rounded-xl border text-sm text-start ${done[i] ? "bg-green-50 border-green-300 text-green-800" : "bg-slate-50 border-slate-200"}`}>
        <span className={`w-5 h-5 rounded-md grid place-items-center ${done[i] ? "bg-green-600 text-white" : "border-2 border-slate-300"}`}>{done[i] && <Check size={13} />}</span>{it}</button>)}
    </div>
  </div>;
}

function EmergencyCard({ e, t }) {
  const [open, setOpen] = useState(false); const I = e.icon;
  return <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
    <button onClick={() => setOpen(o => !o)} className="w-full p-4 flex items-center gap-3 text-start">
      <div className="rounded-xl bg-red-50 p-2.5"><I size={20} className="text-red-600" /></div>
      <div className="flex-1"><div className="font-bold">{e.title}</div><div className="text-xs text-slate-500">{e.sum}</div></div>
      <ChevronRight size={18} className={`text-slate-400 transition ${open ? "rotate-90" : ""}`} />
    </button>
    {open && <div className="px-4 pb-4 space-y-2">
      <MiniList label={t.warningSigns} items={e.warn} color="#D97706" />
      <MiniList label={t.immediate} items={e.now} color="#16A34A" />
      <MiniList label={t.avoid} items={e.avoid} color="#DC2626" />
    </div>}
  </div>;
}
function MiniList({ label, items, color }) {
  return <div className="rounded-xl bg-slate-50 p-3">
    <div className="text-[11px] font-bold uppercase mb-1" style={{ color }}>{label}</div>
    <ul className="space-y-1">{items.map((x, i) => <li key={i} className="text-sm flex gap-2"><span style={{ color }}>•</span>{x}</li>)}</ul>
  </div>;
}

/* ============================== ORAL ============================== */
function OralView({ t, oralDone, setOralDone }) {
  const [i, setI] = useState(0); const [show, setShow] = useState(false); const [typed, setTyped] = useState("");
  const q = ORAL[i];
  const evalIt = (v) => { setOralDone(d => ({ ...d, [i]: v })); next(); };
  const next = () => { setShow(false); setTyped(""); setI(x => (x + 1) % ORAL.length); };
  const doneN = Object.keys(oralDone).length;
  return <div className="max-w-lg mx-auto space-y-4">
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-slate-400">{t.question} {i + 1} {t.of} {ORAL.length}</span>
      <span className="text-xs text-slate-400">{doneN} {t.answered}</span>
    </div>
    <div className="rounded-3xl bg-white border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-2xl bg-red-600 text-white p-3"><Mic size={22} /></div>
        <div className="font-bold text-lg leading-tight">{q.q}</div>
      </div>
      <textarea value={typed} onChange={e => setTyped(e.target.value)} placeholder={t.yourAnswer} rows={3}
        className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-red-400 resize-none" />
      {!show ? <button onClick={() => setShow(true)} className="w-full mt-3 py-3 rounded-xl bg-slate-900 text-white font-semibold flex items-center justify-center gap-2"><Eye size={18} />{t.showModel}</button>
        : <>
          <div className="mt-3 rounded-xl bg-green-50 border border-green-200 p-3 text-sm text-green-900">{q.a}</div>
          <div className="text-xs font-bold text-slate-400 mt-4 mb-2">{t.selfEval}</div>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => evalIt("incorrect")} className="py-2.5 rounded-xl bg-red-50 text-red-700 text-sm font-semibold">{t.incorrect}</button>
            <button onClick={() => evalIt("partial")} className="py-2.5 rounded-xl bg-amber-50 text-amber-700 text-sm font-semibold">{t.partial}</button>
            <button onClick={() => evalIt("correct")} className="py-2.5 rounded-xl bg-green-50 text-green-700 text-sm font-semibold">{t.correct}</button>
          </div>
        </>}
    </div>
    <button onClick={next} className="w-full py-2.5 rounded-xl bg-white border border-slate-200 font-semibold text-sm text-slate-600 flex items-center justify-center gap-1">{t.next}<ChevronRight size={16} /></button>
  </div>;
}

/* ============================== MOCK EXAM ============================== */
function buildSignQ(id) {
  const s = SIGNS.find(x => x.id === id) || SIGNS[Math.floor(Math.random() * SIGNS.length)];
  const others = SIGNS.filter(x => x.id !== s.id).sort(() => Math.random() - 0.5).slice(0, 2);
  const opts = [s.en, ...others.map(o => o.en)];
  return { id: "s" + s.id, type: "Signs", cat: "G", sign: s, en: "What does this sign mean?", ar: "ماذا تعني هذه الإشارة؟", opts, oa: opts, correct: 0, exp: `${s.en}: ${s.meaning}`, _shuffle: true };
}
function MockView({ t, lang, rtl, recordAnswer, exams, setExams }) {
  const [config, setConfig] = useState(null); // {mode,len}
  const [running, setRunning] = useState(null);

  if (running) return <MockRunner {...{ t, lang, rtl, running, recordAnswer }} onDone={(res) => { setExams(e => [{ ...res, ts: Date.now() }, ...e]); setRunning(null); setConfig(res); }} />;

  return <div className="space-y-5 max-w-lg mx-auto">
    <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 text-white p-6 text-center">
      <GraduationCap size={40} className="mx-auto mb-2" />
      <div className="font-bold text-xl">{t.mock}</div>
      <div className="text-sm opacity-80">{t.chooseLen}</div>
    </div>
    <Setup t={t} onStart={(mode, len) => {
      let pool = [];
      const theory = THEORY.map(q => ({ ...q }));
      const signQs = SIGNS.map(s => buildSignQ(s.id));
      if (mode === "signs") pool = signQs;
      else if (mode === "theory") pool = theory;
      else pool = [...theory, ...signQs];
      pool = pool.sort(() => Math.random() - 0.5);
      const n = len === "full" ? pool.length : Math.min(len, pool.length);
      setRunning({ questions: pool.slice(0, n), mode });
    }} />
    {exams.length > 0 && <div>
      <div className="font-bold mb-2">{t.history}</div>
      <div className="space-y-2">{exams.slice(0, 5).map((e, i) => { const pct = Math.round((e.score / e.total) * 100); return (
        <div key={i} className="rounded-xl bg-white border border-slate-200 p-3 flex items-center justify-between">
          <div className="text-sm"><span className="font-bold">{e.score}/{e.total}</span> <span className="text-slate-400">· {e.mode}</span></div>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${pct >= 70 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{pct >= 70 ? t.pass : t.fail} {pct}%</span>
        </div>); })}</div>
    </div>}
  </div>;
}
function Setup({ t, onStart }) {
  const [mode, setMode] = useState("mixed"); const [len, setLen] = useState(10);
  return <div className="rounded-3xl bg-white border border-slate-200 p-5 space-y-4">
    <div>
      <div className="text-xs font-bold text-slate-400 mb-2">Type</div>
      <div className="grid grid-cols-3 gap-2">
        {[["mixed", t.mixed], ["signs", t.signsOnly], ["theory", t.theoryOnly]].map(([k, l]) =>
          <button key={k} onClick={() => setMode(k)} className={`py-2.5 rounded-xl text-sm font-semibold ${mode === k ? "bg-red-600 text-white" : "bg-slate-100 text-slate-600"}`}>{l}</button>)}
      </div>
    </div>
    <div>
      <div className="text-xs font-bold text-slate-400 mb-2">{t.chooseLen}</div>
      <div className="grid grid-cols-4 gap-2">
        {[10, 20, 30, "full"].map(l => <button key={l} onClick={() => setLen(l)} className={`py-2.5 rounded-xl text-sm font-semibold ${len === l ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>{l === "full" ? t.full : l}</button>)}
      </div>
    </div>
    <button onClick={() => onStart(mode, len)} className="w-full py-3 rounded-xl bg-red-600 text-white font-bold flex items-center justify-center gap-2"><Play size={18} />{t.start}</button>
  </div>;
}
function MockRunner({ t, lang, rtl, running, recordAnswer, onDone }) {
  const qs = running.questions;
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState({}); // idx -> origIdx
  const [flags, setFlags] = useState({});
  const [confirm, setConfirm] = useState(false);
  const [result, setResult] = useState(null);
  const [start] = useState(Date.now());
  // stable shuffle per question
  const orders = useRef({});
  const getOrder = (qi) => { if (!orders.current[qi]) orders.current[qi] = qs[qi].opts.map((_, k) => k).sort(() => Math.random() - 0.5); return orders.current[qi]; };

  if (result) {
    const pct = Math.round((result.score / result.total) * 100), pass = pct >= 70;
    const weak = {};
    qs.forEach((q, qi) => { if (picked[qi] !== q.correct) weak[q.type] = (weak[q.type] || 0) + 1; });
    return <div className="max-w-lg mx-auto space-y-4">
      <div className={`rounded-3xl p-6 text-center text-white ${pass ? "bg-gradient-to-br from-green-600 to-green-700" : "bg-gradient-to-br from-red-600 to-red-700"}`}>
        {pass ? <Trophy size={40} className="mx-auto mb-2" /> : <RotateCcw size={40} className="mx-auto mb-2" />}
        <div className="text-4xl font-black">{pct}%</div>
        <div className="font-bold text-lg">{pass ? t.pass : t.fail}</div>
        <div className="text-sm opacity-90 mt-1">{result.score}/{result.total} · {t.timeTaken} {Math.round((Date.now() - start) / 1000)}s</div>
      </div>
      {Object.keys(weak).length > 0 && <div className="rounded-2xl bg-white border border-slate-200 p-4">
        <div className="font-bold text-sm mb-2">{t.weak}</div>
        {Object.entries(weak).map(([k, v]) => <div key={k} className="flex justify-between text-sm py-1"><span>{TYPE_LABEL[k]?.[lang] || k}</span><span className="text-red-600 font-bold">{v} {t.incorrect}</span></div>)}
      </div>}
      <div className="rounded-2xl bg-white border border-slate-200 divide-y">
        {qs.map((q, qi) => <div key={qi} className="p-3">
          <div className="flex items-start gap-2">
            {picked[qi] === q.correct ? <Check size={16} className="text-green-600 mt-0.5 shrink-0" /> : <X size={16} className="text-red-600 mt-0.5 shrink-0" />}
            <div className="flex-1">
              {q.sign && <div className="mb-1"><SignGraphic sign={q.sign} size={54} /></div>}
              <div className="text-sm font-medium" dir={lang === "ar" ? "rtl" : "ltr"}>{lang === "ar" ? q.ar : q.en}</div>
              <div className="text-xs text-green-700 mt-0.5">✓ {q.opts[q.correct]}</div>
            </div>
          </div>
        </div>)}
      </div>
      <button onClick={() => onDone({ score: result.score, total: result.total, mode: running.mode })} className="w-full py-3 rounded-xl bg-red-600 text-white font-bold">{t.retake}</button>
    </div>;
  }

  const q = qs[i]; const order = getOrder(i);
  const submit = () => {
    let sc = 0; qs.forEach((qq, qi) => { if (picked[qi] === qq.correct) sc++; recordAnswer((qq.id || "q") + "-mock", picked[qi] === qq.correct, qq.type); });
    setResult({ score: sc, total: qs.length });
  };

  return <div className="max-w-lg mx-auto space-y-4">
    <div className="flex items-center gap-2">
      <div className="flex-1"><Bar value={((i + 1) / qs.length) * 100} /></div>
      <span className="text-xs font-bold text-slate-400">{i + 1}/{qs.length}</span>
    </div>
    <div className="rounded-3xl bg-white border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{TYPE_LABEL[q.type]?.[lang] || q.type}</span>
        <button onClick={() => setFlags(f => ({ ...f, [i]: !f[i] }))} className={flags[i] ? "text-amber-500" : "text-slate-300"}><Flag size={18} fill={flags[i] ? "currentColor" : "none"} /></button>
      </div>
      {q.sign && <div className="grid place-items-center mb-3"><SignGraphic sign={q.sign} size={110} /></div>}
      <div className="font-semibold mb-4" dir={lang === "ar" ? "rtl" : "ltr"}>{lang === "ar" ? q.ar : q.en}</div>
      <div className="space-y-2" dir={lang === "ar" ? "rtl" : "ltr"}>
        {order.map(oi => <button key={oi} onClick={() => setPicked(p => ({ ...p, [i]: oi }))}
          className={`w-full rounded-xl border-2 p-3 text-start text-sm font-medium ${picked[i] === oi ? "border-red-500 bg-red-50" : "border-slate-200 bg-slate-50"}`}>
          {lang === "ar" ? q.oa[oi] : q.opts[oi]}</button>)}
      </div>
    </div>
    <div className="flex gap-2">
      <button onClick={() => setI(x => Math.max(0, x - 1))} disabled={i === 0} className="px-4 py-3 rounded-xl bg-slate-100 font-semibold disabled:opacity-40"><ChevronLeft size={18} /></button>
      {i < qs.length - 1
        ? <button onClick={() => setI(x => x + 1)} className="flex-1 py-3 rounded-xl bg-slate-900 text-white font-semibold flex items-center justify-center gap-1">{t.next}<ChevronRight size={18} /></button>
        : <button onClick={() => setConfirm(true)} className="flex-1 py-3 rounded-xl bg-green-600 text-white font-bold">{t.finish}</button>}
    </div>
    <Modal open={confirm} onClose={() => setConfirm(false)}>
      <div className="p-6 text-center">
        <AlertTriangle size={36} className="mx-auto text-amber-500 mb-2" />
        <div className="font-bold text-lg mb-1">{t.submitConfirm}</div>
        <div className="text-sm text-slate-500 mb-4">{Object.keys(picked).length}/{qs.length} {t.answered}</div>
        <div className="flex gap-2">
          <button onClick={() => setConfirm(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 font-semibold">{t.cancel}</button>
          <button onClick={() => { setConfirm(false); submit(); }} className="flex-1 py-2.5 rounded-xl bg-green-600 text-white font-bold">{t.yes}</button>
        </div>
      </div>
    </Modal>
  </div>;
}

/* ============================== MISTAKES ============================== */
function MistakesView({ t, lang, answers, recordAnswer, setTab }) {
  const wrong = Object.entries(answers).filter(([, a]) => !a.correct);
  // map back to theory questions
  const wrongTheory = wrong.map(([k, a]) => ({ q: THEORY.find(x => String(x.id) === k), a })).filter(x => x.q);
  const [drill, setDrill] = useState(false);
  const [i, setI] = useState(0);

  if (drill && wrongTheory.length) {
    const item = wrongTheory[i % wrongTheory.length];
    return <div className="max-w-lg mx-auto space-y-4">
      <button onClick={() => setDrill(false)} className="text-sm text-slate-500 flex items-center gap-1"><ChevronLeft size={16} />{t.mistakes}</button>
      <QuestionCard q={item.q} t={t} lang={lang} rtl={lang === "ar"} index={i} total={wrongTheory.length}
        onAnswer={c => recordAnswer(item.q.id, c, item.q.type)} fav={false} onFav={() => { }}
        onPrev={() => setI(x => Math.max(0, x - 1))} onNext={() => setI(x => x + 1)} />
    </div>;
  }

  return <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="font-bold text-lg">{t.mistakes}</h2>
      {wrongTheory.length > 0 && <button onClick={() => { setI(0); setDrill(true); }} className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold flex items-center gap-1"><RefreshCw size={15} />{t.practiseMistakes}</button>}
    </div>
    {wrong.length === 0 ? <div className="text-center text-slate-400 py-16"><ThumbsUp size={40} className="mx-auto mb-2 text-green-400" />{t.noMistakes}</div>
      : <div className="space-y-2">
        {wrongTheory.map(({ q, a }, idx) => <div key={idx} className="rounded-2xl bg-white border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600">{TYPE_LABEL[q.type]?.[lang] || q.type}</span>
            <span className="text-xs text-slate-400">{t.attempts} {a.count}</span>
          </div>
          <div className="text-sm font-medium" dir={lang === "ar" ? "rtl" : "ltr"}>{lang === "ar" ? q.ar : q.en}</div>
          <div className="text-xs text-green-700 mt-1">✓ {lang === "ar" ? q.oa[q.correct] : q.opts[q.correct]}</div>
        </div>)}
        {wrong.filter(([k]) => k.startsWith("sign-")).length > 0 && <div className="rounded-2xl bg-white border border-slate-200 p-4 text-sm text-slate-500">
          {wrong.filter(([k]) => k.startsWith("sign-")).length} sign quiz mistakes saved — practise them in the Signs → Sign quiz tab.
        </div>}
      </div>}
  </div>;
}

/* ============================== PROGRESS ============================== */
function ProgressView({ t, lang, stats, answers, exams, signState, resetAll }) {
  const byType = {};
  ["Safety", "Law", "ED", "Signs"].forEach(type => {
    const qs = THEORY.filter(q => q.type === type);
    const done = Object.entries(answers).filter(([k, a]) => qs.some(q => String(q.id) === k));
    const good = done.filter(([, a]) => a.correct).length;
    byType[type] = { total: qs.length, answered: done.length, pct: done.length ? Math.round((good / done.length) * 100) : 0 };
  });
  const scores = exams.map(e => Math.round((e.score / e.total) * 100));
  const best = scores.length ? Math.max(...scores) : 0;
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const ranked = Object.entries(byType).filter(([, v]) => v.answered > 0).sort((a, b) => b[1].pct - a[1].pct);
  const strongest = ranked[0], weakest = ranked[ranked.length - 1];

  return <div className="space-y-5">
    <div className="rounded-3xl bg-white border border-slate-200 p-6 flex items-center gap-6">
      <Ring value={stats.overall} size={100} stroke={9} />
      <div className="space-y-1">
        <div className="font-bold text-lg">{t.overall}</div>
        <div className="text-sm text-slate-500">{stats.learnedSigns}/{SIGNS.length} signs · {stats.totalAnswered} {t.answered}</div>
        <div className="text-sm text-slate-500">{stats.accuracy}% {t.accuracy}</div>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-3">
      <Stat icon={Award} label={t.bestScore} value={best + "%"} color="#16A34A" />
      <Stat icon={BarChart3} label={t.avgScore} value={avg + "%"} color="#2563EB" />
      <Stat icon={GraduationCap} label={t.history} value={exams.length} color="#DC2626" />
    </div>

    <div className="rounded-2xl bg-white border border-slate-200 p-4">
      <div className="font-bold mb-3">{t.accuracy}</div>
      <div className="space-y-3">
        {Object.entries(byType).map(([k, v]) => <div key={k}>
          <div className="flex justify-between text-sm mb-1"><span>{TYPE_LABEL[k][lang]}</span><span className="font-bold text-slate-500">{v.pct}% <span className="text-xs text-slate-400">({v.answered}/{v.total})</span></span></div>
          <Bar value={v.pct} color={v.pct >= 70 ? "#16A34A" : v.pct >= 40 ? "#D97706" : "#DC2626"} />
        </div>)}
        <div>
          <div className="flex justify-between text-sm mb-1"><span>{TYPE_LABEL.Signs[lang]} ({t.learned})</span><span className="font-bold text-slate-500">{stats.signPct}%</span></div>
          <Bar value={stats.signPct} color="#DC2626" />
        </div>
      </div>
    </div>

    {ranked.length > 0 && <div className="grid grid-cols-2 gap-3">
      <div className="rounded-2xl bg-green-50 border border-green-200 p-4">
        <div className="text-xs font-bold text-green-600 mb-1">{t.strongest}</div>
        <div className="font-bold">{TYPE_LABEL[strongest[0]][lang]}</div>
        <div className="text-sm text-green-700">{strongest[1].pct}%</div>
      </div>
      <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
        <div className="text-xs font-bold text-red-600 mb-1">{t.weakest}</div>
        <div className="font-bold">{TYPE_LABEL[weakest[0]][lang]}</div>
        <div className="text-sm text-red-700">{weakest[1].pct}%</div>
      </div>
    </div>}

    <button onClick={resetAll} className="w-full py-3 rounded-xl bg-white border border-slate-200 text-slate-500 text-sm font-semibold flex items-center justify-center gap-2 hover:border-red-300 hover:text-red-600">
      <RotateCcw size={15} />{t.resetProgress}
    </button>
  </div>;
}
