import CertificateIcon from "@/icons/certificate.svg";
import EmptyState from "@/components/ui/EmptyState";

interface CertificatesEmptyStateProps {
  show: boolean;
}

export function CertificatesEmptyState({ show }: CertificatesEmptyStateProps) {
  return (
    <EmptyState
      icon={CertificateIcon}
      title="No certificates yet"
      body="Complete courses to earn certificates that showcase your skills. Your certificates will appear here once you've finished a course."
      show={show}
    />
  );
}
