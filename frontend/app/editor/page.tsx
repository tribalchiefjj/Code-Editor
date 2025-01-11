'use client';

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import MonacoEditor from '@monaco-editor/react';
import styles from './editor.module.css';

const socket = io('http://localhost:3001');

const EditorPage: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');
  const [cursorPosition, setCursorPosition] = useState<{ line: number, column: number } | null>(null);

  // Only run this logic on the client-side
  useEffect(() => {
    const savedCode = localStorage.getItem('code');
    setCode(savedCode || ''); // Set the saved code or fallback to an empty string
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '');
    socket.emit('code-edit', value);
    localStorage.setItem('code', value || '');
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  const handleEditorDidMount = (editor: any) => {
    editor.onDidChangeCursorPosition((e: any) => {
      const position = e.position;
      setCursorPosition({ line: position.lineNumber, column: position.column });
      socket.emit('cursor-update', { line: position.lineNumber, column: position.column });
    });
  };

  useEffect(() => {
    socket.on('code-update', (data) => {
      setCode(data);
    });

    socket.on('cursor-update', (position) => {
      console.log('Received cursor position update:', position);
      setCursorPosition(position); // Update cursor position on receiving update
    });

    return () => {
      socket.off('code-update');
      socket.off('cursor-update');
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.languageSelector}>
        <label htmlFor="language">Select Language: </label>
        <select id="language" value={language} onChange={handleLanguageChange}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
      </div>
      <MonacoEditor
        height="90vh"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount} 
      />
    </div>
  );
};

export default EditorPage;
