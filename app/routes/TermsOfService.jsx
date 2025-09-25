
import React from "react";
import { useUniversalFluid } from '../hooks/useUniversalFluid'; // Assuming you have this hook
import { useMediaQuery } from "react-responsive";
import Header from '~/components/Header';
import Footer from '../components/Footer';

const TermsOfService = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { fs, fsm, fluidStyle } = useUniversalFluid();

  return (
    <div className="w-full min-h-screen bg-white text-black p-4 md:p-8" style={{ fontFamily: 'Cousine, monospace' }}>
      <Header/>
      <div className="max-w-4xl mx-auto" style={{marginTop: fs(50),marginBottom: fs(50)}}>
        <h1 
          className="text-3xl md:text-4xl font-bold mb-6 text-center" 
          style={{ fontFamily: 'Cairo, sans-serif', fontSize: isMobile ? fsm(24) : fs(32) }}
        >
          Terms and Conditions
        </h1>
        
        <div className="space-y-6 text-sm md:text-base leading-relaxed" style={{ lineHeight: 1.6 }}>
          <p><strong>Effective Date: September 25, 2025</strong></p>
          
          <p>Welcome to Sugamo Navi ("App", "we", "us", or "our"). Sugamo Navi is a mobile application designed for solo travelers to discover the best shops, travel places, and publish blogs in the Sugamo area of Tokyo, Japan. By accessing or using the App, you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree, please do not use the App.</p>
          
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>1. Eligibility</h2>
            <p>You must be at least 18 years old to use the App. By using the App, you represent that you meet this requirement and that you are not barred from using the App under applicable law.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>2. Account Registration</h2>
            <p>To access certain features, you may need to create an account. You agree to provide accurate information and keep it updated. You are responsible for maintaining the confidentiality of your account credentials. We reserve the right to suspend or terminate accounts for violations of these Terms.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>3. User Content and Blogs</h2>
            <p>You may publish blogs and share content via the App. You retain ownership of your content but grant us a worldwide, non-exclusive, royalty-free license to host, display, and distribute it. You agree not to post illegal, harmful, or infringing content. We may remove content that violates these Terms without notice.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>4. Prohibited Conduct</h2>
            <p>You agree not to: (a) use the App for commercial purposes without permission; (b) harass or harm others; (c) upload viruses or malware; (d) scrape or reverse-engineer the App; or (e) violate any laws. Violation may result in termination of access.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>5. Intellectual Property</h2>
            <p>The App and its content (excluding user-generated content) are owned by us or our licensors. You may not copy, modify, or distribute them without permission. Sugamo Navi trademarks and logos are protected.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>6. Disclaimers and Limitations</h2>
            <p>The App is provided "as is" without warranties. We do not guarantee accuracy of shop or travel information. Liability is limited to the maximum extent permitted by law. In no event shall we be liable for indirect damages.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>7. Termination</h2>
            <p>We may terminate your access at any time for violations. Upon termination, your right to use the App ends.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>8. Governing Law</h2>
            <p>These Terms are governed by Japanese law. Disputes shall be resolved in Tokyo courts.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>9. Changes to Terms</h2>
            <p>We may update these Terms. Continued use after changes constitutes acceptance.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>10. Contact</h2>
            <p>For questions, contact us at [info@san-creation.com].</p>
          </section>
          
          <p className="mt-8 text-center"><strong>Copyright © 2025 Sugamo Navi. All Rights Reserved.</strong></p>
        </div>
      </div>
       <Footer />
    </div>
  );
};

export default TermsOfService;