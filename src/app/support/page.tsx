'use client';

import { useState } from 'react';
import NavBar from '../components/navbar/NavBar';
import Footer from '../components/footer/Footer';
import styles from './support.module.css';

const SupportPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement support form submission
    console.log('Support form submitted:', formData);
    alert('Thank you for your message. We will get back to you soon!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={styles.pageContainer}>
      <NavBar />
      <main className={styles.main}>
        {/* Header Section */}
        <section className={styles.header}>
          <div className={styles.container}>
            <div className={styles.headerContent}>
              <h1 className={styles.title}>Support Center</h1>
              <p className={styles.subtitle}>
                We're here to help. Get in touch with our support team for any questions or assistance.
              </p>
            </div>
          </div>
        </section>

        {/* Support Content */}
        <section className={styles.content}>
          <div className={styles.container}>
            <div className={styles.supportGrid}>
              {/* Contact Form */}
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Send us a message</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={styles.input}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={styles.input}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="subject" className={styles.label}>Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={styles.select}
                      required
                    >
                      <option value="">Select a topic</option>
                      <option value="general">General Question</option>
                      <option value="technical">Technical Issue</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="events">Event Management</option>
                      <option value="account">Account Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="message" className={styles.label}>Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className={styles.textarea}
                      rows={5}
                      required
                    />
                  </div>
                  <button type="submit" className={styles.submitButton}>
                    Send Message
                  </button>
                </form>
              </div>

              {/* Support Info */}
              <div className={styles.infoSection}>
                <h2 className={styles.sectionTitle}>Other ways to reach us</h2>
                <div className={styles.supportOptions}>
                  <div className={styles.supportOption}>
                    <div className={styles.optionIcon}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className={styles.optionTitle}>Email Support</h3>
                      <p className={styles.optionText}>support@tikoyangu.com</p>
                      <p className={styles.optionSubtext}>We typically respond within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className={styles.supportOption}>
                    <div className={styles.optionIcon}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className={styles.optionTitle}>Business Hours</h3>
                      <p className={styles.optionText}>Monday - Friday: 9AM - 6PM EAT</p>
                      <p className={styles.optionSubtext}>Weekend support available for urgent issues</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SupportPage;