export default function BookAppointmentLoading() {
  return (
    <>
      <section className="py-12 bg-gradient-to-br from-primary-900 to-primary-800">
        <div className="container-custom">
          <div className="h-10 w-64 bg-white/20 rounded animate-pulse" />
          <div className="h-5 w-48 mt-2 bg-white/10 rounded animate-pulse" />
        </div>
      </section>
      <section className="py-6 bg-white border-b border-neutral-100">
        <div className="container-custom">
          <div className="flex justify-center gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-neutral-200 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
      <section className="section-padding bg-neutral-50">
        <div className="container-custom max-w-4xl">
          <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse mb-6" />
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-white rounded-xl border border-neutral-100 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
