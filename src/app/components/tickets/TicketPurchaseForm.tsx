// Ticket Purchase Form Component
'use client';

import React, { useState, useEffect } from 'react';
import { ticketService, TicketPurchaseData } from '../../services/ticketService';
import { Event, getAvailableTicketTypes, TicketTypeInfo } from '../../services/eventService';
import styles from './TicketPurchaseForm.module.css';

interface TicketPurchaseFormProps {
  eventId: number;
  eventTitle: string;
  event: Event; // Add event data to get ticket types and prices
  onClose: () => void;
  onSuccess?: (ticket: any) => void;
}

interface FormData {
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  ticketType: string;
  price: number;
}

interface FormErrors {
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  ticketType?: string;
  price?: string;
}

export default function TicketPurchaseForm({ 
  eventId, 
  eventTitle, 
  event,
  onClose, 
  onSuccess 
}: TicketPurchaseFormProps) {
  // Get available ticket types from the event
  const availableTicketTypes = getAvailableTicketTypes(event);
  const defaultTicketType = availableTicketTypes[0]; // First available ticket type

  const [formData, setFormData] = useState<FormData>({
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    ticketType: defaultTicketType?.name || 'Regular',
    price: Math.floor(defaultTicketType?.price || event.regularPrice || event.ticketPrice || 0)
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Convert ticket types for the form
  const ticketTypes = availableTicketTypes.map(ticket => ({
    value: ticket.name,
    label: ticket.name,
    price: Math.floor(ticket.price),
    type: ticket.type
  }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.buyerName.trim()) {
      newErrors.buyerName = 'Name is required';
    }

    if (!formData.buyerEmail.trim()) {
      newErrors.buyerEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.buyerEmail)) {
      newErrors.buyerEmail = 'Please enter a valid email address';
    }

    if (!formData.buyerPhone.trim()) {
      newErrors.buyerPhone = 'Phone number is required';
    } else if (!/^(?:254|0)[17][0-9]{8}$/.test(formData.buyerPhone.replace(/\s+/g, ''))) {
      newErrors.buyerPhone = 'Please enter a valid Kenyan phone number (e.g., 0712345678 or 254712345678)';
    }

    if (!formData.ticketType) {
      newErrors.ticketType = 'Please select a ticket type';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'ticketType') {
      const selectedType = ticketTypes.find(type => type.value === value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        price: selectedType?.price || 500
      }));
    } else if (name === 'price') {
      setFormData(prev => ({
        ...prev,
        [name]: Number(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Format phone number for M-Pesa (ensure it starts with 254)
      let formattedPhone = formData.buyerPhone.replace(/\s+/g, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.substring(1);
      }

      const purchaseData: TicketPurchaseData = {
        event: eventId,
        buyerName: formData.buyerName.trim(),
        buyerEmail: formData.buyerEmail.trim(),
        buyerPhone: formattedPhone,
        ticketType: formData.ticketType,
        price: formData.price
      };

      const result = await ticketService.purchaseTicket(purchaseData);
      
      // Show success message
      alert(`Ticket purchased successfully! 
      
M-Pesa Payment Details:
- Merchant Request ID: ${result.mpesa.MerchantRequestID}
- Checkout Request ID: ${result.mpesa.CheckoutRequestID}
- Response: ${result.mpesa.CustomerMessage}

Please complete the payment on your phone. You will receive an SMS confirmation when payment is complete.

Ticket Details:
- Event: ${eventTitle}
- Type: ${formData.ticketType}
- Price: KES ${formData.price.toLocaleString()}
- QR Code: ${result.ticket.qrCode}`);

      if (onSuccess) {
        onSuccess(result.ticket);
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to purchase ticket:', error);
      alert(`Failed to purchase ticket: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Purchase Ticket</h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close ticket purchase form"
            title="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.eventInfo}>
            <h3 className={styles.eventTitle}>{eventTitle}</h3>
            <p className={styles.eventNote}>Complete your ticket purchase below. Payment will be processed through M-Pesa.</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="buyerName" className={styles.label}>
                Full Name *
              </label>
              <input
                type="text"
                id="buyerName"
                name="buyerName"
                value={formData.buyerName}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.buyerName ? styles.inputError : ''}`}
                placeholder="Enter your full name"
                disabled={isLoading}
              />
              {errors.buyerName && <span className={styles.error}>{errors.buyerName}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="buyerEmail" className={styles.label}>
                Email Address *
              </label>
              <input
                type="email"
                id="buyerEmail"
                name="buyerEmail"
                value={formData.buyerEmail}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.buyerEmail ? styles.inputError : ''}`}
                placeholder="Enter your email address"
                disabled={isLoading}
              />
              {errors.buyerEmail && <span className={styles.error}>{errors.buyerEmail}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="buyerPhone" className={styles.label}>
                Phone Number (M-Pesa) *
              </label>
              <input
                type="tel"
                id="buyerPhone"
                name="buyerPhone"
                value={formData.buyerPhone}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.buyerPhone ? styles.inputError : ''}`}
                placeholder="0712345678 or 254712345678"
                disabled={isLoading}
              />
              {errors.buyerPhone && <span className={styles.error}>{errors.buyerPhone}</span>}
              <small className={styles.helpText}>This number will be used for M-Pesa payment</small>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="ticketType" className={styles.label}>
                  Ticket Type *
                </label>
                <select
                  id="ticketType"
                  name="ticketType"
                  value={formData.ticketType}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.ticketType ? styles.inputError : ''}`}
                  disabled={isLoading}
                >
                  {ticketTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label} - KSH {type.price.toLocaleString()}
                    </option>
                  ))}
                </select>
                {errors.ticketType && <span className={styles.error}>{errors.ticketType}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="price" className={styles.label}>
                  Price (KSH) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
                  min="1"
                  disabled={isLoading}
                />
                {errors.price && <span className={styles.error}>{errors.price}</span>}
              </div>
            </div>

            <div className={styles.priceDisplay}>
              <div className={styles.ticketSummary}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Event:</span>
                  <span className={styles.summaryValue}>{eventTitle}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Ticket Type:</span>
                  <span className={styles.summaryValue}>{formData.ticketType}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Price:</span>
                  <span className={styles.summaryValue}>KSH {formData.price.toLocaleString()}</span>
                </div>
              </div>
              <div className={styles.totalPrice}>
                Total: KSH {formData.price.toLocaleString()}
              </div>
              <small className={styles.paymentNote}>
                Payment will be processed securely through M-Pesa. You will receive a payment prompt on your phone.
              </small>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                onClick={onClose}
                className={styles.cancelButton}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className={styles.spinner}></div>
                    Processing...
                  </>
                ) : (
                  'Purchase Ticket'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}