import { Editor } from '@tiptap/react';
import {
    Bold, Italic, Strikethrough, Code, Heading1, Heading2,
    List, ListOrdered, Quote, Undo, Redo, Image as ImageIcon, Link as LinkIcon, Terminal
} from 'lucide-react';
import { useCallback, useRef } from 'react';

interface EditorToolbarProps {
    editor: Editor | null;
    onImageUpload?: (file: File) => Promise<string>;
}

export function EditorToolbar({ editor, onImageUpload }: EditorToolbarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const addImage = useCallback(async () => {
        if (onImageUpload && fileInputRef.current?.files?.[0]) {
            const file = fileInputRef.current.files[0];
            try {
                const url = await onImageUpload(file);
                if (url) {
                    editor?.chain().focus().setImage({ src: url }).run();
                }
            } catch (error) {
                console.error('Failed to upload image:', error);
                alert('Failed to upload image.');
            }
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = '';
        } else if (!onImageUpload) {
            const url = window.prompt('URL');
            if (url) {
                editor?.chain().focus().setImage({ src: url }).run();
            }
        }
    }, [editor, onImageUpload]);

    const setLink = useCallback(() => {
        const previousUrl = editor?.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        // cancelled
        if (url === null) return;

        // empty
        if (url === '') {
            editor?.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update link
        editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    if (!editor) {
        return null;
    }

    const ToolbarButton = ({
        onClick,
        isActive = false,
        disabled = false,
        children
    }: {
        onClick: () => void;
        isActive?: boolean;
        disabled?: boolean;
        children: React.ReactNode;
    }) => (
        <button
            onClick={(e) => { e.preventDefault(); onClick(); }}
            disabled={disabled}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isActive ? 'bg-gray-100/80 dark:bg-gray-800/80 text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {children}
        </button>
    );

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
            <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-800 pr-2 mr-1">
                <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
                    <Bold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
                    <Italic className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')}>
                    <Strikethrough className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')}>
                    <Code className="w-4 h-4" />
                </ToolbarButton>
            </div>

            <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-800 pr-2 mr-1">
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })}>
                    <Heading1 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })}>
                    <Heading2 className="w-4 h-4" />
                </ToolbarButton>
            </div>

            <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-800 pr-2 mr-1">
                <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>
                    <List className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}>
                    <ListOrdered className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')}>
                    <Quote className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')}>
                    <Terminal className="w-4 h-4" /> {/* Need to import Terminal */}
                </ToolbarButton>
            </div>

            <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-800 pr-2 mr-1">
                <ToolbarButton onClick={setLink} isActive={editor.isActive('link')}>
                    <LinkIcon className="w-4 h-4" />
                </ToolbarButton>
                <input
                    title="Upload Image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={addImage}
                />
                <ToolbarButton onClick={() => onImageUpload ? fileInputRef.current?.click() : addImage()}>
                    <ImageIcon className="w-4 h-4" />
                </ToolbarButton>
            </div>

            <div className="flex items-center gap-1 ml-auto">
                <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()}>
                    <Undo className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()}>
                    <Redo className="w-4 h-4" />
                </ToolbarButton>
            </div>
        </div>
    );
}
