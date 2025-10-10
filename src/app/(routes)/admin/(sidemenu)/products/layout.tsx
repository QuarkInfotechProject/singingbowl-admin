// import { ContextProvider } from './_context/context';
import { ContextProvider } from "./(context)/context";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <ContextProvider>
      <section>{children}</section>
    </ContextProvider>
  );
}
