import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useRevalidator } from "@remix-run/react";
import { useUniversalFluid } from "../hooks/useUniversalFluid";
import { useMediaQuery } from "react-responsive";
import supabaseShops from "~/supabase";

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
  ];

  const menuRoutes: Record<string, string> = {
    食べる: "/ShopPage",
    "観る・遊ぶ": "/SeeAndDo",
    モデルコース: "/ModelCourse",
    旅の情報: "/BlogList",
    おすすめの店: "/Recomondation",
  };

  const handleSearchClick = () => setIsSearchOpen(true);
  const handleBookmarkClick = () => navigate("/BookMark");
  const handleHomeClick = () => {
    console.log("🏠 Header: Navigating to home"); // Debug
    navigate("/", { replace: true });
    if (revalidator.state === "idle") {
      revalidator.revalidate();
    }
  };

  const handleLanguageSelect = (language: string) => {
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
          .select('id, name'); // Select only id and name for search functionality

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


  const handleShopClick = (shopId: string, shopName: string) => {
    navigate("/ShopDetails", {
      state: {
        shop: {
          id: shopId,
          title: shopName,
        },
      },
    });
    setIsSearchOpen(false);
    setSearchQuery("");
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

    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
      className={` w-full transition-opacity duration-500`}
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
            {menuItems.map((item) => (
              <Link
                key={item}
                to={menuRoutes[item]}
                className=" relative py-1 pt-2 font-bold font-cousine transition duration-300 ease-in-out rounded-full cursor-pointer group whitespace-nowrap"
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
                Search
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
              {/* <div
                className="flex items-center justify-center bg-white cursor-pointer transition-transform duration-300 hover:scale-125"
                style={{ width: fs(27), height: fs(27) }}
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              >
                <img
                className="w-full j-full object-cover"
                  src="/src/world.svg"
                  alt="World Icon"
                  
                />
              </div> */}
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
                      className={`flex items-center justify-center rounded-full font-bold cursor-pointer my-1 ${selectedLanguage === lang
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
            {/* <img
              src="/src/world.svg"
              alt="World Icon"
              className="w-full h-full object-cover"
              style={{ marginLeft: fsm(6) }}
            /> */}
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
                  className={`flex items-center justify-center rounded-full font-bold cursor-pointer my-1 ${selectedLanguage === lang
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
            <img src="./src/menu-mobile.svg" alt="Mohin" />
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
          <div className="w-full h-full left-0 bg-white flex flex-row">
            <nav
              className="flex flex-col items-center w-full h-full justify-center"
              style={{ gap: fsm(38) }}
            >
              {menuItems.map((item) => (
                <div key={item} className="flex justify-between items-center">
                  <Link
                    to={menuRoutes[item]}
                    className="text-black font-bold cursor-pointer fsm-[16]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </Link>
                </div>
              ))}
            </nav>
            <div>
              <button
                className="transition-transform duration-300 hover:scale-125"
                onClick={handleBookmarkClick}
              >
                <img
                  src="/src/bookmark.svg"
                  alt="Bookmark Icon"
                  style={{
                    height: fsm(20),
                    width: fsm(20),
                    marginTop: fsm(75),
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full h-full flex flex-col items-center justify-center p-6">
            <div
              className="font-bold font-cousine cursor-pointer mb-6"
              style={{ fontSize: isMobile ? fsm(25) : fs(25) }}
              onClick={handleHomeClick}
            >
              SUGAMO NAVI
            </div>
            <div className="flex justify-center mb-6">
              <div
                className="flex items-center justify-center rounded-full border-2 border-black overflow-hidden"
                style={{
                  width: isMobile ? fsm(300) : fs(600),
                  height: isMobile ? fsm(40) : fs(60),
                }}
              >
                <img
                  src="/src/icons8-search.gif"
                  alt="Search Icon"
                  style={{
                    height: isMobile ? fsm(19) : fs(25),
                    width: isMobile ? fsm(19) : fs(25),
                    marginLeft: isMobile ? fsm(20) : fs(30),
                  }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search shops..."
                  className="w-full h-full bg-transparent border-none focus:outline-none font-cousine font-bold pl-3"
                  style={{
                    fontSize: isMobile ? fsm(18) : fs(20),
                  }}
                />
              </div>
            </div>
            <ul
              className="space-y-2 bg-[#F7F7F7] text-center p-4 rounded-lg"
              style={{ width: isMobile ? fsm(300) : fs(500) }}
            >
              {loadingShops ? (
                <li className="text-gray-700">Loading shops...</li>
              ) : shopsError ? (
                <li className="text-red-500">{shopsError}</li>
              ) : filteredShops.length > 0 ? (
                filteredShops.map((shop) => (
                  <li
                    key={shop.id}
                    className="text-gray-700 cursor-pointer hover:bg-gray-200 p-2 rounded"
                    onClick={() => handleShopClick(shop.id, shop.name)}
                  >
                    {shop.name}
                  </li>
                ))
              ) : (
                <li className="text-gray-700">
                  {searchQuery ? 'No shops found' : 'Start typing to search shops...'}
                </li>
              )}
            </ul>
            <div className="mt-6">
              <button
                className="w-auto px-12 py-2 bg-black text-white rounded-3xl hover:bg-black transition-transform duration-300 hover:scale-105"
                onClick={() => setIsSearchOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;