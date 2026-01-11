import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterState {
  departments: string[];
  riskLevels: string[];
  statuses: string[];
}

interface FilterDropdownProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const departments = ["Finance", "Operations", "HR", "Legal", "Marketing", "IT", "Sales"];
const riskLevels = ["Low (0-30)", "Medium (31-60)", "High (61-100)"];
const statuses = ["Pending", "Flagged", "Cleared"];

export function FilterDropdown({ filters, onFiltersChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);

  const hasActiveFilters =
    filters.departments.length > 0 ||
    filters.riskLevels.length > 0 ||
    filters.statuses.length > 0;

  const activeCount =
    filters.departments.length + filters.riskLevels.length + filters.statuses.length;

  const toggleDepartment = (dept: string) => {
    const newDepts = filters.departments.includes(dept)
      ? filters.departments.filter((d) => d !== dept)
      : [...filters.departments, dept];
    onFiltersChange({ ...filters, departments: newDepts });
  };

  const toggleRiskLevel = (level: string) => {
    const newLevels = filters.riskLevels.includes(level)
      ? filters.riskLevels.filter((l) => l !== level)
      : [...filters.riskLevels, level];
    onFiltersChange({ ...filters, riskLevels: newLevels });
  };

  const toggleStatus = (status: string) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const clearFilters = () => {
    onFiltersChange({ departments: [], riskLevels: [], statuses: [] });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-muted-foreground hover:text-foreground gap-2",
            hasActiveFilters && "text-primary"
          )}
        >
          <Filter className="w-4 h-4" />
          Filter
          {hasActiveFilters && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
              {activeCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0 font-normal text-xs text-muted-foreground">
            Filter Transactions
          </DropdownMenuLabel>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-destructive hover:text-destructive"
              onClick={(e) => {
                e.preventDefault();
                clearFilters();
              }}
            >
              <X className="w-3 h-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Department
        </DropdownMenuLabel>
        {departments.map((dept) => (
          <DropdownMenuCheckboxItem
            key={dept}
            checked={filters.departments.includes(dept)}
            onCheckedChange={() => toggleDepartment(dept)}
          >
            {dept}
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Risk Level
        </DropdownMenuLabel>
        {riskLevels.map((level) => (
          <DropdownMenuCheckboxItem
            key={level}
            checked={filters.riskLevels.includes(level)}
            onCheckedChange={() => toggleRiskLevel(level)}
          >
            {level}
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Status
        </DropdownMenuLabel>
        {statuses.map((status) => (
          <DropdownMenuCheckboxItem
            key={status}
            checked={filters.statuses.includes(status.toLowerCase())}
            onCheckedChange={() => toggleStatus(status.toLowerCase())}
          >
            {status}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
