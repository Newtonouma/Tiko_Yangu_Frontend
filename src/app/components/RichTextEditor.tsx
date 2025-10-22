import React from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import { ListItem } from '@tiptap/extension-list-item';
import styles from './RichTextEditor.module.css';
import {
  BoldIcon,
  ItalicIcon,
  CodeBracketIcon,
  ListBulletIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon
} from '@heroicons/react/24/outline';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = "Start typing...",
  className = "",
  editable = true
}) => {
  const editor: Editor | null = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: 'bullet-list',
          },
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: 'ordered-list',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'list-item',
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: 'paragraph',
          },
        },
        heading: {
          HTMLAttributes: {
            class: 'heading',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'blockquote',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'code-block',
          },
        },
      }),
      TextStyle,
      FontFamily,
      ListItem.configure({
        HTMLAttributes: {
          class: 'custom-list-item',
        },
      }),
    ],
    content: content,
    editable: editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `${styles.tiptap} ${className}`,
        spellcheck: 'true',
      },
      handleKeyDown: (view, event) => {
        // Handle Enter key in lists for better numbering
        if (event.key === 'Enter') {
          const { state } = view;
          const { selection } = state;
          const { $from } = selection;
          
          // Check if we're in a list
          if ($from.parent.type.name === 'listItem') {
            // If the list item is empty, exit the list
            if ($from.parent.textContent === '') {
              return editor?.chain().focus().liftListItem('listItem').run();
            }
          }
        }
        
        // Handle Tab key for indentation in lists
        if (event.key === 'Tab') {
          event.preventDefault();
          if (event.shiftKey) {
            return editor?.chain().focus().liftListItem('listItem').run();
          } else {
            return editor?.chain().focus().sinkListItem('listItem').run();
          }
        }
        
        return false;
      },
    },
  });

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive, 
    children, 
    title 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    children: React.ReactNode; 
    title: string;
  }) => (
    <button
      onClick={onClick}
      className={`${styles.toolbarButton} ${isActive ? styles.toolbarButtonActive : ''}`}
      style={{
        padding: '0.5rem',
        borderRadius: '0.25rem',
        background: isActive ? '#dbeafe' : 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: isActive ? '#2563eb' : '#6b7280',
        transition: 'all 0.2s'
      }}
      title={title}
      type="button"
    >
      {children}
    </button>
  );

  if (!editable) {
    return (
      <div className={`${styles.tiptap} ${className}`}>
        <EditorContent editor={editor} />
      </div>
    );
  }

  return (
    <div 
      className={styles.editorContainer}
      style={{
        border: '1px solid #d1d5db',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        width: '100%'
      }}
    >
      {/* Toolbar */}
      <div 
        className={styles.toolbar}
        style={{
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          padding: '0.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.25rem',
          width: '100%'
        }}
      >
        {/* Undo/Redo */}
        <div 
          className={styles.toolbarSection}
          style={{
            display: 'flex',
            gap: '0.25rem',
            borderRight: '1px solid #d1d5db',
            paddingRight: '0.5rem',
            marginRight: '0.5rem'
          }}
        >
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            isActive={false}
            title="Undo (Ctrl+Z)"
          >
            <ArrowUturnLeftIcon style={{ width: '1rem', height: '1rem' }} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            isActive={false}
            title="Redo (Ctrl+Y)"
          >
            <ArrowUturnRightIcon style={{ width: '1rem', height: '1rem' }} />
          </ToolbarButton>
        </div>
        
        {/* Text Formatting */}
        <div 
          className={styles.toolbarSection}
          style={{
            display: 'flex',
            gap: '0.25rem',
            borderRight: '1px solid #d1d5db',
            paddingRight: '0.5rem',
            marginRight: '0.5rem'
          }}
        >
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold (Ctrl+B)"
          >
            <BoldIcon style={{ width: '1rem', height: '1rem' }} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic (Ctrl+I)"
          >
            <ItalicIcon style={{ width: '1rem', height: '1rem' }} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Strikethrough"
          >
            <span style={{ fontSize: '0.875rem', fontWeight: 'bold', textDecoration: 'line-through' }}>S</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Inline Code"
          >
            <CodeBracketIcon style={{ width: '1rem', height: '1rem' }} />
          </ToolbarButton>
        </div>

        {/* Headings */}
        <div 
          className={styles.toolbarSection}
          style={{
            display: 'flex',
            gap: '0.25rem',
            borderRight: '1px solid #d1d5db',
            paddingRight: '0.5rem',
            marginRight: '0.5rem'
          }}
        >
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>H1</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>H2</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>H3</span>
          </ToolbarButton>
        </div>

        {/* Lists */}
        <div 
          className={styles.toolbarSection}
          style={{
            display: 'flex',
            gap: '0.25rem',
            borderRight: '1px solid #d1d5db',
            paddingRight: '0.5rem',
            marginRight: '0.5rem'
          }}
        >
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <ListBulletIcon style={{ width: '1rem', height: '1rem' }} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>1.</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
            isActive={false}
            title="Increase Indent (Tab)"
          >
            <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>→</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().liftListItem('listItem').run()}
            isActive={false}
            title="Decrease Indent (Shift+Tab)"
          >
            <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>←</span>
          </ToolbarButton>
        </div>

        {/* Block Formatting */}
        <div 
          className={styles.toolbarSection}
          style={{
            display: 'flex',
            gap: '0.25rem'
          }}
        >
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote"
          >
            <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>"</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
            title="Code Block"
          >
            <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>&lt;/&gt;</span>
          </ToolbarButton>
        </div>
      </div>

      {/* Editor Content */}
      <div 
        className={styles.editorContent}
        style={{
          padding: '1rem',
          minHeight: '200px',
          backgroundColor: '#1f2937',
          color: '#ffffff',
          width: '100%',
          border: 'none',
          outline: 'none'
        }}
      >
        <EditorContent 
          editor={editor} 
          placeholder={placeholder}
        />
      </div>
      
      {/* Help Text */}
      <div 
        className={styles.helpText}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#f9fafb',
          borderTop: '1px solid #e5e7eb',
          fontSize: '0.75rem',
          color: '#6b7280',
          textAlign: 'center'
        }}
      >
        <span>💡 Tips: Use Tab/Shift+Tab to indent/outdent lists • Ctrl+B for bold • Ctrl+I for italic • Enter twice to exit lists</span>
      </div>
    </div>
  );
};

export default RichTextEditor;