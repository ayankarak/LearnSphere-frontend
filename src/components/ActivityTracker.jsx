
import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const IDLE_TIMEOUT = 60 * 1000;
const HEARTBEAT_INTERVAL = 60 * 1000;

function ActivityTracker() {
    const { user, loading } = useAuth();

    const activeSecondsRef = useRef(0);
    const lastActivityRef = useRef(0);
    const lastTickRef = useRef(Date.now());
    const lastHeartbeatRef = useRef(Date.now());
    const requestInProgressRef = useRef(false);

    useEffect(() => {
        if (loading || !user) return;

        activeSecondsRef.current = 0;
        lastActivityRef.current = 0;
        lastTickRef.current = Date.now();
        lastHeartbeatRef.current = Date.now();

        // RECORD USER INTERACTION
        const handleUserActivity = () => {
            lastActivityRef.current = Date.now();
        };

        // HANDLE TAB VISIBILITY
        const handleVisibilityChange = () => {
            lastTickRef.current = Date.now();

            if (document.visibilityState === "visible") {
                lastActivityRef.current = Date.now();
            }
        };

        const events = [
            "mousemove",
            "mousedown",
            "keydown",
            "scroll",
            "touchstart",
            "click",
        ];

        events.forEach((event) => {
            window.addEventListener(event, handleUserActivity, {
                passive: true,
            });
        });

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

        // SEND ACTIVITY TO BACKEND
        const sendHeartbeat = async () => {
            if (requestInProgressRef.current) return;

            const seconds = Math.min(
                activeSecondsRef.current,
                60
            );

            if (seconds <= 0) return;

            requestInProgressRef.current = true;

            try {
                await api.post("/activity/heartbeat", {
                    activeSeconds: seconds,
                });

                activeSecondsRef.current -= seconds;
            } catch (error) {
                console.error(
                    "Failed to save user activity:",
                    error.response?.data?.message || error.message
                );
            } finally {
                requestInProgressRef.current = false;
            }
        };

        // TRACK ACTIVE SECONDS
        const trackerInterval = setInterval(() => {
            const now = Date.now();
            const elapsed = Math.min(
                (now - lastTickRef.current) / 1000,
                2
            );

            lastTickRef.current = now;

            const isVisible =
                document.visibilityState === "visible";

            const isUserActive =
                lastActivityRef.current > 0 &&
                now - lastActivityRef.current <= IDLE_TIMEOUT;

            if (isVisible && isUserActive) {
                activeSecondsRef.current += elapsed;
            }

            // HEARTBEAT EVERY 60 SECONDS
            if (
                now - lastHeartbeatRef.current >=
                HEARTBEAT_INTERVAL
            ) {
                lastHeartbeatRef.current = now;
                sendHeartbeat();
            }
        }, 1000);

        return () => {
            clearInterval(trackerInterval);

            events.forEach((event) => {
                window.removeEventListener(
                    event,
                    handleUserActivity
                );
            });

            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, [user?.id, loading]);

    return null;
}

export default ActivityTracker;
