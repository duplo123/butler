"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import StageColumn from "./StageColumn";
import CampCard from "./CampCard";

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

interface CampKanbanProps {
  camps: Camp[];
  onStageChange: (campId: string, newStage: string) => Promise<void>;
  onCampClick?: (camp: Camp) => void;
}

const stages = [
  { id: "considering", title: "Considering", emoji: "🤔" },
  { id: "applied", title: "Applied", emoji: "📝" },
  { id: "registered", title: "Registered", emoji: "✅" },
  { id: "archived", title: "Archived", emoji: "📦" },
];

export default function CampKanban({
  camps,
  onStageChange,
  onCampClick,
}: CampKanbanProps) {
  const [activeCamp, setActiveCamp] = useState<Camp | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const camp = camps.find((c) => c.id === active.id);
    if (camp) {
      setActiveCamp(camp);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setActiveCamp(null);
      return;
    }

    const campId = active.id as string;
    const newStage = over.id as string;

    // Check if it's a valid stage
    if (!stages.find((s) => s.id === newStage)) {
      setActiveCamp(null);
      return;
    }

    setIsUpdating(true);
    try {
      await onStageChange(campId, newStage);
    } catch (error) {
      console.error("Error updating camp stage:", error);
      // TODO: Show error notification
    } finally {
      setIsUpdating(false);
      setActiveCamp(null);
    }
  };

  const getCampsByStage = (stageId: string) => {
    return camps.filter((camp) => camp.lifecycleStage === stageId);
  };

  return (
    <div className="w-full">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col gap-4 overflow-x-auto pb-4 md:flex-row">
          {stages.map((stage) => {
            const stageCamps = getCampsByStage(stage.id);
            return (
              <StageColumn
                key={stage.id}
                id={stage.id}
                title={stage.title}
                emoji={stage.emoji}
                count={stageCamps.length}
              >
                {stageCamps.map((camp) => (
                  <div
                    key={camp.id}
                    id={camp.id}
                    className={isUpdating ? "opacity-50" : ""}
                  >
                    <CampCard
                      camp={camp}
                      onClick={() => onCampClick && onCampClick(camp)}
                    />
                  </div>
                ))}
              </StageColumn>
            );
          })}
        </div>

        <DragOverlay>
          {activeCamp ? (
            <div className="rotate-3 opacity-75">
              <CampCard camp={activeCamp} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {isUpdating && (
        <div className="fixed bottom-4 right-4 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-lg">
          Updating camp stage...
        </div>
      )}
    </div>
  );
}
