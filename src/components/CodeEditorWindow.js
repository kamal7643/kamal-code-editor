import React, { useState } from 'react';
import Editor from "@monaco-editor/react";



function CodeEditorWindow  ({ onChange, language, pcode, theme }) {
    const [code, setCode] = useState(pcode || "");
  
    const handleEditorChange = (value) => {
      setCode(value);
      onChange("code", value);
    };
  
    return (
      <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl" >
        <Editor
          height="85vh"
          width={`100%`}
          language={language || "javascript"}
          value={code}
          theme={theme}
          defaultValue="// start here"
          onChange={handleEditorChange}
        />
      </div>
    );
  };
  export default CodeEditorWindow;