import { redirect } from "next/navigation";
import { getAuthenticatedRegistration } from "@/lib/auth";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage({ params }: { params: Promise<{ registrationId: string }> }) {
  const { registrationId } = await params;
  const registration = await getAuthenticatedRegistration();

  if (!registration) {
    redirect("/embedx/login");
  }

  if (registration.registrationId !== registrationId.toUpperCase()) {
    redirect(`/embedx/dashboard/${registration.registrationId}`);
  }

  return <DashboardClient />;
}
