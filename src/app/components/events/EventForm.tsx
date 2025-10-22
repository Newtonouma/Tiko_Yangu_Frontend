'use client';

import React, { useState, useRef } from 'react';
import styles from './EventForm.module.css';
import RichTextEditor from '../RichTextEditorWrapper';

export interface GroupTicket {
  id: number;
  name: string;
  memberCount: number;
  price: number;
}

export interface EventFormData {
  title: string;
  description: string;
  venue: string;
  location: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  // Multiple ticket types
  earlybirdPrice?: number;
  regularPrice: number;
  vipPrice?: number;
  vvipPrice?: number;
  atTheGatePrice?: number;
  // Group tickets (up to 4)
  groupTickets?: GroupTicket[];
  // Backward compatibility
  ticketPrice: number;
  images?: File[] | string[]; // Can be File objects (new uploads) or strings (existing URLs)
  existingImages?: string[]; // URLs of existing images to keep
  url?: string;
}

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: initialData.title || '',
    description: initialData.description || '',
    venue: initialData.venue || '',
    location: initialData.location || '',
    startDate: initialData.startDate || '',
    endDate: initialData.endDate || '',
    startTime: initialData.startTime || '',
    endTime: initialData.endTime || '',
    // Ticket prices
    earlybirdPrice: initialData.earlybirdPrice || undefined,
    regularPrice: initialData.regularPrice || 0,
    vipPrice: initialData.vipPrice || undefined,
    vvipPrice: initialData.vvipPrice || undefined,
    atTheGatePrice: initialData.atTheGatePrice || undefined,
    // Group tickets
    groupTickets: initialData.groupTickets || [],
    // Backward compatibility
    ticketPrice: initialData.regularPrice || initialData.ticketPrice || 0,
    url: initialData.url || '',
    images: []
  });

  // State to track display values for price inputs
  const [priceDisplayValues, setPriceDisplayValues] = useState({
    regularPrice: initialData.regularPrice && initialData.regularPrice > 0 ? `KSH ${Math.floor(initialData.regularPrice).toLocaleString()}` : '',
    earlybirdPrice: initialData.earlybirdPrice && initialData.earlybirdPrice > 0 ? `KSH ${Math.floor(initialData.earlybirdPrice).toLocaleString()}` : '',
    vipPrice: initialData.vipPrice && initialData.vipPrice > 0 ? `KSH ${Math.floor(initialData.vipPrice).toLocaleString()}` : '',
    vvipPrice: initialData.vvipPrice && initialData.vvipPrice > 0 ? `KSH ${Math.floor(initialData.vvipPrice).toLocaleString()}` : '',
    atTheGatePrice: initialData.atTheGatePrice && initialData.atTheGatePrice > 0 ? `KSH ${Math.floor(initialData.atTheGatePrice).toLocaleString()}` : ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize existing images when in edit mode
  React.useEffect(() => {
    if (isEdit && initialData.images && Array.isArray(initialData.images)) {
      // In edit mode, initialData.images contains URLs (strings)
      const imageUrls = initialData.images.filter(img => typeof img === 'string') as string[];
      setExistingImages(imageUrls);
    }
  }, [isEdit, initialData.images]);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);
    setFormData(prev => ({ ...prev, images: newFiles }));
  };

  const removeFile = (indexToRemove: number) => {
    const newFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
    setSelectedFiles(newFiles);
    setFormData(prev => ({ ...prev, images: newFiles }));
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeExistingImage = (indexToRemove: number) => {
    const newExistingImages = existingImages.filter((_, index) => index !== indexToRemove);
    setExistingImages(newExistingImages);
  };

  // Group ticket management functions
  const addGroupTicket = () => {
    if (formData.groupTickets && formData.groupTickets.length >= 4) {
      alert('Maximum 4 group tickets allowed');
      return;
    }

    const newGroupTicket: GroupTicket = {
      id: Date.now(), // Simple ID generation
      name: `Group ${(formData.groupTickets?.length || 0) + 1}`,
      memberCount: 2,
      price: 0
    };

    setFormData(prev => ({
      ...prev,
      groupTickets: [...(prev.groupTickets || []), newGroupTicket]
    }));
  };

  const updateGroupTicket = (id: number, field: keyof GroupTicket, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      groupTickets: prev.groupTickets?.map(ticket => 
        ticket.id === id ? { ...ticket, [field]: value } : ticket
      ) || []
    }));
  };

  const removeGroupTicket = (id: number) => {
    setFormData(prev => ({
      ...prev,
      groupTickets: prev.groupTickets?.filter(ticket => ticket.id !== id) || []
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData.description.trim() || formData.description === '<p></p>') {
      newErrors.description = 'Event description is required';
    }

    if (!formData.venue.trim()) {
      newErrors.venue = 'Venue is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    // Validate regular price (required)
    if (formData.regularPrice < 0) {
      newErrors.regularPrice = 'Regular price cannot be negative';
    } else if (formData.regularPrice === 0) {
      newErrors.regularPrice = 'Regular price is required';
    }

    // Validate optional ticket prices
    if (formData.earlybirdPrice !== undefined && formData.earlybirdPrice < 0) {
      newErrors.earlybirdPrice = 'Earlybird price cannot be negative';
    }
    if (formData.vipPrice !== undefined && formData.vipPrice < 0) {
      newErrors.vipPrice = 'VIP price cannot be negative';
    }
    if (formData.vvipPrice !== undefined && formData.vvipPrice < 0) {
      newErrors.vvipPrice = 'VVIP price cannot be negative';
    }
    if (formData.atTheGatePrice !== undefined && formData.atTheGatePrice < 0) {
      newErrors.atTheGatePrice = 'At the gate price cannot be negative';
    }

    // Backward compatibility
    if (formData.ticketPrice < 0) {
      newErrors.ticketPrice = 'Ticket price cannot be negative';
    } else if (formData.ticketPrice === 0) {
      newErrors.ticketPrice = 'Ticket price is required';
    }

    if (!isEdit && selectedFiles.length === 0) {
      newErrors.images = 'At least one event image is required';
    } else if (isEdit && selectedFiles.length === 0 && existingImages.length === 0) {
      newErrors.images = 'At least one event image is required';
    }

    // Validate that end date is not before start date
    if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
      newErrors.endDate = 'End date cannot be before start date';
    }

    // Validate that end time is after start time for same-day events
    if (formData.startDate && formData.endDate && formData.startDate === formData.endDate &&
        formData.startTime && formData.endTime && formData.endTime <= formData.startTime) {
      newErrors.endTime = 'End time must be after start time for same-day events';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Combine existing images (URLs) and new files for submission
      const submissionData = {
        ...formData,
        images: selectedFiles, // Only send new files to upload
        existingImages: existingImages // Send existing image URLs separately
      };
      await onSubmit(submissionData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className={styles.eventForm}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {isEdit ? 'Edit Event' : 'Create New Event'}
        </h2>
        <p className={styles.subtitle}>
          {isEdit ? 'Update your event details' : 'Fill in the details for your new event. All fields with * are required.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Event Images - Move to top */}
        <div className={styles.inputGroup}>
          <label htmlFor="images" className={styles.label}>
            Event Images *
          </label>
          <input
            id="images"
            name="images"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className={styles.fileInput}
            multiple
            accept="image/*"
            disabled={isLoading}
          />
          <div className={`${styles.fileInputLabel} ${errors.images ? styles.inputError : ''}`} onClick={() => fileInputRef.current?.click()}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {selectedFiles.length > 0 ? `${selectedFiles.length} new image(s) selected` : 'Choose Event Images'}
          </div>
          
          {/* Show existing images in edit mode */}
          {isEdit && existingImages.length > 0 && (
            <div className={styles.existingImagesSection}>
              <h4 className={styles.existingImagesTitle}>Current Images:</h4>
              <div className={styles.existingImagesList}>
                {existingImages.map((imageUrl, index) => (
                  <div key={index} className={styles.existingImageItem}>
                    <img 
                      src={imageUrl} 
                      alt={`Event image ${index + 1}`} 
                      className={styles.existingImagePreview}
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className={styles.removeFileButton}
                      disabled={isLoading}
                      title="Remove existing image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Show new selected files */}
          {selectedFiles.length > 0 && (
            <div className={styles.filePreview}>
              <h4 className={styles.newImagesTitle}>New Images:</h4>
              {selectedFiles.map((file, index) => (
                <div key={index} className={styles.fileItem}>
                  <span className={styles.fileName}>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className={styles.removeFileButton}
                    disabled={isLoading}
                    title="Remove new image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          {errors.images && <span className={styles.error}>{errors.images}</span>}
        </div>

        {/* Basic Information Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Event Information</h3>
          
          {/* Event Title */}
          <div className={styles.inputGroup}>
            <label htmlFor="title" className={styles.label}>
              Event Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
              placeholder="Enter event title"
              disabled={isLoading}
            />
            {errors.title && <span className={styles.error}>{errors.title}</span>}
          </div>

          {/* Event Description */}
          <div className={styles.inputGroup}>
            <label htmlFor="description" className={styles.label}>
              Description *
            </label>
            <RichTextEditor
              content={formData.description}
              onChange={(content) => {
                setFormData(prev => ({ ...prev, description: content }));
                if (errors.description) {
                  setErrors(prev => ({ ...prev, description: '' }));
                }
              }}
              placeholder="Describe your event in detail"
              className={errors.description ? 'border-red-500' : ''}
              editable={!isLoading}
            />
            {errors.description && <span className={styles.error}>{errors.description}</span>}
          </div>
        </div>

        {/* Location Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Location Details</h3>
          
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="venue" className={styles.label}>
                Venue *
              </label>
              <input
                id="venue"
                name="venue"
                type="text"
                value={formData.venue}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.venue ? styles.inputError : ''}`}
                placeholder="e.g., Main Hall, Conference Room"
                disabled={isLoading}
              />
              {errors.venue && <span className={styles.error}>{errors.venue}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="location" className={styles.label}>
                City/Location *
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.location ? styles.inputError : ''}`}
                placeholder="e.g., Nairobi, Mombasa"
                disabled={isLoading}
              />
              {errors.location && <span className={styles.error}>{errors.location}</span>}
            </div>
          </div>
        </div>

        {/* Date & Time Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Date & Time</h3>
          
          {/* Date Range */}
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="startDate" className={styles.label}>
                Start Date *
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.startDate ? styles.inputError : ''}`}
                disabled={isLoading}
              />
              {errors.startDate && <span className={styles.error}>{errors.startDate}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="endDate" className={styles.label}>
                End Date *
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.endDate ? styles.inputError : ''}`}
                disabled={isLoading}
              />
              {errors.endDate && <span className={styles.error}>{errors.endDate}</span>}
            </div>
          </div>

          {/* Time Range */}
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="startTime" className={styles.label}>
                Start Time *
              </label>
              <input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.startTime ? styles.inputError : ''}`}
                disabled={isLoading}
              />
              {errors.startTime && <span className={styles.error}>{errors.startTime}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="endTime" className={styles.label}>
                End Time *
              </label>
              <input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.endTime ? styles.inputError : ''}`}
                disabled={isLoading}
              />
              {errors.endTime && <span className={styles.error}>{errors.endTime}</span>}
            </div>
          </div>

          {/* Ticket Prices Section */}
          <div className={styles.ticketPricesSection}>
            <h4 className={styles.subsectionTitle}>Ticket Pricing</h4>
            <p className={styles.subsectionDescription}>
              Set prices for different ticket types. Regular price is required, others are optional.
            </p>
            
            <div className={styles.ticketPricesGrid}>
              {/* Regular Price - Required */}
              <div className={styles.inputGroup}>
                <label htmlFor="regularPrice" className={styles.label}>
                  Regular Price (KSH) *
                </label>
                <input
                  id="regularPrice"
                  name="regularPrice"
                  type="text"
                  value={priceDisplayValues.regularPrice}
                  onChange={(e) => {
                    // Update display value as user types
                    setPriceDisplayValues(prev => ({ ...prev, regularPrice: e.target.value }));
                    
                    // Extract numeric value from formatted string
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    const parsedValue = parseFloat(numericValue) || 0;
                    
                    // Update form data with numeric value
                    setFormData(prev => ({ 
                      ...prev, 
                      regularPrice: parsedValue,
                      ticketPrice: parsedValue // Update ticketPrice for backward compatibility
                    }));

                    // Clear errors
                    if (errors.regularPrice) {
                      setErrors(prev => ({ ...prev, regularPrice: '' }));
                    }
                  }}
                  onFocus={(e) => {
                    // Show raw number when focused for editing
                    if (formData.regularPrice > 0) {
                      const rawValue = formData.regularPrice.toString();
                      e.target.value = rawValue;
                      setPriceDisplayValues(prev => ({ ...prev, regularPrice: rawValue }));
                    }
                  }}
                  onBlur={(e) => {
                    // Show formatted value when not focused
                    const numericValue = parseFloat(e.target.value) || 0;
                    
                    // Update formData with the final value
                    setFormData(prev => ({ 
                      ...prev, 
                      regularPrice: numericValue,
                      ticketPrice: numericValue
                    }));
                    
                    const formattedValue = numericValue > 0 ? `KSH ${Math.floor(numericValue).toLocaleString()}` : '';
                    setPriceDisplayValues(prev => ({ ...prev, regularPrice: formattedValue }));
                  }}
                  className={`${styles.input} ${errors.regularPrice ? styles.inputError : ''}`}
                  disabled={isLoading}
                  placeholder="Enter regular ticket price"
                />
                {errors.regularPrice && <span className={styles.error}>{errors.regularPrice}</span>}
              </div>

              {/* Earlybird Price - Optional */}
              <div className={styles.inputGroup}>
                <label htmlFor="earlybirdPrice" className={styles.label}>
                  Earlybird Price (KSH)
                </label>
                <input
                  id="earlybirdPrice"
                  name="earlybirdPrice"
                  type="text"
                  value={priceDisplayValues.earlybirdPrice}
                  onChange={(e) => {
                    // Update display value as user types
                    setPriceDisplayValues(prev => ({ ...prev, earlybirdPrice: e.target.value }));
                    
                    // Extract numeric value from formatted string
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    const parsedValue = numericValue ? parseFloat(numericValue) : undefined;
                    
                    // Update form data
                    setFormData(prev => ({ 
                      ...prev, 
                      earlybirdPrice: parsedValue
                    }));

                    // Clear errors
                    if (errors.earlybirdPrice) {
                      setErrors(prev => ({ ...prev, earlybirdPrice: '' }));
                    }
                  }}
                  onFocus={(e) => {
                    // Show raw number when focused for editing
                    if (formData.earlybirdPrice && formData.earlybirdPrice > 0) {
                      const rawValue = formData.earlybirdPrice.toString();
                      e.target.value = rawValue;
                      setPriceDisplayValues(prev => ({ ...prev, earlybirdPrice: rawValue }));
                    }
                  }}
                  onBlur={(e) => {
                    // Show formatted value when not focused
                    const numericValue = parseFloat(e.target.value) || 0;
                    
                    // Update formData with the final value
                    setFormData(prev => ({ 
                      ...prev, 
                      earlybirdPrice: numericValue > 0 ? numericValue : undefined
                    }));
                    
                    const formattedValue = numericValue > 0 ? `KSH ${Math.floor(numericValue).toLocaleString()}` : '';
                    setPriceDisplayValues(prev => ({ ...prev, earlybirdPrice: formattedValue }));
                  }}
                  className={`${styles.input} ${errors.earlybirdPrice ? styles.inputError : ''}`}
                  disabled={isLoading}
                  placeholder="Optional earlybird price"
                />
                {errors.earlybirdPrice && <span className={styles.error}>{errors.earlybirdPrice}</span>}
              </div>

              {/* VIP Price - Optional */}
              <div className={styles.inputGroup}>
                <label htmlFor="vipPrice" className={styles.label}>
                  VIP Price (KSH)
                </label>
                <input
                  id="vipPrice"
                  name="vipPrice"
                  type="text"
                  value={formData.vipPrice && formData.vipPrice > 0 ? `KSH ${Math.floor(formData.vipPrice).toLocaleString()}` : ''}
                  onChange={(e) => {
                    // Extract numeric value from formatted string
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    const parsedValue = numericValue ? parseFloat(numericValue) : undefined;
                    
                    // Update form data
                    setFormData(prev => ({ 
                      ...prev, 
                      vipPrice: parsedValue
                    }));

                    // Clear errors
                    if (errors.vipPrice) {
                      setErrors(prev => ({ ...prev, vipPrice: '' }));
                    }
                  }}
                  onFocus={(e) => {
                    // Show raw number when focused for editing
                    if (formData.vipPrice && formData.vipPrice > 0) {
                      e.target.value = formData.vipPrice.toString();
                    }
                  }}
                  onBlur={(e) => {
                    // Show formatted value when not focused
                    const numericValue = parseFloat(e.target.value) || 0;
                    if (numericValue > 0) {
                      e.target.value = `KSH ${Math.floor(numericValue).toLocaleString()}`;
                    } else {
                      e.target.value = '';
                    }
                  }}
                  className={`${styles.input} ${errors.vipPrice ? styles.inputError : ''}`}
                  disabled={isLoading}
                  placeholder="Optional VIP price"
                />
                {errors.vipPrice && <span className={styles.error}>{errors.vipPrice}</span>}
              </div>

              {/* VVIP Price - Optional */}
              <div className={styles.inputGroup}>
                <label htmlFor="vvipPrice" className={styles.label}>
                  VVIP Price (KSH)
                </label>
                <input
                  id="vvipPrice"
                  name="vvipPrice"
                  type="text"
                  value={formData.vvipPrice && formData.vvipPrice > 0 ? `KSH ${Math.floor(formData.vvipPrice).toLocaleString()}` : ''}
                  onChange={(e) => {
                    // Extract numeric value from formatted string
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    const parsedValue = numericValue ? parseFloat(numericValue) : undefined;
                    
                    // Update form data
                    setFormData(prev => ({ 
                      ...prev, 
                      vvipPrice: parsedValue
                    }));

                    // Clear errors
                    if (errors.vvipPrice) {
                      setErrors(prev => ({ ...prev, vvipPrice: '' }));
                    }
                  }}
                  onFocus={(e) => {
                    // Show raw number when focused for editing
                    if (formData.vvipPrice && formData.vvipPrice > 0) {
                      e.target.value = formData.vvipPrice.toString();
                    }
                  }}
                  onBlur={(e) => {
                    // Show formatted value when not focused
                    const numericValue = parseFloat(e.target.value) || 0;
                    if (numericValue > 0) {
                      e.target.value = `KSH ${Math.floor(numericValue).toLocaleString()}`;
                    } else {
                      e.target.value = '';
                    }
                  }}
                  className={`${styles.input} ${errors.vvipPrice ? styles.inputError : ''}`}
                  disabled={isLoading}
                  placeholder="Optional VVIP price"
                />
                {errors.vvipPrice && <span className={styles.error}>{errors.vvipPrice}</span>}
              </div>

              {/* At the Gate Price - Optional */}
              <div className={styles.inputGroup}>
                <label htmlFor="atTheGatePrice" className={styles.label}>
                  At the Gate Price (KSH)
                </label>
                <input
                  id="atTheGatePrice"
                  name="atTheGatePrice"
                  type="text"
                  value={formData.atTheGatePrice && formData.atTheGatePrice > 0 ? `KSH ${Math.floor(formData.atTheGatePrice).toLocaleString()}` : ''}
                  onChange={(e) => {
                    // Extract numeric value from formatted string
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    const parsedValue = numericValue ? parseFloat(numericValue) : undefined;
                    
                    // Update form data
                    setFormData(prev => ({ 
                      ...prev, 
                      atTheGatePrice: parsedValue
                    }));

                    // Clear errors
                    if (errors.atTheGatePrice) {
                      setErrors(prev => ({ ...prev, atTheGatePrice: '' }));
                    }
                  }}
                  onFocus={(e) => {
                    // Show raw number when focused for editing
                    if (formData.atTheGatePrice && formData.atTheGatePrice > 0) {
                      e.target.value = formData.atTheGatePrice.toString();
                    }
                  }}
                  onBlur={(e) => {
                    // Show formatted value when not focused
                    const numericValue = parseFloat(e.target.value) || 0;
                    if (numericValue > 0) {
                      e.target.value = `KSH ${Math.floor(numericValue).toLocaleString()}`;
                    } else {
                      e.target.value = '';
                    }
                  }}
                  className={`${styles.input} ${errors.atTheGatePrice ? styles.inputError : ''}`}
                  disabled={isLoading}
                  placeholder="Optional at-the-gate price"
                />
                {errors.atTheGatePrice && <span className={styles.error}>{errors.atTheGatePrice}</span>}
              </div>
            </div>
          </div>

          {/* Group Tickets Section */}
          <div className={styles.ticketPricesSection}>
            <h4 className={styles.subsectionTitle}>Group Tickets</h4>
            <p className={styles.subsectionDescription}>
              Create group tickets for teams, families, or organizations. You can create up to 4 different group types.
            </p>
            <button
              type="button"
              onClick={addGroupTicket}
              className={styles.addGroupButton}
              disabled={isLoading || (formData.groupTickets && formData.groupTickets.length >= 4)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Group Ticket ({formData.groupTickets?.length || 0}/4)
            </button>

            {formData.groupTickets && formData.groupTickets.length > 0 && (
              <div className={styles.groupTicketsList}>
                {formData.groupTickets.map((groupTicket, index) => (
                  <div key={groupTicket.id} className={styles.groupTicketItem}>
                    <div className={styles.groupTicketHeader}>
                      <h5 className={styles.groupTicketTitle}>Group Ticket {index + 1}</h5>
                      <button
                        type="button"
                        onClick={() => removeGroupTicket(groupTicket.id)}
                        className={styles.removeGroupButton}
                        disabled={isLoading}
                        title="Remove group ticket"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className={styles.ticketPricesGrid}>
                      {/* Group Name */}
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Group Name</label>
                        <input
                          type="text"
                          value={groupTicket.name}
                          onChange={(e) => updateGroupTicket(groupTicket.id, 'name', e.target.value)}
                          className={styles.input}
                          placeholder="e.g., Family Pack, Team Bundle"
                          disabled={isLoading}
                        />
                      </div>

                      {/* Member Count */}
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Number of Members</label>
                        <input
                          type="number"
                          min="2"
                          max="50"
                          value={groupTicket.memberCount}
                          onChange={(e) => updateGroupTicket(groupTicket.id, 'memberCount', parseInt(e.target.value) || 2)}
                          className={styles.input}
                          disabled={isLoading}
                        />
                      </div>

                      {/* Group Price */}
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Group Price (KSH)</label>
                        <input
                          type="text"
                          value={groupTicket.price > 0 ? `KSH ${Math.floor(groupTicket.price).toLocaleString()}` : ''}
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(/[^0-9]/g, '');
                            const parsedValue = parseFloat(numericValue) || 0;
                            updateGroupTicket(groupTicket.id, 'price', parsedValue);
                          }}
                          onFocus={(e) => {
                            if (groupTicket.price > 0) {
                              e.target.value = groupTicket.price.toString();
                            }
                          }}
                          onBlur={(e) => {
                            const numericValue = parseFloat(e.target.value) || 0;
                            updateGroupTicket(groupTicket.id, 'price', numericValue);
                            if (numericValue > 0) {
                              e.target.value = `KSH ${Math.floor(numericValue).toLocaleString()}`;
                            } else {
                              e.target.value = '';
                            }
                          }}
                          className={styles.input}
                          placeholder="Enter group price"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {/* Group Ticket Preview */}
                    <div className={styles.groupTicketPreview}>
                      <div className={styles.previewLabel}>Preview:</div>
                      <div className={styles.previewContent}>
                        <span className={styles.previewName}>{groupTicket.name || 'Unnamed Group'}</span>
                        <span className={styles.previewDetails}>
                          {groupTicket.memberCount} members • KSH {Math.floor(groupTicket.price).toLocaleString()}
                          {groupTicket.price > 0 && (
                            <span className={styles.pricePerPerson}>
                              (KSH {Math.floor(groupTicket.price / groupTicket.memberCount).toLocaleString()} per person)
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Additional Information Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Additional Information</h3>
          
          {/* Optional URL */}
          <div className={styles.inputGroup}>
            <label htmlFor="url" className={styles.label}>
              Event Website/URL (Optional)
            </label>
            <input
              id="url"
              name="url"
              type="url"
              value={formData.url}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="https://example.com"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className={styles.actions}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEdit ? 'Update Event' : 'Create Event'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;