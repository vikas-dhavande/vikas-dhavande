import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Youtube from '@tiptap/extension-youtube';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { EditorToolbar } from './EditorToolbar';

const lowlight = createLowlight(common);

interface EditorProps {
    initialContent?: any;
    onChange: (json: any, html: string) => void;
    onImageUpload?: (file: File) => Promise<string>;
}

export function Editor({ initialContent, onChange, onImageUpload }: EditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                codeBlock: false, // We use CodeBlockLowlight instead
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full my-4 shadow-sm border border-gray-200 dark:border-gray-800',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 dark:text-blue-400 underline underline-offset-4 hover:text-blue-800 dark:hover:text-blue-300 transition-colors',
                },
            }),
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    class: 'block bg-gray-900 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto text-sm font-mono',
                }
            }),
            Underline,
            TextStyle,
            Color,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Youtube.configure({
                HTMLAttributes: {
                    class: 'w-full aspect-video rounded-lg my-4',
                },
            }),
        ],
        content: initialContent || '',
        editorProps: {
            attributes: {
                class: 'prose prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[500px] py-4 px-0', // removed padding horizontal
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getJSON(), editor.getHTML());
        },
    });

    return (
        <div className="w-full flex flex-col bg-white dark:bg-gray-900 overflow-visible transition-shadow">
            {/* The toolbar will be rendered outside or inside depending on layout, 
                for now keeping it here but we'll style it to be sticky */}
            <div className="sticky top-[72px] z-20 -mx-4 px-4 sm:mx-0 sm:px-0">
                <EditorToolbar editor={editor} onImageUpload={onImageUpload} />
            </div>
            <div className="flex-1 w-full relative mt-4">
                <EditorContent editor={editor} className="w-full" />
            </div>
        </div>
    );
}
