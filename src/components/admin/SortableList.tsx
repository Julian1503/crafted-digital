"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface SortableListItem {
  id: string;
  title: string;
  sortOrder: number;
}

interface SortableListProps {
  items: SortableListItem[];
  onReorder: (items: SortableListItem[]) => void;
  renderItem?: (item: SortableListItem) => React.ReactNode;
}

/* ------------------------------------------------------------------ */
/*  SortableItem                                                       */
/* ------------------------------------------------------------------ */

export function SortableItem({
  item,
  renderItem,
}: {
  item: SortableListItem;
  renderItem?: (item: SortableListItem) => React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-md border bg-background px-4 py-3 transition-shadow",
        isDragging && "z-10 scale-[1.02] shadow-lg"
      )}
    >
      <button
        type="button"
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-5" />
      </button>
      {renderItem ? renderItem(item) : (
        <span className="text-sm font-medium">{item.title}</span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SortableList                                                       */
/* ------------------------------------------------------------------ */

export default function SortableList({
  items,
  onReorder,
  renderItem,
}: SortableListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((item) => (
            <SortableItem
              key={item.id}
              item={item}
              renderItem={renderItem}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
