import {makeScene2D, Circle, Txt, Line, Rect, Node} from '@motion-canvas/2d';
import {all, createRef, easeOutBack, easeOutCubic, linear, waitFor, Vector2} from '@motion-canvas/core';

const BG = '#0A0A0F';
const GREEN = '#14F195';
const PURPLE = '#9945FF';
const CYAN = '#00E1F0';
const GLASS_BG = 'rgba(13, 13, 18, 0.7)';

export const meta = { name: 'AIProductListing' };

export default makeScene2D(function* (view) {
  view.fill(BG);

  const titleRef = createRef<Txt>();
  view.add(
    <Txt ref={titleRef} fontSize={72} fontWeight={700} fontFamily="Arial" fill={GREEN} position={new Vector2(0, -420)}>
      AI Product Listing
    </Txt>
  );

  // Step 1: Camera (Outer circle + Inner lens)
  const camOuterRef = createRef<Circle>();
  const camInnerRef = createRef<Circle>();
  const camLabelRef = createRef<Txt>();

  view.add(<Circle ref={camOuterRef} size={160} fill={GLASS_BG} stroke={GREEN} lineWidth={3} opacity={0} position={new Vector2(-620, 0)} />);
  view.add(<Circle ref={camInnerRef} size={60} fill={'rgba(0,0,0,0)'} stroke={GREEN} lineWidth={4} opacity={0} position={new Vector2(-620, 0)} />);
  view.add(<Txt ref={camLabelRef} fontSize={36} fill="#aaaaaa" fontFamily="Arial" opacity={0} position={new Vector2(-620, -130)}>Foto Produk</Txt>);

  // Arrow 1
  const arrow1Ref = createRef<Line>();
  view.add(<Line ref={arrow1Ref} points={[new Vector2(-520, 0), new Vector2(-380, 0)]} stroke="#ffffff" lineWidth={4} endArrow opacity={0} />);

  // Step 2: Gemini AI Core (sesuai ecosystem.html - Tiga Layer, Gemini sebagai Intelligence Pillar)
  const geminiCenterX = -320;

  // Central Gemini node (dengan emoji 🤖)
  const geminiCoreRef = createRef<Circle>();
  const geminiIconRef = createRef<Txt>();
  view.add(<Circle ref={geminiCoreRef} size={90} fill={GLASS_BG} stroke={PURPLE} lineWidth={4} opacity={0} position={new Vector2(geminiCenterX, 10)} />);
  view.add(<Txt ref={geminiIconRef} fontSize={42} fill={PURPLE} fontFamily="Arial" opacity={0} position={new Vector2(geminiCenterX, 10)}>🤖</Txt>);

  // Surrounding nodes (Vision + Analytics satellites)
  const geminiSatellites: Circle[] = [];
  const satelliteOffsets = [
    new Vector2(geminiCenterX - 85, -55),
    new Vector2(geminiCenterX + 85, -55),
    new Vector2(geminiCenterX - 100, 55),
    new Vector2(geminiCenterX + 100, 55),
    new Vector2(geminiCenterX, -90),
    new Vector2(geminiCenterX, 95),
  ];

  for (const pos of satelliteOffsets) {
    const ref = createRef<Circle>();
    view.add(<Circle ref={ref} size={22} fill={PURPLE} opacity={0} position={pos} />);
    geminiSatellites.push(ref());
  }

  // Label Gemini AI + subtext (Vision + Analytics) — mirip tampilan di ecosystem.html
  const geminiLabelRef = createRef<Txt>();
  const geminiSubRef = createRef<Txt>();
  view.add(<Txt ref={geminiLabelRef} fontSize={32} fontWeight={700} fill={PURPLE} fontFamily="Arial" opacity={0} position={new Vector2(geminiCenterX, -155)}>Gemini AI</Txt>);
  view.add(<Txt ref={geminiSubRef} fontSize={18} fill="#aaaaaa" fontFamily="Arial" opacity={0} position={new Vector2(geminiCenterX, -125)}>Vision + Analytics</Txt>);

  // Product Preview (clean, no raw code)
  const jsonBgRef = createRef<Rect>();
  const productNameRef = createRef<Txt>();
  const categoryRef = createRef<Txt>();
  const priceRef = createRef<Txt>();

  view.add(<Rect ref={jsonBgRef} size={[420, 220]} radius={16} fill={GLASS_BG} stroke={GREEN} lineWidth={2} opacity={0} position={new Vector2(60, 20)} />);
  
  view.add(<Txt ref={productNameRef} fontSize={32} fontWeight={700} fill="#ffffff" fontFamily="Arial" opacity={0} position={new Vector2(60, -40)}>Kopi Gayo</Txt>);
  view.add(<Txt ref={categoryRef} fontSize={22} fill="#aaaaaa" fontFamily="Arial" opacity={0} position={new Vector2(60, 10)}>☕ Minuman • Arabica</Txt>);
  view.add(<Txt ref={priceRef} fontSize={36} fontWeight={700} fill={GREEN} fontFamily="Arial" opacity={0} position={new Vector2(60, 70)}>Rp 85.000</Txt>);

  // Arrow 2
  const arrow2Ref = createRef<Line>();
  view.add(<Line ref={arrow2Ref} points={[new Vector2(280, 0), new Vector2(410, 0)]} stroke="#ffffff" lineWidth={4} endArrow opacity={0} />);

  // Step 3: Product Card
  const cardRef = createRef<Rect>();
  const cardTitleRef = createRef<Txt>();
  const cardPriceRef = createRef<Txt>();

  view.add(<Rect ref={cardRef} size={[440, 280]} radius={24} fill={GLASS_BG} stroke={GREEN} lineWidth={2} opacity={0} position={new Vector2(580, 0)} />);
  view.add(<Txt ref={cardTitleRef} fontSize={32} fontWeight={700} fill="#ffffff" fontFamily="Arial" opacity={0} position={new Vector2(580, -50)}>Kopi Gayo Premium</Txt>);
  view.add(<Txt ref={cardPriceRef} fontSize={36} fill={GREEN} fontWeight={700} fontFamily="Arial" opacity={0} position={new Vector2(580, 60)}>Rp 85.000</Txt>);

  // Highlight Auto-fill
  const autoFillContainerRef = createRef<Rect>();
  const autoFillRef = createRef<Txt>();
  view.add(
    <Rect ref={autoFillContainerRef} size={[280, 80]} radius={40} fill={GLASS_BG} stroke={GREEN} lineWidth={3} opacity={0} scale={0.8} position={new Vector2(580, 200)}>
      <Txt ref={autoFillRef} fontSize={40} fill={GREEN} fontWeight={700} fontFamily="Arial">Auto-fill!</Txt>
    </Rect>
  );

  // ===== ANIMATION =====

  yield* all(
    camOuterRef().opacity(1, 0.4, easeOutCubic),
    camInnerRef().opacity(1, 0.4, easeOutCubic),
    camLabelRef().opacity(1, 0.4, easeOutCubic),
  );

  yield* waitFor(0.3);

  yield* arrow1Ref().opacity(1, 0.3, easeOutCubic);

  // Gemini AI Core animation (lebih prominent seperti di ecosystem.html)
  yield* all(
    geminiCoreRef().opacity(1, 0.35, easeOutBack),
    geminiIconRef().opacity(1, 0.35, easeOutBack),
  );

  for (const sat of geminiSatellites) {
    yield* sat.opacity(1, 0.1, easeOutCubic);
  }

  yield* all(
    geminiLabelRef().opacity(1, 0.3, easeOutCubic),
    geminiSubRef().opacity(1, 0.3, easeOutCubic),
  );
  yield* waitFor(0.2);

  yield* all(
    jsonBgRef().opacity(1, 0.4, easeOutBack),
    productNameRef().opacity(1, 0.4, easeOutBack),
    categoryRef().opacity(1, 0.4, easeOutBack),
    priceRef().opacity(1, 0.4, easeOutBack),
  );
  yield* waitFor(0.4);

  yield* all(
    arrow2Ref().opacity(1, 0.3, easeOutCubic),
    cardRef().opacity(1, 0.4, easeOutCubic),
    cardTitleRef().opacity(1, 0.4, easeOutCubic),
    cardPriceRef().opacity(1, 0.4, easeOutCubic),
  );

  yield* waitFor(0.3);

  // Auto-fill stamp bounce & card pulse
  yield* all(
    autoFillContainerRef().opacity(1, 0.2, linear),
    autoFillContainerRef().scale(1.2, 0.15, easeOutCubic).to(1, 0.25, easeOutBack),
    cardRef().lineWidth(4, 0.15, easeOutCubic).to(1, 0.25, easeOutBack),
  );
  
  yield* waitFor(1.0);

  // Fade out
  yield* all(
    titleRef().opacity(0, 0.4, linear),
    camOuterRef().opacity(0, 0.4, linear),
    camInnerRef().opacity(0, 0.4, linear),
    camLabelRef().opacity(0, 0.4, linear),
    arrow1Ref().opacity(0, 0.4, linear),
    jsonBgRef().opacity(0, 0.4, linear),
    productNameRef().opacity(0, 0.4, linear),
    categoryRef().opacity(0, 0.4, linear),
    priceRef().opacity(0, 0.4, linear),
    arrow2Ref().opacity(0, 0.4, linear),
    cardRef().opacity(0, 0.4, linear),
    cardTitleRef().opacity(0, 0.4, linear),
    cardPriceRef().opacity(0, 0.4, linear),
    autoFillContainerRef().opacity(0, 0.4, linear),
    geminiCoreRef().opacity(0, 0.4, linear),
    geminiIconRef().opacity(0, 0.4, linear),
    geminiLabelRef().opacity(0, 0.4, linear),
    geminiSubRef().opacity(0, 0.4, linear),
  );
  for (const sat of geminiSatellites) sat.opacity(0, 0.3, linear);

  yield* waitFor(0.3);
});