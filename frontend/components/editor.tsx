import React, { useState, useEffect, useRef } from "react";

interface Props {
  text: string;
  onChange: (newText: string) => void;
}

const Editor: React.FunctionComponent<Props> = ({ text, onChange }) => {
  const editorRef = useRef({ CKEditor: null, ClassicEditor: null });
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react"),
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic")
    };
    setEditorLoaded(true);
  }, []);

  return editorLoaded ? (
    // @ts-ignore
    <CKEditor
      editor={ClassicEditor}
      onChange={(event: any, editor: any) => {
        const data = editor.getData();
        onChange(data);
      }}
      data={text}
    />
  ) : null;
};
export default Editor;
