export interface Seat {
  seatNumber: number; // for no-seat seat no. is -1
  status: "available" | "booked" | "no-seat" | "reserved";
  isSvg?: boolean;
  svg?: string;
}

export interface Row {
  rowName: string;
  rowSeats: Seat[];
  type: "row" | "no-row";
}

export interface TheatreSection {
  name: string;
  pricing: {
    IN: number;
    US: number;
  };
  rows: Row[];
}

export type ITheatreLayout = TheatreSection[];
