import { ReferrerSheet } from "@/components/admin/referrer-sheet";

export default async function InterceptedReferrerDetail({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  return <ReferrerSheet id={id} locale={locale} />;
}
