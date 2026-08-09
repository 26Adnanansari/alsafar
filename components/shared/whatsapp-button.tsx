import Link from "next/link";
import { MessageCircle } from "lucide-react";

/**
 * Floating WhatsApp button — always visible, top layer.
 * Replace WHATSAPP_NUMBER with the real business number (country code, no +/spaces).
 */
const WHATSAPP_NUMBER = "923000000000";
const DEFAULT_MESSAGE = "Assalam-o-Alaikum, mujhe Hajj/Umrah package ke baare mein maloomat chahiye.";

export function WhatsAppButton() {
  return (
    <Link
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle size={26} />
    </Link>
  );
}
