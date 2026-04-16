import { redirect } from "next/navigation";

export default async function CalendarRedirectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/admin/reservations?view=month`);
}
