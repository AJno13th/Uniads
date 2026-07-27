import { redirect } from "next/navigation";

/** Keep old postgraduate URL working — content now lives under /courses/masters */
export default function PostgraduateRedirectPage() {
  redirect("/courses/masters");
}
