import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers, fetchInvoiceById } from '@/app/lib/data';
import { updateInvoice } from '@/app/lib/actions';
import { notFound } from 'next/navigation';
 
export default async function Page(props: {params:{id: Promise<string>}}) {

  const params = await props.params
  const id = await params.id;
  
  const [customers, invoice] = await Promise.all([fetchCustomers(), fetchInvoiceById(id)])

  if (!invoice) {
    notFound()
  }
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Update Invoice',
            href: `/dashboard/invoices/${id}/update`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}