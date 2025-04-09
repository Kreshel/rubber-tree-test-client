import { getInvoiceByInvoiceIdOptions } from '@/client/@tanstack/react-query.gen';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router';

const Invoice = () => {
  const { invoiceId } = useParams();
  if (!invoiceId) throw new Error('there should be an invoice here');
  const { data, isLoading } = useQuery({
    ...getInvoiceByInvoiceIdOptions({
      path: {
        invoiceId: parseInt(invoiceId),
      },
    }),
  });

  if (isLoading) return <div>loading...</div>;
  if (!data) throw new Error('there should be an invoice here');

  // line data from invoice
  const invoiceLines = data.items ?? [];

  return (
    <main className='flex flex-col items-center justify-center p-4 gap-4'>
      <div className='border rounded-2xl p-4 w-full flex items-start justify-center flex-col gap-2'>
        <div className='flex justify-between items-center w-full'>
          <h1 className='text-2xl font-bold'>Invoice Header</h1>
          <Link
            to={`/invoice/header/edit/${data.id}`}
            className='text-blue-500'
          >
            Edit
          </Link>
        </div>
        <div className='flex gap-2'>
          <div className='font-semibold'>Invoice Number:</div>
          <div>{data.id}</div>
        </div>
        <div className='flex gap-2'>
          <div className='font-semibold'>Customer Name:</div>
          <div>{data.customerName}</div>
        </div>
        <div className='flex gap-2'>
          <div className='font-semibold'>Customer Address:</div>
          <div>{data.customerAddress}</div>
        </div>
      </div>
      <div className='border rounded-2xl p-4 w-full flex items-start justify-center flex-col gap-2'>
        <h2 className='text-xl font-bold'>Invoice Details</h2>
        <div className='text-red-500 border-red-500 border rounded-2xl p-4 bg-gray-200'>
          DELETE ME: Add the invoice line list here with links/functions to
          Edit, create, and delete
        </div>
        <table>{/*invoice line item list goes here*/}</table>
      </div>
    </main>
  );
};

export default Invoice;
