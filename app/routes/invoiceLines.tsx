import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteInvoiceLineByInvoiceIdByLineNumberMutation,
  getInvoiceByInvoiceIdQueryKey,
} from "@/client/@tanstack/react-query.gen";
import { Link, useParams } from "react-router";
import type { InvoiceLine } from "@/client";

const InvoiceLines = ({ invoiceLines }: { invoiceLines: InvoiceLine[] }) => {
  const { invoiceId } = useParams();
  if (!invoiceId) throw new Error("there should be an invoice here");

  const invoiceIdInt = parseInt(invoiceId);
  if (isNaN(invoiceIdInt)) throw new Error("invoiceId should be a number");

  return (
    <div className="border rounded-2xl p-4 w-full flex items-center justify-center flex-col gap-2">
      <div className="flex justify-between items-center w-full">
        <h2 className="font-bold text-2xl">Invoice Details</h2>
        <Link
          to={`/invoice/${invoiceId}/line/create`}
          className="bg-blue-500 text-white rounded-2xl h-10 flex items-center px-4 cursor-pointer"
        >
          Create New
        </Link>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Line Number</th>
            <th className="text-left">Item Number</th>
            <th className="text-left">Description</th>
            <th className="text-left">Unit Price</th>
            <th className="text-left">Quantity</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {invoiceLines.map((line: InvoiceLine) => (
            <tr key={line.lineNumber}>
              <td className="text-left">
                <Link
                  to={`line/edit/${line.lineNumber}`}
                  className="text-blue-500 font-bold"
                >
                  {line.lineNumber}
                </Link>
              </td>
              <td className="text-left">{line.itemNumber}</td>
              <td className="text-left">{line.description}</td>
              <td className="text-left">{line.unitPrice}</td>
              <td className="text-left">{line.quantity}</td>
              <td>
                <LineDeleteButton
                  invoiceId={line.invoiceId}
                  lineNumber={line.lineNumber}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const LineDeleteButton = ({
  invoiceId,
  lineNumber,
}: {
  invoiceId: number;
  lineNumber: number;
}) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    ...deleteInvoiceLineByInvoiceIdByLineNumberMutation({
      path: { invoiceId, lineNumber },
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          ...getInvoiceByInvoiceIdQueryKey({
            path: {
              invoiceId: invoiceId,
            },
          }),
        ],
      });
    },
  });

  const handleDelete = async () => {
    await deleteMutation.mutateAsync({ path: { invoiceId, lineNumber } });
  };

  return (
    <button
      className="border border-red-500 text-red-500 rounded-2xl h-10 flex items-center px-2 cursor-pointer disabled:opacity-50"
      onClick={handleDelete}
      disabled={deleteMutation.isPending}
    >
      Delete
    </button>
  );
};

export default InvoiceLines;
