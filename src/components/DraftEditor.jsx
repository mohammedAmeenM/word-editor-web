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
//       <div className="mb-4">
//         <button onClick={() => toggleInlineStyle('BOLD')} className="mr-2 p-2 bg-gray-200 rounded hover:bg-gray-300">Bold</button>
//         <button onClick={() => toggleInlineStyle('ITALIC')} className="mr-2 p-2 bg-gray-200 rounded hover:bg-gray-300">Italic</button>
//         <button onClick={() => toggleInlineStyle('UNDERLINE')} className="p-2 bg-gray-200 rounded hover:bg-gray-300">Underline</button>
//       </div>
//       <div className="border p-4 rounded bg-white" style={{ minHeight: '200px' }}>
//         <Editor 
//           editorState={editorState} 
//           onChange={handleEditorChange} 
//           handleKeyCommand={handleKeyCommand} 
//         />
//       </div>
//     </div>
//   );
// };

// export default DraftEditor;
