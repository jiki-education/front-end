import { AppModalRegistrar } from "@/lib/modal/AppModalRegistrar";

// Register the (app)-only modals for every /dev page so modal test pages
// (challenge-unlocked, keyboard, etc.) can trigger them without each page
// mounting the registrar itself. The GlobalModalProvider lives in the root
// layout; it can only render a modal that has been registered.
export default function DevLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AppModalRegistrar />
      {children}
    </>
  );
}
