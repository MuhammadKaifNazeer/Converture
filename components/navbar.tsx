"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, Github } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

const navLinks = [
    {
        label: "Home",
        link: "/",
    },
    {
        label: "About",
        link: "/about",
    },
    {
        label: "Privacy Policy",
        link: "/privacy-policy",
    },
];

const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setScrolled(true);
                if (isOpen) {
                    setIsOpen(false);
                }
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isOpen]);

    return (
        <>
            <div
                className={`fixed inset-x-0 top-0 z-[200] mx-auto flex w-full sm:w-[95%] max-w-[85rem] items-center justify-between px-3 sm:px-4 py-4 antialiased md:w-full md:px-9 bg-transparent ${scrolled ? "backdrop-blur-xl shadow-[rgba(0,0,0,0.25)_0px_25px_50px_-12px] sm:rounded-2xl" : ""}`}
            >
                <div className="relative">
                    <Link
                        href="/"
                        className="flex items-center justify-start gap-2"
                    >
                        <Image
                            src="/images/logo.svg"
                            width={30}
                            height={30}
                            alt="logo"
                        ></Image>
                        <h2 className="text-2xl font-bold">Converture</h2>
                    </Link>
                </div>

                <div className="hidden h-full items-center space-x-4 lg:flex lg:space-x-8">
                    <nav
                        aria-label="Main"
                        data-orientation="horizontal"
                        dir="ltr"
                        className="relative z-10 flex max-w-max flex-1 items-center justify-center"
                    >
                        <div style={{ position: "relative" }}>
                            <ul
                                data-orientation="horizontal"
                                className="group flex flex-1 list-none items-center justify-center space-x-1"
                                dir="ltr"
                            >
                                {navLinks.map((link) => (
                                    <li key={link.link}>
                                        <Link
                                            className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                                            href={link.link}
                                            data-radix-collection-item=""
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <ModeToggle />
                                </li>
                                <li>
                                    <Link
                                        className="ml-4 block"
                                        target="_blank"
                                        href="https://github.com/MuhammadKaifNazeer/Converture"
                                    >
                                        <span className="relative z-20 block cursor-pointer rounded-xl bg-primary px-8 py-3 text-center text-sm text-white font-semibold shadow-2xl flex items-center justify-center">
                                            <Github className="mr-1 w-4 h-4" />
                                            Github
                                        </span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="absolute left-0 top-full flex justify-center"></div>
                    </nav>
                </div>

                <div className="flex h-full items-center lg:hidden cursor-pointer gap-1">
                    <ModeToggle />
                    <Button
                        className="px-2 dark:text-white text-black"
                        variant={"ghost"}
                        onClick={toggleMenu}
                    >
                        <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 512 512"
                            height="1.5em"
                            width="1.5em"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M432 176H80c-8.8 0-16-7.2-16-16s7.2-16 16-16h352c8.8 0 16 7.2 16 16s-7.2 16-16 16zM432 272H80c-8.8 0-16-7.2-16-16s7.2-16 16-16h352c8.8 0 16 7.2 16 16s-7.2 16-16 16zM432 368H80c-8.8 0-16-7.2-16-16s7.2-16 16-16h352c8.8 0 16 7.2 16 16s-7.2 16-16 16z"></path>
                        </svg>
                    </Button>
                </div>
            </div>

            <div
                className={`fixed z-[250] pt-4 min-w-screen min-h-screen select-none left-0 top-0 flex inset-0 bg-background z-50 flex-col justify-center items-center space-y-10 text-xl font-bold dark:text-white text-zinc-600 hover:text-zinc-800 transition duration-500 ${isOpen ? "-translate-x-0" : "-translate-x-full"}`}
            >
                <div onClick={toggleMenu} className="cursor-pointer">
                    <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 512 512"
                        className="absolute right-8 top-8 h-5 w-5"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M331.3 308.7L278.6 256l52.7-52.7c6.2-6.2 6.2-16.4 0-22.6-6.2-6.2-16.4-6.2-22.6 0L256 233.4l-52.7-52.7c-6.2-6.2-15.6-7.1-22.6 0-7.1 7.1-6 16.6 0 22.6l52.7 52.7-52.7 52.7c-6.7 6.7-6.4 16.3 0 22.6 6.4 6.4 16.4 6.2 22.6 0l52.7-52.7 52.7 52.7c6.2 6.2 16.4 6.2 22.6 0 6.3-6.2 6.3-16.4 0-22.6z"></path>
                        <path d="M256 76c48.1 0 93.3 18.7 127.3 52.7S436 207.9 436 256s-18.7 93.3-52.7 127.3S304.1 436 256 436c-48.1 0-93.3-18.7-127.3-52.7S76 304.1 76 256s18.7-93.3 52.7-127.3S207.9 76 256 76m0-28C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48z"></path>
                    </svg>
                </div>
                {navLinks.map((link) => (
                    <Link
                        className="relative"
                        href={link.link}
                        key={link.link}
                        onClick={toggleMenu}
                    >
                        <span
                            className="block"
                            style={{
                                opacity: 1,
                                transform: "translateX(0vw) translateZ(0px)",
                            }}
                        >
                            {link.label}
                        </span>
                    </Link>
                ))}
                <Link
                    className="ml-4 block"
                    onClick={toggleMenu}
                    target="_blank"
                    href="https://github.com/MuhammadKaifNazeer/Converture"
                >
                    <span className="relative z-20 block cursor-pointer rounded-xl bg-primary px-8 py-3 text-center text-sm text-white font-semibold shadow-2xl flex items-center justify-center">
                        <Github className="mr-1 w-4 h-4" />
                        Github
                    </span>
                </Link>
            </div>
        </>
    );
};

export default Navbar;
