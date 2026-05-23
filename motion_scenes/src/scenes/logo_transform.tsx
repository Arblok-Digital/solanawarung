import {makeScene2D, Circle, Txt, Line, Img, Rect, Node} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, easeOutBack, easeOutCubic, linear, waitFor, Vector2} from '@motion-canvas/core';

const BG = '#0A0A0F';
const GREEN = '#14F195';
const PURPLE = '#9945FF';
const CYAN = '#00E1F0';

export const meta = {
  name: 'LogoTransform',
};

export default makeScene2D(function* (view) {
  view.fill(BG);

  // ===== HOOK: Problem Statement sebelum logo =====
  const hookRef = createRef<Txt>();
  const hook2Ref = createRef<Txt>();

  view.add(
    <Txt
      ref={hookRef}
      fontSize={38}
      fontWeight={400}
      fontFamily="Arial"
      fill="#555555"
      opacity={0}
      scale={0}
      position={new Vector2(0, -30)}
    >
      UMKM susah go digital? Takut penipuan online?
    </Txt>
  );

  view.add(
    <Txt
      ref={hook2Ref}
      fontSize={30}
      fontWeight={700}
      fontFamily="Arial"
      fill={GREEN}
      opacity={0}
      scale={0}
      position={new Vector2(0, 30)}
    >
      Web3 & AI for Everyone.
    </Txt>
  );

  // Fade in & scale hook
  yield* all(
    hookRef().opacity(1, 0.6, easeOutCubic),
    hookRef().scale(1, 0.6, easeOutBack)
  );
  yield* waitFor(0.3);
  yield* all(
    hook2Ref().opacity(1, 0.5, easeOutBack),
    hook2Ref().scale(1, 0.5, easeOutBack)
  );
  yield* waitFor(0.5);

  // Fade out hook
  yield* all(
    hookRef().opacity(0, 0.4, easeInOutCubic),
    hook2Ref().opacity(0, 0.4, easeInOutCubic),
  );

  yield* waitFor(0.2);

  // ===== MAIN SCENE =====

  const logoRef = createRef<Img>();
  const glowRef = createRef<Circle>();
  const titleRef = createRef<Txt>();
  const subtitleRef = createRef<Txt>();

  view.add(
    <Circle
      ref={glowRef}
      width={0}
      height={0}
      fill={GREEN}
      opacity={0.15}
    />
  );

  view.add(
     <Img
       ref={logoRef}
        src="/solana_logo.png"
       width={0}
       height={0}
     />
  );

  const nodeCount = 12;
  const nodeRefs: Circle[] = [];
  const lineRefs: Line[] = [];

  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2;
    const radius = 180;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    const nodeRef = createRef<Circle>();
    view.add(
      <Circle
        ref={nodeRef}
        size={6}
        fill={i % 2 === 0 ? GREEN : PURPLE}
        opacity={0}
        position={new Vector2(x, y)}
      />
    );
    nodeRefs.push(nodeRef());

    const lineRef = createRef<Line>();
    view.add(
      <Line
        ref={lineRef}
        points={[new Vector2(x, y), new Vector2(0, 0)]}
        stroke={i % 2 === 0 ? GREEN : PURPLE}
        lineWidth={1}
        opacity={0}
      />
    );
    lineRefs.push(lineRef());
  }

  view.add(
    <Txt
      ref={titleRef}
      fontSize={72}
      fontWeight={700}
      fontFamily="Arial"
      fill={GREEN}
      opacity={0}
    >
      SOLANA WARUNG
    </Txt>
  );

  view.add(
    <Txt
      ref={subtitleRef}
      fontSize={28}
      fontWeight={400}
      fontFamily="Arial"
      fill="#888888"
      opacity={0}
      position={new Vector2(0, 60)}
    >
      Empowering UMKM with Web3 & AI
    </Txt>
  );

  // 1. Logo FadeIn + scale up with glow (snappier timing)
  yield* all(
    logoRef().width(200, 0.4, easeOutBack),
    logoRef().height(200, 0.4, easeOutBack),
    glowRef().width(300, 0.5, easeOutCubic),
    glowRef().height(300, 0.5, easeOutCubic),
  );

  yield* waitFor(0.2);

  // 2. Neural network nodes appear (staggered feel)
  for (let i = 0; i < nodeCount; i++) {
    yield* all(
      nodeRefs[i].opacity(0.8, 0.12, easeOutCubic),
      lineRefs[i].opacity(0.3, 0.12, easeOutCubic),
    );
    yield* waitFor(0.07);
  }

  // Pulse glow
  yield* all(
    glowRef().width(400, 0.4, easeInOutCubic),
    glowRef().height(400, 0.4, easeInOutCubic),
    glowRef().opacity(0.08, 0.4, easeInOutCubic),
  );
  yield* all(
    glowRef().width(300, 0.4, easeInOutCubic),
    glowRef().height(300, 0.4, easeInOutCubic),
    glowRef().opacity(0.15, 0.4, easeInOutCubic),
  );

  yield* waitFor(0.3);

  // 3. Transform logo -> title
  yield* all(
    logoRef().opacity(0, 0.3, easeInOutCubic),
    logoRef().width(0, 0.3, easeInOutCubic),
    logoRef().height(0, 0.3, easeInOutCubic),
    glowRef().opacity(0, 0.3, linear),
  );

  for (let i = 0; i < nodeCount; i++) {
    yield* all(
      nodeRefs[i].opacity(0, 0.08, linear),
      lineRefs[i].opacity(0, 0.08, linear),
    );
  }

  yield* all(
    titleRef().opacity(1, 0.5, easeOutCubic),
    titleRef().position(new Vector2(0, -20), 0.5, easeOutBack),
  );

  yield* titleRef().fill(PURPLE, 0.3, easeInOutCubic);
  yield* titleRef().fill(GREEN, 0.3, easeInOutCubic);
  yield* waitFor(0.2);

  // 4. Subtitle bounces in
  yield* all(
    subtitleRef().opacity(1, 0.4, easeOutBack),
    subtitleRef().position(new Vector2(0, 50), 0.4, easeOutBack),
  );

  yield* waitFor(0.5);

  // 5. Fade out
  yield* all(
    titleRef().opacity(0, 0.5, easeInOutCubic),
    subtitleRef().opacity(0, 0.5, easeInOutCubic),
  );

  yield* waitFor(0.3);
});