import { useRef, useEffect } from "react";

// Lightweight WYSIWYG using contentEditable and execCommand
// Props: value (HTML), onChange(html), placeholder
const RichTextEditor = ({ value = "", onChange, placeholder = "Write something..." }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    onChange?.(editorRef.current?.innerHTML || "");
  };

  const exec = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    handleInput();
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => exec("bold")}>B</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => exec("italic")}><em>I</em></button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => exec("underline")}><u>U</u></button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => exec("insertUnorderedList")}>• List</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => exec("insertOrderedList")}>1. List</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => {
          const url = prompt("Enter URL");
          if (url) exec("createLink", url);
        }}>Link</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => exec("removeFormat")}>Clear</button>
      </div>
      <div
        ref={editorRef}
        onInput={handleInput}
        contentEditable
        placeholder={placeholder}
        style={{
          minHeight: 160,
          padding: 12,
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: 6,
        }}
        className="form-control"
        suppressContentEditableWarning
      />
    </div>
  );
};

export default RichTextEditor;
