export default function Footer() {
  return (
    <footer className="w-full border-t-4 border-border dark:border-darkBorder bg-bg dark:bg-darkBg p-6 mt-auto">
      <div className="container mx-auto text-center font-base">
        <p>Pocket © {new Date().getFullYear()} - A collection of browser-based utility tools</p>
        <p className="text-sm mt-2 opacity-75">All processing happens in your browser - no data is sent to any server</p>
      </div>
    </footer>
  );
}
