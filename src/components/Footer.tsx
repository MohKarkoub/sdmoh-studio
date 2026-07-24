export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/20 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white/40 font-body text-base">
          &copy; {new Date().getFullYear()} SDMoh Studio. All rights reserved.
        </p>
        <p className="text-white/30 font-body text-base">
          Coloring books for relaxation and creativity
        </p>
      </div>
    </footer>
  );
}
