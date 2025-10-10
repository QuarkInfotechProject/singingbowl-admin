import Sidebar from "@/components/_admin_components/Sidebar";
import Navbar from "@/components/_admin_components/Navbar";
import Footer from "@/components/_admin_components/Footer";
import { MenuProvider } from "./(sidemenu)/context/contextActiveMenu/context";
import { serverSideFetch } from "@/app/_utils/serverSideFetch";
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";
export default async function AdminDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const menu = await getMenuItems();
  const cookieStore = cookies();
  const username = cookieStore.get("currentUser")?.value;
  return (
    <>
      <MenuProvider>
        <section className="flex h-screen overflow-hidden">
          <Sidebar menuData={menu?.data || []} />
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <Navbar username={username} />
            <main>
              <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                {children}
              </div>
            </main>
            <Footer />
          </div>
        </section>
      </MenuProvider>
    </>
  );
}
const getMenuItems = async () => {
  const response = serverSideFetch({
    url: "/menu/active",
  });
  return response;
};
