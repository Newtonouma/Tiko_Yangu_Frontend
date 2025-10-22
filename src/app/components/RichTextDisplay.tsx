import React from 'react';
import styles from './RichTextDisplay.module.css';

interface RichTextDisplayProps {
  content: string;
  className?: string;
}

const RichTextDisplay: React.FC<RichTextDisplayProps> = ({ 
  content, 
  className = "" 
}) => {
  return (
    <div 
      className={`${styles.richTextDisplay} ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default RichTextDisplay;