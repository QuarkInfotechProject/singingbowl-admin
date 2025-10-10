import { MenuProvider } from '../context/contextMenu/context';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <MenuProvider>
      {children}
    </MenuProvider>
  );
}