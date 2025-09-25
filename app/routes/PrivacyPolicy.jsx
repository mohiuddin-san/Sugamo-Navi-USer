
import React from "react";
import { useUniversalFluid } from '../hooks/useUniversalFluid';
import { useMediaQuery } from "react-responsive";
import Header from '~/components/Header';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { fs, fsm, fluidStyle } = useUniversalFluid();

  return (
    <div className="w-full min-h-screen bg-white text-black p-4 md:p-8" style={{ fontFamily: 'Cousine, monospace' }}>
      <Header />
      <div className="max-w-4xl mx-auto" style={{marginTop: fs(50),marginBottom: fs(50)}}>
        <h1 
          className="text-3xl md:text-4xl font-bold mb-6 text-center" 
          style={{ fontFamily: 'Cairo, sans-serif', fontSize: isMobile ? fsm(24) : fs(32) }}
        >
          Privacy Policy
        </h1>
        
        <div className="space-y-6 text-sm md:text-base leading-relaxed" style={{ lineHeight: 1.6 }}>
          <p><strong>Effective Date: September 25, 2025</strong></p>
          
          <p>Sugamo Navi ("we", "us", or "our") respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our App for solo travelers to find shops, travel spots, and publish blogs. By using the App, you consent to this policy.</p>
          
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>1. Information We Collect</h2>
            <p><strong>Personal Information:</strong> Account details (e.g., email, name) during registration. Location data for travel recommendations (with consent). User-generated content like blogs.</p>
            <p><strong>Non-Personal Information:</strong> Device info, usage data, IP address, analytics via tools like Google Analytics.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>2. How We Use Information</h2>
            <p>We use it to: (a) provide and improve App features; (b) personalize recommendations; (c) communicate updates; (d) analyze usage; (e) comply with laws. We do not sell your personal data.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>3. Sharing Information</h2>
            <p>We share with: (a) service providers (e.g., hosting, analytics); (b) affiliates; (c) legal authorities if required. Third-party links (e.g., Instagram, TikTok) have their own policies.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>4. Data Security</h2>
            <p>We use reasonable measures (e.g., encryption) to protect data, but no system is foolproof. You are responsible for securing your account.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>5. Your Rights</h2>
            <p>Under applicable laws (e.g., GDPR if relevant), you can access, correct, delete, or opt-out of data processing. Contact us to exercise rights. Cookies can be managed via device settings.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>6. Children's Privacy</h2>
            <p>The App is not for children under 13. We do not knowingly collect their data.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>7. International Transfers</h2>
            <p>Data may be transferred to Japan or other countries. We ensure adequate protections.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>8. Changes to Policy</h2>
            <p>We may update this policy. Check the App for the latest version.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>9. Contact</h2>
            <p>For privacy concerns, email [info@san-creation.com].</p>
          </section>
          
          <p className="mt-8 text-center"><strong>Copyright © 2025 Sugamo Navi. All Rights Reserved.</strong></p>
        </div>
      </div>
       <Footer />
    </div>
  );
};

export default PrivacyPolicy;