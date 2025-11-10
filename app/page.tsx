"use client";

import { useState, useEffect } from "react";
import CaregiverForm, { Caregiver } from "@/components/FamilyProfile/CaregiverForm";
import ChildForm, { Child } from "@/components/FamilyProfile/ChildForm";
import ProfileSummary from "@/components/FamilyProfile/ProfileSummary";
import URLInput from "@/components/CampIngestor/URLInput";
import ProcessingStatus, { ProcessingStage } from "@/components/CampIngestor/ProcessingStatus";
import CampKanban from "@/components/LifecycleTracker/CampKanban";
import CalendarView from "@/components/Calendar/CalendarView";

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

export default function Home() {
  const [activeTab, setActiveTab] = useState<"profile" | "ingest" | "kanban" | "calendar">("profile");
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [camps, setCamps] = useState<Camp[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>("scraping");

  // Initialize family on mount
  useEffect(() => {
    initializeFamily();
  }, []);

  const initializeFamily = async () => {
    try {
      // Get or create family
      const familyRes = await fetch("/api/family");
      const families = await familyRes.json();
      
      let family;
      if (families.length === 0) {
        const createRes = await fetch("/api/family", { method: "POST" });
        family = await createRes.json();
      } else {
        family = families[0];
      }
      
      setFamilyId(family.id);
      setCaregivers(family.caregivers || []);
      setChildren(family.children || []);
      
      // Load camps
      loadCamps(family.id);
    } catch (error) {
      console.error("Error initializing family:", error);
    }
  };

  const loadCamps = async (fid: string) => {
    try {
      const res = await fetch(`/api/camps?familyId=${fid}`);
      const data = await res.json();
      setCamps(data);
    } catch (error) {
      console.error("Error loading camps:", error);
    }
  };

  const handleAddCaregiver = async (caregiver: Omit<Caregiver, "id">) => {
    if (!familyId) return;
    
    try {
      const res = await fetch("/api/caregivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...caregiver, familyId }),
      });
      const newCaregiver = await res.json();
      setCaregivers([...caregivers, newCaregiver]);
    } catch (error) {
      console.error("Error adding caregiver:", error);
    }
  };

  const handleDeleteCaregiver = async (id: string) => {
    try {
      await fetch(`/api/caregivers?id=${id}`, { method: "DELETE" });
      setCaregivers(caregivers.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting caregiver:", error);
    }
  };

  const handleAddChild = async (child: Omit<Child, "id">) => {
    if (!familyId) return;
    
    try {
      const res = await fetch("/api/children", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...child, familyId }),
      });
      const newChild = await res.json();
      setChildren([...children, newChild]);
    } catch (error) {
      console.error("Error adding child:", error);
    }
  };

  const handleDeleteChild = async (id: string) => {
    try {
      await fetch(`/api/children?id=${id}`, { method: "DELETE" });
      setChildren(children.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting child:", error);
    }
  };

  const handleIngestCamp = async (url: string) => {
    if (!familyId) return;
    
    setIsProcessing(true);
    setProcessingStage("scraping");
    
    try {
      // Simulate processing stages
      setTimeout(() => setProcessingStage("extracting"), 1000);
      setTimeout(() => setProcessingStage("summarizing"), 2000);
      setTimeout(() => setProcessingStage("saving"), 3000);
      
      const res = await fetch("/api/camps/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, familyId }),
      });
      
      const newCamp = await res.json();
      
      setProcessingStage("complete");
      setTimeout(() => {
        setIsProcessing(false);
        loadCamps(familyId);
        setActiveTab("kanban");
      }, 1500);
    } catch (error) {
      console.error("Error ingesting camp:", error);
      setProcessingStage("error");
      setTimeout(() => setIsProcessing(false), 2000);
    }
  };

  const handleStageChange = async (campId: string, newStage: string) => {
    try {
      await fetch(`/api/camps/${campId}/stage`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lifecycleStage: newStage }),
      });
      
      if (familyId) {
        loadCamps(familyId);
      }
    } catch (error) {
      console.error("Error updating camp stage:", error);
    }
  };

  const tabs = [
    { id: "profile" as const, label: "👨‍👩‍👧‍👦 Family Profile", emoji: "👨‍👩‍👧‍👦" },
    { id: "ingest" as const, label: "🔍 Ingest Camp", emoji: "🔍" },
    { id: "kanban" as const, label: "📋 Lifecycle Tracker", emoji: "📋" },
    { id: "calendar" as const, label: "📅 Calendar", emoji: "📅" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Summer Schedule Planner
          </h1>
          <p className="text-lg text-gray-600">
            AI-powered family logistics management for summer camps
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 justify-center border-b border-gray-200 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          {/* Family Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Add Caregiver</h2>
                <CaregiverForm onSubmit={handleAddCaregiver} />
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-4">Add Child</h2>
                <ChildForm onSubmit={handleAddChild} />
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-4">Family Summary</h2>
                <ProfileSummary
                  caregivers={caregivers}
                  children={children}
                  onDeleteCaregiver={handleDeleteCaregiver}
                  onDeleteChild={handleDeleteChild}
                />
              </div>
            </div>
          )}

          {/* Ingest Camp Tab */}
          {activeTab === "ingest" && (
            <div className="flex flex-col items-center space-y-6">
              <div className="w-full max-w-2xl">
                <h2 className="text-2xl font-semibold mb-4 text-center">
                  Ingest Summer Camp
                </h2>
                <p className="text-gray-600 text-center mb-6">
                  Paste the URL of a summer camp website to automatically extract camp information.
                </p>
                <URLInput onSubmit={handleIngestCamp} isProcessing={isProcessing} />
              </div>
              
              {isProcessing && (
                <ProcessingStatus stage={processingStage} />
              )}
              
              <div className="w-full max-w-2xl">
                <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                  <p className="font-medium mb-2">💡 Try these example URLs:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>https://www.ymca.org/summer-camps</li>
                    <li>https://www.campfire.org/</li>
                    <li>Any local summer camp website</li>
                  </ul>
                  <p className="mt-3 text-xs">
                    <strong>Note:</strong> Without an OpenAI API key, you'll see placeholder data.
                    Add your key to <code>.env</code> for real AI extraction.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Kanban Tab */}
          {activeTab === "kanban" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Camp Lifecycle Tracker</h2>
              <p className="text-gray-600 mb-6">
                Drag and drop camps between stages to track your summer planning progress.
              </p>
              {camps.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No camps yet!</p>
                  <p className="text-gray-400 mt-2">
                    Go to the "Ingest Camp" tab to add your first camp.
                  </p>
                </div>
              ) : (
                <CampKanban
                  camps={camps}
                  onStageChange={handleStageChange}
                />
              )}
            </div>
          )}

          {/* Calendar Tab */}
          {activeTab === "calendar" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Summer Camp Calendar</h2>
              <p className="text-gray-600 mb-6">
                View all your camps in a calendar format with color-coding by lifecycle stage.
              </p>
              {camps.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No camps to display!</p>
                  <p className="text-gray-400 mt-2">
                    Add camps with dates to see them on the calendar.
                  </p>
                </div>
              ) : (
                <CalendarView camps={camps.filter(c => c.lifecycleStage !== "archived")} />
              )}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <div className="rounded-lg bg-white px-4 py-2 shadow-sm">
            <span className="font-medium">{caregivers.length}</span> Caregivers
          </div>
          <div className="rounded-lg bg-white px-4 py-2 shadow-sm">
            <span className="font-medium">{children.length}</span> Children
          </div>
          <div className="rounded-lg bg-white px-4 py-2 shadow-sm">
            <span className="font-medium">{camps.length}</span> Camps
          </div>
        </div>
      </div>
    </main>
  );
}
