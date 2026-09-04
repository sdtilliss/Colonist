import { redirect } from "next/navigation";
import { DEFAULT_LEAGUE_SLUG } from "@/lib/leagues";

export default function HistoryPage() {
  redirect(`/l/${DEFAULT_LEAGUE_SLUG}/history`);
}
