'use client';

import React from 'react';

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface InvoiceData {
  invoice_number: string;
  vendor_name: string;
  invoice_date: string;
  due_date: string;
  total_amount: string;
  currency: string;
  line_items: LineItem[];
}

interface Props {
  data: InvoiceData;
  onChange: (updated: InvoiceData) => void;
}

const InvoiceEditor: React.FC<Props> = ({ data, onChange }) => {
  const handleFieldChange = (field: keyof InvoiceData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleLineItemChange = (index: number, key: keyof LineItem, value: string) => {
    const updatedItems = data.line_items.map((item, i) =>
      i === index ? { ...item, [key]: value } : item
    );
    onChange({ ...data, line_items: updatedItems });
  };

  return (
    <div className="border p-4 rounded-md mt-4 space-y-4">
      <h2 className="text-lg font-semibold">Edit Extracted Invoice</h2>

      {['invoice_number', 'vendor_name', 'invoice_date', 'due_date', 'total_amount', 'currency'].map((field) => (
        <div key={field} className="flex gap-2">
          <label className="w-40 font-medium capitalize">{field.replace(/_/g, ' ')}:</label>
          <input
            className="flex-1 border px-2 py-1 rounded"
            value={data[field as keyof InvoiceData] as string}
            onChange={(e) => handleFieldChange(field as keyof InvoiceData, e.target.value)}
          />
        </div>
      ))}

      <div>
        <h3 className="font-semibold mt-4 mb-2">Line Items</h3>
        <div className="space-y-2">
          {data.line_items.map((item, i) => (
            <div key={i} className="grid grid-cols-4 gap-2">
              {(['description', 'quantity', 'unit_price', 'total_price'] as const).map((key) => (
                <input
                  key={key}
                  className="border px-2 py-1 rounded"
                  value={item[key]}
                  placeholder={key}
                  onChange={(e) => handleLineItemChange(i, key, e.target.value)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvoiceEditor;
