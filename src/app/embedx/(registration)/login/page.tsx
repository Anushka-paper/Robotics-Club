import { redirect } from "next/navigation";
import { getAuthenticatedRegistration } from "@/lib/auth";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const registration = await getAuthenticatedRegistration();

  if (registration) {
    redirect("/embedx/dashboard");
  }

  return <LoginForm />;
}
