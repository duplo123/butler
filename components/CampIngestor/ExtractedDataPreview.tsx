"use client";

interface ExtractedCampData {
  name: string;
  sourceUrl: string;
  description?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  pricing?: string;
  pricingDetails?: string;
  eligibilityCriteria?: string;
  activities?: string[];
  registrationProcess?: {
    timeline?: string;
    method?: string;
    preRegistration?: boolean;
  };
}

interface ExtractedDataPreviewProps {
  data: ExtractedCampData;
  onConfirm: () => void;
  onEdit: (data: ExtractedCampData) => void;
  onCancel: () => void;
}

export default function ExtractedDataPreview({
  data,
  onConfirm,
  onEdit,
  onCancel,
}: ExtractedDataPreviewProps) {
  return (
    <div className="w-full max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-xl font-semibold">Review Extracted Information</h3>
      
      <div className="space-y-4">
        {/* Camp Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Camp Name</label>
          <p className="mt-1 text-gray-900">{data.name || "Not provided"}</p>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <p className="mt-1 text-gray-900">
              {data.startDate ? new Date(data.startDate).toLocaleDateString() : "Not provided"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <p className="mt-1 text-gray-900">
              {data.endDate ? new Date(data.endDate).toLocaleDateString() : "Not provided"}
            </p>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <p className="mt-1 text-gray-900">{data.location || "Not provided"}</p>
        </div>

        {/* Pricing */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Pricing</label>
          <p className="mt-1 text-gray-900">{data.pricing || "Not provided"}</p>
          {data.pricingDetails && (
            <p className="mt-1 text-sm text-gray-600">{data.pricingDetails}</p>
          )}
        </div>

        {/* Activities */}
        {data.activities && data.activities.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Activities</label>
            <ul className="mt-2 list-inside list-disc space-y-1">
              {data.activities.map((activity, index) => (
                <li key={index} className="text-gray-900">
                  {activity}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Eligibility */}
        {data.eligibilityCriteria && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Eligibility</label>
            <p className="mt-1 text-gray-900">{data.eligibilityCriteria}</p>
          </div>
        )}

        {/* Registration Process */}
        {data.registrationProcess && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Registration Process</label>
            <div className="mt-2 space-y-1 text-sm text-gray-900">
              {data.registrationProcess.timeline && (
                <p><span className="font-medium">Timeline:</span> {data.registrationProcess.timeline}</p>
              )}
              {data.registrationProcess.method && (
                <p><span className="font-medium">Method:</span> {data.registrationProcess.method}</p>
              )}
              {data.registrationProcess.preRegistration !== undefined && (
                <p>
                  <span className="font-medium">Pre-registration:</span>{" "}
                  {data.registrationProcess.preRegistration ? "Available" : "Not available"}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        {data.description && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <p className="mt-1 text-gray-900">{data.description}</p>
          </div>
        )}

        {/* Source URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Source URL</label>
          <a
            href={data.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block text-blue-600 hover:text-blue-800"
          >
            {data.sourceUrl}
          </a>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={onConfirm}
          className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save to Considering
        </button>
        <button
          onClick={() => onEdit(data)}
          className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Edit Details
        </button>
        <button
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
