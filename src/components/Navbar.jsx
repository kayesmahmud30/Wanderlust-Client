"use client";

import { authClient } from "@/lib/auth-client";
import { Avatar, Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  return (
    <nav className="flex items-center justify-between bg-white p-5">
      <ul className="flex gap-3">
        <i>
          <Link href={"/"}>Home</Link>
        </i>
        <i>
          <Link href={"/destinations"}>Destinations</Link>
        </i>
        <i>
          <Link href={"/my-bookings"}>My booking</Link>
        </i>
        <i>
          <Link href={"/add-destination"}>Add Destination</Link>
        </i>
      </ul>

      <div>
        <Image
          src={"/assets/Wanderlast.png"}
          height={150}
          width={150}
          alt="logo"
        />
      </div>

      <ul className="flex items-center gap-3">
        <i>
          <Link href={"/profile"}>Profile</Link>
        </i>
        {user ? (
          <>
            <li>
              <Avatar>
                <Avatar.Image
                  referrerPolicy="no-referrer"
                  alt="John Doe"
                  src={user?.image}
                />
                <Avatar.Fallback>{user.name.charAt(0)}</Avatar.Fallback>
              </Avatar>
            </li>
            <li>
              <Button
                onClick={handleSignOut}
                variant="danger"
                className={"rounded-none"}
              >
                Logout
              </Button>
            </li>
          </>
        ) : (
          <>
            <i>
              <Link href={"/login"}>Login</Link>
            </i>
            <i>
              <Link href={"/signup"}>Sign Up</Link>
            </i>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
