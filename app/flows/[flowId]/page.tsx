import Link from 'next/link';
import { getFlow, getFlowVersions } from '@/lib/flows/registry';
import { generateFlowParams } from '@/lib/flows/static-params';

// Required for static export - generate all flow pages at build time
export const generateStaticParams = generateFlowParams;

interface Props {
  params: Promise<{ flowId: string }>;
}

export default async function FlowVersionsPage({ params }: Props) {
  const { flowId } = await params;
  const flow = getFlow(flowId);
  const versions = getFlowVersions(flowId);

  if (!flow) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Flow not found</h1>
          <p className="text-gray-600 mb-4">
            The flow &quot;{flowId}&quot; does not exist.
          </p>
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{flow.name}</h1>
                <p className="text-sm text-gray-500">Flow versions</p>
              </div>
            </div>
            <Link
              href={`/flows/${flow.id}/preview`}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Quiz →
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Details Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="text-gray-900 mt-1">
                {flow.description || 'No description provided'}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Flow ID</label>
              <p className="text-gray-900 mt-1 font-mono text-sm bg-gray-50 px-3 py-2 rounded-lg">
                {flow.id}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Base URL</label>
              <p className="text-gray-900 mt-1 font-mono text-sm bg-gray-50 px-3 py-2 rounded-lg">
                /quiz/{flow.id}
              </p>
            </div>

            <div className="flex gap-8">
              <div>
                <label className="text-sm font-medium text-gray-500">Current Version</label>
                <p className="text-2xl font-bold text-gray-900 mt-1">v{flow.version}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total Versions</label>
                <p className="text-2xl font-bold text-gray-900 mt-1">{versions.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Versions Section */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Versions</h2>
            <p className="text-sm text-gray-500 mt-1">
              Select a version to view the flow visualizer
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {versions.map((v, index) => {
              const isCurrent = v.version === flow.version;
              const isLatest = index === 0;
              
              return (
                <Link
                  key={v.version}
                  href={`/flows/${flow.id}/visualizer?version=${v.version}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      isCurrent ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <svg
                        className={`w-6 h-6 ${isCurrent ? 'text-blue-600' : 'text-gray-500'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">v{v.version}</span>
                        {isCurrent && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                            Current
                          </span>
                        )}
                        {isLatest && !isCurrent && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                            Latest
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-0.5">
                        {v.steps.length} steps • {Object.keys(v.outcomes).length} outcomes
                      </div>
                      {v.description && v.description !== flow.description && (
                        <div className="text-xs text-gray-400 mt-1 max-w-md truncate">
                          {v.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 group-hover:text-gray-600">
                      View visualizer
                    </span>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
