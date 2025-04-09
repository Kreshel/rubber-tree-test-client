import type { InvoiceMutation, Invoice } from '@/client';
import {
  getInvoiceByInvoiceIdOptions,
  putInvoiceByInvoiceIdMutation,
} from '@/client/@tanstack/react-query.gen';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useParams } from 'react-router';

const EditInvoiceHeader = () => {
  const { invoiceId } = useParams();
  if (!invoiceId) throw new Error('there should be an invoice here');

  const invoiceIdInt = parseInt(invoiceId);
  if (isNaN(invoiceIdInt)) throw new Error('invoiceId should be a number');

  const { data, isLoading } = useQuery({
    ...getInvoiceByInvoiceIdOptions({
      path: {
        invoiceId: invoiceIdInt,
      },
    }),
  });

  if (isLoading) return <div>loading...</div>;
  if (!data) throw new Error('there should be an invoice here');

  return <InvoiceHeaderForm invoice={data} />;
};

const InvoiceHeaderForm = ({ invoice }: { invoice: Invoice }) => {
  const queryClient = useQueryClient();
  const [invoiceMutationData, setInvoiceMutationData] =
    useState<InvoiceMutation>({
      customerName: invoice.customerName ?? '',
      customerAddress: invoice.customerAddress ?? '',
    });

  const [mutationStatus, setMutationStatus] = useState<MutationStatus>();

  const editMutation = useMutation({
    ...putInvoiceByInvoiceIdMutation({
      path: { invoiceId: invoice.id },
      body: invoiceMutationData,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        exact: false,
      });
    },
  });

  const handleSave = async () => {
    setMutationStatus({
      result: 'pending',
      message: 'Saving...',
    });

    await editMutation.mutateAsync(
      {
        path: { invoiceId: invoice.id },
        body: invoiceMutationData,
      },
      {
        onSuccess: () => {
          setMutationStatus({
            result: 'success',
            message: 'Saved successfully',
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
          <h1 className='text-2xl font-bold'>
            Invoice Header Edit: {invoice.id}
          </h1>
          <Link to={`/invoice/${invoice.id}`} className='text-blue-500'>
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
          <button
            className='bg-blue-500 text-white rounded-md p-2 disabled:opacity-50 cursor-pointer'
            onClick={handleSave}
            disabled={mutationStatus?.result === 'pending'}
          >
            Save
          </button>
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
}

export default EditInvoiceHeader;
