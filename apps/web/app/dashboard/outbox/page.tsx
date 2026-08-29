import { redirect } from "next/navigation";

export default function OutboxRedirect() {
  redirect("/dashboard/messaging?tab=out");
}
