export default function Errored() {
  return (
    <div className="w-full flex items-center justify-center h-screen" data-testid="error-container">
      <div className="max-w-md p-4 bg-red-800 rounded-lg shadow-md" data-testid="error-box">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-white">Please try again later.</p>
      </div>
    </div>
  );
}
