export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-maroon/20 border-t-maroon rounded-full animate-spin" />
        <p className="text-charcoal/60 text-sm">Loading...</p>
      </div>
    </div>
  );
}
