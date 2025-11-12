import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useRevalidator } from "@remix-run/react";
import { useUniversalFluid } from "../hooks/useUniversalFluid";
import { useMediaQuery } from "react-responsive";
import supabaseShops from "~/supabase";
import { useTranslation } from "react-i18next";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("JA");
  const [pageTransition, setPageTransition] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [shops, setShops] = useState<{ id: string; name: string }[]>([]);
  const [loadingShops, setLoadingShops] = useState(true);
  const [shopsError, setShopsError] = useState<string | null>(null);
  const { fs, fsm } = useUniversalFluid();
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const menuItems = [
    "食べる",
    "観る・遊ぶ",
    "モデルコース",
    "旅の情報",
    "おすすめの店",
    "ブックマーク",
  ];

  const menuRoutes: Record<string, string> = {
    食べる: "/ShopPage",
    "観る・遊ぶ": "/SeeAndDo",
    モデルコース: "/ModelCourse",
    旅の情報: "/BlogList",
    おすすめの店: "/Recomondation",
    ブックマーク: "/BookMark",
  };

  const handleSearchClick = () => setIsSearchOpen(true);
  const handleBookmarkClick = () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => navigate("/BookMark"));
    } else {
      navigate("/BookMark");
    }
  };

  const handleHomeClick = () => {
    console.log("Home: Navigating to home");
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        navigate("/", { replace: true });
        if (revalidator.state === "idle") {
          revalidator.revalidate();
        }
      });
    } else {
      navigate("/", { replace: true });
      if (revalidator.state === "idle") {
        revalidator.revalidate();
      }
    }

    if (isSearchOpen) setIsSearchOpen(false);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const handleLanguageSelect = (language: string) => {
    i18n.changeLanguage(language);
    setSelectedLanguage(language);
    setIsLanguageDropdownOpen(false);
  };

  // Fetch shops data from Supabase
  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoadingShops(true);
        setShopsError(null);
        const { data: shopsData, error } = await supabaseShops
          .from('shops')
          .select('id, name');

        if (error) {
          console.error('Error fetching shops:', error);
          setShopsError('Failed to load shops');
          return;
        }

        if (shopsData) {
          setShops(shopsData);
        }
      } catch (err) {
        console.error('Unexpected error fetching shops:', err);
        setShopsError('An unexpected error occurred');
      } finally {
        setLoadingShops(false);
      }
    };

    fetchShops();
  }, []);

  // Filter shops based on search query
  const filteredShops = shops.filter((shop) =>
    shop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [selectedShop, setSelectedShop] = useState<{id: string, name: string} | null>(null);

  const handleShopClick = (shopId: string, shopName: string) => {
    setSearchQuery(shopName);
    setSelectedShop({id: shopId, name: shopName});
  };

  useEffect(() => {
    setPageTransition(true);
    const timer = setTimeout(() => setPageTransition(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMenuOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen, isSearchOpen]);

  return (
    <div
      className={`w-full transition-opacity duration-500`}
      style={{
        paddingTop: fs(33),
        height: fs(90)
      }}
    >
      {/* Desktop Header */}
      <div
        className="hidden md:flex justify-between items-center flex-nowrap"
        style={{ marginLeft: fs(90), marginRight: fs(90) }}
      >
        <div
          className="font-bold font-cousine cursor-pointer"
          style={{ fontSize: fs(28) }}
          onClick={handleHomeClick}
        >
          SUGAMO NAVI
        </div>
        <div className="flex flex-row justify-between items-center">
          <nav
            className="flex flex-nowrap items-center justify-center"
            style={{ gap: isMobile ? fsm(48) : fs(17) }}
          >
            {menuItems.slice(0, -1).map((item) => (
              <Link
                key={item}
                to={menuRoutes[item]}
                viewTransition // View Transition যোগ করা হয়েছে
                className="relative py-1 pt-2 font-bold font-cousine transition duration-300 ease-in-out rounded-full cursor-pointer group whitespace-nowrap"
                style={{ fontSize: fs(16), paddingLeft: fs(15), paddingRight: fs(15) }}
              >
                <span className="relative text-center z-10 text-black group-hover:text-white transition-colors duration-300">
                  {item}
                </span>
                <span className="absolute inset-0 rounded-full bg-black scale-0 group-hover:scale-100 transition-shadow duration-300 ease-linear z-0"></span>
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center" style={{ gap: fs(32), marginLeft: fs(28) }}>
            <div
              className="flex items-center py-1 cursor-pointer transition-transform duration-300 hover:scale-105 hover:text-black"
              onClick={handleSearchClick}
            >
              <img
                src="/src/search.svg"
                alt="Search Icon"
                className="transition-transform duration-300 hover:scale-105"
                style={{ width: fs(19), height: fs(19) }}
              />
              <span
                className="font-cousine font-bold italic whitespace-nowrap"
                style={{ fontSize: fs(16) }}
              >
                検索
              </span>
            </div>
            <button
              className="py-1 transition-transform duration-300 hover:scale-125"
              onClick={handleBookmarkClick}
            >
              <img
                src="/src/bookmark.svg"
                alt="Bookmark Icon"
                style={{ height: isMobile ? fsm(21) : fs(21), width: isMobile ? fsm(26) : fs(26) }}
              />
            </button>
            <div className="relative flex items-center justify-center">
              <div
                className="flex items-center justify-center bg-white cursor-pointer transition-transform duration-300 hover:scale-125"
                style={{ width: fs(27), height: fs(27) }}
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              >
                <img
                  className="w-full h-full object-cover"
                  src="/src/world.svg"
                  alt="World Icon"
                />
              </div>
              {isLanguageDropdownOpen && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-start bg-white border rounded-full shadow-md"
                  style={{
                    borderRadius: fs(30),
                    width: fs(40),
                    height: fs(160),
                  }}
                >
                  <div
                    className="flex justify-center rounded-full cursor-pointer"
                    onClick={() => setIsLanguageDropdownOpen(false)}
                  >
                    <img src="/src/world.svg" alt="World Icon" />
                  </div>
                  {["JA", "EN", "ZH"].map((lang) => (
                    <div
                      key={lang}
                      onClick={() => handleLanguageSelect(lang)}
                      className={`flex items-center justify-center rounded-full font-bold cursor-pointer my-1 ${
                        selectedLanguage === lang
                          ? "bg-black text-white"
                          : "border border-black text-black"
                      } font-cousine text-center transition-colors duration-300 hover:bg-black hover:text-white`}
                      style={{
                        width: fs(28),
                        height: fs(28),
                        fontSize: fs(12),
                      }}
                    >
                      {lang}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center px-4 relative">
        <div className="relative flex items-center justify-center">
          <div
            className="flex items-center justify-center bg-white cursor-pointer transition-transform duration-300 hover:scale-125"
            style={{ width: fsm(27), height: fsm(27) }}
            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
          >
            <img
              src="/src/world.svg"
              alt="World Icon"
              className="w-full h-full object-cover"
              style={{ marginLeft: fsm(6) }}
            />
          </div>
          {isLanguageDropdownOpen && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-start bg-white border rounded-full shadow-md"
              style={{
                borderRadius: fsm(30),
                width: fsm(40),
                height: fsm(128),
              }}
            >
              <div
                className="flex justify-center rounded-full cursor-pointer"
                onClick={() => setIsLanguageDropdownOpen(false)}
              >
                <img
                  src="/src/world.svg"
                  alt="World Icon"
                  style={{ height: fsm(28), width: fsm(28) }}
                />
              </div>
              {["JA", "EN", "ZH"].map((lang) => (
                <div
                  key={lang}
                  onClick={() => handleLanguageSelect(lang)}
                  className={`flex items-center justify-center rounded-full font-bold cursor-pointer my-1 ${
                    selectedLanguage === lang
                      ? "bg-black text-white"
                      : "border border-black text-black"
                  } font-cousine text-center transition-colors duration-300 hover:bg-black hover:text-white`}
                  style={{
                    height: fsm(27),
                    width: fsm(27),
                    fontSize: fsm(12),
                  }}
                >
                  {lang}
                </div>
              ))}
            </div>
          )}
        </div>
        <div
          className="flex justify-center font-cousine font-bold absolute left-1/2 transform -translate-x-1/2 cursor-pointer active:scale-90 active:opacity-50 transition-all duration-200 select-none"
          style={{ fontSize: fsm(25) }}
          onClick={handleHomeClick}
        >
          SUGAMO NAVI
        </div>
        <div className="flex items-center space-x-4">
          <div
            className="flex items-center py-1 cursor-pointer transition-transform duration-300 hover:scale-110 hover:text-black"
            onClick={handleSearchClick}
          >
            <img
              src="/src/search.svg"
              alt="Search Icon"
              className="transition-transform duration-300 hover:scale-125"
              style={{ height: fsm(20), width: fsm(20) }}
            />
          </div>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="transition-transform duration-300 hover:scale-125"
          >
            <img src="./src/menu-mobile.svg" alt="Menu" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Fullscreen Modal */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center p-6">
          <div className="flex justify-between items-center w-full">
            <div
              className="font-cousine font-bold cursor-pointer transition-transform duration-300 hover:scale-110"
              style={{ fontSize: fsm(25) }}
              onClick={handleHomeClick}
            >
              SUGAMO NAVI
            </div>
            <img
              onClick={() => setIsMenuOpen(false)}
              className="sp-only w-[16.97px] h-[16.97px]"
              src="./src/cross.svg"
              alt="close menu"
            />
          </div>
          <div className="w-full h-full left-0 bg-white flex flex-col items-center">
            <nav
              className="flex flex-col items-center w-full h-full justify-center"
              style={{ gap: fsm(38) }}
            >
              {menuItems.map((item) => (
                <div key={item} className="flex justify-between items-center">
                  <Link
                    to={menuRoutes[item]}
                    viewTransition // View Transition যোগ করা হয়েছে
                    className="text-black font-bold cursor-pointer fsm-[16] flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item === "ブックマーク" && (
                      <img
                        src="/src/bookmark.svg"
                        alt="Bookmark Icon"
                        style={{
                          height: fsm(20),
                          width: fsm(20),
                          marginRight: fsm(8),
                        }}
                      />
                    )}
                    {item}
                  </Link>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Search Model */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
          <div className="w-full h-full flex flex-col items-center justify-center p-6 relative">
            {isMobile ? (
              <div className="absolute top-0 left-0 w-full flex items-center justify-between pt-4 px-4">
                <div className="relative flex items-center justify-center">
                  <img
                    src="/src/world.svg"
                    alt="World Icon"
                    className="cursor-pointer transition-transform duration-300 hover:scale-110"
                    style={{
                      width: fsm(37),
                      height: fsm(37),
                    }}
                    onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  />
                  {isLanguageDropdownOpen && (
                    <div
                      className="absolute top-0 left-0 flex flex-col items-center justify-start bg-white border rounded-full shadow-md z-10"
                      style={{
                        borderRadius: fsm(30),
                        width: fsm(40),
                        height: fsm(128),
                      }}
                    >
                      <div
                        className="flex justify-center rounded-full cursor-pointer"
                        onClick={() => setIsLanguageDropdownOpen(false)}
                      >
                        <img
                          src="/src/world.svg"
                          alt="World Icon"
                          style={{ height: fsm(20), width: fsm(20) }}
                        />
                      </div>
                      {["JA", "EN", "ZH"].map((lang) => (
                        <div
                          key={lang}
                          onClick={() => handleLanguageSelect(lang)}
                          className={`flex items-center justify-center rounded-full font-bold cursor-pointer my-1 ${
                            selectedLanguage === lang
                              ? "bg-black text-white"
                              : "border border-black text-black"
                          } font-cousine text-center transition-colors duration-300 hover:bg-black hover:text-white`}
                          style={{
                            height: fsm(27),
                            width: fsm(27),
                            fontSize: fsm(12),
                          }}
                        >
                          {lang}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div
                  className="font-bold font-cousine cursor-pointer absolute left-1/2 transform -translate-x-1/2"
                  style={{ 
                    fontSize: fsm(25),
                    fontWeight: 700,
                    color: '#000000'
                  }}
                  onClick={handleHomeClick}
                >
                  SUGAMO NAVI
                </div>
                <img
                  src="/src/cross.svg"
                  alt="Close"
                  className="cursor-pointer transition-transform duration-300 hover:scale-110"
                  style={{
                    width: fsm(20),
                    height: fsm(20),
                  }}
                  onClick={() => setIsSearchOpen(false)}
                />
              </div>
            ) : (
              <div
                className="font-bold font-cousine cursor-pointer"
                style={{ 
                  height: fs(100),
                  fontSize: fs(61.4),
                  fontWeight: 700,
                  color: '#000000'
                }}
                onClick={handleHomeClick}
              >
                SUGAMO NAVI
              </div>
            )}
            <div className="flex justify-center">
              <div
                className="flex items-center justify-center border-  border-2 border-black overflow-hidden"
                style={{
                  width: isMobile ? fsm(400) : fs(950),
                  height: isMobile ? fsm(65) : fs(108),
                  borderRadius: isMobile ? fsm(172.5) : fs(172.5),
                }}
              >
                <img
                  src="/src/icons-search.png"
                  alt="Search Icon"
                  className=""
                  style={{
                    height: isMobile ? fsm(19.5) : fs(54),
                    width: isMobile ? fsm(19.5) : fs(55),
                    marginLeft: isMobile ? fsm(20) : fs(30),
                  }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedShop(null);
                  }}
                  placeholder="ブーランジェリーボヌール"
                  className="w-full h-full bg-transparent border-none focus:outline-none font-cousine pl-3"
                  style={{
                    fontSize: isMobile ? fsm(16) : fs(25),
                    fontFamily: 'Cousine',
                    fontWeight: 700,
                    color: '#000000',
                  }}
                />
                <span
                  className="cursor-pointer hover:scale-110 transition-transform duration-200 font-bold select-none"
                  style={{
                    fontSize: isMobile ? fsm(23) : fs(50),
                    marginRight: isMobile ? fsm(20) : fs(30),
                    color: '#000000',
                    lineHeight: 1,
                  }}
                  onClick={() => {
                    if (selectedShop) {
                      const url = `/ShopDetails?id=${selectedShop.id}&type=shops`;
                      if (document.startViewTransition) {
                        document.startViewTransition(() => {
                          window.open(url, '_blank');
                        });
                      } else {
                        window.open(url, '_blank');
                      }
                    } else {
                      const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                      if (searchInput) searchInput.focus();
                    }
                  }}
                >
                  →
                </span>
              </div>
            </div>
            <ul
              className="space-y-2 bg-[#F7F7F7] text-left p-4 rounded-lg overflow-hidden"
              style={{ 
                width: isMobile ? fsm(360) : fs(860),
                height: 'auto',
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomLeftRadius: isMobile ? fsm(30) : fs(30),
                borderBottomRightRadius: isMobile ? fsm(30) : fs(30),
              }}
            >
              {loadingShops ? (
                <li className="text-gray-700">Loading shops...</li>
              ) : shopsError ? (
                <li className="text-red-500">{shopsError}</li>
              ) : filteredShops.length > 0 ? (
                filteredShops.slice(0, 4).map((shop) => (
                  <li
                    key={shop.id}
                    className="font-Cousine font-bold cursor-pointer hover:bg-gray-200 hover:text-black active:bg-black active:text-white transition-colors duration-200"
                    style={{ 
                      fontSize: isMobile ? fsm(16) : fs(20),
                      fontWeight: 700,
                      color:'#878787',
                      paddingLeft: isMobile ? fsm(10) : fs(40),
                    }}
                    onClick={() => handleShopClick(shop.id, shop.name)}
                  >
                    # {shop.name}
                  </li>
                ))
              ) : (
                <li className="text-gray-700">
                  {searchQuery ? 'No shops found' : 'Start typing to search shops...'}
                </li>
              )}
            </ul>
            {!isMobile && (
              <div className="mt-6">
                <button
                  className="w-auto px-12 py-2 bg-black text-white rounded-3xl hover:bg-black transition-transform duration-300 hover:scale-105"
                  onClick={() => setIsSearchOpen(false)}
                >
                  閉じる
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;