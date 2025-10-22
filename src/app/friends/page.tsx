import { requireUser } from "@/lib/auth";
import { createClientFromRequest } from "@/lib/supabase/server";

export default async function FirendsPage() {
    const user = await requireUser()
    const supabase = createClientFromRequest()


}