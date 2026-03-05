import { Editor } from '@tiptap/react';
import {
    Bold, Italic, Strikethrough, Code, Heading1, Heading2,
    List, ListOrdered, Quote, Undo, Redo, Image as ImageIcon, Link as LinkIcon, Terminal,
    Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify, Video, Minus
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

        if (url === null) return;

        if (url === '') {
            editor?.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const addVideo = useCallback(() => {
        const url = window.prompt('YouTube Video URL');
        if (url) {
            editor?.commands.setYoutubeVideo({
                src: url,
                width: Math.max(320, parseInt('640', 10)) || 640,
                height: Math.max(180, parseInt('480', 10)) || 480,
            })
        }
    }, [editor]);

    if (!editor) {
        return null;
    }

    const ToolbarButton = ({
        onClick,
        isActive = false,
        disabled = false,
        children,
        title
    }: {
        onClick: () => void;
        isActive?: boolean;
        disabled?: boolean;
        children: React.ReactNode;
        title?: string;
    }) => (
        <button
            title={title}
            onClick={(e) => { e.preventDefault(); onClick(); }}
            disabled={disabled}
            className={`p-1.5 md:p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${isActive ? 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white' : 'text-gray-600 dark:text-gray-300'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {children}
        </button>
    );

    return (
        <div className="flex flex-wrap items-center gap-1 md:gap-2 p-2 px-4 shadow-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg">

            {/* History */}
            <div className="flex items-center gap-0.5 border-r border-gray-200 dark:border-gray-700 pr-2">
                <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()}>
                    <Undo className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()}>
                    <Redo className="w-4 h-4" />
                </ToolbarButton>
            </div>

            {/* Text Formatting */}
            <div className="flex items-center gap-0.5 border-r border-gray-200 dark:border-gray-700 pr-2">
                <ToolbarButton title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
                    <Bold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
                    <Italic className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')}>
                    <UnderlineIcon className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')}>
                    <Strikethrough className="w-4 h-4" />
                </ToolbarButton>

                {/* Color Picker */}
                <div className="relative flex items-center p-1.5 text-gray-600 dark:text-gray-300">
                    <input
                        type="color"
                        onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
                        value={editor.getAttributes('textStyle').color || '#000000'}
                        title="Text Color"
                        className="w-5 h-5 cursor-pointer rounded border border-gray-300 p-0"
                    />
                </div>
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-0.5 border-r border-gray-200 dark:border-gray-700 pr-2 hidden sm:flex">
                <ToolbarButton title="Align Left" onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })}>
                    <AlignLeft className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton title="Align Center" onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })}>
                    <AlignCenter className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton title="Align Right" onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })}>
                    <AlignRight className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton title="Justify" onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })}>
                    <AlignJustify className="w-4 h-4" />
                </ToolbarButton>
            </div>

            {/* Blocks */}
            <div className="flex items-center gap-0.5 border-r border-gray-200 dark:border-gray-700 pr-2">
                <ToolbarButton title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })}>
                    <Heading1 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })}>
                    <Heading2 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton title="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>
                    <List className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton title="Numbered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}>
                    <ListOrdered className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton title="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')}>
                    <Quote className="w-4 h-4" />
                </ToolbarButton>
            </div>

            {/* Inserts */}
            <div className="flex items-center gap-0.5">
                <ToolbarButton title="Link" onClick={setLink} isActive={editor.isActive('link')}>
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
                <ToolbarButton title="Insert Image" onClick={() => onImageUpload ? fileInputRef.current?.click() : addImage()}>
                    <ImageIcon className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton title="Insert Video" onClick={addVideo}>
                    <Video className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton title="Insert Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                    <Minus className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton title="Code Block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')}>
                    <Terminal className="w-4 h-4" />
                </ToolbarButton>
            </div>

        </div>
    );
}
