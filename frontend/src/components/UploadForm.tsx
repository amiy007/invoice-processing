'use client';

import React, { useState } from 'react';
import axios from 'axios';
import InvoiceEditor from './InvoiceEditor';


interface InvoiceData {
  invoice_number: string;
  vendor_name: string;
  invoice_date: string;
  due_date: string;
  total_amount: string;
  currency: string;
  line_items: Array<any>;
}

const UploadForm = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState('');
  const [structured, setStructured] = useState<InvoiceData | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await axios.post('http://localhost:8000/upload-invoice', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setRawText(res.data.raw_text);
      setStructured(res.data.structured_data);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border p-4 rounded-md shadow">
        <input type="file" onChange={handleFileChange} className="mb-2" />
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload Invoice
        </button>
      </div>

      {rawText && (
        <div className="border p-4 rounded-md mt-4">
          <h2 className="text-lg font-semibold mb-2">Raw Text:</h2>
          <pre className="whitespace-pre-wrap">{rawText}</pre>
        </div>
      )}
{structured && (
  <>
    <InvoiceEditor
      data={structured}
      onChange={(updated) => setStructured(updated)}
    />
  </>
)}

    </div>
  );
};

export default UploadForm;
