import { useEffect } from "react";

/** Set per-route <title> and meta description. */
export function useDocumentMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.name = "description";
      document.head.appendChild(tag);
    }
    const previous = tag.content;
    tag.content = description;
    return () => {
      tag!.content = previous;
    };
  }, [title, description]);
}
