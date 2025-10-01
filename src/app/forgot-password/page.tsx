'use client';

import { useRouter } from 'next/navigation';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import styles from './auth.module.css';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const handleSwitchToLogin = () => {
    router.push('/login');
  };

  const handleClose = () => {
    router.push('/');
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.backButton}>
          <button onClick={handleClose} className={styles.backBtn}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m0 7h18" />
            </svg>
            Back to Home
          </button>
        </div>
        
        <div className={styles.formContainer}>
          <ForgotPasswordForm
            onSwitchToLogin={handleSwitchToLogin}
            onClose={handleClose}
          />
        </div>
      </div>
    </div>
  );
}