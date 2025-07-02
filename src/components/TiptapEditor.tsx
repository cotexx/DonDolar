import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import React, { useEffect } from 'react';
import {
  Bold, Italic, Strikethrough, Code, List, ListOrdered,
  Quote, Undo, Redo, Heading1, Heading2, Heading3,
  Link as LinkIcon, Unlink, Eraser, Image as ImageIcon
} from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 hover:text-blue-600 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'w-full h-32 sm:h-40 md:h-60 object-cover rounded-lg shadow-lg my-4',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('URL de la imagen:');
    
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const MenuButton = ({ 
    onClick, 
    active = false,
    disabled = false,
    children 
  }: { 
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg transition-colors ${
        active 
          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
      } ${
        disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : ''
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      <div className="border-b border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-800 flex flex-wrap gap-1">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
        >
          <Bold className="w-5 h-5" />
        </MenuButton>
        
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
        >
          <Italic className="w-5 h-5" />
        </MenuButton>
        
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
        >
          <Strikethrough className="w-5 h-5" />
        </MenuButton>
        
        <MenuButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
        >
          <Code className="w-5 h-5" />
        </MenuButton>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
        >
          <Heading1 className="w-5 h-5" />
        </MenuButton>
        
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
        >
          <Heading2 className="w-5 h-5" />
        </MenuButton>
        
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
        >
          <Heading3 className="w-5 h-5" />
        </MenuButton>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
        >
          <List className="w-5 h-5" />
        </MenuButton>
        
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
        >
          <ListOrdered className="w-5 h-5" />
        </MenuButton>
        
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
        >
          <Quote className="w-5 h-5" />
        </MenuButton>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        <MenuButton onClick={setLink} active={editor.isActive('link')}>
          <LinkIcon className="w-5 h-5" />
        </MenuButton>
        
        <MenuButton
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive('link')}
        >
          <Unlink className="w-5 h-5" />
        </MenuButton>

        <MenuButton onClick={addImage}>
          <ImageIcon className="w-5 h-5" />
        </MenuButton>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().clearNodes().clearContent().run()}
        >
          <Eraser className="w-5 h-5" />
        </MenuButton>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="w-5 h-5" />
        </MenuButton>
        
        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="w-5 h-5" />
        </MenuButton>
      </div>

      <EditorContent 
        editor={editor} 
        className="prose prose-sm sm:prose lg:prose-lg max-w-none dark:prose-invert p-4 min-h-[200px] bg-white dark:bg-gray-800 focus:outline-none"
      />
    </div>
  );
};

export default TiptapEditor;