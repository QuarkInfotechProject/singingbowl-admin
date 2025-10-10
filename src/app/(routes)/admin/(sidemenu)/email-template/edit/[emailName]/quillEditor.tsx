import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface QuillEditorProps {
  editData: string;
  onDataChange: (data: string) => void;
}

const QuillEditorComponent = ({ editData, onDataChange }: QuillEditorProps) => {
  const [editorValue, setEditorValue] = useState<string>(editData);

  useEffect(() => {
    setEditorValue(editData);
  }, [editData]);

  const handleChange = (content: string) => {
    setEditorValue(content);
    onDataChange(content);
  };
  return (
    <div style={{ height: '400px' }}>
      <ReactQuill theme="snow" value={editorValue} onChange={handleChange}  style={{ height: '80%' }}/>
    </div>
  );
};

export default QuillEditorComponent;
