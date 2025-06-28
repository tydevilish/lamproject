"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("/api/me", {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) {
                    router.push("/login");
                    return;
                }

                const data = await res.json();
                setUser(data.user);
            } catch (err) {
                console.error("Error fetching user:", err);
                router.push("/login");
            }
        }

        fetchUser();
    }, []);

    const handleLogout = async () => {
        await fetch("/api/logout", {
            method: "POST",
            credentials: "include",
        });
        router.push("/login");
    };

    return (
        <div className="p-4">
            <h1>📊 หน้าหลัก Dashboard</h1>
            <div className="d-flex gap-2">
                <p>สวัสดีคุณ</p>
                <p className="thai-extra-bold"> {user?.username} </p>
            </div>
            <button onClick={handleLogout} className="btn btn-danger">
                ออกจากระบบ
            </button>
        </div>
    );
}
