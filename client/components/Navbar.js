import Link from 'next/link'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'

import UpdateProfileModal from './UpdateProfileModal'

const Navbar = () => {
  const [active, setActive] = useState(false)
  const { data: session } = useSession()

  const handleClick = () => {
    setActive(!active)
  }

  return (
    <>
      <nav className="flex items-center flex-wrap bg-red-500 p-2">
        <Link href="/">
          <a className="inline-flex items-center p-2 mr-4 ">
            <span className="text-xl text-white font-bold uppercase tracking-wide">Hypertube</span>
          </a>
        </Link>

        <button
          className="inline-flex p-3 hover:bg-slate-800 rounded lg:hidden text-white ml-auto hover:text-white outline-none"
          onClick={handleClick}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/*Note that in this div we will use a ternary operator to decide whether or not to display the content of the div  */}
        <div className={`${active ? '' : 'hidden'}   w-full lg:inline-flex lg:flex-grow lg:w-auto`}>
          <div className="lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start  flex flex-col lg:h-auto">
            {session && <UpdateProfileModal />}

            {session ? (
              <div className="">
                <button
                  className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-red-200 hover:text-black"
                  onClick={() => signOut()}
                  type="button"
                >
                  LogOut
                </button>
              </div>
            ) : (
              // Router.push('/auth/login')
              <Link href="/auth/login">
                <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-slate-800 hover:text-white">
                  LogIn
                </a>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
