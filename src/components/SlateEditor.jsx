import React, { useState, useMemo, useCallback } from 'react';
import { createEditor, Editor, Transforms, Text } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

const SlateEditor = () => {
    const [value, setValue] = useState([
        {
