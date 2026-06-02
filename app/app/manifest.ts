import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jiki",
    short_name: "Jiki",
    description: "Welcome to Jiki - the best place to learn to code. Fun, effective and free!",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3b82f6",
    icons: [
      {
        src: "/static/images/logo-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/static/images/logo.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };
}
