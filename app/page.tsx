import Link from 'next/link';
import { getAllFlows } from '@/lib/flows/registry';
import { questionTypeMeta } from '@/lib/flows/question-types/metadata';

export default function HomePage() {
  const flows = getAllFlows();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Client-Side Quiz POC</h1>
          <Link
            href="/builder"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Open Builder
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">
        {/* FAQ */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">FAQ</h2>
          </div>
          <div className="space-y-3">
            <details className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-900">What is this?</span>
                <svg
                  className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 pt-2 border-t border-gray-100 text-sm text-gray-600">
                <p>
                  Think of this as a <strong>read-only version of the quiz admin</strong>. 
                  You can browse all quizzes, see every question, preview how they look, 
                  and understand the branching logic — but you can&apos;t edit anything here.
                </p>
              </div>
            </details>

            <details className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-900">How do quizzes get updated?</span>
                <svg
                  className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 pt-2 border-t border-gray-100 text-sm text-gray-600">
                <p>
                  Instead of editing in an admin panel, quiz changes go through a 
                  <strong> formal review process</strong>. A developer makes the change, 
                  it gets reviewed by the team, and then it&apos;s deployed. This means every change is tracked and approved.
                </p>
              </div>
            </details>

            <details className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-900">Where do customers see these quizzes?</span>
                <svg
                  className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 pt-2 border-t border-gray-100 text-sm text-gray-600 space-y-2">
                <p>
                  Customer-facing quizzes would be hosted at specific URLs in the main app 
                  (e.g. <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">/quiz/weight-loss</code>). 
                  These are the screens customers actually interact with.
                </p>
                <p>
                  The pages you&apos;re viewing right now are an <strong>internal tool</strong> — 
                  they&apos;d live on the same domain but at routes customers would never visit. 
                  Think of it as a backstage view for the team.
                </p>
              </div>
            </details>

            <details className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-900">Will this make quiz updates slow?</span>
                <svg
                  className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 pt-2 border-t border-gray-100 text-sm text-gray-600 space-y-2">
                <p>
                  Not necessarily. With a dedicated growth engineering team, changes can move quickly. 
                  The config-driven approach means most updates are straightforward — change a question, 
                  tweak some logic, add an option.
                </p>
                <p>
                  There&apos;s also a big simplification: <strong>everything lives in one codebase</strong>. 
                  Today, quiz changes often touch two separate repos with shared data structures — that 
                  means coordinating deployments, keeping things in sync, and more chances for things to 
                  break. With this approach, the quiz definition and the UI that renders it are in the 
                  same place. One change, one deploy, done.
                </p>
                <p>
                  And a visual builder <strong>can still exist</strong> — it just outputs config files 
                  instead of writing to a database. Non-technical team members could use it to draft 
                  changes, then export the config for an engineer to review and merge. Best of both worlds.
                </p>
                <p>
                  These kinds of structured changes are also <strong>ideal for AI assistance</strong> — 
                  an LLM could likely handle most routine updates with minimal human intervention.
                </p>
                <p>
                  The tradeoff? This approach <strong>drastically reduces the risk of breaking things</strong>. 
                  Every change goes through code review, so subtle bugs or logic errors get caught before 
                  they reach customers.
                </p>
              </div>
            </details>

            <details className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-900">Is this definitely a good idea?</span>
                <svg
                  className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 pt-2 border-t border-gray-100 text-sm text-gray-600 space-y-2">
                <p>
                  Honestly? <strong>Not sure yet.</strong> But I do think it&apos;ll be simpler to build 
                  and maintain than a full admin CMS.
                </p>
                <p>
                  I&apos;m keen to see where this approach breaks down — what edge cases make it painful, 
                  what workflows don&apos;t fit the model. That&apos;s partly what this POC is for.
                </p>
              </div>
            </details>
          </div>
        </section>

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
