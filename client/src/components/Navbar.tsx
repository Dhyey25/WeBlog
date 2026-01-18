import { NavLink } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../hooks"
import SearchBar from "./SearchBar"
import { useEffect, useRef, useState } from "react"
import { logout } from "../features/userSlice"
import confirm from "./ConfirmationComponent"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { loading, isAuthenticated } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const dropdownRef = useRef<any>(null)
  const iconRef = useRef<any>(null)

  const handleClickOutside = (event: any) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !iconRef.current?.contains(event.target)
    ) {
      setIsOpen(false)
    }
  }

  const handleLogout = async () => {
    const confirmLogout = await confirm(
      "Are you sure you want to logout? This will clear all saved data.",
      {
        title: "Logout",
        deleteButton: "Logout",
        cancelButton: "Cancel",
      },
    )
    if (confirmLogout === false) return
    dispatch(logout())
    setIsOpen(false)
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div>
      <nav className="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <NavLink
            to={`${!loading && isAuthenticated ? "/feed" : "/"}`}
            className="flex items-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="h-6 md:h-8 "
            >
              <g data-name="75-Write">
                <path d="M30 7v18a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5h18a5 5 0 0 1 5 5zm-2 0a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v18a3 3 0 0 0 3 3h18a3 3 0 0 0 3-3z" />
                <path d="M22.38 24H11a3 3 0 0 1 0-6h4v-2h-4a5 5 0 0 1 0-10h11.38a3 3 0 0 1 0 6h-4v2h4a5 5 0 0 1 0 10zm0-16H11a3 3 0 0 0 0 6h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H11a3 3 0 0 0 0 6h11.38a3 3 0 0 0 0-6h-6a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h6a3 3 0 0 0 0-6z" />
              </g>
            </svg>
            <span className="self-center text-lg md:text-2xl font-semibold whitespace-nowrap text-dark">
              WeBlog
            </span>
          </NavLink>

          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
              <li>
                <NavLink
                  to="/feed"
                  className="block py-2 px-3 text-dark rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-highlight md:p-0"
                >
                  Blogs
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/#features"
                  className="block py-2 px-3 text-dark rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-highlight md:p-0"
                >
                  Features
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/#pricing"
                  className="block py-2 px-3 text-dark rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-highlight md:p-0"
                >
                  Pricing
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/#contact"
                  className="block py-2 px-3 text-dark rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-highlight md:p-0"
                >
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>

          {!loading && !isAuthenticated ? (
            <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
              <NavLink
                to="/sign-in"
                className="text-white bg-dark focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2 text-center"
              >
                <span>Sign In</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 ml-1 inline"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </NavLink>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-4 md:order-2">
              <SearchBar />
              <NavLink
                to={"/write/new_blog"}
                className="bg-dark px-2 md:px-6 hover:bg-highlight transition-all py-2 rounded-3xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-4 md:w-5 aspect-square inline"
                >
                  <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                </svg>
                <span className="hidden md:inline text-white font-medium ml-2">
                  Write
                </span>
              </NavLink>

              <button
                ref={iconRef}
                onClick={() => {
                  setIsOpen(!isOpen)
                }}
                className={`${isOpen ? "bg-highlight" : "bg-dark"} p-2 md:p-3 rounded-full transition-all`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-4 aspect-square"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute z-10 top-20 right-[5%] mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200"
                >
                  <NavLink
                    to={"/profile"}
                    onClick={() => {
                      setIsOpen(false)
                    }}
                    className={`cursor-pointer flex items-center gap-1 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 inline "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                    Profile
                  </NavLink>

                  <button
                    onClick={handleLogout}
                    className={`cursor-pointer text-left hover:bg-red-50 flex items-center gap-1 w-full px-4 py-2 text-sm text-red-600`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                      />
                    </svg>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

export default Navbar