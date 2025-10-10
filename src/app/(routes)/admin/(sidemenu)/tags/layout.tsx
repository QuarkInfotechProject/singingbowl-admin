import { ContextProvider } from './_context/context';

export default function DashboardLayout({
  children, 
}: {
  children: React.ReactNode;
}) {
  return (
      <ContextProvider>
        <section>{children}</section>
      </ContextProvider>
  );
}
