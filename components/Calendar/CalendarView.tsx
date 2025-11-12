"use client";

import { Calendar, momentLocalizer, Event } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

interface Camp {
  id: string;
  name: string;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  lifecycleStage: string;
  location?: string | null;
}

interface CalendarViewProps {
  camps: Camp[];
  onEventClick?: (camp: Camp) => void;
}

const stageColors: Record<string, string> = {
  considering: "#FCD34D",
  applied: "#60A5FA",
  registered: "#34D399",
};

export default function CalendarView({ camps, onEventClick }: CalendarViewProps) {
  const events: Event[] = camps
    .filter((camp) => camp.startDate && camp.endDate)
    .map((camp) => ({
      title: camp.name,
      start: new Date(camp.startDate!),
      end: new Date(camp.endDate!),
      resource: camp,
    }));

  const eventStyleGetter = (event: Event) => {
    const camp = event.resource as Camp;
    const backgroundColor = stageColors[camp.lifecycleStage] || "#D1D5DB";

    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.8,
        color: "#1F2937",
        border: "0px",
        display: "block",
        fontWeight: "500",
      },
    };
  };

  const handleSelectEvent = (event: Event) => {
    if (onEventClick && event.resource) {
      onEventClick(event.resource as Camp);
    }
  };

  return (
    <div className="h-[700px] rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-4 flex items-center gap-4">
        <h3 className="text-lg font-semibold">Summer Camp Schedule</h3>
        <div className="flex gap-3 text-sm">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded" style={{ backgroundColor: stageColors.considering }}></div>
            <span>Considering</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded" style={{ backgroundColor: stageColors.applied }}></div>
            <span>Applied</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded" style={{ backgroundColor: stageColors.registered }}></div>
            <span>Registered</span>
          </div>
        </div>
      </div>
      
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleSelectEvent}
        views={["month", "week", "agenda"]}
        defaultView="month"
        style={{ height: "calc(100% - 3rem)" }}
      />
    </div>
  );
}
