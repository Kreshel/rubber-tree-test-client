import type { InvoiceMutation } from '@/client';
import { postInvoiceMutation } from '@/client/@tanstack/react-query.gen';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router';

const CreateInvoiceHeader = () => {
  return <InvoiceHeaderForm />;
};

const InvoiceHeaderForm = () => {
  const queryClient = useQueryClient();
  const [invoiceMutationData, setInvoiceMutationData] =
    useState<InvoiceMutation>({
      customerName: '',
      customerAddress: '',
    });

  const [mutationStatus, setMutationStatus] = useState<MutationStatus>();

  const editMutation = useMutation({
    ...postInvoiceMutation({
      body: invoiceMutationData,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        exact: false,
      });
    },
  });

  const handleSave = async () => {
    let isValid = true;
    if (invoiceMutationData.customerName === '') isValid = false;

    if (invoiceMutationData.customerAddress === '') isValid = false;

    if (!isValid) {
      setMutationStatus({
        result: 'error',
        message: 'Please fill in all fields',
      });
      return;
    }

    setMutationStatus({
      result: 'pending',
      message: 'Saving...',
    });

    await editMutation.mutateAsync(
      {
        body: invoiceMutationData,
      },
      {
        onSuccess: (invoiceId) => {
          setMutationStatus({
            result: 'success',
            message: 'Created successfully with id: ' + invoiceId,
            invoiceId,
          });
        },
        onError: (error) => {
          setMutationStatus({
            result: 'error',
            message: error.message,
          });
        },
      }
    );
  };

  return (
    <main className='flex flex-col gap-4 items-center justify-center p-4'>
      <div className='flex flex-col gap-4 border rounded-2xl p-4 w-full'>
        <div className='flex justify-between items-center w-full'>
          <h1 className='text-2xl font-bold'>Invoice Header Create</h1>
          <Link to={`/`} className='text-blue-500'>
            Back
          </Link>
        </div>
        <div className='flex gap-2 flex-col'>
          <label htmlFor='customer-name' className='font-bold'>
            Customer Name
          </label>
          <input
            id='customer-name'
            className='border rounded-md p-2'
            onChange={(e) => {
              setInvoiceMutationData((prev) => ({
                ...prev,
                customerName: e.target.value,
              }));
            }}
            value={invoiceMutationData.customerName}
          />
        </div>
        <div className='flex gap-2 flex-col'>
          <label htmlFor='customer-address' className='font-bold'>
            Customer Address
          </label>
          <input
            id='customer-address'
            className='border rounded-md p-2'
            onChange={(e) =>
              setInvoiceMutationData((prev) => ({
                ...prev,
                customerAddress: e.target.value,
              }))
            }
            value={invoiceMutationData.customerAddress}
          />
        </div>
        <div className='flex flex-col gap-2'>
          {mutationStatus?.result !== 'success' ? (
            <button
              className='bg-blue-500 text-white rounded-md p-2 disabled:opacity-50 cursor-pointer'
              onClick={handleSave}
              disabled={mutationStatus?.result === 'pending'}
            >
              Create
            </button>
          ) : (
            <Link
              to={`/invoice/${mutationStatus?.invoiceId}`}
              className='bg-green-600 text-white rounded-md p-2'
            >
              Go to Invoice
            </Link>
          )}
          {mutationStatus?.result === 'pending' && (
            <div className='text-gray-500'>{mutationStatus.message}</div>
          )}
          {mutationStatus?.result === 'success' && (
            <div className='text-green-500'>{mutationStatus.message}</div>
          )}
          {mutationStatus?.result === 'error' && (
            <div className='text-red-500'>{mutationStatus.message}</div>
          )}
        </div>
      </div>
    </main>
  );
};

interface MutationStatus {
  result?: 'success' | 'error' | 'pending';
  message?: string;
  invoiceId?: number;
}

export default CreateInvoiceHeader;
