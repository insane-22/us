import Navbar from "@/components/Navbar";
import Sidenav from "@/components/Sidenav";
import Sidebar from "@/components/chat/Sidebar";
import { getConversations, getUsers } from "@/lib/actions";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const conversations = await getConversations();
  const users = await getUsers();
  return (
    <div className="flex h-screen relative flex-col ">
      <Navbar />
      <div className="h-full w-full mx-auto flex md:flex-row md:overflow-hidden">
        <div className="w-20 flex-none lg:w-96   md:border-r">
          <Sidebar users={users} initialConversations={conversations} />
        </div>
        <div className="flex-grow mt-12 md:mt-0 flex-1 w-full md:overflow-y-auto sm:p-6 md:p-12">
          {children}
        </div>
      </div>
    </div>
  );
}
