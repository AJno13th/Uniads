import { siteConfig, whatsappLink } from "@/data/site";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-pulse fixed bottom-5 right-5 z-[60] flex max-w-[min(100vw-2rem,20rem)] items-center gap-3 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg transition hover:scale-[1.02] hover:bg-[#1ebe57]"
      aria-label={siteConfig.whatsappMessage}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
          <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.3-1.65a11.9 11.9 0 0 0 5.76 1.47h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.45-8.44ZM12.07 21.15h-.01a9.27 9.27 0 0 1-4.72-1.29l-.34-.2-3.74.98 1-3.64-.22-.37a9.25 9.25 0 0 1-1.42-4.93c0-5.11 4.16-9.27 9.28-9.27a9.22 9.22 0 0 1 6.56 2.72 9.22 9.22 0 0 1 2.72 6.56c0 5.12-4.16 9.28-9.27 9.28Zm5.38-6.95c-.29-.15-1.73-.85-2-.95-.27-.1-.46-.15-.66.15-.2.29-.76.95-.93 1.14-.17.2-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.52-.07-.15-.66-1.59-.9-2.18-.24-.58-.48-.5-.66-.51h-.56c-.2 0-.52.07-.79.37-.27.29-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.73-.71 1.97-1.39.24-.68.24-1.27.17-1.39-.07-.12-.26-.2-.55-.34Z" />
        </svg>
      </span>
      <span className="pr-1 text-left text-xs font-semibold leading-snug sm:text-sm">
        {siteConfig.whatsappMessage}
      </span>
    </a>
  );
}
