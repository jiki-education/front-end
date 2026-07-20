import CertificateIcon from "@/icons/certificate.svg";
import EmptyState from "@/components/ui/EmptyState";
import { useTranslations } from "next-intl";

interface CertificatesEmptyStateProps {
  show: boolean;
}

export function CertificatesEmptyState({ show }: CertificatesEmptyStateProps) {
  const t = useTranslations("achievements");
  return (
    <EmptyState
      icon={CertificateIcon}
      title={t("certificatesEmptyTitle")}
      body={t("certificatesEmptyBody")}
      show={show}
    />
  );
}
