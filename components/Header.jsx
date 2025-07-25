"use client"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

function Header() {
    const path = usePathname()
    return (
        <div className='fixed left-1/2 top-6 transform -translate-x-1/2 z-50 text-nowarp'>
            <div className='backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-8 py-3 flex items-center  justify-between gap-8'>
                <Link href={"/"}
                    className='mr-10 md:mr-20'
                >
                    Logo
                </Link>

                {path === "/" && (
                    <div className="hidden md:flex space-x-6">
                        <Link
                            href="#features"
                            className="text-white font-medium transition-all duration-300 hover:text-cyan-400 cursor-pointer"
                        >
                            Features
                        </Link>
                        <Link
                            href="#pricing"
                            className="text-white font-medium transition-all duration-300 hover:text-cyan-400 cursor-pointer"
                        >
                            Pricing
                        </Link>
                        <Link
                            href="#contact"
                            className="text-white font-medium transition-all duration-300 hover:text-cyan-400 cursor-pointer"
                        >
                            Contact
                        </Link>
                        <p></p>
                    </div>
                )}
                <div className='flex items-center gap-3 ml:10 md:ml-20'>
                    <SignedOut>
                        <SignInButton />
                        <SignUpButton>
                            <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                                Sign Up
                            </button>
                        </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
        </div>
    )
}

export default Header
