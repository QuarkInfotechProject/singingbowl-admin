import { ContextProvider } from './_context/context';
import { ContextProvider as AttributeProvider } from '../attribute-sets/_context/context';

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <AttributeProvider>
      <ContextProvider>
        <section>{children}</section>
      </ContextProvider>
      </AttributeProvider>
  );
}
