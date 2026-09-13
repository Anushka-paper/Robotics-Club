import { redirect } from "next/navigation";
import { getAuthenticatedRegistration } from "@/lib/auth";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const registration = await getAuthenticatedRegistration();

  if (!registration) {
    redirect("/embedx/login");
  }

  return <DashboardClient />;
}
