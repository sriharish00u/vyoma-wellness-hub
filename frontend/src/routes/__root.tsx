import { createRootRoute, Outlet } from "@tanstack/react-router"
import { Component, type ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { Header } from "@/components/site/Header"
import { Footer } from "@/components/site/Footer"
import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"

const queryClient = new QueryClient()

export const Route = createRootRoute({
  component: RootComponent,
})

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-8">
          <div className="max-w-md text-center">
            <h1 className="font-display text-2xl font-bold text-foreground">Something went wrong</h1>
            <p className="mt-2 text-sm text-muted-foreground">An unexpected error occurred. Please try again.</p>
            <Button onClick={() => { this.setState({ hasError: false }); window.location.href = "/"; }} className="mt-6">
              Go home
            </Button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground">
        <Header />

        <main>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>

        <Footer />
      </div>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  )
}
