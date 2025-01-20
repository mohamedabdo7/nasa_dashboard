import React, { useRef, useState } from "react";

interface SingleUploaderProps {
  type: "file" | "image"; // Determines whether to upload a file or an image
  label?: string;
  placeholder?: string;
  onUpload: (file: File | null) => void;
}

const SingleUploader: React.FC<SingleUploaderProps> = ({
  type = "file",
  label = "Upload File",
  placeholder = "Click to upload",
  onUpload,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = () => {
    if (inputRef.current?.files && inputRef.current.files[0]) {
      const selectedFile = inputRef.current.files[0];
      if (type === "image" && !selectedFile.type.startsWith("image/")) return;

      setFile(selectedFile);
      onUpload(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    onUpload(null);

    // Reset input value to allow re-uploading the same file
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div style={styles.container}>
      {!file && (
        <div onClick={() => inputRef.current?.click()} style={styles.uploadBox}>
          <div style={styles.addIcon}>+</div>
          <div>{label}</div>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={type === "image" ? "image/*" : "*/*"}
        style={styles.input}
        onChange={handleFileChange}
      />
      <div style={styles.placeholder}>{placeholder}</div>

      {file && (
        <div style={styles.preview}>
          {file.type.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              style={styles.imagePreview}
            />
          ) : (
            <div style={styles.fileIcon}>
              <span style={styles.fileIconSymbol}>📄</span>
              <div style={styles.fileName}>{file.name}</div>
            </div>
          )}
          <button onClick={handleRemoveFile} style={styles.deleteButton}>
            X
          </button>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
  },
  uploadBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "150px",
    height: "150px",
    border: "2px dashed #000",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "8px",
  },
  addIcon: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  input: {
    display: "none",
  },
  placeholder: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "8px",
  },
  preview: {
    position: "relative",
    width: "100px",
    height: "100px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
    flexDirection: "column",
  },
  imagePreview: {
    maxWidth: "100%",
    maxHeight: "80%",
  },
  fileIcon: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  fileIconSymbol: {
    fontSize: "32px",
    marginBottom: "4px",
  },
  fileName: {
    fontSize: "12px",
    textAlign: "center",
    padding: "5px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  deleteButton: {
    position: "absolute",
    top: "5px",
    right: "5px",
    backgroundColor: "#ff5c5c",
    border: "none",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    color: "#fff",
    fontSize: "12px",
    cursor: "pointer",
  },
};

export default SingleUploader;
