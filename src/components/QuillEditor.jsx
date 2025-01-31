import React, { useState, useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import Quill's Snow theme CSS

const QuillEditor = () => {
  const quillRef = useRef(null);
  const [editorContent, setEditorContent] = useState('');
