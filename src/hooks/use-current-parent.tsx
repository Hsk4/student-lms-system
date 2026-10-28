"use client";

import * as React from "react";

import {
  MOCK_PARENT,
  SIMULATE_SINGLE_CHILD_LINKED,
  getHomeAlertsForChild,
  getLinkedChildren,
} from "@/app/parent/mock/data";
import type {
  HomeAlert,
  LinkedChild,
  ParentProfile,
} from "@/app/parent/mock/types";

export const ALL_CHILDREN_ID = "all";

interface CurrentParentContextValue {
  parent: ParentProfile;
  linkedChildren: LinkedChild[];
  selectedChildId: string;
  setSelectedChildId: (childId: string) => void;
  selectedChild: LinkedChild | null;
  isAllChildrenSelected: boolean;
  showSwitcher: boolean;
  scopedChildId: string;
  getHomeAlerts: () => HomeAlert[];
}

const CurrentParentContext =
  React.createContext<CurrentParentContextValue | null>(null);

export function CurrentParentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const linkedChildren = React.useMemo(() => getLinkedChildren(), []);
  const onlyChild = SIMULATE_SINGLE_CHILD_LINKED ? linkedChildren[0] : null;

  const [selectedChildId, setSelectedChildId] = React.useState<string>(
    onlyChild ? onlyChild.id : ALL_CHILDREN_ID,
  );

  const value = React.useMemo<CurrentParentContextValue>(() => {
    const selectedChild = SIMULATE_SINGLE_CHILD_LINKED
      ? (onlyChild ?? null)
      : (linkedChildren.find((child) => child.id === selectedChildId) ?? null);

    const isAllChildrenSelected =
      !SIMULATE_SINGLE_CHILD_LINKED && selectedChild === null;

    const scopedChildId = isAllChildrenSelected
      ? ALL_CHILDREN_ID
      : (selectedChild?.id ?? ALL_CHILDREN_ID);

    return {
      parent: MOCK_PARENT,
      linkedChildren,
      selectedChildId: scopedChildId,
      setSelectedChildId,
      selectedChild,
      isAllChildrenSelected,
      showSwitcher: !SIMULATE_SINGLE_CHILD_LINKED && linkedChildren.length > 1,
      scopedChildId,
      getHomeAlerts: () => getHomeAlertsForChild(scopedChildId),
    };
  }, [linkedChildren, onlyChild, selectedChildId]);

  return (
    <CurrentParentContext.Provider value={value}>
      {children}
    </CurrentParentContext.Provider>
  );
}

export function useCurrentParent(): CurrentParentContextValue {
  const context = React.useContext(CurrentParentContext);
  if (!context) {
    throw new Error(
      "useCurrentParent must be used within a CurrentParentProvider",
    );
  }
  return context;
}
