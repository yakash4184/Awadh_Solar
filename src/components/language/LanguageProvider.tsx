'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Language = 'en' | 'hi'
const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void }>({ language: 'en', setLanguage: () => {} })

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const saved = window.localStorage.getItem('awadh-language')
    if (saved === 'hi' || saved === 'en') setLanguage(saved)
  }, [])

  useEffect(() => {
    document.documentElement.lang = language === 'hi' ? 'hi-IN' : 'en-IN'
    document.documentElement.dataset.language = language
    window.localStorage.setItem('awadh-language', language)
  }, [language])

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
}

export function useLanguage() { return useContext(LanguageContext) }

const translations: Record<string, string> = {
  'Photo credits': 'तस्वीरों का श्रेय',
  'Solar Products': 'सोलर उत्पाद', Panels: 'पैनल', Storage: 'स्टोरेज',
  Home: 'होम', 'About Us': 'हमारे बारे में', 'Solar Solutions': 'सोलर समाधान', Products: 'उत्पाद', Projects: 'प्रोजेक्ट', Contact: 'संपर्क',
  'Call Now': 'अभी कॉल करें', 'Get a Free Quote': 'मुफ़्त कोटेशन पाएं', 'Admin Login': 'एडमिन लॉगिन', 'Solar Calculator': 'सोलर कैलकुलेटर',
  'Solar solutions for homes & businesses': 'घर और व्यवसायों के लिए सोलर समाधान', 'Quality products': 'गुणवत्तापूर्ण उत्पाद', 'Expert installation': 'विशेषज्ञ इंस्टॉलेशन', 'After-sales support': 'बिक्री के बाद सहायता',
  'SOLAR SOLUTIONS · CLEAN ENERGY · SUSTAINABLE FUTURE': 'सोलर समाधान · स्वच्छ ऊर्जा · टिकाऊ भविष्य', 'Solar Solutions overview': 'सोलर समाधान देखें', 'Products overview': 'उत्पाद देखें',
  'Solar panels': 'सोलर पैनल', Inverters: 'इन्वर्टर', Batteries: 'बैटरी', Residential: 'आवासीय', Commercial: 'व्यावसायिक', 'PM Surya Ghar': 'पीएम सूर्य घर',
  'OUR SOLAR SOLUTIONS': 'हमारे सोलर समाधान', 'Complete Solar Solutions for a': 'टिकाऊ भविष्य के लिए संपूर्ण सोलर समाधान', 'Sustainable Future': '',
  'From homes to businesses, explore solar options with local guidance and ongoing support.': 'घर से लेकर व्यवसाय तक, स्थानीय मार्गदर्शन और निरंतर सहायता के साथ सोलर विकल्प जानें।',
  'YOUR LOCAL SOLAR STORE': 'आपकी स्थानीय सोलर दुकान', 'Meet us in Mirzapur.': 'मिर्ज़ापुर में हमसे मिलें।', 'Visit the Awadh Enterprises showroom, talk with our team and explore solar products in person.': 'अवध एंटरप्राइजेज़ के शोरूम आएं, हमारी टीम से बात करें और सोलर उत्पादों को करीब से देखें।',
  'Call': 'कॉल करें', 'SOLAR PRODUCTS': 'सोलर उत्पाद', 'Choose the right products for your': 'अपने लिए सही उत्पाद चुनें', 'solar setup.': 'सोलर सिस्टम।', 'Talk to our team to confirm product details, system fit and availability.': 'उत्पाद, सिस्टम की उपयुक्तता और उपलब्धता जानने के लिए हमारी टीम से बात करें।',
  'View details / enquiry': 'जानकारी / पूछताछ', 'PLAN YOUR SOLAR SYSTEM': 'अपने सोलर सिस्टम की योजना बनाएं', 'Start with your': 'शुरुआत करें अपने', 'monthly bill.': 'मासिक बिजली बिल से।',
  'Get a quick, indicative system size, panel count and cost range. You can adjust the estimate assumptions in the admin dashboard.': 'सिस्टम का अनुमानित आकार, पैनलों की संख्या और लागत जानें। अनुमान के आधार एडमिन डैशबोर्ड में बदले जा सकते हैं।', 'Read about PM Surya Ghar': 'पीएम सूर्य घर के बारे में पढ़ें',
  'Installation guidance': 'इंस्टॉलेशन मार्गदर्शन', 'Planned for your site': 'आपकी जगह के अनुसार योजना', 'Solar consultation': 'सोलर परामर्श', 'Options for your needs': 'आपकी ज़रूरत के विकल्प', 'Based in Mirzapur': 'मिर्ज़ापुर में स्थित', 'Visit or contact us': 'मिलें या संपर्क करें',
  'A SIMPLE WAY TO START': 'आसान शुरुआत', 'Your solar journey starts with a': 'आपकी सोलर यात्रा शुरू होती है', 'conversation.': 'एक बातचीत से।', 'Tell us about your property and electricity needs. We’ll help you explore the next steps.': 'अपनी जगह और बिजली की ज़रूरतें बताएं। हम आपको अगले कदम समझने में मदद करेंगे।', 'Estimate your system size': 'सिस्टम का अनुमान जानें', 'Talk to a solar advisor': 'सोलर सलाहकार से बात करें',
  'Helpful links': 'उपयोगी लिंक', Explore: 'जानें', 'About Awadh Enterprises': 'अवध एंटरप्राइजेज़ के बारे में', 'Solar solutions': 'सोलर समाधान', 'Solar calculator': 'सोलर कैलकुलेटर', 'Privacy policy': 'गोपनीयता नीति', 'Terms of use': 'उपयोग की शर्तें',
  'Talk to our team': 'हमारी टीम से बात करें', 'Have a question about solar for your home or business? We’re here to help you get started.': 'घर या व्यवसाय के लिए सोलर से जुड़ा सवाल है? शुरुआत करने में हम आपकी मदद करेंगे।', 'Call Awadh Enterprises': 'अवध एंटरप्राइजेज़ को कॉल करें', 'Chat with us on WhatsApp': 'व्हाट्सऐप पर बात करें', 'Back to top': 'ऊपर जाएं',
  'Average monthly electricity bill': 'औसत मासिक बिजली बिल', 'Indicative system size': 'अनुमानित सिस्टम क्षमता', 'At around': 'लगभग', 'each': 'प्रत्येक', 'Indicative installed cost range': 'इंस्टॉलेशन की अनुमानित लागत',
  month: 'माह', panels: 'पैनल', lakh: 'लाख',
  'LOCAL SOLAR GUIDANCE · MIRZAPUR': 'स्थानीय सोलर मार्गदर्शन · मिर्ज़ापुर', 'Helping homes and businesses explore dependable solar energy with local guidance from Mirzapur.': 'मिर्ज़ापुर में स्थानीय मार्गदर्शन के साथ घरों और व्यवसायों को भरोसेमंद सौर ऊर्जा अपनाने में मदद।', 'Local team. Clear guidance. Support when you need it.': 'स्थानीय टीम। स्पष्ट मार्गदर्शन। ज़रूरत पर सहायता।', 'Solar guidance for Mirzapur and nearby communities.': 'मिर्ज़ापुर और आसपास के क्षेत्रों के लिए सोलर मार्गदर्शन।',
  'All rights reserved.': 'सर्वाधिकार सुरक्षित।',
  'Your name': 'आपका नाम', 'Mobile number': 'मोबाइल नंबर', 'What do you need?': 'आपको क्या चाहिए?', 'Select a requirement': 'अपनी आवश्यकता चुनें', 'Residential rooftop solar': 'आवासीय रूफटॉप सोलर', 'Commercial solar': 'व्यावसायिक सोलर', 'Inverter or battery': 'इन्वर्टर या बैटरी', 'Maintenance and support': 'रखरखाव और सहायता', Other: 'अन्य', 'Continue on WhatsApp': 'व्हाट्सऐप पर आगे बढ़ें',
  'Solar solutions, rooted in Mirzapur.': 'मिर्ज़ापुर से जुड़े सोलर समाधान।', 'Solar solutions for every site': 'हर जगह के लिए सोलर समाधान', 'Let’s talk solar': 'सोलर के बारे में बात करें',
  'Open the official PM Surya Ghar portal': 'आधिकारिक पीएम सूर्य घर पोर्टल खोलें',
  'Sunlight today.': 'आज की धूप।', 'Brighter tomorrow.': 'कल उज्ज्वल।', 'Local solar guidance from': 'से स्थानीय सोलर मार्गदर्शन', 'Explore solar solutions': 'सोलर समाधान देखें',
  'English': 'English', 'Hindi': 'हिन्दी', 'Language': 'भाषा',
  "Mirzapur's trusted solar partner": 'मिर्ज़ापुर का भरोसेमंद सोलर साथी', 'Reliable, affordable solar solutions for homes, businesses and institutions.': 'घर, व्यवसाय और संस्थानों के लिए भरोसेमंद, किफायती सोलर समाधान।',
  'SUNLIGHT TODAY': 'आज की धूप', 'BRIGHTER TOMORROW': 'कल और उज्ज्वल', 'Save on your': 'बचत करें', 'electricity bill': 'बिजली बिल में', 'Choose clean': 'चुनें स्वच्छ', 'renewable energy': 'नवीकरणीय ऊर्जा', 'Reliable solar': 'भरोसेमंद सोलर', 'for daily power': 'रोज़मर्रा की बिजली', 'Local service': 'स्थानीय सेवा', 'and support': 'और सहायता',
  'SOLAR POWER FOR': 'सोलर ऊर्जा से', 'A BRIGHTER TOMORROW': 'उज्ज्वल भविष्य',
  'Calculate your solar system size': 'अपने सोलर सिस्टम का आकार जानें', 'Talk to us on WhatsApp': 'व्हाट्सऐप पर बात करें', 'Get quick guidance': 'तुरंत सलाह पाएं', 'Clean Energy': 'स्वच्छ ऊर्जा', 'For a brighter Mirzapur': 'उज्ज्वल मिर्ज़ापुर के लिए', 'Built for your rooftop': 'आपकी छत के लिए बना',
  'Residential Solar': 'आवासीय सोलर', 'Commercial Solar': 'व्यावसायिक सोलर', 'Institutional Solar': 'संस्थागत सोलर', 'Solar Panels': 'सोलर पैनल', 'Solar Inverters': 'सोलर इन्वर्टर', 'Solar Batteries': 'सोलर बैटरी',
  'Rooftop solar planned around your home and electricity use.': 'आपके घर और बिजली की खपत के अनुसार रूफटॉप सोलर योजना।', 'Solar options for offices, shops and industrial sites.': 'कार्यालयों, दुकानों और औद्योगिक स्थलों के लिए सोलर विकल्प।', 'Explore clean-energy planning for campuses and institutions.': 'कैंपस और संस्थानों के लिए स्वच्छ ऊर्जा योजना जानें।', 'Panels, inverters and accessories for a complete system.': 'संपूर्ण सिस्टम के लिए पैनल, इन्वर्टर और सहायक उत्पाद।',
  'Solar panels convert sunlight into electricity.': 'सोलर पैनल सूर्य के प्रकाश को बिजली में बदलते हैं।', 'Explore solar panel options for rooftop systems.': 'रूफटॉप सिस्टम के लिए सोलर पैनल के विकल्प देखें।', 'Explore inverter options for your solar installation.': 'अपने सोलर इंस्टॉलेशन के लिए इन्वर्टर विकल्प देखें।', 'Discuss battery storage for compatible solar systems.': 'अनुकूल सोलर सिस्टम के लिए बैटरी स्टोरेज पर चर्चा करें।',
  'Awadh Enterprises helps homes, businesses and institutions explore solar energy with local guidance.': 'अवध एंटरप्राइजेज़ स्थानीय मार्गदर्शन के साथ घरों, व्यवसायों और संस्थानों को सोलर ऊर्जा के विकल्प समझने में मदद करता है।',
  'We are based in Bari Basahi, Mirzapur, Uttar Pradesh.': 'हम बारी बसाही, मिर्ज़ापुर, उत्तर प्रदेश में स्थित हैं।', 'Talk with our team about your property, electricity needs and the options available for your site.': 'अपनी जगह, बिजली की ज़रूरत और उपलब्ध विकल्पों के बारे में हमारी टीम से बात करें।',
  'Every rooftop and site has different requirements.': 'हर छत और जगह की ज़रूरतें अलग होती हैं।', 'Project examples and customer installations will be added here as verified photographs and project details are approved for publication.': 'सत्यापित तस्वीरें और प्रोजेक्ट विवरण प्रकाशन के लिए स्वीकृत होने पर यहां प्रोजेक्ट उदाहरण और ग्राहक इंस्टॉलेशन जोड़े जाएंगे।', 'Contact us to discuss a property in Mirzapur and nearby areas.': 'मिर्ज़ापुर और आसपास की जगहों के बारे में चर्चा के लिए संपर्क करें।',
  'Residential: explore rooftop solar for your home.': 'आवासीय: अपने घर के लिए रूफटॉप सोलर विकल्प जानें।', 'Commercial: discuss the energy requirements of your shop, office or facility.': 'व्यावसायिक: अपनी दुकान, कार्यालय या सुविधा की ऊर्जा ज़रूरतों पर चर्चा करें।', 'Institutional: plan a site assessment for a campus or public-serving institution.': 'संस्थागत: कैंपस या सार्वजनिक संस्था के लिए साइट आकलन की योजना बनाएं।', 'The final system size, equipment and economics require a site-specific assessment.': 'अंतिम सिस्टम क्षमता, उपकरण और लागत के लिए साइट का आकलन आवश्यक है।',
  'The PM Surya Ghar: Muft Bijli Yojana is a Government of India programme for residential rooftop solar.': 'पीएम सूर्य घर: मुफ्त बिजली योजना आवासीय रूफटॉप सोलर के लिए भारत सरकार का कार्यक्रम है।', 'Eligibility, application steps and assistance amounts are set by the programme and can change. Check the official portal for current details.': 'पात्रता, आवेदन प्रक्रिया और सहायता राशि योजना द्वारा तय होती है और बदल सकती है। नवीनतम जानकारी के लिए आधिकारिक पोर्टल देखें।', 'Awadh Enterprises can help you discuss rooftop solar options and understand what information to prepare.': 'अवध एंटरप्राइजेज़ रूफटॉप सोलर विकल्पों पर चर्चा करने और आवश्यक जानकारी समझने में आपकी मदद कर सकता है।',
  'Use your monthly electricity bill to get a rough system-size estimate.': 'सिस्टम की अनुमानित क्षमता जानने के लिए अपना मासिक बिजली बिल डालें।',
  'Information on this website is provided as a general introduction to solar options.': 'इस वेबसाइट की जानकारी सोलर विकल्पों का सामान्य परिचय देती है।', 'System sizing, pricing, availability, timelines and savings depend on a site assessment and final written proposal.': 'सिस्टम का आकार, कीमत, उपलब्धता, समय और बचत साइट आकलन और अंतिम लिखित प्रस्ताव पर निर्भर करते हैं।', 'Programme rules and eligibility are governed by the relevant official sources.': 'योजना के नियम और पात्रता संबंधित आधिकारिक स्रोतों द्वारा निर्धारित होते हैं।',
  'Solar products': 'सोलर उत्पाद', 'Explore the main components used in rooftop solar systems.': 'रूफटॉप सोलर सिस्टम में इस्तेमाल होने वाले मुख्य उपकरणों को जानें।', 'Inverters convert solar power for use in your building and manage the system.': 'इन्वर्टर सोलर बिजली को आपके भवन में उपयोग योग्य बनाते और सिस्टम को नियंत्रित करते हैं।', 'Batteries can store energy for compatible systems.': 'बैटरी अनुकूल सिस्टम के लिए ऊर्जा संचित कर सकती है।',
  'Solar services': 'सोलर सेवाएं', 'Get help exploring a solar system from the first site conversation through installation planning.': 'पहली साइट चर्चा से लेकर इंस्टॉलेशन योजना तक सोलर सिस्टम के विकल्प जानने में सहायता पाएं।', 'Residential and commercial solar consultation': 'आवासीय और व्यावसायिक सोलर परामर्श', 'System planning and installation coordination': 'सिस्टम योजना और इंस्टॉलेशन समन्वय', 'Product guidance and post-installation support': 'उत्पाद मार्गदर्शन और इंस्टॉलेशन के बाद सहायता',
  'Solar projects': 'सोलर प्रोजेक्ट',
  'The right solar system depends on your roof, electricity use and goals.': 'सही सोलर सिस्टम आपकी छत, बिजली की खपत और लक्ष्यों पर निर्भर करता है।',
  'Share your requirements with Awadh Enterprises. Continue your enquiry directly in WhatsApp.': 'अपनी ज़रूरतें अवध एंटरप्राइजेज़ को बताएं। अपनी पूछताछ सीधे व्हाट्सऐप पर जारी रखें।',
  'We respect the information you choose to share with us.': 'आप हमारे साथ जो जानकारी साझा करते हैं, हम उसका सम्मान करते हैं।',
  'Contact our team to discuss solar options for your property.': 'अपनी जगह के लिए सोलर विकल्पों पर चर्चा करने के लिए हमारी टीम से संपर्क करें।', 'Details depend on product availability or verified project information. Contact our team to learn more.': 'जानकारी उत्पाद की उपलब्धता या सत्यापित प्रोजेक्ट विवरण पर निर्भर करती है। अधिक जानने के लिए हमारी टीम से संपर्क करें।',
}

const englishOverrides: Record<string, string> = {
  'मिर्ज़ापुर का भरोसेमंद सोलर साथी': "Mirzapur's trusted solar partner",
  'घर, व्यवसाय और संस्थानों के लिए भरोसेमंद, किफायती सोलर समाधान।': 'Reliable, affordable solar solutions for homes, businesses and institutions.',
}

export function T({ children, hi }: { children: string; hi?: string }) {
  const { language } = useLanguage()
  return <>{language === 'hi' ? (hi ?? translations[children] ?? children) : (englishOverrides[children] ?? children)}</>
}

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useLanguage()
  return <div className={`language-switch ${className}`} role="group" aria-label={language === 'hi' ? 'भाषा चुनें' : 'Choose language'}>
    <button type="button" onClick={() => setLanguage('en')} aria-pressed={language === 'en'}>EN</button>
    <button type="button" onClick={() => setLanguage('hi')} aria-pressed={language === 'hi'}>हिन्दी</button>
  </div>
}
