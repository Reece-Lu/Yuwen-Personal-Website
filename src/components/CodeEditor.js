import React, { useEffect, useRef } from 'react';
import { CodeJar } from 'codejar';
import hljs from 'highlight.js';
import 'highlight.js/styles/monokai.css';

const CodeEditor = ({ code, language = "javascript", readOnly = true }) => {
    const editorRef = useRef(null);

    useEffect(() => {
        const jar = CodeJar(editorRef.current, (editor) => {
            editor.innerHTML = hljs.highlight(editor.textContent, { language }).value;
        });

        jar.updateCode(code);

        if (readOnly) {
            jar.onUpdate(() => {});
        }

        return () => {
            jar.destroy();
        };
    }, [code, language, readOnly]);

    return (
        <div
            ref={editorRef}
            style={{
                fontFamily: 'monospace',
                whiteSpace: 'pre',
                padding: '10px',
                backgroundColor: '#2d2d2d',
                color: '#f8f8f2',
                borderRadius: '4px',
                overflowX: 'auto',
            }}
        />
    );
};

export default CodeEditor;
