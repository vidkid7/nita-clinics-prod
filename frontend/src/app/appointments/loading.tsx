export default function AppointmentsLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <div className="inline-block w-10 h-10 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-neutral-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}
