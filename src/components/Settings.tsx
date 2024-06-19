import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const tabs = [
  { title: "Edit profile", value: "edit-profile" },
  { title: "Storage and data", value: "storage-and-data" },
  { title: "Privacy and security", value: "privacy-and-security" },
  { title: "Login activity", value: "login-activity" },
  { title: "Emails from Us", value: "emails-from-us" },
  { title: "Help", value: "help" },
];

const Settings = () => {
  return (
    <>
      <Tabs
        defaultValue="edit-profile"
        orientation="vertical"
      >
        <TabsList className="flex flex-col items-start justify-start h-full bg-transparent">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-neutral-800 dark:hover:bg-neutral-900 w-full justify-start !px-3"
              )}
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </>
  );
};

export default Settings;
