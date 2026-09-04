import { redirect } from "next/navigation";
import { DEFAULT_LEAGUE_SLUG } from "@/lib/leagues";

export default function RecordPage() {
  redirect(`/l/${DEFAULT_LEAGUE_SLUG}/record`);
}
