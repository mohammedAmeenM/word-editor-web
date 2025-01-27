import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const TinyMCEEditor = () => {
  const [editorContent, setEditorContent] = useState('');

  const handleEditorChange = (content, editor) => {
    setEditorContent(content);
  };

  const handleSave = () => {
    // Do something with the editor content, e.g., send it to the server
    console.log('Editor content:', editorContent);
  };

  return (
    <div>
      <Editor
        apiKey="hmej19fo3gepmko172hv91pvqwzlw9h6wlca9az4oba4b9b8"  // Optional: You can get a free TinyMCE API key at https://www.tiny.cloud/
        value={editorContent}
        init={{
          height: 400,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'print',
            'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen'
          ],
          toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | preview fullscreen',
          content_style: 'body { font-family:Arial, sans-serif; font-size:14px }',
        }}
        onEditorChange={handleEditorChange}
      />
      <button onClick={handleSave}>Save Content</button>
    </div>
  );
};

export default TinyMCEEditor;
