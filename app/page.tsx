import Link from 'next/link';
import { getAllFlows } from '@/lib/flows/registry';
import { questionTypeMeta } from '@/lib/flows/question-types/metadata';

export default function HomePage() {
  const flows = getAllFlows();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Client-Side Quiz POC</h1>
          <p className="text-gray-600 mt-1">
            Flow definitions in code • PR-based changes
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">
        {/* Available Flows */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Available Flows</h2>
          </div>
          <div className="space-y-3">
            {flows.map((flow) => (
              <div
                key={flow.id}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900">{flow.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    v{flow.version} • {flow.steps.length} steps • {Object.keys(flow.outcomes).length} outcomes
                  </p>
                </div>
                <Link
                  href={`/flows/${flow.id}`}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View
                </Link>
              </div>
            ))}
            {flows.length === 0 && (
              <div className="p-8 bg-white rounded-xl border border-gray-200 text-center">
                <p className="text-gray-500">No flows defined yet.</p>
                <p className="text-sm text-gray-400 mt-1">
                  Add flows in <code className="bg-gray-100 px-1 rounded">lib/flows/definitions/</code>
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Question Types */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Question Types</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {questionTypeMeta.map((qt) => (
              <Link
                key={qt.type}
                href={`/question-types/${qt.type}`}
                className={`
                  flex items-center justify-center px-4 py-3 rounded-xl border font-medium text-sm
                  hover:shadow-md transition-all
                  ${qt.color}
                `}
              >
                {qt.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
