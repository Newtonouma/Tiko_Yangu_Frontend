'use client';

import React, { useEffect, useState } from 'react';
import { 
  CalendarDaysIcon,
  UserGroupIcon,
  MapPinIcon,
  StarIcon,
  TicketIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import './StatisticsSection.css';

interface StatisticItem {
  id: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  value: number;
  label: string;
  description: string;
  color: string;
  suffix?: string;
  prefix?: string;
}

const StatisticsSection: React.FC = () => {
  const [animatedValues, setAnimatedValues] = useState<{ [key: string]: number }>({});
  const [isVisible, setIsVisible] = useState(false);

  // Static statistics data - replace with API calls in production
  const statistics: StatisticItem[] = [
    {
      id: 'events',
      icon: CalendarDaysIcon,
      value: 2500,
      label: 'Events Hosted',
      description: 'Successful events organized',
      color: 'indigo',
      suffix: '+'
    },
    {
      id: 'attendees',
      icon: UserGroupIcon,
      value: 150000,
      label: 'Happy Attendees',
      description: 'People who enjoyed our events',
      color: 'green',
      suffix: '+'
    },
    {
      id: 'cities',
      icon: MapPinIcon,
      value: 45,
      label: 'Cities Covered',
      description: 'Locations across the country',
      color: 'blue'
    },
    {
      id: 'rating',
      icon: StarIcon,
      value: 4.9,
      label: 'Average Rating',
      description: 'Customer satisfaction score',
      color: 'yellow'
    },
    {
      id: 'tickets',
      icon: TicketIcon,
      value: 500000,
      label: 'Tickets Sold',
      description: 'Total tickets distributed',
      color: 'purple',
      suffix: '+'
    },
    {
      id: 'partners',
      icon: CurrencyDollarIcon,
      value: 350,
      label: 'Event Partners',
      description: 'Trusted business partners',
      color: 'emerald',
      suffix: '+'
    }
  ];

  // Initialize animated values
  useEffect(() => {
    const initialValues: { [key: string]: number } = {};
    statistics.forEach(stat => {
      initialValues[stat.id] = 0;
    });
    setAnimatedValues(initialValues);
  }, []);

  // Intersection Observer for triggering animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('statistics-section');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, [isVisible]);

  // Counter animation function
  const animateCounters = () => {
    statistics.forEach(stat => {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = stat.value / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const currentValue = Math.min(increment * currentStep, stat.value);
        
        setAnimatedValues(prev => ({
          ...prev,
          [stat.id]: currentValue
        }));

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, duration / steps);
    });
  };

  // Format number for display
  const formatNumber = (value: number, stat: StatisticItem) => {
    let formattedValue: string;
    
    if (stat.id === 'rating') {
      formattedValue = value.toFixed(1);
    } else if (value >= 1000000) {
      formattedValue = (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      formattedValue = (value / 1000).toFixed(0) + 'K';
    } else {
      formattedValue = Math.floor(value).toString();
    }

    return `${stat.prefix || ''}${formattedValue}${stat.suffix || ''}`;
  };

  // Get color classes based on color name
  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { bg: string; text: string; border: string; } } = {
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
      green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
      yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
      emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' }
    };
    return colorMap[color] || colorMap.indigo;
  };

  return (
    <section id="statistics-section" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            See how we've been creating memorable experiences and bringing people together 
            through amazing events across the country.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {statistics.map((stat) => {
            const IconComponent = stat.icon;
            const colorClasses = getColorClasses(stat.color);
            
            return (
              <div
                key={stat.id}
                className="statistic-card bg-white rounded-lg p-6 text-center border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${colorClasses.bg} ${colorClasses.border} border mb-4`}>
                  <IconComponent className={`h-6 w-6 ${colorClasses.text}`} />
                </div>
                
                {/* Value */}
                <div className="mb-2">
                  <span className="counter-value text-2xl lg:text-3xl font-bold text-gray-900">
                    {formatNumber(animatedValues[stat.id] || 0, stat)}
                  </span>
                </div>
                
                {/* Label */}
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {stat.label}
                </h3>
                
                {/* Description */}
                <p className="text-xs text-gray-500 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-4">
            Ready to be part of our growing community?
          </p>
          <a 
            href="/events" 
            className="inline-flex items-center px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <CalendarDaysIcon className="h-5 w-5 mr-2" />
            Explore Events
          </a>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;