import {makeScene2D, Circle, Txt, Line, Rect, Node} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, easeOutBack, easeOutCubic, linear, waitFor, Vector2} from '@motion-canvas/core';

const BG = '#0A0A0F';
const GREEN = '#14F195';
const PURPLE = '#9945FF';
const GLASS_BG = 'rgba(13, 13, 18, 0.7)';

export const meta = { name: 'ClosingCTA' };

export default makeScene2D(function* (view) {
  view.fill(BG);

  // Opening glow
  const glowRef = createRef<Circle>();
  view.add(<Circle ref={glowRef} size={20} fill={GREEN} opacity={0.8} />);

  // Tagline
  const taglineRef = createRef<Txt>();
  view.add(
    <Txt 
      ref={taglineRef} 
      fontSize={96} 
      fontWeight={700} 
      fontFamily="Arial" 
      fill={GREEN} 
      opacity={0} 
      lineHeight={120} 
      position={new Vector2(0, -80)}
      shadowColor={GREEN}
      shadowBlur={0}
    >
      {'From warung\nto the world.'}
    </Txt>
  );

  // Subtitle
  const subtitleRef = createRef<Txt>();
  view.add(
    <Txt ref={subtitleRef} fontSize={36} fill="#888888" fontFamily="Arial" opacity={0} position={new Vector2(0, 120)}>
      AI-Powered UMKM Marketplace with Digital Rupiah (CBDC)
    </Txt>
  );

  // Divider
  const dividerRef = createRef<Line>();
  view.add(<Line ref={dividerRef} points={[new Vector2(-300, 0), new Vector2(300, 0)]} stroke={PURPLE} lineWidth={2} opacity={0} position={new Vector2(0, 170)} />);

  // CTA Button 1
  const btn1Ref = createRef<Rect>();
  const btn1TextRef = createRef<Txt>();
  view.add(<Rect ref={btn1Ref} size={[300, 72]} radius={16} fill={GLASS_BG} stroke={GREEN} lineWidth={2} opacity={0} position={new Vector2(-190, 270)} />);
  view.add(<Txt ref={btn1TextRef} fontSize={30} fontWeight={700} fill={GREEN} fontFamily="Arial" opacity={0} position={new Vector2(-190, 270)}>Mulai Jualan</Txt>);

  // CTA Button 2
  const btn2Ref = createRef<Rect>();
  const btn2TextRef = createRef<Txt>();
  view.add(<Rect ref={btn2Ref} size={[300, 72]} radius={16} fill={GLASS_BG} stroke={PURPLE} lineWidth={2} opacity={0} position={new Vector2(190, 270)} />);
  view.add(<Txt ref={btn2TextRef} fontSize={30} fontWeight={700} fill={PURPLE} fontFamily="Arial" opacity={0} position={new Vector2(190, 270)}>Belanja Sekarang</Txt>);

  // Website
  const websiteRef = createRef<Txt>();
  view.add(<Txt ref={websiteRef} fontSize={28} fill="#666666" fontWeight={600} fontFamily="Arial" opacity={0} position={new Vector2(0, 380)}>solanawarung-eaxld3g4jq-et.a.run.app</Txt>);

  // Powered by
  const poweredRef = createRef<Txt>();
  view.add(<Txt ref={poweredRef} fontSize={20} fill="#444444" fontFamily="Arial" opacity={0} position={new Vector2(0, 430)}>Powered by Google AI & Solana Blockchain</Txt>);

  // Loading dots
  const dot1Ref = createRef<Circle>();
  const dot2Ref = createRef<Circle>();
  const dot3Ref = createRef<Circle>();
  view.add(<Circle ref={dot1Ref} size={12} fill={GREEN} opacity={0} position={new Vector2(-30, 490)} />);
  view.add(<Circle ref={dot2Ref} size={12} fill={GREEN} opacity={0} position={new Vector2(0, 490)} />);
  view.add(<Circle ref={dot3Ref} size={12} fill={GREEN} opacity={0} position={new Vector2(30, 490)} />);

  // Final glow
  const finalGlowRef = createRef<Circle>();

  // ===== ANIMATION =====

  // 1. Glow expands
  yield* all(
    glowRef().width(600, 1.2, easeOutCubic),
    glowRef().height(600, 1.2, easeOutCubic),
    glowRef().opacity(0, 1.2, linear),
  );

  // 2. Tagline
  yield* all(
    taglineRef().opacity(1, 0.5, easeOutCubic),
    taglineRef().shadowBlur(15, 0.5, easeOutCubic)
  );
  yield* taglineRef().fill(PURPLE, 0.4, easeInOutCubic);
  yield* taglineRef().fill(GREEN, 0.4, easeInOutCubic);
  yield* waitFor(0.2);

  // 3. Subtitle + divider
  yield* all(subtitleRef().opacity(1, 0.4, easeOutCubic), dividerRef().opacity(0.5, 0.3, easeOutCubic));
  yield* waitFor(0.2);

  // 4. CTA buttons with pulse
  yield* all(
    btn1Ref().opacity(1, 0.3, easeOutBack),
    btn1TextRef().opacity(1, 0.3, easeOutBack),
    btn1Ref().lineWidth(4, 0.15, easeOutCubic).to(1, 0.15, easeOutBack),
  );
  yield* all(
    btn2Ref().opacity(1, 0.3, easeOutBack),
    btn2TextRef().opacity(1, 0.3, easeOutBack),
    btn2Ref().lineWidth(4, 0.15, easeOutCubic).to(1, 0.15, easeOutBack),
  );
  yield* waitFor(0.2);

  // 5. Website + powered
  yield* all(websiteRef().opacity(1, 0.3, easeOutCubic), poweredRef().opacity(1, 0.3, easeOutCubic));
  yield* waitFor(0.2);

  // 6. Loading dots
  yield* all(dot1Ref().opacity(1, 0.2, linear), dot2Ref().opacity(1, 0.2, linear), dot3Ref().opacity(1, 0.2, linear));

  // Pulse (Sinusoidal approximation)
  yield* all(
    dot1Ref().size(20, 0.2, easeInOutCubic).to(12, 0.2, easeInOutCubic),
    dot1Ref().position(new Vector2(-30, 483), 0.2, easeInOutCubic).to(new Vector2(-30, 490), 0.2, easeInOutCubic),
    dot1Ref().fill(PURPLE, 0.2, linear).to(GREEN, 0.2, linear),
  );
  yield* all(
    dot2Ref().size(20, 0.2, easeInOutCubic).to(12, 0.2, easeInOutCubic),
    dot2Ref().position(new Vector2(0, 483), 0.2, easeInOutCubic).to(new Vector2(0, 490), 0.2, easeInOutCubic),
    dot2Ref().fill(PURPLE, 0.2, linear).to(GREEN, 0.2, linear),
  );
  yield* all(
    dot3Ref().size(20, 0.2, easeInOutCubic).to(12, 0.2, easeInOutCubic),
    dot3Ref().position(new Vector2(30, 483), 0.2, easeInOutCubic).to(new Vector2(30, 490), 0.2, easeInOutCubic),
    dot3Ref().fill(PURPLE, 0.2, linear).to(GREEN, 0.2, linear),
  );

  yield* waitFor(0.6);

  // 7. Final glow out
  view.add(<Circle ref={finalGlowRef} size={100} fill={GREEN} opacity={0.3} />);

  yield* all(
    finalGlowRef().width(800, 1.2, easeOutCubic),
    finalGlowRef().height(800, 1.2, easeOutCubic),
    finalGlowRef().opacity(0, 1.2, linear),
    taglineRef().opacity(0, 0.8, easeInOutCubic),
    subtitleRef().opacity(0, 0.8, easeInOutCubic),
    dividerRef().opacity(0, 0.8, linear),
    btn1Ref().opacity(0, 0.8, linear), btn1TextRef().opacity(0, 0.8, linear),
    btn2Ref().opacity(0, 0.8, linear), btn2TextRef().opacity(0, 0.8, linear),
    websiteRef().opacity(0, 0.8, linear), poweredRef().opacity(0, 0.8, linear),
    dot1Ref().opacity(0, 0.4, linear), dot2Ref().opacity(0, 0.4, linear), dot3Ref().opacity(0, 0.4, linear),
  );

  yield* waitFor(0.4);
});