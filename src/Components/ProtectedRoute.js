// src/components/ProtectedRoute.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token"); // or cookie
        if (!token) {
            router.replace("/"); // redirect if not authenticated
        } else {
            setIsLoading(false);
        }
    }, [router]);

    if (isLoading) return <div>Loading...</div>;

    return <>{children}</>;
}
