"use client";

import { Suspense } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { ReferrersList } from "@/components/admin/referrers-list";
import { ReferrerSheet } from "@/components/admin/referrer-sheet";

interface Props {
  locale: string;
}

/**
 * Reads `?refId=<id>` to open the referrer sheet on top of the list.
 * Mirrors the reservation pattern (`?detailId=…`) so we avoid the
 * `@modal` parallel-route slot that Cloud Run mishandles (URL %40
 * decoding → chunk 404 → client-side exception).
 */
function ReferrersContainerInner({ locale }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const refId = search.get("refId");

  function openDetail(id: string) {
    const sp = new URLSearchParams(search.toString());
    sp.set("refId", id);
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
  }

  function close() {
    const sp = new URLSearchParams(search.toString());
    sp.delete("refId");
    sp.delete("detailId");
    const q = sp.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }

  return (
    <>
      <ReferrersList onOpenDetail={openDetail} />
      {refId && <ReferrerSheet id={refId} locale={locale} onClose={close} />}
    </>
  );
}

export function ReferrersContainer(props: Props) {
  return (
    <Suspense fallback={null}>
      <ReferrersContainerInner {...props} />
    </Suspense>
  );
}
