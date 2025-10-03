'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import styles from './NavBar.module.css';

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const authDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // Close dropdown and mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (authDropdownRef.current && !authDropdownRef.current.contains(event.target as Node)) {
        setIsAuthDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleAuthDropdown = () => {
    setIsAuthDropdownOpen(!isAuthDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log('Search clicked');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <span className={styles.logoText}>TikoYangu</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className={styles.navLinks}>
          <button 
            className={styles.navLink}
            onClick={() => router.push('/events')}
          >
            Events
          </button>
          <button 
            className={styles.navLink}
            onClick={() => router.push('/support')}
          >
            Support
          </button>
        </div>

        {/* Right section with search and auth */}
        <div className={styles.rightSection}>
          {/* Mobile Menu Button */}
          <button 
            className={styles.mobileMenuButton}
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            <svg 
              className={styles.menuIcon}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
          {/* Search Icon */}
          <button 
            className={styles.searchButton}
            onClick={handleSearch}
            aria-label="Search"
          >
            <svg 
              className={styles.searchIcon}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </button>

          {/* Auth Section */}
          <div className={styles.authSection} ref={dropdownRef}>
            {isAuthenticated ? (
              <>
                <button 
                  className={styles.authButton}
                  onClick={toggleDropdown}
                  aria-label="Account menu"
                >
                  <div className={styles.userAvatar}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className={styles.userName}>{user?.name}</span>
                  <svg 
                    className={`${styles.chevronIcon} ${isDropdownOpen ? styles.chevronUp : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 9l-7 7-7-7" 
                    />
                  </svg>
                </button>

                {/* Authenticated Dropdown Menu */}
                {isDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <div className={styles.userInfo}>
                      <div className={styles.userInfoAvatar}>
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className={styles.userInfoText}>
                        <div className={styles.userInfoName}>{user?.name}</div>
                        <div className={styles.userInfoEmail}>{user?.email}</div>
                      </div>
                    </div>
                    <div className={styles.dropdownDivider}></div>
                    <button 
                      onClick={() => {
                        const dashboardPath = user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/organizer';
                        router.push(dashboardPath);
                        setIsDropdownOpen(false);
                      }}
                      className={styles.dropdownItem}
                    >
                      <svg 
                        className={styles.dropdownIcon}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" 
                        />
                      </svg>
                      Dashboard
                    </button>
                    <button 
                      onClick={() => {
                        router.push('/my-events');
                        setIsDropdownOpen(false);
                      }}
                      className={styles.dropdownItem}
                    >
                      <svg 
                        className={styles.dropdownIcon}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                        />
                      </svg>
                      My Events
                    </button>
                    <button 
                      onClick={() => {
                        router.push('/my-tickets');
                        setIsDropdownOpen(false);
                      }}
                      className={styles.dropdownItem}
                    >
                      <svg 
                        className={styles.dropdownIcon}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" 
                        />
                      </svg>
                      My Tickets
                    </button>
                    <button 
                      onClick={() => {
                        router.push('/profile');
                        setIsDropdownOpen(false);
                      }}
                      className={styles.dropdownItem}
                    >
                      <svg 
                        className={styles.dropdownIcon}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                        />
                      </svg>
                      Profile
                    </button>
                    <div className={styles.dropdownDivider}></div>
                    <button onClick={handleLogout} className={styles.dropdownItem}>
                      <svg 
                        className={styles.dropdownIcon}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                        />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.unauthSection} ref={authDropdownRef}>
                <button 
                  className={styles.authButton}
                  onClick={toggleAuthDropdown}
                  aria-label="Account menu"
                >
                  <div className={styles.userAvatar}>
                    <svg 
                      className={styles.userIcon}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                      />
                    </svg>
                  </div>
                  <span className={styles.userName}>Account</span>
                  <svg 
                    className={`${styles.chevronIcon} ${isAuthDropdownOpen ? styles.chevronUp : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 9l-7 7-7-7" 
                    />
                  </svg>
                </button>

                {/* Unauthenticated Dropdown Menu */}
                {isAuthDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <button 
                      onClick={() => {
                        handleLogin();
                        setIsAuthDropdownOpen(false);
                      }}
                      className={styles.dropdownItem}
                    >
                      <svg 
                        className={styles.dropdownIcon}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                        />
                      </svg>
                      Sign In
                    </button>
                    <button 
                      onClick={() => {
                        handleRegister();
                        setIsAuthDropdownOpen(false);
                      }}
                      className={styles.dropdownItem}
                    >
                      <svg 
                        className={styles.dropdownIcon}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" 
                        />
                      </svg>
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu} ref={mobileMenuRef}>
          <div className={styles.mobileMenuContent}>
            <button 
              className={styles.mobileNavLink}
              onClick={() => {
                router.push('/events');
                setIsMobileMenuOpen(false);
              }}
            >
              Events
            </button>
            <button 
              className={styles.mobileNavLink}
              onClick={() => {
                router.push('/support');
                setIsMobileMenuOpen(false);
              }}
            >
              Support
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;