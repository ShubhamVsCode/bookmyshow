import { ITheatreLayout } from "@/types/theatre";

export const theatre1: ITheatreLayout = [
  {
    name: "Recliner",
    pricing: {
      IN: 390.0,
      US: 20.5,
    },
    rows: [
      {
        rowName: "A",
        rowSeats: [
          {
            seatNumber: 1,
            status: "available",
          },
          {
            seatNumber: 2,
            status: "available",
          },
          {
            seatNumber: 3,
            status: "available",
          },
          {
            seatNumber: -1,
            status: "no-seat",
          },
          {
            seatNumber: 4,
            status: "available",
          },
          {
            seatNumber: 5,
            status: "booked",
          },
          {
            seatNumber: 6,
            status: "booked",
          },
          {
            seatNumber: 7,
            status: "available",
          },
        ],
        type: "row",
      },
      {
        rowName: "B",
        rowSeats: [
          {
            seatNumber: 1,
            status: "available",
          },
          {
            seatNumber: 2,
            status: "available",
          },
          {
            seatNumber: 3,
            status: "booked",
          },
          {
            seatNumber: 4,
            status: "available",
          },
          {
            seatNumber: 5,
            status: "available",
          },
          {
            seatNumber: 6,
            status: "available",
          },
          {
            seatNumber: 7,
            status: "available",
          },
        ],
        type: "row",
      },
      {
        rowName: "C",
        rowSeats: [
          {
            seatNumber: 1,
            status: "booked",
          },
          {
            seatNumber: 2,
            status: "available",
          },
          {
            seatNumber: 3,
            status: "booked",
          },
          {
            seatNumber: 4,
            status: "available",
          },
          {
            seatNumber: 5,
            status: "available",
          },
          {
            seatNumber: 6,
            status: "available",
          },
          {
            seatNumber: 7,
            status: "booked",
          },
          {
            seatNumber: 8,
            status: "available",
          },
        ],
        type: "no-row",
      },
    ],
  },
];
