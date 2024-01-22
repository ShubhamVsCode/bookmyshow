import { cn } from "@/lib/utils";
import {
  ITheatreLayout,
  Row,
  Seat,
  SeatStatus,
  TheatreSection,
} from "@/types/theatre";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SelectionArea, { SelectionEvent } from "@viselect/react";
import { useState } from "react";

const ClientLayout = ({
  layout,
  handleSeatClick,
  selected,
  setSelected,
}: {
  layout: ITheatreLayout;
  selected: Set<string>;
  setSelected: (value: Set<string>) => void;
  handleSeatClick?: (data: {
    seat: Seat;
    row: Row;
    section: TheatreSection;
    seatIndex: number;
    rowIndex: number;
    sectionIndex: number;
    status: SeatStatus;
  }) => void;
}) => {
  const extractIds = (els: Element[]): string[] =>
    els
      .map((v) => v.getAttribute("data-key"))
      .filter(Boolean)
      .map(String);

  const onStart = ({ event, selection }: SelectionEvent) => {
    if (!event?.ctrlKey && !event?.metaKey) {
      selection.clearSelection();
      setSelected(new Set());
    }
  };

  const onMove = ({
    store: {
      changed: { added, removed },
      touched,
    },
  }: SelectionEvent) => {
    // console.log("Moving...");
    setSelected((prev: string) => {
      // console.log({ prev, added, removed });
      const next = new Set(prev);
      const id = extractIds(added);
      // console.log("id", id);
      extractIds(added).forEach((id) => next.add(id));
      extractIds(removed).forEach((id) => next.delete(id));
      return next;
    });
  };

  const onStop = ({ event, selection, store }: SelectionEvent) => {
    // console.log("Stop", { event, selection, store });
  };

  return (
    <div>
      <SelectionArea
        className="mx-5 h-[75vh] overflow-y-scroll"
        onStart={onStart}
        onMove={onMove}
        onStop={onStop}
        onClick={() => {
          setSelected(new Set());
          // console.log("Clicked");
        }}
        selectables=".selectable"
      >
        {layout.map((section, sectionIndex) => {
          return (
            <div key={sectionIndex} className="mb-3 selection:bg-transparent">
              <div className="mb-2">
                {section.name} Rs.{section.pricing.IN}
              </div>
              <div className="grid gap-2">
                {section.rows.map((row, rowIndex) => {
                  if (row.type === "no-row") {
                    return (
                      <div
                        key={"row" + rowIndex + "no-row" + sectionIndex}
                        className="w-6 aspect-square"
                      />
                    );
                  }
                  return (
                    <div
                      key={"row" + rowIndex + sectionIndex}
                      className="flex gap-2"
                    >
                      <div className="w-6 aspect-square text-center">
                        {row.rowName}
                      </div>

                      {row.rowSeats.map((seat, seatIndex) => {
                        return (
                          <button
                            key={"seat" + seatIndex + rowIndex + sectionIndex}
                            data-key={`Seat-${seatIndex}-Row-${rowIndex}-Seaction-${sectionIndex}`}
                            className={
                              selected.has(
                                `Seat-${seatIndex}-Row-${rowIndex}-Seaction-${sectionIndex}`
                              )
                                ? "selected selectable border-2 border-dashed"
                                : "selectable border-2 border-transparent"
                            }
                          >
                            <div
                              className={cn(
                                "border w-6 aspect-square rounded-sm text-sm grid place-content-center ",
                                seat?.status === SeatStatus.BOOKED &&
                                  "bg-gray-500 text-gray-400 border-gray-500",
                                seat.status === SeatStatus.AVAILABLE &&
                                  "border-green-400 text-green-500 hover:bg-green-600 hover:text-white",
                                seat.status === SeatStatus.RESERVED &&
                                  "border-red-500 bg-red-600 text-white",
                                seat.status === SeatStatus.NO_SEAT &&
                                  "border-gray-500 text-gray-500"
                              )}
                            >
                              {seat.status !== SeatStatus.NO_SEAT &&
                                seat?.seatNumber}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </SelectionArea>

      <div className="h-20 mt-5 text-center">
        <p>All eyes this way please</p>
      </div>
    </div>
  );
};

export default ClientLayout;

{
  /* <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <button>
      <div
        className={cn(
          "border w-6 aspect-square rounded-sm text-sm grid place-content-center ",
          seat?.status === SeatStatus.BOOKED &&
            "bg-gray-500 text-gray-400 border-gray-500",
          seat.status === SeatStatus.AVAILABLE &&
            "border-green-400 text-green-500 hover:bg-green-600 hover:text-white",
          seat.status === SeatStatus.RESERVED &&
            "border-red-500 bg-red-600 text-white",
          seat.status === SeatStatus.NO_SEAT && "border-gray-500 text-gray-500"
        )}
      >
        {seat.status !== SeatStatus.NO_SEAT && seat?.seatNumber}
      </div>
    </button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-28">
    <DropdownMenuLabel>Seat Status</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuRadioGroup
      value={seat.status}
      onValueChange={(value) => {
        handleSeatClick &&
          handleSeatClick({
            seat,
            row,
            section,
            seatIndex: seatIndex,
            rowIndex: rowIndex,
            sectionIndex: sectionIndex,
            status: value as SeatStatus,
          });
      }}
    >
      <DropdownMenuRadioItem value={SeatStatus.AVAILABLE}>
        Available
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem value={SeatStatus.RESERVED}>
        Reserved
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem value={SeatStatus.NO_SEAT}>
        No Seat
      </DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  </DropdownMenuContent>
</DropdownMenu>; */
}
