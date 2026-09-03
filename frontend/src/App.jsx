import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "@/components/Header";
import Dashboard from "@/pages/Dashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Dashboard />
        </main>
      </div>
    </QueryClientProvider>
  );
}
