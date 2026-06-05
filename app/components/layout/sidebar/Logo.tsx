import Image from "next/image";

export function Logo() {
  return (
    <div className="logo">
      <Image src="/static/images/logo.png" alt="Jiki" width={215} height={133} className="full-logo" priority />
    </div>
  );
}
