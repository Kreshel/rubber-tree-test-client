import type { Route } from './+types/home';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteInvoiceByInvoiceIdMutation,
  getInvoiceListOptions,
  getInvoiceListQueryKey,
} from '@/client/@tanstack/react-query.gen';
import { Link } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Rubber Tree Test' },
    { name: 'description', content: 'Good luck!' },
  ];
}

const Home = () => {
  const { data, isLoading } = useQuery({
    ...getInvoiceListOptions(),
  });

  if (isLoading) return <div>loading...</div>;
  if (!data) throw new Error('there should be an invoice here');

  return (
    <main className='flex items-center justify-center pt-16 p-4'>
      <div className='border rounded-2xl p-4 w-full flex items-center justify-center flex-col gap-2'>
        <div className='flex justify-between items-center w-full'>
          <h2 className='font-bold text-2xl'>Invoice List</h2>
          <Link
            to='/invoice/header/create'
            className='bg-blue-500 text-white rounded-2xl h-10 flex items-center px-4 cursor-pointer'
          >
            Create New
          </Link>
        </div>
        <table className='w-full'>
          <thead>
            <tr>
              <th className='text-left'>Invoice Number</th>
              <th className='text-left'>Customer Name</th>
              <th className='text-left'>Address</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((invoice) => (
              <tr key={invoice.id}>
                <td className='text-left'>
                  <Link
                    to={`invoice/${invoice.id}`}
                    className='text-blue-500 font-bold'
                  >
                    {invoice.id}
                  </Link>
                </td>
                <td className='text-left'>{invoice.customerName}</td>
                <td className='text-left'>{invoice.customerAddress}</td>
                <td>
                  <InvoiceDeleteButton invoiceId={invoice.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

const InvoiceDeleteButton = ({ invoiceId }: { invoiceId: number }) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    ...deleteInvoiceByInvoiceIdMutation({ path: { invoiceId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...getInvoiceListQueryKey()],
      });
    },
  });

  const handleDelete = async () => {
    await deleteMutation.mutateAsync({ path: { invoiceId } });
  };

  return (
    <button
      className='border border-red-500 text-red-500 rounded-2xl h-10 flex items-center px-2 cursor-pointer disabled:opacity-50'
      onClick={handleDelete}
      disabled={deleteMutation.isPending}
    >
      Delete
    </button>
  );
};

export default Home;
