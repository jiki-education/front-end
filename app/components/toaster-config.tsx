import { Toaster } from "react-hot-toast";

export function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#363636",
          color: "#fff"
        },
        success: {
          style: {
            background: "green"
          }
        },
        error: {
          style: {
            background: "red"
          }
        }
      }}
    />
  );
}
