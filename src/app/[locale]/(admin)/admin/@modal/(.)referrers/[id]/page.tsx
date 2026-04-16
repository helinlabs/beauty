import { Suspense } from "react";

import { ReferrerSheet } from "@/components/admin/referrer-sheet";

export default async function InterceptedReferrerDetail({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  return (
    <Suspense fallback={null}>
      <ReferrerSheet id={id} locale={locale} />
    </Suspense>
  );
}
