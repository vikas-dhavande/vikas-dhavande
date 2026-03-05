import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
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
            })
        ],
        content: initialContent || '',
        editorProps: {
            attributes: {
                class: 'prose prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[300px] py-4 px-6',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getJSON(), editor.getHTML());
        },
    });

    return (
        <div className="w-full flex flex-col rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-black dark:focus-within:ring-white transition-shadow">
            <EditorToolbar editor={editor} onImageUpload={onImageUpload} />
            <div className="flex-1 w-full relative">
                <EditorContent editor={editor} className="w-full" />
            </div>
        </div>
    );
}
