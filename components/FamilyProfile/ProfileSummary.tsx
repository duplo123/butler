"use client";

import { Caregiver } from "./CaregiverForm";
import { Child } from "./ChildForm";

interface ProfileSummaryProps {
  caregivers: Caregiver[];
  children: Child[];
  onEditCaregiver?: (caregiver: Caregiver) => void;
  onDeleteCaregiver?: (id: string) => void;
  onEditChild?: (child: Child) => void;
  onDeleteChild?: (id: string) => void;
}

export default function ProfileSummary({
  caregivers,
  children,
  onEditCaregiver,
  onDeleteCaregiver,
  onEditChild,
  onDeleteChild,
}: ProfileSummaryProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Caregivers ({caregivers.length})</h3>
        {caregivers.length === 0 ? (
          <p className="text-gray-500 italic">No caregivers added yet</p>
        ) : (
          <div className="space-y-2">
            {caregivers.map((caregiver) => (
              <div
                key={caregiver.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
              >
                <div>
                  <p className="font-medium">{caregiver.name}</p>
                  {caregiver.email && (
                    <p className="text-sm text-gray-600">{caregiver.email}</p>
                  )}
                  {caregiver.phone && (
                    <p className="text-sm text-gray-600">{caregiver.phone}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {onEditCaregiver && (
                    <button
                      onClick={() => onEditCaregiver(caregiver)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  )}
                  {onDeleteCaregiver && caregiver.id && (
                    <button
                      onClick={() => onDeleteCaregiver(caregiver.id!)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Children ({children.length})</h3>
        {children.length === 0 ? (
          <p className="text-gray-500 italic">No children added yet</p>
        ) : (
          <div className="space-y-2">
            {children.map((child) => (
              <div
                key={child.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
              >
                <div>
                  <p className="font-medium">{child.name}</p>
                  <p className="text-sm text-gray-600">
                    Age: {child.age}
                    {child.gender && ` • ${child.gender}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    Born: {new Date(child.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {onEditChild && (
                    <button
                      onClick={() => onEditChild(child)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  )}
                  {onDeleteChild && child.id && (
                    <button
                      onClick={() => onDeleteChild(child.id!)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
