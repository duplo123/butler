"use client";

export type ProcessingStage = 
  | "scraping"
  | "extracting"
  | "summarizing"
  | "saving"
  | "complete"
  | "error";

interface ProcessingStatusProps {
  stage: ProcessingStage;
  message?: string;
  error?: string;
}

const stageInfo: Record<ProcessingStage, { label: string; description: string }> = {
  scraping: {
    label: "Scraping Website",
    description: "Fetching content from the camp website...",
  },
  extracting: {
    label: "Extracting Data",
    description: "Using AI to extract structured information...",
  },
  summarizing: {
    label: "Summarizing",
    description: "Generating parent-friendly summary...",
  },
  saving: {
    label: "Saving",
    description: "Saving camp information to your profile...",
  },
  complete: {
    label: "Complete",
    description: "Camp information successfully ingested!",
  },
  error: {
    label: "Error",
    description: "Something went wrong during processing.",
  },
};

export default function ProcessingStatus({
  stage,
  message,
  error,
}: ProcessingStatusProps) {
  const info = stageInfo[stage];
  const stages: ProcessingStage[] = ["scraping", "extracting", "summarizing", "saving"];
  const currentIndex = stages.indexOf(stage);

  return (
    <div className="w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        {/* Current Stage */}
        <div className="flex items-center gap-3">
          {stage === "error" ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          ) : stage === "complete" ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center">
              <svg
                className="animate-spin h-8 w-8 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{info.label}</h3>
            <p className="text-sm text-gray-600">
              {message || error || info.description}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        {stage !== "error" && stage !== "complete" && (
          <div className="flex items-center gap-2">
            {stages.map((s, index) => (
              <div key={s} className="flex flex-1 items-center">
                <div
                  className={`flex h-2 w-full rounded-full ${
                    index <= currentIndex
                      ? "bg-blue-600"
                      : "bg-gray-200"
                  }`}
                />
                {index < stages.length - 1 && (
                  <div className="w-2" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Error Details */}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
