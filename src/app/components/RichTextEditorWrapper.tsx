'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamic import of RichTextEditor to prevent SSR issues
const RichTextEditorComponent = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 rounded-lg p-4 min-h-[200px] bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500">Loading editor...</div>
    </div>
  )
});

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

const RichTextEditorWrapper: React.FC<RichTextEditorProps> = (props) => {
  return <RichTextEditorComponent {...props} />;
};

export default RichTextEditorWrapper;