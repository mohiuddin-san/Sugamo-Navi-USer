import React from "react";
import MarqueeHeader from "./MarqueeHeader";

const Footer = () => {
  const footerLinks = [
    "運営会社",
    "利用規約",
    "プライバシーポリシー",
  ];

  return (
    <div className="w-full">
      <MarqueeHeader
        text="FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE! FOLLOW US AND SEE MORE!"
        backgroundColor="#000000"
        textColor="#FFFFFF"
        animationDuration="40s"
        marginBottom={0}
      />
      <footer className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="space-y-4 flex flex-col "> {/* Changed to flex-col with space-y-4 for vertical spacing */}
            {footerLinks.map((link) => (
              <li
                key={link}
                className="hover:text-white transition-colors font-semibold font-cairo"
              >
                {link}
              </li>
            ))}
          </div>
          <div className="flex space-x-4">
            <a href="https://www.instagram.com/reel/DNfV4MozhwL/">
              <img
                src="/src/instagram-icon.svg"
                alt="Instagram"
                className="w-10 h-10"
              />
            </a>
            <a href="https://www.tiktok.com/@sugamo_japan">
              <img
                src="/src/titok.svg"
                alt="TikTok"
                className="w-10 h-10"
              />
            </a>
          </div>
        </div>

        <div className="mx-auto py-6 text-center text-sm text-black bg-white font-cairo font-bold">
          Copyright © 2025 SUGAMO NAVI All Rights Reserved.
        </div>
      </footer>
    </div>
  );

};

export default Footer;