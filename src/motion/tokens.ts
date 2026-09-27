export const ease = {
  /** reveals */
  out: [0.16, 1, 0.3, 1] as const,
  /** wipes / section transitions */
  inOut: [0.76, 0, 0.24, 1] as const,
};

export const dur = { micro: 0.2, reveal: 0.8, wipe: 1.0 } as const;

export const pointerSpring = { stiffness: 150, damping: 20, mass: 0.4 };

/** Hero depth factors: 0 = far/slow, 1 = scroll speed. */
export const depth = { sky: 0.1, far: 0.25, word: 0.45, near: 0.7, haze: 1.1 } as const;
