"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

export function ModeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            className="px-2"
            variant={"ghost"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </Button>
    );
}
