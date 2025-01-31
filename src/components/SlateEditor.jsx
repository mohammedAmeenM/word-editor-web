import React, { useState, useMemo, useCallback } from 'react';
import { createEditor, Editor, Transforms, Text } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

const SlateEditor = () => {
    const [value, setValue] = useState([
        {
          type: 'paragraph',
          children: [{ text: 'Type something here...' }],
        },
      ]);

  const editor = useMemo(() => withReact(createEditor()), []);

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case 'heading':
        return <h2 {...props.attributes}>{props.children}</h2>;
      default:
        return <p {...props.attributes}>{props.children}</p>;
    }
  }, []);

  const renderLeaf = useCallback((props) => {
    return <span {...props.attributes} style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}>{props.children}</span>;
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'b' && event.ctrlKey) {
      event.preventDefault();
