import React, { createContext, useState, useContext, useEffect } from 'react';

// Define available languages and their translations
const languages = {
  en: {
    name: 'English',
    welcomeMessage: 'Welcome to your accessible banking app',
    loginPrompt: 'Please log in to access your account',
    voiceAuthPrompt: 'Press space and speak your passphrase',
    dashboardTitle: 'Dashboard',
    linkBankPrompt: 'Link your bank account to get started',
    transactionsTitle: 'Recent Transactions',
    logoutButton: 'Log out',
    // Add more translations as needed
  },
  hi: {
    name: 'हिंदी', // Hindi
    welcomeMessage: 'आपके सुलभ बैंकिंग ऐप में आपका स्वागत है',
    loginPrompt: 'अपने खाते तक पहुंचने के लिए कृपया लॉग इन करें',
    voiceAuthPrompt: 'स्पेस दबाएं और अपना पासफ्रेज बोलें',
    dashboardTitle: 'डैशबोर्ड',
    linkBankPrompt: 'शुरू करने के लिए अपना बैंक खाता लिंक करें',
    transactionsTitle: 'हाल के लेनदेन',
    logoutButton: 'लॉग आउट',
    // Add more translations as needed
  },
};

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Try to get saved language from localStorage or default to English
    const savedLanguage = localStorage.getItem('preferredLanguage');
    return savedLanguage && languages[savedLanguage] ? savedLanguage : 'en';
  });

  const [translations, setTranslations] = useState(languages[currentLanguage]);

  // Update translations when language changes
  useEffect(() => {
    setTranslations(languages[currentLanguage]);
    localStorage.setItem('preferredLanguage', currentLanguage);
    
    // Set lang attribute on html for screen readers
    document.documentElement.lang = currentLanguage;
    
    // Announce language change for screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.textContent = `Language changed to ${languages[currentLanguage].name}`;
    document.body.appendChild(announcement);
    
    // Remove after announcement is read
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, [currentLanguage]);

  const changeLanguage = (lang) => {
    if (languages[lang]) {
      setCurrentLanguage(lang);
    }
  };

  const value = {
    currentLanguage,
    translations,
    changeLanguage,
    availableLanguages: Object.keys(languages).map(code => ({
      code,
      name: languages[code].name
    }))
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};