'use client'

import { SessionProvider, useSession } from "next-auth/react";
import PortalBuilderDashboard from "@/components/blocks/portal-builder";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

export default function Edit({ params }: { params: { slug: string } }) {
    return (
        <SessionProvider>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-white bg-gray-900">Loading...</div>}>
                <PortalEdit portalId={params.slug} />
            </Suspense>
        </SessionProvider>
    );
}

function PortalEdit({ portalId }: { portalId: string }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") {
        return <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">Loading...</div>;
    }

    if (!session?.user) {
        return (
            <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
                You don't have access
            </div>
        );
    }

    if (!portalId) {
        router.push("/dashboard"); 
        return null;
    }

    return (
        <div className="bg-gray-900 min-h-screen">
            <PortalBuilderDashboard portalId={portalId} />
        </div>
    );
}