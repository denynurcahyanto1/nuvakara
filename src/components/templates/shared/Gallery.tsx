import Image from "next/image";
import { cn } from "@/lib/cn";

export interface GalleryProps {
  images: string[];
  className?: string;
  /** "mosaic" makes every third photo full width; "grid" keeps a strict grid. */
  layout?: "mosaic" | "grid";
}

export function Gallery({ images, className, layout = "mosaic" }: GalleryProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-2 sm:gap-3", className)}>
      {images.map((src, index) => {
        const wide = layout === "mosaic" && index % 3 === 0;
        return (
          <figure
            key={`${src}-${index}`}
            className={cn(
              "relative overflow-hidden rounded-[var(--inv-radius)] bg-[var(--inv-accent-soft)]",
              wide ? "col-span-2 aspect-[16/10]" : "aspect-[3/4]",
            )}
          >
            <Image
              src={src}
              alt={`Momen ${index + 1}`}
              fill
              sizes="(min-width: 768px) 40vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
            />
          </figure>
        );
      })}
    </div>
  );
}
