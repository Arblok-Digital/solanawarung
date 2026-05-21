import {makeScene2D, Circle, Txt, Line, Rect, Node} from '@motion-canvas/2d';
import {all, createRef, easeOutBack, easeOutCubic, linear, waitFor, Vector2} from '@motion-canvas/core';

const BG = '#0A0A0F';
const GREEN = '#14F195';
const PURPLE = '#9945FF';
const RED = '#FF6B6B';

export const meta = { name: 'EscrowFlow' };

export default makeScene2D(function* (view) {
  view.fill(BG);

  const titleRef = createRef<Txt>();
  view.add(<Txt ref={titleRef} fontSize={44} fontWeight={700} fontFamily="Arial" fill={GREEN} position={new Vector2(0, -280)}>Escrow Transaction Flow</Txt>);

  // Buyer
  const buyerRef = createRef<Circle>();
  const buyerTextRef = createRef<Txt>();
  const buyerLabelRef = createRef<Txt>();
  view.add(<Circle ref={buyerRef} size={80} fill={GREEN} opacity={0} stroke={GREEN} lineWidth={2} position={new Vector2(-300, 0)} />);
  view.add(<Txt ref={buyerTextRef} fontSize={36} fontWeight={700} fill={GREEN} fontFamily="Arial" position={new Vector2(-300, 0)}>B</Txt>);
  view.add(<Txt ref={buyerLabelRef} fontSize={22} fill="#aaaaaa" fontFamily="Arial" position={new Vector2(-300, -60)}>Buyer</Txt>);

  // Escrow
  const escrowRef = createRef<Rect>();
  const escrowTextRef = createRef<Txt>();
  view.add(<Rect ref={escrowRef} size={[180, 100]} radius={12} fill={PURPLE} opacity={0} stroke={PURPLE} lineWidth={2} position={new Vector2(0, 0)} />);
  view.add(<Txt ref={escrowTextRef} fontSize={18} fill={PURPLE} fontFamily="Arial" lineHeight={28} position={new Vector2(0, 0)}>{'Escrow\nSmart Contract'}</Txt>);

  // Seller
  const sellerRef = createRef<Circle>();
  const sellerTextRef = createRef<Txt>();
  const sellerLabelRef = createRef<Txt>();
  view.add(<Circle ref={sellerRef} size={80} fill={RED} opacity={0} stroke={RED} lineWidth={2} position={new Vector2(300, 0)} />);
  view.add(<Txt ref={sellerTextRef} fontSize={36} fontWeight={700} fill={RED} fontFamily="Arial" position={new Vector2(300, 0)}>S</Txt>);
  view.add(<Txt ref={sellerLabelRef} fontSize={22} fill="#aaaaaa" fontFamily="Arial" position={new Vector2(300, -60)}>Seller</Txt>);

  // Animated labels
  const paymentRef = createRef<Txt>();
  const holdRef = createRef<Txt>();
  const shipRef = createRef<Txt>();
  const confirmRef = createRef<Txt>();
  const releaseRef = createRef<Txt>();
  const shieldRef = createRef<Txt>();

  view.add(<Txt ref={paymentRef} fontSize={20} fill={GREEN} fontWeight={700} fontFamily="Arial" opacity={0} position={new Vector2(-150, 80)}>Rp 85.000</Txt>);
  view.add(<Txt ref={holdRef} fontSize={18} fill={PURPLE} fontFamily="Arial" opacity={0} position={new Vector2(0, -80)}>Dana Ditahan</Txt>);
  view.add(<Txt ref={shipRef} fontSize={18} fill={RED} fontFamily="Arial" opacity={0} position={new Vector2(150, 80)}>Kirim Barang</Txt>);
  view.add(<Txt ref={confirmRef} fontSize={16} fill={GREEN} fontFamily="Arial" opacity={0} position={new Vector2(-150, -100)}>Konfirmasi</Txt>);
  view.add(<Txt ref={releaseRef} fontSize={20} fill={GREEN} fontWeight={700} fontFamily="Arial" opacity={0} position={new Vector2(150, -80)}>Dana Dilepaskan!</Txt>);
  view.add(<Txt ref={shieldRef} fontSize={24} fill={GREEN} fontFamily="Arial" opacity={0} position={new Vector2(0, 200)}>{'🛡️ Aman & Transparan'}</Txt>);

  // Arrows
  const payArrowRef = createRef<Line>();
  const shipArrowRef = createRef<Line>();
  const confirmArrowRef = createRef<Line>();
  const releaseArrowRef = createRef<Line>();

  view.add(<Line ref={payArrowRef} points={[new Vector2(-260, 30), new Vector2(-90, 30)]} stroke={GREEN} lineWidth={2} endArrow opacity={0} />);
  view.add(<Line ref={shipArrowRef} points={[new Vector2(260, 30), new Vector2(90, 30)]} stroke={RED} lineWidth={2} endArrow opacity={0} />);
  view.add(<Line ref={confirmArrowRef} points={[new Vector2(-260, -30), new Vector2(-90, -30)]} stroke={GREEN} lineWidth={2} endArrow opacity={0} />);
  view.add(<Line ref={releaseArrowRef} points={[new Vector2(0, -50), new Vector2(260, -50)]} stroke={GREEN} lineWidth={2} endArrow opacity={0} />);

  // ===== ANIMATION =====

  yield* all(
    buyerRef().opacity(0.15, 0.4, easeOutCubic),
    buyerTextRef().opacity(1, 0.4, easeOutCubic),
    buyerLabelRef().opacity(1, 0.4, easeOutCubic),
    escrowRef().opacity(0.15, 0.4, easeOutCubic),
    escrowTextRef().opacity(1, 0.4, easeOutCubic),
    sellerRef().opacity(0.15, 0.4, easeOutCubic),
    sellerTextRef().opacity(1, 0.4, easeOutCubic),
    sellerLabelRef().opacity(1, 0.4, easeOutCubic),
  );

  yield* waitFor(0.5);

  // Buyer pays
  yield* all(payArrowRef().opacity(1, 0.3, easeOutCubic), paymentRef().opacity(1, 0.3, easeOutBack));
  yield* waitFor(0.3);
  yield* holdRef().opacity(1, 0.3, easeOutCubic);
  yield* waitFor(0.5);

  // Seller ships
  yield* all(shipArrowRef().opacity(1, 0.3, easeOutCubic), shipRef().opacity(1, 0.3, easeOutBack));
  yield* waitFor(0.5);

  // Buyer confirms
  yield* all(confirmArrowRef().opacity(1, 0.3, easeOutCubic), confirmRef().opacity(1, 0.3, easeOutBack));
  yield* waitFor(0.5);

  // Escrow releases
  yield* all(releaseArrowRef().opacity(1, 0.3, easeOutCubic), releaseRef().opacity(1, 0.3, easeOutBack));
  yield* waitFor(0.3);
  yield* shieldRef().opacity(1, 0.4, easeOutBack);

  yield* waitFor(1.2);

  // Fade out
  yield* all(
    titleRef().opacity(0, 0.5, linear),
    buyerRef().opacity(0, 0.5, linear), buyerTextRef().opacity(0, 0.5, linear), buyerLabelRef().opacity(0, 0.5, linear),
    escrowRef().opacity(0, 0.5, linear), escrowTextRef().opacity(0, 0.5, linear),
    sellerRef().opacity(0, 0.5, linear), sellerTextRef().opacity(0, 0.5, linear), sellerLabelRef().opacity(0, 0.5, linear),
    payArrowRef().opacity(0, 0.5, linear), shipArrowRef().opacity(0, 0.5, linear),
    confirmArrowRef().opacity(0, 0.5, linear), releaseArrowRef().opacity(0, 0.5, linear),
    paymentRef().opacity(0, 0.5, linear), holdRef().opacity(0, 0.5, linear),
    shipRef().opacity(0, 0.5, linear), confirmRef().opacity(0, 0.5, linear),
    releaseRef().opacity(0, 0.5, linear), shieldRef().opacity(0, 0.5, linear),
  );

  yield* waitFor(0.5);
});