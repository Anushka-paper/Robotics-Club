import { useEffect, useState } from "react";

const CHARS = "-_~`!@#$%^&*()+=[]{}|;:,.<>?/0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface EncryptedTextProps {
  text: string;
  revealDelayMs?: number;
  className?: string;
  encryptedClass?: string;
  revealedClass?: string;
}

export function EncryptedText({
  text,
  revealDelayMs = 50,
  className = "",
  encryptedClass = "text-neutral-500",
  revealedClass = "text-white dark:text-white text-black",
}: EncryptedTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    let iteration = 0;
    let interval: NodeJS.Timeout;

    const startScrambling = () => {
      interval = setInterval(() => {
        setDisplayText(() => {
          return text
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";
              if (index < iteration) {
                return text[index];
              }
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("");
        });

        iteration += 1 / 3; // Controls reveal speed

        if (iteration >= text.length) {
          clearInterval(interval);
          setDisplayText(text); // Ensure exactly the final string is set
          setIsRevealed(true);
        }
      }, revealDelayMs);
    };

    setIsRevealed(false);
    startScrambling();

    return () => clearInterval(interval);
  }, [text, revealDelayMs]);

  return (
    <span className={`${className} ${isRevealed ? revealedClass : encryptedClass}`}>
      {displayText}
    </span>
  );
}
