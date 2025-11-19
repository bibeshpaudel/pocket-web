import Header from './Header';
import Footer from './Footer';
import BackgroundOrbs from './BackgroundOrbs';

export default function Layout({ children, searchTerm, onSearchChange }) {
  return (
    <div className="min-h-screen bg-bg text-text font-sans antialiased flex flex-col selection:bg-accent selection:text-white relative overflow-hidden">
      <BackgroundOrbs />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header searchTerm={searchTerm} onSearchChange={onSearchChange} />
        
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
