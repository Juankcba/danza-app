'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

const MenuButton = ({
    onClick,
    active,
    children,
}: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
}) => (
    <button
        type="button"
        onClick={onClick}
        className={`px-2 py-1 rounded text-sm cursor-pointer transition-colors ${active
                ? 'bg-pink-500/20 text-pink-400'
                : 'text-foreground/60 hover:bg-default-100 hover:text-foreground'
            }`}
    >
        {children}
    </button>
);

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Placeholder.configure({
                placeholder: placeholder || 'Escribí la descripción...',
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class:
                    'prose prose-invert prose-sm max-w-none min-h-[120px] px-4 py-3 outline-none text-foreground',
            },
        },
    });

    if (!editor) return null;

    return (
        <div className="rounded-xl border border-default-200 bg-default-100/50 overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 px-3 py-2 border-b border-default-200 bg-default-50/50">
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive('bold')}
                >
                    <strong>B</strong>
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive('italic')}
                >
                    <em>I</em>
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    active={editor.isActive('underline')}
                >
                    <span className="underline">U</span>
                </MenuButton>
                <span className="w-px bg-default-200 mx-1" />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    active={editor.isActive('heading', { level: 3 })}
                >
                    H3
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                >
                    • Lista
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive('orderedList')}
                >
                    1. Lista
                </MenuButton>
                <span className="w-px bg-default-200 mx-1" />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive('blockquote')}
                >
                    &ldquo; Cita
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                >
                    ― Línea
                </MenuButton>
            </div>
            {/* Editor */}
            <EditorContent editor={editor} />
        </div>
    );
}
