// One feel for every scroll-in animation (Reveal, AnimatedWords and the
// motion blocks on the home page):
// - It starts while the block is still a quarter of a screen away (the
//   viewport margin), so it is already showing by the time it scrolls in:
//   no blank gap that fills in with a jolt.
// - once: after showing it stays. Fading out again as it left the top of the
//   screen made a faded strip under the header.
// - A short, light fade with a small rise: no big jump, no blur.
// The policy pages don't use it at all, and visitors who ask for less motion
// see everything at once (.reveal in globals.css).
export const REVEAL_VIEWPORT = { once: true, margin: "25% 0px" } as const;

export const REVEAL_RISE = 12; // px

export const REVEAL_TRANSITION = { duration: 0.4, ease: [0.22, 1, 0.36, 1] } as const;

// Spread onto a motion element, and give it the "reveal" class.
// from: 1 rises into place, -1 drops into place.
export function revealMotion(delay = 0, from: 1 | -1 = 1) {
  return {
    initial: { opacity: 0, y: REVEAL_RISE * from },
    whileInView: { opacity: 1, y: 0 },
    viewport: REVEAL_VIEWPORT,
    transition: { ...REVEAL_TRANSITION, delay },
  };
}
