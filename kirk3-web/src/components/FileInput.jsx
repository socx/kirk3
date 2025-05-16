import { useEffect, useRef } from 'react';
import * as React from 'react';


const FileInput = ({ fileList = [], className, isRequired, onChange }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      const dataTransfer = new DataTransfer();
      fileList.forEach((file) => dataTransfer.items.add(file));
      inputRef.current.files = dataTransfer.files;
    }
  }, [fileList]);

  return (
    <input
      id="receipts"
      type="file"
      className={className}
      required={isRequired}
      multiple
      ref={inputRef}
      data-testid="receipts"
      onChange={(e) => {
        onChange(e.target.files);
      }}
    />
  );
};

export default FileInput;
