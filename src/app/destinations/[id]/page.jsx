import BookingCard from "@/components/BookingCard";
import { DeleteAlert } from "@/components/DeleteAlert";
import { EditModal } from "@/components/EditModal";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import React from "react";
import { FaRegCalendar } from "react-icons/fa";
import { LuMapPin } from "react-icons/lu";

const DestinationDetailsPage = async ({ params }) => {
  const { id } = await params;
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });

  // console.log(token);

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/destination/${id}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const destination = await res.json();

  const {
    _id,
    imageUrl,
    price,
    destinationName,
    duration,
    country,
    description,
  } = destination;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-3 justify-end mt-5 mb-3">
        <EditModal destination={destination} />
        <DeleteAlert destination={destination} />
      </div>

      <Image
        className="w-full h-100 mx-auto object-cover"
        alt={destinationName}
        src={imageUrl}
        height={500}
        width={800}
      />

      <div className="flex justify-between">
        <div className="p-2">
          <div className="flex items-center">
            <LuMapPin />
            <span>{country}</span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div>
                <h2 className="text-xl font-bold">{destinationName}</h2>
              </div>
              <div className="flex gap-2 items-center">
                <FaRegCalendar />
                {duration}
              </div>
            </div>
          </div>
          <h1 className="mt-10 text-2xl font-bold">Overview</h1>
          <p>{description}</p>
        </div>

        <BookingCard destination={destination} />
      </div>
    </div>
  );
};

export default DestinationDetailsPage;
