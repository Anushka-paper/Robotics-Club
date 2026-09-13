import { EncryptedText } from "./ui/EncryptedText";

export default function LoadingScreen({ label = "Boot Completed !" }: { label?: string }) {
  return (
    <div className="flex min-h-40 h-screen w-full items-center justify-center bg-[#0a1120] absolute inset-0 z-[100]">
      <div className="text-xl md:text-3xl font-mono font-bold tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
        <EncryptedText
          text={label}
          encryptedClass="text-neutral-500"
          revealedClass="text-white"
          revealDelayMs={50}
        />
      </div>
    </div>
  );
}
