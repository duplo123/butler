"use client";

interface Camp {
  id: string;
  name: string;
  location?: string | null;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  pricing?: number | null;
  pricingDetails?: string | null;
  lifecycleStage: string;
  activities?: Array<{ activityName: string }>;
}

interface CampCardProps {
  camp: Camp;
  onClick?: () => void;
}

const stageColors: Record<string, string> = {
  considering: "bg-yellow-50 border-yellow-200",
  applied: "bg-blue-50 border-blue-200",
  registered: "bg-green-50 border-green-200",
  archived: "bg-gray-50 border-gray-200",
};

const stageIcons: Record<string, string> = {
  considering: "🤔",
  applied: "📝",
  registered: "✅",
  archived: "📦",
};

export default function CampCard({ camp, onClick }: CampCardProps) {
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-lg border-2 p-4 transition-shadow hover:shadow-md ${
        stageColors[camp.lifecycleStage] || "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">{stageIcons[camp.lifecycleStage]}</span>
            <h3 className="font-semibold text-gray-900">{camp.name}</h3>
          </div>
          
          {camp.location && (
            <p className="mt-1 text-sm text-gray-600">📍 {camp.location}</p>
          )}
          
          {(camp.startDate || camp.endDate) && (
            <p className="mt-1 text-sm text-gray-600">
              📅{" "}
              {camp.startDate && formatDate(camp.startDate)}
              {camp.startDate && camp.endDate && " - "}
              {camp.endDate && formatDate(camp.endDate)}
            </p>
          )}
          
          {camp.pricing !== null && camp.pricing !== undefined && (
            <p className="mt-1 text-sm font-medium text-gray-700">
              💵 ${Number(camp.pricing).toLocaleString()}
              {camp.pricingDetails && (
                <span className="ml-1 text-xs text-gray-500">
                  {camp.pricingDetails}
                </span>
              )}
            </p>
          )}
          
          {camp.activities && camp.activities.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {camp.activities.slice(0, 3).map((activity, index) => (
                <span
                  key={index}
                  className="rounded-full bg-white px-2 py-0.5 text-xs text-gray-700"
                >
                  {activity.activityName}
                </span>
              ))}
              {camp.activities.length > 3 && (
                <span className="rounded-full bg-white px-2 py-0.5 text-xs text-gray-500">
                  +{camp.activities.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
