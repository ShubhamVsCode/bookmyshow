import { cn } from "@/lib/utils";
import { ITheatreLayout, Row, Seat, TheatreSection } from "@/types/theatre";

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
                      if (seat.seatNumber === -1 || seat.status === "no-seat") {
                        return (
                          <div
                            key={"seat" + seatIndex + rowIndex + sectionIndex}
                            className="w-6 aspect-square"
                          />
                        );
                      }
                      return (
                        <button
                          key={seat?.seatNumber + rowIndex + sectionIndex}
                          // disabled={seat?.status === "booked"}
                          onClick={() => {
                            handleSeatClick &&
                              handleSeatClick({
                                seat,
                                row,
                                section,
                                seatIndex: seatIndex,
                                rowIndex: rowIndex,
                                sectionIndex: sectionIndex,
                              });
                          }}
                        >
                          <div
                            className={cn(
                              "border w-6 aspect-square rounded-sm text-sm grid place-content-center ",
                              seat?.status === "booked"
                                ? "bg-gray-500 text-gray-400 border-gray-500"
                                : "border-green-400 text-green-500 hover:bg-green-600 hover:text-white"
                            )}
                          >
                            {seat?.seatNumber}
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
    </div>
  );
};

export default ClientLayout;
