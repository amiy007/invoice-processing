'use client';

import { useState } from 'react';
import Head from 'next/head';
import FileUpload from '../components/FileUpload';
import InvoiceResults from '../components/InvoiceResults';

type ProcessState = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';

export default function Home() {
  const [processState, setProcessState] = useState<ProcessState>('idle');
  const [error, setError] = useState<string | null>(null);
  interface InvoiceResult {
    data: {
      vendor_name?: string;
      invoice_number?: string;
      date?: string;
      due_date?: string;
      subtotal?: number;
      tax?: number;
      total?: number;
      line_items?: Array<{
        description: string;
        quantity?: number;
        unit_price?: number;
        amount: number;
      }>;
      [key: string]: string | number | boolean | undefined | null | Array<{
        description: string;
        quantity?: number;
        unit_price?: number;
        amount: number;
      }>;
    };
  }
  
  const [result, setResult] = useState<InvoiceResult | null>(null);

  const handleFileSelected = async (file: File) => {
    setProcessState('uploading');
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      setProcessState('processing');
      
      const response = await fetch('http://localhost:8000/api/process-invoice', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process invoice');
      }
      
      const data = await response.json();
      setResult(data.data);
      setProcessState('completed');
    } catch (err) {
      console.error('Error processing invoice:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setProcessState('error');
    }
  };

  const handleReset = () => {
    setProcessState('idle');
    setResult(null);
    setError(null);
  };

  return (
    <>
      <Head>
        <title>AI-Powered Invoice Scanner</title>
        <meta name="description" content="Extract and process invoice data using AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
        <header className="bg-indigo-700 shadow-lg">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">AI-Powered Invoice Scanner</h1>
            <p className="mt-2 text-indigo-100 text-sm sm:text-base max-w-2xl mx-auto">Extract, analyze, and process invoice data with the power of AI</p>
            <div className="mt-4 w-16 h-1 bg-indigo-400 rounded-full mx-auto" aria-hidden="true"></div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {processState === 'idle' && (
              <div className="text-center">
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Get Started</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">Upload an invoice to extract and analyze its data using our powerful AI technology</p>
                </div>
                <FileUpload 
                  onFileSelected={handleFileSelected} 
                  isLoading={false} 
                />
              </div>
            )}

            {(processState === 'uploading' || processState === 'processing') && (
              <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-sm px-6 py-8 sm:px-8">
                <div className="inline-flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-indigo-50 mb-6" role="status" aria-label="Loading">
                  <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-indigo-600"></div>
                  <span className="sr-only">Loading...</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {processState === 'uploading' ? 'Uploading your file...' : 'Processing invoice...'}
                </h3>
                <p className="text-gray-500">
                  {processState === 'uploading' 
                    ? 'Please wait while we upload your file.' 
                    : 'Our AI is analyzing the invoice. This may take a moment.'}
                </p>
              </div>
            )}

            {processState === 'completed' && result && result.data && (
              <InvoiceResults 
                data={{
                  vendor_name: result.data.vendor_name,
                  invoice_number: result.data.invoice_number,
                  date: result.data.date,
                  due_date: result.data.due_date,
                  subtotal: result.data.subtotal,
                  tax: result.data.tax,
                  total: result.data.total,
                  line_items: result.data.line_items || []
                }} 
                onReset={handleReset} 
              />
            )}

            {processState === 'error' && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error processing invoice
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error || 'An unknown error occurred while processing your invoice.'}</p>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="text-sm font-medium text-red-800 hover:text-red-700 focus:outline-none focus:underline transition duration-150 ease-in-out"
                      >
                        Try again <span aria-hidden="true">&rarr;</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <footer className="border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
            <p className="text-center text-base text-gray-500">
              &copy; {new Date().getFullYear()} Invoice Scanner. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
