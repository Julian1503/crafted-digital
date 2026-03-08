"use client";

import { useState } from "react";
import LoadingScreen from "@/components/ui/LoadingScreen/LoadingScreen";

export default function PageLoader({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(() => {
        if (typeof window === "undefined") return true;
        return !sessionStorage.getItem("loaded");
    });
    const onComplete = () => {
    }

    return (
        <>
            {loading && <LoadingScreen onComplete={onComplete} />}
            {children}
        </>
    );
}