import { useLocation } from "@remix-run/react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

interface HeaderProps {}

const Navbar: React.FC<HeaderProps> = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<string>("Home");
  const [isProgramsDropdownOpen, setIsProgramsDropdownOpen] =
    useState<boolean>(false);
  const currentPage = useLocation();

  const programSubItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Emolog", path: "/emolog" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 50) {
        setIsScrolled(true);
      } else if (scrollPosition === 0) {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    const path = currentPage.pathname;
    if (path === "/") {
      setActiveItem("Home");
    } else {
      const matchedItem = navItems.find(
        (item) => path === `/${item.toLowerCase().replace(/\s+/g, "-")}`
      );
      if (matchedItem) setActiveItem(matchedItem);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentPage.pathname]);

  const navItems = ["Home", "About-Us", "Programs", "Login", "Register"];

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <li
          key={item}
          className={`relative group ${
            item === "Programs" ? "has-dropdown" : ""
          }`}
          onMouseEnter={() =>
            item === "Programs" && setIsProgramsDropdownOpen(true)
          }
          onMouseLeave={() =>
            item === "Programs" && setIsProgramsDropdownOpen(false)
          }
        >
          {item === "Programs" ? (
            <div
              className={`relative py-3 px-4 rounded-lg transition-all duration-300 flex items-center cursor-pointer
                ${
                  activeItem === item
                    ? "text-blue-600 font-bold bg-transparent"
                    : "hover:text-blue-600 hover:bg-transparent transform hover:scale-105"
                }`}
            >
              <span className="mr-2">{item}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  isProgramsDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              />

              {/* Modern Animated Dropdown Menu */}
              <div
                className={`absolute top-full left-0 mt-3 bg-white shadow-2xl rounded-xl min-w-[220px] z-50 border border-blue-100 overflow-hidden transition-all duration-500 transform ${
                  isProgramsDropdownOpen
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
                }`}
              >
                <div className="py-2">
                  {programSubItems.map((subItem, index) => (
                    <a
                      key={subItem.name}
                      href={subItem.path}
                      className="block px-6 py-3 hover:bg-gradient-to-r hover:from-sky-100 hover:to-blue-200 hover:text-blue-700 transition-all duration-300 transform hover:translate-x-1 border-l-4 border-transparent hover:border-blue-500"
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                      onClick={() => {
                        setActiveItem("Programs");
                        setIsProgramsDropdownOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-3 transition-transform duration-300 hover:scale-125"></div>
                        {subItem.name}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <a
              href={`${
                item === "Home"
                  ? "/"
                  : `/${item.toLowerCase().replace(/\s+/g, "-")}`
              }`}
              className={`py-3 px-4 rounded-lg transition-all duration-300 block transform hover:scale-105 relative overflow-hidden
                ${
                  activeItem === item
                    ? "text-blue-600 font-bold bg-transparent"
                    : "hover:text-blue-600 hover:bg-transparent"
                }`}
              onClick={() => {
                setActiveItem(item);
                setIsMobileMenuOpen(false);
              }}
            >
              {/* Animated underline */}
              <span className="relative z-10">{item}</span>
              <div
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-transform duration-300 ${
                  activeItem === item
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              ></div>
            </a>
          )}
        </li>
      ))}
    </>
  );

  const MobileNavLinks = () => (
    <>
      {navItems.map((item, index) => (
        <li
          key={item}
          className="px-4"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {item === "Programs" ? (
            <button
              className={`block w-full text-left py-4 px-5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                activeItem === item
                  ? "bg-gradient-to-r from-sky-100 to-blue-200 text-blue-700 shadow-lg"
                  : "hover:bg-gradient-to-r hover:from-sky-100 hover:to-blue-200 hover:text-blue-600 hover:shadow-md"
              }`}
              onClick={() => setIsProgramsDropdownOpen(!isProgramsDropdownOpen)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setIsProgramsDropdownOpen(!isProgramsDropdownOpen);
                }
              }}
              aria-expanded={isProgramsDropdownOpen}
              aria-haspopup="true"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{item}</span>
                <ChevronDown
                  className="w-5 h-5 transition-transform duration-300"
                  style={{
                    transform: isProgramsDropdownOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                />
              </div>

              {/* Mobile Animated Dropdown */}
              <div
                className={`overflow-hidden transition-all duration-500 ${
                  isProgramsDropdownOpen ? "max-h-96 mt-3" : "max-h-0"
                }`}
              >
                <div className="space-y-2">
                  {programSubItems.map((subItem, subIndex) => (
                    <a
                      key={subItem.name}
                      href={subItem.path}
                      className="block py-3 px-4 bg-gradient-to-r from-white to-sky-50 rounded-lg text-blue-700 hover:from-sky-100 hover:to-blue-100 transition-all duration-300 transform hover:translate-x-2 hover:shadow-md border-l-4 border-blue-300"
                      style={{
                        animationDelay: `${subIndex * 75}ms`,
                      }}
                      onClick={() => {
                        setActiveItem("Programs");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-3"></div>
                        {subItem.name}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </button>
          ) : (
            <a
              href={`${
                item === "Home"
                  ? "/"
                  : `/${item.toLowerCase().replace(/\s+/g, "-")}`
              }`}
              className={`block py-4 px-5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] font-semibold ${
                activeItem === item
                  ? "bg-gradient-to-r from-sky-100 to-blue-200 text-blue-700 shadow-lg"
                  : "hover:bg-gradient-to-r hover:from-sky-100 hover:to-blue-200 hover:text-blue-600 hover:shadow-md"
              }`}
              onClick={() => {
                setActiveItem(item);
                setIsMobileMenuOpen(false);
              }}
            >
              {item}
            </a>
          )}
        </li>
      ))}
    </>
  );

  return (
    <>
      {/* Modern Background Decoration */}
      <div className="fixed top-0 left-0 w-full h-32 bg-gradient-to-br from-sky-100/30 via-blue-200/20 to-purple-200/30 -z-10"></div>

      <div
        className={`w-full top-0 left-0 z-50 fixed h-16 md:h-20 flex justify-between items-center px-4 md:px-10 transition-all duration-500 backdrop-blur-md border-b border-blue-100/50
          ${
            isScrolled || isMobileMenuOpen
              ? "text-gray-800 bg-white shadow-xl"
              : "text-gray-800 bg-white shadow-lg"
          }`}
      >
        <div className="flex items-center">
          <h1 className="text-xl md:text-2xl font-bold transition-all duration-300 hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Men
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              Tora
            </span>
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex gap-2 font-semibold items-center">
            <NavLinks />
          </ul>
        </nav>

        {/* Modern Mobile Menu Button */}
        <button
          className="md:hidden text-2xl p-3 rounded-full bg-gradient-to-r from-sky-100 to-blue-200 hover:from-sky-200 hover:to-blue-300 transition-all duration-300 transform hover:scale-110 shadow-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="relative">
            {isMobileMenuOpen ? (
              <X className="text-blue-600 transition-transform duration-300 rotate-90" />
            ) : (
              <Menu className="text-blue-600 transition-transform duration-300" />
            )}
          </div>
        </button>
      </div>

      {/* Modern Mobile Menu Overlay with Blur Effect */}
      <button
        className={`fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-sky-900/20 backdrop-blur-sm z-40 transition-all duration-500 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setIsMobileMenuOpen(false)}
        aria-label="Close menu overlay"
        tabIndex={isMobileMenuOpen ? 0 : -1}
      />

      {/* Enhanced Mobile Menu */}
      <div
        className={`fixed right-0 top-0 w-80 bg-white h-full shadow-2xl z-50 transform transition-all duration-700 ease-out ${
          isMobileMenuOpen
            ? "translate-x-0 scale-100"
            : "translate-x-full scale-95"
        } rounded-l-3xl border-l border-blue-100`}
      >
        {/* Mobile Menu Header */}
        <div className="p-6 border-white flex justify-between items-center bg-white">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Men
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              Tora
            </span>
          </h1>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-full bg-white hover:bg-white transition-all duration-300 transform hover:scale-110 shadow-md"
          >
            <X className="text-blue-600" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="py-8 px-2">
          <ul className="flex flex-col gap-3 font-medium">
            <MobileNavLinks />
          </ul>
        </nav>

        {/* Mobile Menu Footer Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-white rounded-bl-3xl"></div>
      </div>

      <style>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .mobile-nav-item {
          animation: slideInFromRight 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Navbar;