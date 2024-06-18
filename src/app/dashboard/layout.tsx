import Navbar from "@/components/Navbar";
import Sidenav from "@/components/Sidenav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen relative flex-col ">
      <Navbar />
      <div className="h-full w-full mx-auto flex md:flex-row md:overflow-hidden">
        <div className="w-20 flex-none lg:w-64 md:border-r">
          <Sidenav />
        </div>
        <div className="flex-grow mt-12 md:mt-0 flex-1 w-full md:overflow-y-auto sm:p-6 md:p-12">
          {children}
        </div>
      </div>
    </div>
  );
}
