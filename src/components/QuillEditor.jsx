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

