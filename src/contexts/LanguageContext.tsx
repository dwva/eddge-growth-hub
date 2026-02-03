import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'ta';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    ta: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': { en: 'Home', hi: 'होम', ta: 'முகப்பு' },
  'nav.progress': { en: 'Progress', hi: 'प्रगति', ta: 'முன்னேற்றம்' },
  'nav.achievements': { en: 'Achievements', hi: 'उपलब्धियां', ta: 'சாதனைகள்' },
  'nav.meetings': { en: 'Meetings', hi: 'बैठकें', ta: 'கூட்டங்கள்' },
  'nav.messages': { en: 'Messages', hi: 'संदेश', ta: 'செய்திகள்' },
  'nav.homework': { en: 'Homework', hi: 'गृहकार्य', ta: 'வீட்டுப்பாடம்' },
  'nav.announcements': { en: 'Announcements', hi: 'घोषणाएं', ta: 'அறிவிப்புகள்' },
  'nav.settings': { en: 'Settings', hi: 'सेटिंग्स', ta: 'அமைப்புகள்' },
  'nav.support': { en: 'Support', hi: 'सहायता', ta: 'உதவி' },
  
  // Dashboard
  'dashboard.welcome': { en: "Welcome to", hi: 'में आपका स्वागत है', ta: 'வரவேற்கிறோம்' },
  'dashboard.overview': { en: 'Overview', hi: 'अवलोकन', ta: 'கண்ணோட்டம்' },
  'dashboard.quickActions': { en: 'Quick Actions', hi: 'त्वरित कार्य', ta: 'விரைவு செயல்கள்' },
  'dashboard.childSummary': { en: 'Child Summary', hi: 'बच्चे का सारांश', ta: 'குழந்தை சுருக்கம்' },
  
  // Stats
  'stats.overallProgress': { en: 'Overall Progress', hi: 'समग्र प्रगति', ta: 'ஒட்டுமொத்த முன்னேற்றம்' },
  'stats.attendance': { en: 'Attendance', hi: 'उपस्थिति', ta: 'வருகை' },
  'stats.assignments': { en: 'Assignments', hi: 'असाइनमेंट', ta: 'பணிகள்' },
  'stats.achievements': { en: 'Achievements', hi: 'उपलब्धियां', ta: 'சாதனைகள்' },
  'stats.excellent': { en: 'Excellent', hi: 'उत्कृष्ट', ta: 'சிறந்தது' },
  'stats.good': { en: 'Good', hi: 'अच्छा', ta: 'நல்லது' },
  'stats.needsAttention': { en: 'Needs Attention', hi: 'ध्यान चाहिए', ta: 'கவனம் தேவை' },
  
  // Actions
  'actions.viewProgress': { en: 'View Progress', hi: 'प्रगति देखें', ta: 'முன்னேற்றம் காண்க' },
  'actions.viewAchievements': { en: 'View Achievements', hi: 'उपलब्धियां देखें', ta: 'சாதனைகள் காண்க' },
  'actions.scheduleMeeting': { en: 'Schedule Meeting', hi: 'बैठक शेड्यूल करें', ta: 'கூட்டம் திட்டமிடுக' },
  'actions.viewMessages': { en: 'View Messages', hi: 'संदेश देखें', ta: 'செய்திகள் காண்க' },
  'actions.viewHomework': { en: 'View Homework', hi: 'गृहकार्य देखें', ta: 'வீட்டுப்பாடம் காண்க' },
  'actions.viewAnnouncements': { en: 'View Announcements', hi: 'घोषणाएं देखें', ta: 'அறிவிப்புகள் காண்க' },
  
  // Progress
  'progress.subjectPerformance': { en: 'Subject Performance', hi: 'विषय प्रदर्शन', ta: 'பாட செயல்திறன்' },
  'progress.testInsights': { en: 'Test & Exam Insights', hi: 'परीक्षा अंतर्दृष्टि', ta: 'தேர்வு நுண்ணறிவு' },
  'progress.progressTrend': { en: 'Progress Trend', hi: 'प्रगति रुझान', ta: 'முன்னேற்ற போக்கு' },
  'progress.attendanceDetails': { en: 'Attendance Details', hi: 'उपस्थिति विवरण', ta: 'வருகை விவரங்கள்' },
  
  // Homework
  'homework.all': { en: 'All', hi: 'सभी', ta: 'அனைத்தும்' },
  'homework.pending': { en: 'Pending', hi: 'लंबित', ta: 'நிலுவை' },
  'homework.completed': { en: 'Completed', hi: 'पूर्ण', ta: 'நிறைவு' },
  'homework.dueToday': { en: 'Due Today', hi: 'आज देय', ta: 'இன்று காலாவதி' },
  'homework.dueSoon': { en: 'Due Soon', hi: 'जल्द देय', ta: 'விரைவில் காலாவதி' },
  'homework.overdue': { en: 'Overdue', hi: 'अतिदेय', ta: 'காலாவதியானது' },
  
  // Settings
  'settings.profile': { en: 'Profile Settings', hi: 'प्रोफ़ाइल सेटिंग्स', ta: 'சுயவிவர அமைப்புகள்' },
  'settings.notifications': { en: 'Notification Settings', hi: 'सूचना सेटिंग्स', ta: 'அறிவிப்பு அமைப்புகள்' },
  'settings.privacy': { en: 'Privacy & Permissions', hi: 'गोपनीयता और अनुमतियां', ta: 'தனியுரிமை மற்றும் அனுமதிகள்' },
  'settings.language': { en: 'Language', hi: 'भाषा', ta: 'மொழி' },
  'settings.logout': { en: 'Logout', hi: 'लॉग आउट', ta: 'வெளியேறு' },
  
  // Common
  'common.viewAll': { en: 'View All', hi: 'सभी देखें', ta: 'அனைத்தும் காண்க' },
  'common.back': { en: 'Back', hi: 'वापस', ta: 'பின்' },
  'common.save': { en: 'Save', hi: 'सहेजें', ta: 'சேமி' },
  'common.cancel': { en: 'Cancel', hi: 'रद्द करें', ta: 'ரத்து' },
  'common.submit': { en: 'Submit', hi: 'जमा करें', ta: 'சமர்ப்பிக்க' },
  'common.loading': { en: 'Loading...', hi: 'लोड हो रहा है...', ta: 'ஏற்றுகிறது...' },
  'common.noData': { en: 'No data available', hi: 'कोई डेटा उपलब्ध नहीं', ta: 'தரவு இல்லை' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') as Language;
    if (savedLanguage && ['en', 'hi', 'ta'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferredLanguage', lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
