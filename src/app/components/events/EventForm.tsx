'use client';

import React, { useState, useRef } from 'react';
import styles from './EventForm.module.css';

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
    // Backward compatibility
    ticketPrice: initialData.regularPrice || initialData.ticketPrice || 0,
    url: initialData.url || '',
    images: []
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData.description.trim()) {
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
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
              placeholder="Describe your event in detail"
              rows={4}
              disabled={isLoading}
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
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.regularPrice}
                  onChange={(e) => {
                    handleInputChange(e);
                    // Update ticketPrice for backward compatibility
                    setFormData(prev => ({ ...prev, ticketPrice: parseFloat(e.target.value) || 0 }));
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
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.earlybirdPrice || ''}
                  onChange={handleInputChange}
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
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.vipPrice || ''}
                  onChange={handleInputChange}
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
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.vvipPrice || ''}
                  onChange={handleInputChange}
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
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.atTheGatePrice || ''}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.atTheGatePrice ? styles.inputError : ''}`}
                  disabled={isLoading}
                  placeholder="Optional at-the-gate price"
                />
                {errors.atTheGatePrice && <span className={styles.error}>{errors.atTheGatePrice}</span>}
              </div>
            </div>
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