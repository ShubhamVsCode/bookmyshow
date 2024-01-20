"use client";
import AdminLayout from "@/components/admin-layout";
import ClientLayout from "@/components/client-layout";
import { theatre1 } from "@/constants/theatre";
import { ITheatreLayout, Seat, TheatreSection, Row } from "@/types/theatre";
import { useState } from "react";

const BookingPage = () => {
  const [layout, setLayout] = useState<ITheatreLayout>(theatre1);

  const handleSeatClick = (data: {
    seat: Seat;
    row: Row;
    section: TheatreSection;
  }) => {
    // console.log(seat, row, section.name);
    // console.log(
    //   `In ${section.name} of Rs. ${section.pricing.IN} ticket with seat no. ${seat.seatNumber} in row ${row.rowName}`
    // );
  };

  return (
    <div className="grid grid-cols-2 my-10 mx-20">
      {/* <ClientLayout layout={layout} handleSeatClick={handleSeatClick} /> */}
      <AdminLayout />
    </div>
  );
};

export default BookingPage;
