import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('invoice/:invoiceId', 'routes/invoice.tsx'),
  route('invoice/header/create', 'routes/createInvoiceHeader.tsx'),
  route('invoice/header/edit/:invoiceId', 'routes/editInvoiceHeader.tsx'),
  // add routes for the invoice line CRUD operations
] satisfies RouteConfig;
