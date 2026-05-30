import { redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen';

export async function loader({ params }: LoaderFunctionArgs) {
  const locale = params?.locale ? `/${params.locale}` : '';
  return redirect(`${locale}/collections/sale`, { status: 301 });
}
