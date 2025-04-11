import type { InvoiceLine, InvoiceLineMutationWritable } from "@/client";
import {
  getInvoiceLineByInvoiceIdByLineNumberOptions,
  putInvoiceLineByInvoiceIdByLineNumberMutation,
} from "@/client/@tanstack/react-query.gen";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router";

const EditInvoiceLine = () => {
  const { invoiceId, lineNumber } = useParams();
  if (!invoiceId) throw new Error("there should be an invoice here");
  if (!lineNumber) throw new Error("there should be a line here");

  const invoiceIdInt = parseInt(invoiceId);
  if (isNaN(invoiceIdInt)) throw new Error("invoiceId should be a number");

  const lineNumberInt = parseInt(lineNumber);
  if (isNaN(lineNumberInt)) throw new Error("invoiceId should be a number");

  const { data, isLoading } = useQuery({
    ...getInvoiceLineByInvoiceIdByLineNumberOptions({
      path: {
        invoiceId: invoiceIdInt,
        lineNumber: lineNumberInt,
      },
    }),
  });

  if (isLoading) return <div>loading...</div>;
  if (!data) throw new Error("there should be a line here");

  return <InvoiceLineForm line={data} />;
};

const InvoiceLineForm = ({ line }: { line: InvoiceLine }) => {
  const queryClient = useQueryClient();
  const [invoiceMutationData, setInvoiceMutationData] =
    useState<InvoiceLineMutationWritable>({
      itemNumber: line.itemNumber ?? "",
      description: line.description,
      unitPrice: line.unitPrice ?? 0,
      quantity: line.quantity ?? 0,
    });

  const [mutationStatus, setMutationStatus] = useState<MutationStatus>();

  const editMutation = useMutation({
    ...putInvoiceLineByInvoiceIdByLineNumberMutation({
      path: { invoiceId: line.invoiceId, lineNumber: line.lineNumber },
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
      result: "pending",
      message: "Saving...",
    });

    await editMutation.mutateAsync(
      {
        path: { invoiceId: line.invoiceId, lineNumber: line.lineNumber },
        body: invoiceMutationData,
      },
      {
        onSuccess: () => {
          setMutationStatus({
            result: "success",
            message: "Saved successfully",
          });
        },
        onError: (error) => {
          setMutationStatus({
            result: "error",
            message: error.message,
          });
        },
      }
    );
  };

  return (
    <main className="flex flex-col gap-4 items-center justify-center p-4">
      <div className="flex flex-col gap-4 border rounded-2xl p-4 w-full">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-2xl font-bold">
            Invoice Line Edit: {line.lineNumber}
          </h1>
          <Link to={`/invoice/${line.invoiceId}`} className="text-blue-500">
            Back
          </Link>
        </div>
        <div className="flex gap-2 flex-col">
          <label htmlFor="item-number" className="font-bold">
            Item Number
          </label>
          <input
            id="item-number"
            className="border rounded-md p-2"
            onChange={(e) => {
              setInvoiceMutationData((prev) => ({
                ...prev,
                itemNumber: e.target.value,
              }));
            }}
            value={invoiceMutationData.itemNumber}
          />
        </div>
        <div className="flex gap-2 flex-col">
          <label htmlFor="description" className="font-bold">
            Description
          </label>
          <input
            id="description"
            className="border rounded-md p-2"
            onChange={(e) =>
              setInvoiceMutationData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            value={invoiceMutationData.description ?? ""}
          />
        </div>
        <div className="flex gap-2 flex-col">
          <label htmlFor="unit-price" className="font-bold">
            Unit Price
          </label>
          <input
            id="unit-price"
            className="border rounded-md p-2"
            onChange={(e) =>
              setInvoiceMutationData((prev) => ({
                ...prev,
                unitPrice: parseInt(e.target.value),
              }))
            }
            value={invoiceMutationData.unitPrice}
          />
        </div>
        <div className="flex gap-2 flex-col">
          <label htmlFor="quantity" className="font-bold">
            Quantity
          </label>
          <input
            id="quantity"
            className="border rounded-md p-2"
            onChange={(e) =>
              setInvoiceMutationData((prev) => ({
                ...prev,
                quantity: parseInt(e.target.value),
              }))
            }
            value={invoiceMutationData.quantity}
          />
        </div>
        <div className="flex flex-col gap-2">
          <button
            className="bg-blue-500 text-white rounded-md p-2 disabled:opacity-50 cursor-pointer"
            onClick={handleSave}
            disabled={mutationStatus?.result === "pending"}
          >
            Save
          </button>
          {mutationStatus?.result === "pending" && (
            <div className="text-gray-500">{mutationStatus.message}</div>
          )}
          {mutationStatus?.result === "success" && (
            <div className="text-green-500">{mutationStatus.message}</div>
          )}
          {mutationStatus?.result === "error" && (
            <div className="text-red-500">{mutationStatus.message}</div>
          )}
        </div>
      </div>
    </main>
  );
};

interface MutationStatus {
  result?: "success" | "error" | "pending";
  message?: string;
}

export default EditInvoiceLine;
