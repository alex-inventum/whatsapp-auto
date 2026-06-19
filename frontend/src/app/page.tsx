export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-dark">WhatsApp Auto</h1>
        <p className="text-lg text-gray-600">
          Automatiza respuestas, clasifica conversaciones y configura reenvios.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <a
            href="/dashboard"
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary transition"
          >
            Ir al Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}
