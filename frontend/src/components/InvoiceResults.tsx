'use client';

import { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';

type LineItem = {
  description: string;
  quantity?: number;
  unit_price?: number;
  amount: number;
};

type InvoiceData = {
  vendor_name?: string;
  invoice_number?: string;
  date?: string;
  due_date?: string;
  subtotal?: number;
  tax?: number;
  total?: number;
  line_items?: LineItem[];
  [key: string]: any;
};

type InvoiceResultsProps = {
  data: InvoiceData;
  onReset: () => void;
};

const formatCurrency = (amount?: number) => {
  if (amount === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const CopyButton = ({ value }: { value: string | number }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (value === undefined) return;
    
    navigator.clipboard.writeText(String(value)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button 
      onClick={copyToClipboard}
      className="ml-2 text-gray-400 hover:text-indigo-600 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
    </button>
  );
};

const InvoiceResults = ({ data, onReset }: InvoiceResultsProps) => {
  const [activeTab, setActiveTab] = useState<'details' | 'raw'>('details');
  
  // Filter out empty values and format the data for display
  const filteredData = Object.entries(data).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Invoice Details</h2>
        <button
          onClick={onReset}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Process another invoice
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'details'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'raw'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Raw Data
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'details' ? (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Vendor</h3>
                  <div className="flex items-center">
                    <p className="text-gray-900 font-medium">
                      {data.vendor_name || 'N/A'}
                    </p>
                    <CopyButton value={data.vendor_name || ''} />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Invoice #</h3>
                  <div className="flex items-center">
                    <p className="text-gray-900 font-mono">
                      {data.invoice_number || 'N/A'}
                    </p>
                    <CopyButton value={data.invoice_number || ''} />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p>{formatDate(data.date)}</p>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                  <p>{formatDate(data.due_date)}</p>
                </div>
              </div>
              
              {/* Line Items */}
              {data.line_items && data.line_items.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Line Items</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Qty
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Unit Price
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {data.line_items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                              {item.quantity || 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                              {formatCurrency(item.unit_price)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                              {formatCurrency(item.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                            Subtotal
                          </td>
                          <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                            {formatCurrency(data.subtotal)}
                          </td>
                        </tr>
                        {data.tax && (
                          <tr>
                            <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                              Tax
                            </td>
                            <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                              {formatCurrency(data.tax)}
                            </td>
                          </tr>
                        )}
                        <tr className="bg-gray-50">
                          <td colSpan={3} className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                            Total
                          </td>
                          <td className="px-6 py-3 text-right text-sm font-semibold text-indigo-600">
                            {formatCurrency(data.total)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
              
              {/* Additional Fields */}
              {Object.keys(filteredData).filter(
                key => !['vendor_name', 'invoice_number', 'date', 'due_date', 'subtotal', 'tax', 'total', 'line_items'].includes(key)
              ).length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Additional Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                      {Object.entries(filteredData)
                        .filter(([key]) => !['vendor_name', 'invoice_number', 'date', 'due_date', 'subtotal', 'tax', 'total', 'line_items'].includes(key))
                        .map(([key, value]) => (
                          <div key={key} className="sm:col-span-1">
                            <dt className="text-xs font-medium text-gray-500 capitalize">
                              {key.replace(/_/g, ' ')}
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 break-words">
                              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </dd>
                          </div>
                        ))}
                    </dl>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">
              <pre className="text-xs text-gray-800">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={() => {
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${data.invoice_number || 'data'}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
          className="btn-secondary flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Export as JSON</span>
        </button>
      </div>
    </div>
  );
};

export default InvoiceResults;
