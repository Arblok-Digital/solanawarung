import {makeScene2D, Circle, Txt, Line, Rect, Node} from '@motion-canvas/2d';
import {all, createRef, easeOutBack, easeOutCubic, linear, waitFor, Vector2} from '@motion-canvas/core';

const BG = '#0A0A0F';
const GREEN = '#14F195';
const PURPLE = '#9945FF';

export const meta = { name: 'AIProductListing' };

export default makeScene2D(function* (view) {
  view.fill(BG);

  const titleRef = createRef<Txt>();
  view.add(
    <Txt ref={titleRef} fontSize={48} fontWeight={700} fontFamily="Arial" fill={GREEN} position={new Vector2(0, -280)}>
      AI Product Listing
    </Txt>
  );

  // Step 1: Camera
  const camRef = createRef<Rect>();
  const camLensRef = createRef<Circle>();
  const camLabelRef = createRef<Txt>();

  view.add(<Rect ref={camRef} size={[80, 60]} radius={8} fill={GREEN} opacity={0} stroke={GREEN} lineWidth={2} position={new Vector2(-300, 0)} />);
  view.add(<Circle ref={camLensRef} size={24} fill={GREEN} opacity={0} position={new Vector2(-300, 0)} />);
  view.add(<Txt ref={camLabelRef} fontSize={20} fill="#aaaaaa" fontFamily="Arial" opacity={0} position={new Vector2(-300, -55)}>Foto Produk</Txt>);

  // Arrow 1
  const arrow1Ref = createRef<Line>();
  view.add(<Line ref={arrow1Ref} points={[new Vector2(-240, 0), new Vector2(-140, 0)]} stroke="#ffffff" lineWidth={2} endArrow opacity={0} />);

  // Step 2: AI Brain nodes
  const brainOffsets = [
    new Vector2(-20, -25), new Vector2(20, -25), new Vector2(-25, 10),
    new Vector2(25, 10), new Vector2(0, 30), new Vector2(0, -5),
  ];
  const brainConns = [[0,1],[0,2],[0,5],[1,3],[1,5],[2,4],[3,4],[4,5]];

  const brainNodes: Circle[] = [];
  for (let i = 0; i < brainOffsets.length; i++) {
    const ref = createRef<Circle>();
    view.add(<Circle ref={ref} size={10} fill={PURPLE} opacity={0} position={brainOffsets[i]} />);
    brainNodes.push(ref());
  }
  const brainLines: Line[] = [];
  for (const [a, b] of brainConns) {
    const ref = createRef<Line>();
    view.add(<Line ref={ref} points={[brainOffsets[a], brainOffsets[b]]} stroke={PURPLE} lineWidth={1} opacity={0} />);
    brainLines.push(ref());
  }

  const brainLabelRef = createRef<Txt>();
  view.add(<Txt ref={brainLabelRef} fontSize={20} fill="#aaaaaa" fontFamily="Arial" opacity={0} position={new Vector2(0, -55)}>Gemini AI</Txt>);

  // JSON popup
  const jsonRef = createRef<Txt>();
  view.add(<Txt ref={jsonRef} fontSize={16} fill={GREEN} fontFamily="monospace" opacity={0} position={new Vector2(0, 80)}>
    {'{\n  "name": "Kopi Gayo",\n  "category": "Minuman",\n  "price": 85000\n}'}
  </Txt>);

  // Arrow 2
  const arrow2Ref = createRef<Line>();
  view.add(<Line ref={arrow2Ref} points={[new Vector2(140, 0), new Vector2(240, 0)]} stroke="#ffffff" lineWidth={2} endArrow opacity={0} />);

  // Step 3: Product Card
  const cardRef = createRef<Rect>();
  const cardTitleRef = createRef<Txt>();
  const cardPriceRef = createRef<Txt>();

  view.add(<Rect ref={cardRef} size={[220, 140]} radius={12} fill="#0D0D12" stroke={GREEN} lineWidth={2} opacity={0} position={new Vector2(300, 0)} />);
  view.add(<Txt ref={cardTitleRef} fontSize={18} fontWeight={700} fill="#ffffff" fontFamily="Arial" opacity={0} position={new Vector2(300, -25)}>Kopi Gayo Premium</Txt>);
  view.add(<Txt ref={cardPriceRef} fontSize={20} fill={GREEN} fontWeight={700} fontFamily="Arial" opacity={0} position={new Vector2(300, 30)}>Rp 85.000</Txt>);

  // Highlight
  const highlightRef = createRef<Rect>();
  const autoFillRef = createRef<Txt>();
  view.add(<Rect ref={highlightRef} size={[230, 150]} radius={12} stroke={GREEN} lineWidth={3} fill={GREEN} opacity={0} position={new Vector2(300, 0)} />);
  view.add(<Txt ref={autoFillRef} fontSize={24} fill={GREEN} fontWeight={700} fontFamily="Arial" opacity={0} position={new Vector2(300, 100)}>Auto-fill!</Txt>);

  // ===== ANIMATION =====

  yield* all(
    camRef().opacity(0.2, 0.4, easeOutCubic),
    camLensRef().opacity(0.6, 0.4, easeOutCubic),
    camLabelRef().opacity(1, 0.4, easeOutCubic),
  );

  yield* waitFor(0.5);

  yield* arrow1Ref().opacity(1, 0.3, easeOutCubic);

  for (let i = 0; i < brainNodes.length; i++) {
    yield* all(
      brainNodes[i].opacity(0.8, 0.12, easeOutCubic),
      brainLines[i]?.opacity(0.4, 0.12, easeOutCubic),
    );
  }
  yield* brainLabelRef().opacity(1, 0.3, easeOutCubic);
  yield* waitFor(0.3);

  yield* jsonRef().opacity(1, 0.4, easeOutBack);
  yield* waitFor(0.8);

  yield* all(
    arrow2Ref().opacity(1, 0.3, easeOutCubic),
    cardRef().opacity(1, 0.4, easeOutCubic),
    cardTitleRef().opacity(1, 0.4, easeOutCubic),
    cardPriceRef().opacity(1, 0.4, easeOutCubic),
  );

  yield* waitFor(0.5);

  yield* all(
    highlightRef().opacity(0.15, 0.2, linear),
    autoFillRef().opacity(1, 0.3, easeOutBack),
  );
  yield* waitFor(0.3);
  yield* highlightRef().opacity(0, 0.3, linear);
  yield* waitFor(0.3);
  yield* all(
    highlightRef().opacity(0.15, 0.2, linear),
    autoFillRef().opacity(1, 0.2, linear),
  );

  yield* waitFor(1.0);

  // Fade out
  yield* all(
    titleRef().opacity(0, 0.5, linear),
    camRef().opacity(0, 0.5, linear),
    camLensRef().opacity(0, 0.5, linear),
    camLabelRef().opacity(0, 0.5, linear),
    arrow1Ref().opacity(0, 0.5, linear),
    jsonRef().opacity(0, 0.5, linear),
    arrow2Ref().opacity(0, 0.5, linear),
    cardRef().opacity(0, 0.5, linear),
    cardTitleRef().opacity(0, 0.5, linear),
    cardPriceRef().opacity(0, 0.5, linear),
    highlightRef().opacity(0, 0.5, linear),
    autoFillRef().opacity(0, 0.5, linear),
    brainLabelRef().opacity(0, 0.5, linear),
  );
  for (const n of brainNodes) n.opacity(0, 0.3, linear);
  for (const l of brainLines) l.opacity(0, 0.3, linear);

  yield* waitFor(0.5);
});