import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2 sm:p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-3 sm:space-y-4 sm:space-x-4 sm:space-y-0 w-full",
        month: "space-y-2 sm:space-y-4 w-full min-w-0",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-xs sm:text-sm font-medium",
        nav: "space-x-0.5 sm:space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 sm:h-7 sm:w-7 bg-transparent p-0 opacity-50 hover:opacity-100 shrink-0",
        ),
        nav_button_previous: "absolute left-0.5 sm:left-1",
        nav_button_next: "absolute right-0.5 sm:right-1",
        table: "w-full border-collapse space-y-0.5 sm:space-y-1",
        head_row: "flex w-full",
        head_cell: "text-muted-foreground rounded-md flex-1 min-w-0 sm:flex-none sm:w-9 font-normal text-[0.65rem] sm:text-[0.8rem] text-center py-1",
        row: "flex w-full mt-1 sm:mt-2",
        cell: "flex-1 min-w-0 flex items-center justify-center sm:flex-none sm:h-9 sm:w-9 text-center text-xs sm:text-sm p-0.5 sm:p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(buttonVariants({ variant: "ghost" }), "w-full aspect-square max-w-[2.5rem] sm:max-w-none sm:h-9 sm:w-9 sm:aspect-auto p-0 font-normal text-xs sm:text-sm aria-selected:opacity-100 flex items-center justify-center"),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
