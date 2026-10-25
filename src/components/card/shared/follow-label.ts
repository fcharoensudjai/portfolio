import React, { useCallback, useRef } from "react";

/**
 * The cursor-following hover label shared by the artwork frames — the recents stage's plate and the
 * gallery's cards. ONE definition, because the two were carrying copies of the same clamp and had
 * drifted: the stage measured its label, the gallery's sat in a fixed 175x50 box that couldn't hug
 * its text (the surplus reads as an empty box, not a tag).
 *
 * The label is positioned by writing `transform` straight to the node. A React state write per
 * mousemove re-renders the artwork underneath on every pointer event, which is visible as the image
 * stuttering under the cursor.
 */

/**
 * Only the clamp's fallback for the sliver of time before the label has mounted and measured itself,
 * which is why it's allowed to be a rough guess.
 */
export const LABEL_FALLBACK = { w: 150, h: 50 };

/** Where the label sits for a pointer at (clientX, clientY) inside the frame's `rect`. */
export function labelTransform(clientX: number, clientY: number, rect: DOMRect, { w, h }: { w: number; h: number }) {
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const clampedX = Math.min(Math.max(x, w / 2), rect.width - w / 1.6);
  const clampedY = Math.min(Math.max(y, h / 2), rect.height - h);
  return `translate(${(clampedX - w / 2 + 10).toFixed(1)}px, ${(clampedY - h / 2 + 10).toFixed(1)}px)`;
}

type PointerSample = { clientX: number; clientY: number; rect: DOMRect };

/**
 * Wire `measureLabel` to the label's ref and `trackPointer` to the hovered frame's mousemove (and to
 * its mouseenter, so a pointer that enters and then holds still doesn't leave the label parked in the
 * frame's corner — the label doesn't exist until the render *after* hover flips true).
 */
export const useFollowLabel = () => {
  const labelRef = useRef<HTMLDivElement | null>(null);
  // the label hugs its own text, so the clamp needs its real box rather than a constant
  const labelSize = useRef({ ...LABEL_FALLBACK });
  // the pointer last seen over the frame, with the rect it was seen in
  const lastPointer = useRef<PointerSample | null>(null);

  const trackPointer = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    lastPointer.current = { clientX: e.clientX, clientY: e.clientY, rect };
    const label = labelRef.current;
    if (!label) return;
    label.style.transform = labelTransform(e.clientX, e.clientY, rect, labelSize.current);
  }, []);

  // stable identity on purpose: an inline ref callback is detached and re-attached on every render,
  // which would re-measure (and re-place) the label on every frame of a crossfade. `offsetWidth`
  // rather than `getBoundingClientRect`: the label mounts mid pop-in (`scale: 1.3`), and a rect would
  // measure that 30% oversized box and clamp the label against a size it never has at rest.
  const measureLabel = useCallback((el: HTMLDivElement | null) => {
    labelRef.current = el;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    if (w && h) labelSize.current = { w, h };
    const pointer = lastPointer.current;
    if (pointer) {
      el.style.transform = labelTransform(pointer.clientX, pointer.clientY, pointer.rect, labelSize.current);
    }
  }, []);

  return { measureLabel, trackPointer };
};
