// import React, { useState } from 'react';
// import { Editor, EditorState, RichUtils } from 'draft-js';
// import 'draft-js/dist/Draft.css'; // Include default styles

// const DraftEditor = () => {
//   const [editorState, setEditorState] = useState(EditorState.createEmpty());

//   const handleEditorChange = (state) => {
//     setEditorState(state);
//   };

//   const handleKeyCommand = (command) => {
//     const newState = RichUtils.handleKeyCommand(editorState, command);
//     if (newState) {
//       setEditorState(newState);
//       return 'handled';
//     }
//     return 'not-handled';
//   };

//   const toggleInlineStyle = (inlineStyle) => {
//     setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-semibold text-black text-opacity-50 mb-4">
//         Draft.js Word Editor
//       </h1>
