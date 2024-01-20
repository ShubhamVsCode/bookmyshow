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

const ClientLayout = ({
  layout,
  handleSeatClick,
}: {
  layout: ITheatreLayout;
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
  return (
    <div>
      {layout.map((section, sectionIndex) => {
        return (
          <div key={sectionIndex} className="mb-3">
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
                        <DropdownMenu
                          key={"seat" + seatIndex + rowIndex + sectionIndex}
                        >
                          <DropdownMenuTrigger asChild>
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
                              {seat?.seatNumber}
                            </div>
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
                              <DropdownMenuRadioItem
                                value={SeatStatus.AVAILABLE}
                              >
                                Available
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem
                                value={SeatStatus.RESERVED}
                              >
                                Reserved
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value={SeatStatus.NO_SEAT}>
                                No Seat
                              </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ClientLayout;
