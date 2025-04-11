import { type InvoiceLineMutationWritable } from "@/client";
import { postInvoiceLineByInvoiceIdMutation } from "@/client/@tanstack/react-query.gen";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router";

const CreateInvoiceLine = () => {
  return <InvoiceLineForm />;
};

const InvoiceLineForm = () => {
  const { invoiceId } = useParams();
  if (!invoiceId) throw new Error("there should be an invoice here");

  const invoiceIdInt = parseInt(invoiceId);
  if (isNaN(invoiceIdInt)) throw new Error("invoiceId should be a number");

  const queryClient = useQueryClient();
  const [invoiceMutationData, setInvoiceMutationData] =
    useState<InvoiceLineMutationWritable>({
      itemNumber: "",
      description: null,
      unitPrice: 0,
      quantity: 0,
    });

  const [mutationStatus, setMutationStatus] = useState<MutationStatus>();

  const editMutation = useMutation({
    ...postInvoiceLineByInvoiceIdMutation({
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
    if (invoiceMutationData.itemNumber === "") isValid = false;

    // Not necessarily invalid
    // if (invoiceMutationData.unitPrice === 0) isValid = false;

    // if (invoiceMutationData.quantity === 0) isValid = false;

    if (!isValid) {
      setMutationStatus({
        result: "error",
        message: "Please fill in all fields",
      });
      return;
    }

    setMutationStatus({
      result: "pending",
      message: "Saving...",
    });

    await editMutation.mutateAsync(
      {
        body: invoiceMutationData,
        path: {
          invoiceId: invoiceIdInt,
        },
      },
      {
        onSuccess: (lineNumber) => {
          setMutationStatus({
            result: "success",
            message: "Created successfully with line number: " + lineNumber,
            lineNumber,
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
          <h1 className="text-2xl font-bold">Invoice Line Create</h1>
          <Link to={`/`} className="text-blue-500">
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
          {mutationStatus?.result !== "success" ? (
            <button
              className="bg-blue-500 text-white rounded-md p-2 disabled:opacity-50 cursor-pointer"
              onClick={handleSave}
              disabled={mutationStatus?.result === "pending"}
            >
              Create
            </button>
          ) : (
            <Link
              to={`/invoice/${invoiceId}`}
              className="bg-green-600 text-white rounded-md p-2"
            >
              Go to Invoice
            </Link>
          )}
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
  lineNumber?: number;
}

export default CreateInvoiceLine;
