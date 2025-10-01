'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './HeroSection.module.css'

// Sample data for hero slides
const heroSlides = [
  {
    id: 1,
    image: '/images/heros/1.jpg',
    title: 'Discover Amazing Events',
    description: 'Find and book tickets for concerts, festivals, sports events, and more. Your next unforgettable experience is just a click away.'
  },
  {
    id: 2,
    image: '/images/heros/2.jpg',
    title: 'Premium Event Experiences',
    description: 'Access exclusive events and VIP experiences. Get the best seats, backstage passes, and special perks for your favorite events.'
  },
  {
    id: 3,
    image: '/images/heros/3.jpg',
    title: 'Book with Confidence',
    description: 'Secure booking, instant confirmations, and reliable customer support. We make event booking simple and trustworthy.'
  },
  {
    id: 4,
    image: '/images/heros/4.jpg',
    title: 'Events Near You',
    description: 'Explore local and international events happening in your city. From intimate gatherings to massive festivals, find it all here.'
  }
]

// Event ticket booking vocabulary
const vocabularyWords = [
  'Concerts', 'Festivals', 'Sports', 'Theater', 'Comedy', 'Music', 
  'Live Events', 'Tickets', 'Booking', 'Venues', 'Artists', 'Shows',
  'VIP Access', 'Front Row', 'Backstage', 'Premium', 'Early Bird', 'Limited',
  'Sold Out', 'Available', 'Reserve', 'Instant', 'Secure', 'Verified',
  'Experience', 'Memorable', 'Exclusive', 'Popular', 'Trending', 'Hot',
  'Entertainment', 'Performance', 'Stadium', 'Arena', 'Club', 'Outdoor',
  'Weekend', 'Tonight', 'Tomorrow', 'Season', 'Tour', 'Special'
]

// Split words into two rows
const row1Words = vocabularyWords.slice(0, Math.ceil(vocabularyWords.length / 2))
const row2Words = vocabularyWords.slice(Math.ceil(vocabularyWords.length / 2))

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [previousSlide, setPreviousSlide] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setPreviousSlide(currentSlide)
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
      
      // Reset transition state after animation completes
      setTimeout(() => setIsTransitioning(false), 1000)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [currentSlide])

  // Text carousel setup
  useEffect(() => {
    setMounted(true)
    // Check for dark mode preference
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDark(isDarkMode)
  }, [])

  return (
    <section className={styles.heroSection}>
      {/* Background Images */}
      <div className={styles.backgroundContainer}>
        {heroSlides.map((slide, index) => {
          let slideClass = styles.slideHidden
          
          if (index === currentSlide) {
            slideClass = styles.slideVisible
          } else if (index === previousSlide && isTransitioning) {
            slideClass = styles.slideExiting
          }
          
          return (
            <div
              key={slide.id}
              className={`${styles.slide} ${slideClass}`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className={styles.backgroundImage}
                priority={index === 0}
              />
              {/* Dark overlay for better text readability */}
              <div className={styles.overlay} />
            </div>
          )
        })}
      </div>

      {/* Content positioned at bottom left */}
      <div className={styles.content}>
        <div className={styles.contentContainer}>
          <h1 className={styles.title}>
            {heroSlides[currentSlide].title}
          </h1>
          <p className={styles.description}>
            {heroSlides[currentSlide].description}
          </p>
          
          {/* Call to action buttons */}
          <div className={styles.buttonContainer}>
            <button className={styles.primaryButton}>
              Explore Events
            </button>
            <button className={styles.secondaryButton}>
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className={styles.indicators}>
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (index !== currentSlide && !isTransitioning) {
                setIsTransitioning(true)
                setPreviousSlide(currentSlide)
                setCurrentSlide(index)
                setTimeout(() => setIsTransitioning(false), 1000)
              }
            }}
            aria-label={`Go to slide ${index + 1}`}
            className={`${styles.indicator} ${
              index === currentSlide ? styles.indicatorActive : styles.indicatorInactive
            }`}
          />
        ))}
      </div>

      {/* Text Carousel - integrated into hero */}
      {mounted && (
        <div className={`${styles.textCarousel} ${isDark ? styles.dark : ''}`}>
          {/* First row - moving right to left */}
          <div className={styles.carouselRow}>
            <div className={`${styles.scrollContainer} ${styles.scrollLeft}`}>
              {/* Duplicate the array to create seamless loop */}
              {[...row1Words, ...row1Words].map((word, index) => (
                <span
                  key={`row1-${index}`}
                  className={styles.word}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>

          {/* Second row - moving left to right */}
          <div className={styles.carouselRow}>
            <div className={`${styles.scrollContainer} ${styles.scrollRight}`}>
              {/* Duplicate the array to create seamless loop */}
              {[...row2Words, ...row2Words].map((word, index) => (
                <span
                  key={`row2-${index}`}
                  className={`${styles.word} ${styles.wordRow2}`}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}