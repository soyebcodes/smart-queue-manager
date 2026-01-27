import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-muted/40 font-sans">
      <Sidebar />
      <div className="flex flex-col lg:pl-64 min-h-screen">
        <Header />
        <main className="flex-1 p-4 lg:p-6 mt-14 lg:mt-[60px] w-11/12 mx-auto max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
}
