import React from "react";
import MarqueeHeader from "./MarqueeHeader";
import { useUniversalFluid } from '../hooks/useUniversalFluid';
import { useMediaQuery } from "react-responsive";
import { Link } from "@remix-run/react";

interface FooterProps {
  marginTop?: number; // Optional dynamic margin top
}

const Footer: React.FC<FooterProps> = ({
  marginTop = 0,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { fs, fsm } = useUniversalFluid();
  const footerLinks = [
    { text: "運営会社", href: "#" }, // Placeholder for company link; update with actual route if needed
    { text: "利用規約", href: "/TermsOfService" },
    { text: "プライバシーポリシー", href: "/PrivacyPolicy" },
  ];

  return (
    <div className="w-full" style={{ marginTop: fs(marginTop) }}>
      <MarqueeHeader
        text="FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE!"
        backgroundColor="#000000"
        textColor="#FFFFFF"
        animationDuration="90s"
      />
      <footer className="text-white">
        <div 
          className="flex justify-between bg-[#ED4548] items-center" 
          style={{ 
            height: isMobile ? fsm(122) : fs(209), 
            paddingRight: isMobile ? fsm(21) : fs(89), 
            paddingLeft: isMobile ? fsm(0) : fs(90) 
          }}
        >
          <div 
            className="flex flex-col" 
            style={{ 
              gap: isMobile ? fsm(10) : fs(30), 
              height: isMobile ? fsm(90) : fs(135), 
              justifyContent: 'center',
              marginLeft: isMobile ? fsm(41) : 0 
            }}
          >
            {footerLinks.map((link) => (
              <li key={link.text} className="list-none">
                <Link
                  to={link.href}
                  className="hover:text-white transition-colors font-semibold font-cairo"
                  style={{ fontSize: isMobile ? fsm(12) : fs(16) }}
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </div>
          <div className="flex-row flex" style={{ gap: isMobile ? fsm(16) : fs(32) }}>
            <a href="https://www.instagram.com/reel/DNfV4MozhwL/">
              <img
                src="/src/instagram-icon.svg"
                alt="Instagram"
                style={{ width: isMobile ? fsm(36) : fs(76), height: isMobile ? fsm(36) : fs(74) }}
              />
            </a>
            <a href="https://www.tiktok.com/@sugamo_japan">
              <img
                src="/src/titok.svg"
                alt="TikTok"
                style={{ width: isMobile ? fsm(36) : fs(76), height: isMobile ? fsm(36) : fs(74) }}
              />
            </a>
          </div>
        </div>

        <div
          className="w-full flex justify-center items-center text-center text-sm text-black bg-white font-cousine font-bold"
          style={{
            height: isMobile ? fsm(56) : fs(100),
            fontSize: isMobile ? fsm(10) : fs(16),
          }}
        >
          Copyright © 2025 SUGAMO NAVI All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Footer;