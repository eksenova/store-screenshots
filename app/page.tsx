export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            Store Screenshots
          </h1>
          <nav className="flex items-center gap-4">
            <a
              href="https://github.com/eksenova/store-screenshots"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      {/* Editor — will be replaced with full editor component */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 p-6">
        {/* Left: Controls */}
        <aside className="w-80 shrink-0 space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="mb-3 text-sm font-semibold text-gray-700">
              Device
            </h2>
            <p className="text-sm text-gray-400">Device picker coming soon</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="mb-3 text-sm font-semibold text-gray-700">
              Screenshot
            </h2>
            <p className="text-sm text-gray-400">Upload area coming soon</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="mb-3 text-sm font-semibold text-gray-700">
              Text
            </h2>
            <p className="text-sm text-gray-400">Text editor coming soon</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="mb-3 text-sm font-semibold text-gray-700">
              Background
            </h2>
            <p className="text-sm text-gray-400">Color picker coming soon</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="mb-3 text-sm font-semibold text-gray-700">
              Export
            </h2>
            <p className="text-sm text-gray-400">Export panel coming soon</p>
          </div>
        </aside>

        {/* Right: Preview */}
        <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-500">
              Screenshot Preview
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Select a device and upload a screenshot to get started
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
