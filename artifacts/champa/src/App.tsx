import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import HomePage from "@/pages/HomePage";
import ChatPage from "@/pages/ChatPage";
import TasksPage from "@/pages/TasksPage";
import MemoryPage from "@/pages/MemoryPage";
import AccountPage from "@/pages/AccountPage";
import NotFound from "@/pages/not-found";
import BottomNav from "@/components/BottomNav";

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-black text-white w-full max-w-md mx-auto relative overflow-hidden border-x border-border/30">
      <main className="flex-1 overflow-y-auto pb-20 no-scrollbar">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/home" component={HomePage} />
          <Route path="/chat" component={ChatPage} />
          <Route path="/tasks" component={TasksPage} />
          <Route path="/memory" component={MemoryPage} />
          <Route path="/account" component={AccountPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div className="bg-zinc-950 min-h-[100dvh] flex justify-center">
            <Router />
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
