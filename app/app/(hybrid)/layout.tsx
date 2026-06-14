import JsonLd from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo/schemas";

export default function HybridLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      {children}
    </>
  );
}
