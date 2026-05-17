import { createRootRoute, Outlet } from "@tanstack/react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { Header } from "@/components/site/Header"
import { Footer } from "@/components/site/Footer"

const queryClient = new QueryClient()

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground">
        <Header />

        <main>
          <Outlet />
        </main>

        <Footer />
      </div>
    </QueryClientProvider>
  )
}
