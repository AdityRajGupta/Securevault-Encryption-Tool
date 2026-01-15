import Header from './Header.jsx'

export default function DashboardLayout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-8 md:py-12">
          {children}
        </div>
      </main>
    </div>
  )
}
