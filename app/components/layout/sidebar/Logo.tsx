import Image from "next/image";

export function Logo() {
  return (
    <div className="logo">
      <Image src="/static/images/logo-4.png" alt="Jiki" width={215} height={93} className="full-logo" priority />
    </div>
  );
}
