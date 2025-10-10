import { PermissionContextProvider } from './context/context';
import { ContextProvider } from '../roles/_context/context';


export default function DashboardLayout({
  children, 
}: {
  children: React.ReactNode;
}) {
  return (
    <PermissionContextProvider>
     
        <ContextProvider>
          <section>{children}</section>
        </ContextProvider>
      
    </PermissionContextProvider>
  );
}
