import React, { useState, useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import Quill's Snow theme CSS

const QuillEditor = () => {
  const quillRef = useRef(null);
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    // Initialize Quill editor
    const quill = new Quill(quillRef.current, {
      theme: 'snow', // Theme of the editor
      modules: {
        toolbar: [
          [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'align': [] }],
          ['bold', 'italic', 'underline'],
          ['link'],
          ['image']
        ],
      },
    });

    // Listen for text changes and update the content state
    quill.on('text-change', () => {
      setEditorContent(quill.root.innerHTML);
    });

    // Cleanup editor when the component is unmounted
    return () => {
      quill.off('text-change');
    };
  }, []);

  const handleSave = () => {
    // Do something with the editor content, e.g., send it to the server
    console.log('Editor content:', editorContent);
  };

