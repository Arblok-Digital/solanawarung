import {makeScene2D, Circle, Txt, Line, Img, Rect, Node} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, easeOutBack, easeOutCubic, linear, waitFor, Vector2} from '@motion-canvas/core';

const BG = '#0A0A0F';
const GREEN = '#14F195';
const PURPLE = '#9945FF';

export const meta = {
  name: 'LogoTransform',
};

export default makeScene2D(function* (view) {
  view.fill(BG);

  const logoRef = createRef<Img>();
  const glowRef = createRef<Circle>();
  const titleRef = createRef<Txt>();
  const subtitleRef = createRef<Txt>();

  view.add(
    <Circle
      ref={glowRef}
      size={0}
      fill={GREEN}
      opacity={0.15}
    />
  );

  view.add(
     <Img
       ref={logoRef}
       src="solana_logo.png"
       size={0}
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

  // 1. Logo FadeIn + scale up with glow
  yield* all(
    logoRef().size(200, 0.8, easeOutBack),
    glowRef().size(300, 1.2, easeOutCubic),
  );

  yield* waitFor(0.3);

  // 2. Neural network nodes appear
  for (let i = 0; i < nodeCount; i++) {
    yield* all(
      nodeRefs[i].opacity(0.8, 0.15, easeOutCubic),
      lineRefs[i].opacity(0.3, 0.15, easeOutCubic),
    );
  }

  // Pulse glow
  yield* all(
    glowRef().size(400, 0.6, easeInOutCubic),
    glowRef().opacity(0.08, 0.6, easeInOutCubic),
  );
  yield* all(
    glowRef().size(300, 0.6, easeInOutCubic),
    glowRef().opacity(0.15, 0.6, easeInOutCubic),
  );

  yield* waitFor(0.5);

  // 3. Transform logo -> title
  yield* all(
    logoRef().opacity(0, 0.5, easeInOutCubic),
    logoRef().size(0, 0.5, easeInOutCubic),
    glowRef().opacity(0, 0.5, linear),
  );

  for (let i = 0; i < nodeCount; i++) {
    yield* all(
      nodeRefs[i].opacity(0, 0.1, linear),
      lineRefs[i].opacity(0, 0.1, linear),
    );
  }

  yield* all(
    titleRef().opacity(1, 0.6, easeOutCubic),
    titleRef().position(new Vector2(0, -20), 0.6, easeOutBack),
  );

  yield* titleRef().fill(PURPLE, 0.4, easeInOutCubic);
  yield* titleRef().fill(GREEN, 0.4, easeInOutCubic);
  yield* waitFor(0.3);

  // 4. Subtitle
  yield* all(
    subtitleRef().opacity(1, 0.5, easeOutCubic),
    subtitleRef().position(new Vector2(0, 50), 0.5, easeOutCubic),
  );

  yield* waitFor(1.5);

  // 5. Fade out
  yield* all(
    titleRef().opacity(0, 0.8, easeInOutCubic),
    subtitleRef().opacity(0, 0.8, easeInOutCubic),
  );

  yield* waitFor(0.5);
});