
   import React, { useState } from 'react';

   const LanguageSelector = () => {
     const [isOpen, setIsOpen] = useState(false);
     const [selectedLanguage, setSelectedLanguage] = useState('JA');
     const languages = ['JA', 'EN', 'ZH'];

     return (
       <div className="relative inline-block text-left">
         <button
           type="button"
           className="flex items-center px-2 py-1 bg-gray-200 rounded-full"
           onClick={() => setIsOpen(!isOpen)}
         >
           <span className="text-xl">{selectedLanguage}</span>
           <span className="ml-2">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
             </svg>
           </span>
         </button>

         {isOpen && (
           <div className="origin-top-right absolute left-0 mt-2 w-16 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
             <div className="py-1">
               {languages.map((lang) => (
                 <button
                   key={lang}
                   className={`w-full text-center py-2 ${selectedLanguage === lang ? 'bg-gray-100' : ''}`}
                   onClick={() => {
                     setSelectedLanguage(lang);
                     setIsOpen(false);
                   }}
                 >
                   <span className={`inline-flex items-center justify-center w-8 h-8 ${selectedLanguage === lang ? 'bg-black text-white rounded-full' : ''}`}>
                     {lang}
                   </span>
                 </button>
               ))}
             </div>
           </div>
         )}
       </div>
     );
   };

   export default LanguageSelector;
