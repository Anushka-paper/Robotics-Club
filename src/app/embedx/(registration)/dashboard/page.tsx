import { redirect } from "next/navigation";
import { getAuthenticatedRegistration } from "@/lib/auth";

export default async function DashboardRootPage() {
  const registration = await getAuthenticatedRegistration();

  if (!registration) {
    redirect("/embedx/login");
  }

  redirect(`/embedx/dashboard/${registration.registrationId}`);
}
