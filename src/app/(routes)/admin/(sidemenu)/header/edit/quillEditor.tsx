import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface QuillEditorProps {
  editData: string;
  onDataChange: (data: string) => void;
}

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});
const QuillEditorComponent = ({ editData, onDataChange }: QuillEditorProps) => {
  const [editorValue, setEditorValue] = useState<string>(editData);

  useEffect(() => {
    setEditorValue(editData);
  }, [editData]);

  const handleChange = (content: string) => {
    setEditorValue(content);
    onDataChange(content);
  };

  // Define the toolbar options including image
  const toolbarOptions = [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'color': [] }, { 'background': [] }],        // dropdown with defaults from theme
    [{ 'align': [] }],
    ['link', 'image', 'video'],          // add image and video options
    ['clean']                                         // remove formatting button
  ];

  // Set up the modules for Quill
  const modules = {
    toolbar: toolbarOptions,
  };

  return (
    <div style={{ height: '100px' }}>
      <ReactQuill 
        theme="snow" 
        value={editorValue} 
        onChange={handleChange} 
        modules={modules} 
        style={{ height: '80%' }}
      />
    </div>
  );
};

export default QuillEditorComponent;
