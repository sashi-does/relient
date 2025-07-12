import options from "@/app/api/auth/[...nextauth]/options";
import OnboardingForm from "@/components/spectrumui/multistepformdemo";
import { prisma } from "@repo/db/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Onboarding() {
    const session = await getServerSession(options)
    if(!session?.user) {
        redirect("/")
    }
    const user = await prisma.user.findFirst({
        where: {
            email: (session.user as { email: string }).email
        }
    })
    if(user?.onboarded) {
        redirect("/dashboard")
    }
    return <OnboardingForm />
}