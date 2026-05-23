import {makeScene2D, Circle, Txt, Line, Rect, Node} from '@motion-canvas/2d';
import {all, createRef, easeOutBack, easeOutCubic, linear, waitFor, Vector2} from '@motion-canvas/core';

const BG = '#0A0A0F';
const GREEN = '#14F195';
const PURPLE = '#9945FF';
const CYAN = '#00E1F0';
const GLASS_BG = 'rgba(13, 13, 18, 0.7)';

export const meta = { name: 'EscrowFlow' };

export default makeScene2D(function* (view) {
  view.fill(BG);

  const titleRef = createRef<Txt>();
  view.add(<Txt ref={titleRef} fontSize={72} fontWeight={700} fontFamily="Arial" fill={GREEN} position={new Vector2(0, -400)}>Escrow Transaction Flow</Txt>);

  // Buyer
  const buyerRef = createRef<Circle>();
  const buyerTextRef = createRef<Txt>();
  const buyerLabelRef = createRef<Txt>();
  view.add(<Circle ref={buyerRef} size={200} fill={GLASS_BG} opacity={0} stroke={GREEN} lineWidth={4} position={new Vector2(-600, 0)} />);
  view.add(<Txt ref={buyerTextRef} fontSize={80} fontWeight={700} fill={GREEN} fontFamily="Arial" position={new Vector2(-600, 0)}>B</Txt>);
  view.add(<Txt ref={buyerLabelRef} fontSize={40} fill="#aaaaaa" fontFamily="Arial" position={new Vector2(-600, -150)}>Buyer</Txt>);

  // Escrow
  const escrowRef = createRef<Rect>();
  const escrowTextRef = createRef<Txt>();
  view.add(<Rect ref={escrowRef} size={[360, 200]} radius={24} fill={GLASS_BG} opacity={0} stroke={PURPLE} lineWidth={4} position={new Vector2(0, 0)} />);
  view.add(<Txt ref={escrowTextRef} fontSize={36} fill={PURPLE} fontFamily="Arial" lineHeight={48} position={new Vector2(0, 0)}>{'Escrow\nSmart Contract'}</Txt>);

  // Seller
  const sellerRef = createRef<Circle>();
  const sellerTextRef = createRef<Txt>();
  const sellerLabelRef = createRef<Txt>();
  view.add(<Circle ref={sellerRef} size={200} fill={GLASS_BG} opacity={0} stroke={CYAN} lineWidth={4} position={new Vector2(600, 0)} />);
  view.add(<Txt ref={sellerTextRef} fontSize={80} fontWeight={700} fill={CYAN} fontFamily="Arial" position={new Vector2(600, 0)}>S</Txt>);
  view.add(<Txt ref={sellerLabelRef} fontSize={40} fill="#aaaaaa" fontFamily="Arial" position={new Vector2(600, -150)}>Seller</Txt>);

  // Animated labels
  const paymentRef = createRef<Txt>();
  const holdBoxRef = createRef<Rect>();
  const holdRef = createRef<Txt>();
  const shipRef = createRef<Txt>();
  const confirmRef = createRef<Txt>();
  const releaseBoxRef = createRef<Rect>();
  const releaseRef = createRef<Txt>();
  const shieldRef = createRef<Txt>();

  view.add(<Txt ref={paymentRef} fontSize={36} fill={GREEN} fontWeight={700} fontFamily="Arial" opacity={0} position={new Vector2(-300, 170)}>Rp 85.000</Txt>);
  
  view.add(
    <Rect ref={holdBoxRef} size={[360, 72]} radius={16} fill={GLASS_BG} stroke={PURPLE} lineWidth={3} opacity={0} position={new Vector2(0, -180)}>
      <Txt ref={holdRef} fontSize={28} fill={PURPLE} fontFamily="Arial">🔒 DANA DIAMANKAN</Txt>
    </Rect>
  );

  view.add(<Txt ref={shipRef} fontSize={32} fill={CYAN} fontFamily="Arial" opacity={0} position={new Vector2(300, 170)}>Kirim Barang</Txt>);
  view.add(<Txt ref={confirmRef} fontSize={28} fill={GREEN} fontFamily="Arial" opacity={0} position={new Vector2(-300, -160)}>Konfirmasi</Txt>);
  view.add(
    <Rect ref={releaseBoxRef} size={[360, 72]} radius={16} fill={GLASS_BG} stroke={GREEN} lineWidth={3} opacity={0} position={new Vector2(0, 280)}>
      <Txt ref={releaseRef} fontSize={28} fill={GREEN} fontFamily="Arial">✅ DANA DILEPASKAN</Txt>
    </Rect>
  );
  view.add(<Txt ref={shieldRef} fontSize={56} fill={GREEN} fontFamily="Arial" opacity={0} scale={0} position={new Vector2(0, 380)}>{'🛡️ Aman & Transparan'}</Txt>);

  // Arrows
  const payArrowRef = createRef<Line>();
  const shipArrowRef = createRef<Line>();
  const confirmArrowRef = createRef<Line>();
  const releaseArrowRef = createRef<Line>();

  view.add(<Line ref={payArrowRef} points={[new Vector2(-480, 60), new Vector2(-200, 60)]} stroke={GREEN} lineWidth={6} endArrow opacity={0} />);
  view.add(<Line ref={shipArrowRef} points={[new Vector2(480, 60), new Vector2(200, 60)]} stroke={CYAN} lineWidth={6} endArrow opacity={0} />);
  view.add(<Line ref={confirmArrowRef} points={[new Vector2(-480, -60), new Vector2(-200, -60)]} stroke={GREEN} lineWidth={6} endArrow opacity={0} />);
  view.add(<Line ref={releaseArrowRef} points={[new Vector2(200, -60), new Vector2(480, -60)]} stroke={GREEN} lineWidth={6} endArrow opacity={0} />);

  // ===== ANIMATION =====

  yield* all(
    buyerRef().opacity(1, 0.4, easeOutCubic),
    buyerTextRef().opacity(1, 0.4, easeOutCubic),
    buyerLabelRef().opacity(1, 0.4, easeOutCubic),
    escrowRef().opacity(1, 0.4, easeOutCubic),
    escrowTextRef().opacity(1, 0.4, easeOutCubic),
    sellerRef().opacity(1, 0.4, easeOutCubic),
    sellerTextRef().opacity(1, 0.4, easeOutCubic),
    sellerLabelRef().opacity(1, 0.4, easeOutCubic),
  );

  yield* waitFor(0.3);

  // Buyer pays
  yield* all(payArrowRef().opacity(1, 0.3, easeOutCubic), paymentRef().opacity(1, 0.3, easeOutBack));
  yield* waitFor(0.3);
  yield* holdBoxRef().opacity(1, 0.3, easeOutCubic);
  yield* waitFor(0.4);

  // Seller ships
  yield* all(shipArrowRef().opacity(1, 0.3, easeOutCubic), shipRef().opacity(1, 0.3, easeOutBack));
  yield* waitFor(0.4);

  // Buyer confirms
  yield* all(confirmArrowRef().opacity(1, 0.3, easeOutCubic), confirmRef().opacity(1, 0.3, easeOutBack));
  yield* waitFor(0.4);

  // Escrow releases
  yield* all(releaseArrowRef().opacity(1, 0.3, easeOutCubic), releaseBoxRef().opacity(1, 0.3, easeOutBack));
  yield* waitFor(0.3);
  yield* all(shieldRef().opacity(1, 0.4, easeOutBack), shieldRef().scale(1, 0.4, easeOutBack));

  yield* waitFor(1.0);

  // Fade out
  yield* all(
    titleRef().opacity(0, 0.4, linear),
    buyerRef().opacity(0, 0.4, linear), buyerTextRef().opacity(0, 0.4, linear), buyerLabelRef().opacity(0, 0.4, linear),
    escrowRef().opacity(0, 0.4, linear), escrowTextRef().opacity(0, 0.4, linear),
    sellerRef().opacity(0, 0.4, linear), sellerTextRef().opacity(0, 0.4, linear), sellerLabelRef().opacity(0, 0.4, linear),
    payArrowRef().opacity(0, 0.4, linear), shipArrowRef().opacity(0, 0.4, linear),
    confirmArrowRef().opacity(0, 0.4, linear), releaseArrowRef().opacity(0, 0.4, linear),
    paymentRef().opacity(0, 0.4, linear), holdBoxRef().opacity(0, 0.4, linear),
    shipRef().opacity(0, 0.4, linear), confirmRef().opacity(0, 0.4, linear),
    releaseBoxRef().opacity(0, 0.4, linear), shieldRef().opacity(0, 0.4, linear),
  );

  yield* waitFor(0.3);
});