'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../auth/AuthModal';
import styles from './NavBar.module.css';

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'register'>('login');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
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

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log('Search clicked');
  };

  const handleLogin = () => {
    setAuthModalView('login');
    setIsAuthModalOpen(true);
  };

  const handleRegister = () => {
    setAuthModalView('register');
    setIsAuthModalOpen(true);
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

        {/* Right section with search and auth */}
        <div className={styles.rightSection}>
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
                    <a href="/dashboard" className={styles.dropdownItem}>
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
                    </a>
                    <a href="/my-events" className={styles.dropdownItem}>
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
                    </a>
                    <a href="/my-tickets" className={styles.dropdownItem}>
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
                    </a>
                    <a href="/profile" className={styles.dropdownItem}>
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
                    </a>
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
              <>
                <button
                  className={styles.loginButton}
                  onClick={handleLogin}
                >
                  Sign In
                </button>
                <button
                  className={styles.registerButton}
                  onClick={handleRegister}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView={authModalView}
      />
    </nav>
  );
};

export default NavBar;