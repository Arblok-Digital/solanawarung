import {makeScene2D, Circle, Txt, Line, Rect, Node} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, easeOutBack, easeOutCubic, linear, waitFor, Vector2} from '@motion-canvas/core';

const BG = '#0A0A0F';
const GREEN = '#14F195';
const PURPLE = '#9945FF';

export const meta = { name: 'ClosingCTA' };

export default makeScene2D(function* (view) {
  view.fill(BG);

  // Opening glow
  const glowRef = createRef<Circle>();
  view.add(<Circle ref={glowRef} size={20} fill={GREEN} opacity={0.8} />);

  // Tagline
  const taglineRef = createRef<Txt>();
  view.add(
    <Txt ref={taglineRef} fontSize={64} fontWeight={700} fontFamily="Arial" fill={GREEN} opacity={0} lineHeight={80} position={new Vector2(0, -30)}>
      {'From warung\nto the world.'}
    </Txt>
  );

  // Subtitle
  const subtitleRef = createRef<Txt>();
  view.add(
    <Txt ref={subtitleRef} fontSize={24} fill="#888888" fontFamily="Arial" opacity={0} position={new Vector2(0, 70)}>
      AI-Powered UMKM Marketplace with Digital Rupiah (CBDC)
    </Txt>
  );

  // Divider
  const dividerRef = createRef<Line>();
  view.add(<Line ref={dividerRef} points={[new Vector2(-200, 0), new Vector2(200, 0)]} stroke={PURPLE} lineWidth={1} opacity={0} position={new Vector2(0, 110)} />);

  // CTA Button 1
  const btn1Ref = createRef<Rect>();
  const btn1TextRef = createRef<Txt>();
  view.add(<Rect ref={btn1Ref} size={[200, 45]} radius={10} fill={GREEN} opacity={0} position={new Vector2(-120, 150)} />);
  view.add(<Txt ref={btn1TextRef} fontSize={18} fontWeight={700} fill="#0A0A0F" fontFamily="Arial" opacity={0} position={new Vector2(-120, 150)}>Mulai Jualan</Txt>);

  // CTA Button 2
  const btn2Ref = createRef<Rect>();
  const btn2TextRef = createRef<Txt>();
  view.add(<Rect ref={btn2Ref} size={[200, 45]} radius={10} fill={PURPLE} opacity={0} position={new Vector2(120, 150)} />);
  view.add(<Txt ref={btn2TextRef} fontSize={18} fontWeight={700} fill="#ffffff" fontFamily="Arial" opacity={0} position={new Vector2(120, 150)}>Belanja Sekarang</Txt>);

  // Website
  const websiteRef = createRef<Txt>();
  view.add(<Txt ref={websiteRef} fontSize={18} fill="#666666" fontWeight={600} fontFamily="Arial" opacity={0} position={new Vector2(0, 210)}>solanawarung.vercel.app</Txt>);

  // Powered by
  const poweredRef = createRef<Txt>();
  view.add(<Txt ref={poweredRef} fontSize={14} fill="#444444" fontFamily="Arial" opacity={0} position={new Vector2(0, 245)}>Powered by Google AI & Solana Blockchain</Txt>);

  // Loading dots
  const dot1Ref = createRef<Circle>();
  const dot2Ref = createRef<Circle>();
  const dot3Ref = createRef<Circle>();
  view.add(<Circle ref={dot1Ref} size={6} fill={GREEN} opacity={0} position={new Vector2(-20, 280)} />);
  view.add(<Circle ref={dot2Ref} size={6} fill={GREEN} opacity={0} position={new Vector2(0, 280)} />);
  view.add(<Circle ref={dot3Ref} size={6} fill={GREEN} opacity={0} position={new Vector2(20, 280)} />);

  // Final glow
  const finalGlowRef = createRef<Circle>();

  // ===== ANIMATION =====

  // 1. Glow expands
  yield* all(
    glowRef().size(600, 1.2, easeOutCubic),
    glowRef().opacity(0, 1.2, linear),
  );

  // 2. Tagline
  yield* taglineRef().opacity(1, 0.6, easeOutCubic);
  yield* taglineRef().fill(PURPLE, 0.5, easeInOutCubic);
  yield* taglineRef().fill(GREEN, 0.5, easeInOutCubic);
  yield* waitFor(0.3);

  // 3. Subtitle + divider
  yield* all(subtitleRef().opacity(1, 0.5, easeOutCubic), dividerRef().opacity(0.5, 0.4, easeOutCubic));
  yield* waitFor(0.3);

  // 4. CTA buttons
  yield* all(btn1Ref().opacity(0.2, 0.3, easeOutBack), btn1TextRef().opacity(1, 0.3, easeOutBack));
  yield* all(btn2Ref().opacity(0.2, 0.3, easeOutBack), btn2TextRef().opacity(1, 0.3, easeOutBack));
  yield* waitFor(0.3);

  // 5. Website + powered
  yield* all(websiteRef().opacity(1, 0.4, easeOutCubic), poweredRef().opacity(1, 0.4, easeOutCubic));
  yield* waitFor(0.3);

  // 6. Loading dots
  yield* all(dot1Ref().opacity(1, 0.2, linear), dot2Ref().opacity(1, 0.2, linear), dot3Ref().opacity(1, 0.2, linear));

  // Pulse
  yield* all(dot1Ref().size(10, 0.2, easeOutCubic), dot1Ref().fill(PURPLE, 0.2, linear));
  yield* all(dot2Ref().size(10, 0.2, easeOutCubic), dot2Ref().fill(PURPLE, 0.2, linear));
  yield* all(dot3Ref().size(10, 0.2, easeOutCubic), dot3Ref().fill(PURPLE, 0.2, linear));
  yield* all(
    dot1Ref().size(6, 0.2, easeOutCubic), dot1Ref().fill(GREEN, 0.2, linear),
    dot2Ref().size(6, 0.2, easeOutCubic), dot2Ref().fill(GREEN, 0.2, linear),
    dot3Ref().size(6, 0.2, easeOutCubic), dot3Ref().fill(GREEN, 0.2, linear),
  );

  yield* waitFor(0.8);

  // 7. Final glow out
  view.add(<Circle ref={finalGlowRef} size={100} fill={GREEN} opacity={0.3} />);

  yield* all(
    finalGlowRef().size(800, 1.5, easeOutCubic),
    finalGlowRef().opacity(0, 1.5, linear),
    taglineRef().opacity(0, 1.0, easeInOutCubic),
    subtitleRef().opacity(0, 1.0, easeInOutCubic),
    dividerRef().opacity(0, 1.0, linear),
    btn1Ref().opacity(0, 1.0, linear), btn1TextRef().opacity(0, 1.0, linear),
    btn2Ref().opacity(0, 1.0, linear), btn2TextRef().opacity(0, 1.0, linear),
    websiteRef().opacity(0, 1.0, linear), poweredRef().opacity(0, 1.0, linear),
    dot1Ref().opacity(0, 0.5, linear), dot2Ref().opacity(0, 0.5, linear), dot3Ref().opacity(0, 0.5, linear),
  );

  yield* waitFor(0.5);
});