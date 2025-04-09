# Rubber Tree Test - Invoice Management System
Welcome to the Rubber Tree Test coding exercise! This project is a React application that manages invoices and their line items. Your task is to complete the implementation by adding functionality for managing invoice line items.

### Objective
You need to build the UI and functionality for managing invoice line items (Create, Read, Update, Delete operations) to complete the application.

### Getting Started
1. Clone the repository and navigate to the project directory
1. Install dependencies with npm install
1. Start the development server with npm run dev
### Task Requirements
1. Run the API Project
The client application communicates with a .NET API. You'll need to:
- Run the provided .NET API locally (instructions should be provided separately)
- The API is configured to run at https://localhost:7153 (note the API uses HTTPS)
- Ensure the client can connect to the API

2. Create Route Files for Invoice Line CRUD Operations
In the routes.ts file, there's a comment indicating where to add routes for invoice line operations:

#### You need to:
- Create the necessary route files for managing invoice line items
- Add appropriate route definitions to handle:
  - Creating new invoice lines
  - Editing existing invoice lines
  - Deleting invoice lines
    
3. Complete the Invoice Detail UI
In the invoice.tsx file, there's a placeholder for the invoice line items list:

```
<div className='text-red-500 border-red-500 border rounded-2xl p-4 bg-gray-200'>
  DELETE ME: Add the invoice line list here with links/functions to
  Edit, create, and delete
</div>
<table>{/*invoice line item list goes here*/}</table>
```

#### You need to:
- Replace this placeholder with a proper table to display invoice line items
- Implement "Create", "Edit", and "Delete" functionality for line items
- Ensure proper data fetching and mutations using the TanStack Query hooks

4. Connect to API Endpoints
The application already has generated API client code. Use the appropriate functions from react-query.gen.ts to:
- Fetch invoice line items
- Create new line items
- Update existing line items
- Delete line items

## API Types and Operations
Here are the key types and operations you'll be working with
**InvoiceLine** - Type representing invoice line items
**InvoiceLineMutationWritable** - Type for creating/updating line items
- Relevant API operations:
  - **postInvoiceLineByInvoiceId** - Create a new line item
  - **putInvoiceLineByInvoiceIdByLineNumber** - Update an existing line item
  - **deleteInvoiceLineByInvoiceIdByLineNumber** - Delete a line item

## Stretch Goals
If you complete the core functionality, consider these improvements:
- Add form validation for line item creation/editing
- Implement optimistic updates for a better user experience
- Add confirmation dialogs for destructive operations (like delete)
- Improve the visual design and responsiveness
- Add sorting or filtering capabilities to the line items table
- Add error handling with user-friendly error messages

## Your submission will be evaluated based on:
- Functionality - Does it work correctly?
- Code quality - Is the code well-structured and maintainable?
- UI/UX - Is the interface intuitive and responsive?
- Error handling - Does it gracefully handle errors?
- React best practices - Proper use of hooks, components, etc.
  
## Hints
- Study the existing code for invoice headers to understand the patterns used
- Use the TanStack Query hooks for data fetching and mutations
- Check the types defined in types.gen.ts to understand the data structures
- The invoice ID is available from the URL params in the invoice view


Good luck! Feel free to ask questions if you need clarification on any aspect of the assignment.
