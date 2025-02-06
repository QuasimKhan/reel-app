"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";  // Import usePathname

export default function Header() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Get the current path

  const closeSidebar = () => setIsOpen(false);
  const openSidebar = () => setIsOpen(true);

  // Helper function to apply active link class
  const getLinkClass = (linkPath: string) => {
    return pathname === linkPath
      ? "btn btn-ghost text-indigo-500"  // Active link style
      : "btn btn-ghost hover:text-indigo-500";  // Inactive link style
  };

  return (
    <header className="navbar bg-base-100 fixed top-0 left-0 right-0 z-50">
      {/* Left Section: Hamburger Menu for Mobile */}
      
      <div className="navbar-start md:hidden">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className={`menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow ${isOpen ? "block" : "hidden"}`}
          >
            <li>
              <Link href="/" onClick={closeSidebar} className={getLinkClass("/")}>
                Home
              </Link>
            </li>
            {!session ? (
              <>
                <li>
                  <Link
                    href="/register"
                    onClick={closeSidebar}
                    className="btn btn-ghost m-2 bg-blue-500 hover:bg-blue-600"
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    onClick={closeSidebar}
                    className="btn btn-ghost m-2 bg-green-500 hover:bg-green-600"
                  >
                    Login
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href={`/profile/${session?.user.id}`} onClick={closeSidebar} className={getLinkClass(`/profile/${session?.user.id}`)}>
                    Profile
                  </Link>
                </li>
                <li>
                  <Link href="/upload" onClick={closeSidebar} className={getLinkClass("/upload")}>
                    Upload
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="btn btn-ghost m-2 bg-red-500 hover:bg-red-600"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Center Section: Logo */}
      <div className="flex items-center justify-between flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          MyReel
        </Link>
      </div>

      {/* Right Section: Profile/Sign Out Buttons */}
      <div className="navbar-end">
        <div className="hidden md:flex space-x-4">
          <Link href="/" className={getLinkClass("/")}>
            Home
          </Link>

          {!session ? (
            <>
              <Link href="/register" className="btn btn-ghost bg-blue-500 hover:bg-blue-600">
                Register
              </Link>
              <Link href="/login" className="btn btn-ghost bg-green-500 hover:bg-green-600">
                Login
              </Link>
            </>
          ) : (
            <>
              <Link href={`/profile/${session.user.id}`} className={getLinkClass(`/profile/${session.user.id}`)}>
                Profile
              </Link>
              <Link href="/upload" className={getLinkClass("/upload")}>
                Upload
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="btn btn-ghost bg-red-500 hover:bg-red-600"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
