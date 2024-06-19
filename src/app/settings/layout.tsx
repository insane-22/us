import Navbar from "@/components/Navbar";
import TabSettings from "@/components/TabSettings";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    // <div className="flex">
      // <Tabs
      //   defaultValue="edit-profile"
      //   className="w-[250px] min-h-screen fixed space-y-8 left-0 top-0 md:ml-20 lg:ml-64 h-full flex flex-col lg:border-r px-6 py-12"
      //   orientation="vertical"
      // >
      //   <h4 className="font-extrabold text-xl text-white ml-1">Settings</h4>
      //   <TabsList className="flex flex-col items-start justify-start h-full bg-transparent">
      //     {tabs.map((tab) => (
      //       <TabsTrigger
      //         key={tab.value}
      //         value={tab.value}
      //         className={cn(
      //           buttonVariants({ variant: "ghost", size: "lg" }),
      //           "data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-neutral-800 dark:hover:bg-neutral-900 w-full justify-start !px-3"
      //         )}
      //       >
      //         {tab.title}
      //       </TabsTrigger>
      //     ))}
      //   </TabsList>
      // </Tabs>

    //   <div className="flex-1 ml-[200px] xl:ml-32 min-h-screen bg-white dark:bg-neutral-950">
    //     {children}
    //   </div>
    // </div>
    <div className="flex h-screen relative flex-col ">
      <Navbar />
      <div className="h-full w-full mx-auto flex md:flex-row md:overflow-hidden">
        <div className="w-20 flex-none lg:w-64 md:border-r">
          <TabSettings/>
        </div>
        <div className="flex-grow mt-12 md:mt-0 flex-1 w-full md:overflow-y-auto sm:p-6 md:p-12">
          {children}
        </div>
      </div>
    </div>
  );
};

export default layout;
