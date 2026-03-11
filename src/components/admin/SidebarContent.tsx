import {ChevronDown, ChevronLeft} from "lucide-react";
import {cn} from "@/lib/utils";
import {NAV_GROUPS} from "@/components/admin/admin.data";
import Link from "next/link";

interface SidebarContentProps {
    isMobile?: boolean;
    collapsed: boolean;
    expandedGroups: Record<string, boolean>;
    toggleGroup: (groupTitle: string) => void;
    isActive: (href: string) => boolean;
    onToggleCollapsed: () => void;
}

export default function SidebarContent({
                                           isMobile = false,
                                           collapsed,
                                           expandedGroups,
                                           toggleGroup,
                                           isActive,
                                           onToggleCollapsed,
                                       }: SidebarContentProps) {
    return (
        <nav className="flex h-full flex-col" aria-label="Admin navigation">
            <div className="flex h-14 items-center gap-2 border-b border-white/10 px-4">
                {(!collapsed || isMobile) && (
                    <span className="text-lg font-bold text-white">Admin</span>
                )}

                {!isMobile && (
                    <button
                        onClick={onToggleCollapsed}
                        className="ml-auto rounded-md p-1 text-slate-400 transition-colors duration-150 hover:bg-white/10 hover:text-white"
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        <ChevronLeft
                            className={cn(
                                "size-4 transition-transform duration-200",
                                collapsed && "rotate-180"
                            )}
                        />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-3">
                {NAV_GROUPS.map((group) => {
                    const open = expandedGroups[group.title] ?? true;

                    return (
                        <div key={group.title} className="mb-1">
                            {(!collapsed || isMobile) && (
                                <button
                                    onClick={() => toggleGroup(group.title)}
                                    className="flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 transition-colors duration-150 hover:text-slate-200"
                                >
                                    <span className="flex-1 text-left">{group.title}</span>
                                    <ChevronDown
                                        className={cn(
                                            "size-3 transition-transform duration-200",
                                            !open && "-rotate-90"
                                        )}
                                    />
                                </button>
                            )}

                            <div
                                className={cn(
                                    "grid transition-[grid-template-rows] duration-200 ease-out",
                                    collapsed && !isMobile
                                        ? "grid-rows-[1fr]"
                                        : open
                                            ? "grid-rows-[1fr]"
                                            : "grid-rows-[0fr]"
                                )}
                            >
                                <div className="overflow-hidden">
                                    {group.items.map((item) => {
                                        const Icon = item.icon;
                                        const active = isActive(item.href);

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={cn(
                                                    "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                                                    active
                                                        ? "border-l-2 border-secondary bg-white/10 text-white"
                                                        : "border-l-2 border-transparent text-slate-300 hover:bg-white/5 hover:text-white"
                                                )}
                                                title={collapsed && !isMobile ? item.label : undefined}
                                            >
                                                <Icon className="size-4 shrink-0" />
                                                {(!collapsed || isMobile) && <span>{item.label}</span>}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </nav>
    );
}