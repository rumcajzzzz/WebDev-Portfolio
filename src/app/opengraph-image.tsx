import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Link preview image (Messenger, LinkedIn, WhatsApp...): white logo on black.
export const alt = "rumcajzdev.pl";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const svg = await readFile(join(process.cwd(), "public/rumcajzlogo.svg"), "utf8");
  // Logo is dark (the loader inverts it via CSS); recolor every fill to white here.
  const whiteSvg = svg.replace(/fill="#[0-9a-fA-F]{6}"/g, 'fill="#ffffff"');
  const src = `data:image/svg+xml;base64,${Buffer.from(whiteSvg).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={780} height={520} alt="" />
      </div>
    ),
    size
  );
}
