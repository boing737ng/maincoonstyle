import "server-only";

const siteData = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Maincoon Style",
  phoneDisplay:
    process.env.NEXT_PUBLIC_PHONE_DISPLAY || "+7 (903) 622-01-42",
  phoneTel: process.env.NEXT_PUBLIC_PHONE_TEL || "+79036220142",
  email: process.env.NEXT_PUBLIC_EMAIL || "jpankova103@gmail.com",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export function getSiteData() {
  return siteData;
}

export { ALLOWED_PHOTO_TYPES, MAX_PHOTO_BYTES, MAX_PHOTOS_PER_ANIMAL } from "./shared";