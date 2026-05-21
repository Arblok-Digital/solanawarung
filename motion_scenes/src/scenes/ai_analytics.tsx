import {makeScene2D, Circle, Txt, Line, Rect, Node} from '@motion-canvas/2d';
import {all, createRef, easeOutBack, easeOutCubic, linear, waitFor, Vector2} from '@motion-canvas/core';

const BG = '#0A0A0F';
const GREEN = '#14F195';
const PURPLE = '#9945FF';
const YELLOW = '#FFD700';

export const meta = { name: 'AIAnalytics' };

export default makeScene2D(function* (view) {
  view.fill(BG);

  const titleRef = createRef<Txt>();
  view.add(<Txt ref={titleRef} fontSize={44} fontWeight={700} fontFamily="Arial" fill={GREEN} position={new Vector2(0, -280)}>AI Analytics Dashboard</Txt>);

  // Dashboard Card
  const cardRef = createRef<Rect>();
  view.add(<Rect ref={cardRef} size={[500, 280]} radius={12} fill="#0D0D12" stroke={PURPLE} lineWidth={1.5} opacity={0} position={new Vector2(0, 20)} />);

  // Bar Chart
  const barHeights = [60, 120, 80, 150, 100, 130, 50];
  const barColors = [GREEN, PURPLE, '#FF6B6B', GREEN, PURPLE, '#FF6B6B', GREEN];
  const barWidth = 30;
  const barGap = 50;
  const startX = -160;
  const baseY = -60;

  const bars: Rect[] = [];
  for (let i = 0; i < barHeights.length; i++) {
    const ref = createRef<Rect>();
    view.add(
      <Rect
        ref={ref}
        size={[barWidth, 0]}
        radius={4}
        fill={barColors[i]}
        opacity={0.8}
        position={new Vector2(startX + i * barGap, baseY + barHeights[i] / 2)}
      />
    );
    bars.push(ref());
  }

  // Line overlay dots
  const lineDots: Circle[] = [];
  for (let i = 0; i < barHeights.length; i++) {
    const ref = createRef<Circle>();
    view.add(<Circle ref={ref} size={6} fill={YELLOW} opacity={0} position={new Vector2(startX + i * barGap, baseY + barHeights[i])} />);
    lineDots.push(ref());
  }

  const lineRef = createRef<Line>();
  view.add(
    <Line
      ref={lineRef}
      points={barHeights.map((h, i) => new Vector2(startX + i * barGap, baseY + h))}
      stroke={YELLOW}
      lineWidth={2}
      opacity={0}
    />
  );

  // Labels
  const chartTitleRef = createRef<Txt>();
  const growthRef = createRef<Txt>();
  view.add(<Txt ref={chartTitleRef} fontSize={14} fill="#888888" fontFamily="Arial" opacity={0} position={new Vector2(0, 100)}>Pendapatan Mingguan</Txt>);
  view.add(<Txt ref={growthRef} fontSize={18} fill={GREEN} fontWeight={700} fontFamily="Arial" opacity={0} position={new Vector2(140, 80)}>+24% MoM</Txt>);

  // AI Insight
  const insightBgRef = createRef<Rect>();
  const insightTextRef = createRef<Txt>();
  view.add(<Rect ref={insightBgRef} size={[420, 40]} radius={8} fill={PURPLE} opacity={0} position={new Vector2(0, -150)} />);
  view.add(<Txt ref={insightTextRef} fontSize={15} fill="#ffffff" fontFamily="Arial" opacity={0} position={new Vector2(0, -150)}>{'🤖 Kopi Gayo best seller! Stok habis dalam 3 hari'}</Txt>);

  // Stats
  const stat1Ref = createRef<Txt>(); const stat1LabelRef = createRef<Txt>();
  const stat2Ref = createRef<Txt>(); const stat2LabelRef = createRef<Txt>();
  const stat3Ref = createRef<Txt>(); const stat3LabelRef = createRef<Txt>();

  view.add(<Txt ref={stat1Ref} fontSize={24} fill={GREEN} fontWeight={700} fontFamily="Arial" opacity={0} position={new Vector2(-150, -220)}>Rp 2,4jt</Txt>);
  view.add(<Txt ref={stat1LabelRef} fontSize={12} fill="#888888" fontFamily="Arial" opacity={0} position={new Vector2(-150, -245)}>Total Penjualan</Txt>);
  view.add(<Txt ref={stat2Ref} fontSize={24} fill={GREEN} fontWeight={700} fontFamily="Arial" opacity={0} position={new Vector2(0, -220)}>128</Txt>);
  view.add(<Txt ref={stat2LabelRef} fontSize={12} fill="#888888" fontFamily="Arial" opacity={0} position={new Vector2(0, -245)}>Pesanan</Txt>);
  view.add(<Txt ref={stat3Ref} fontSize={24} fill={GREEN} fontWeight={700} fontFamily="Arial" opacity={0} position={new Vector2(150, -220)}>4.8⭐</Txt>);
  view.add(<Txt ref={stat3LabelRef} fontSize={12} fill="#888888" fontFamily="Arial" opacity={0} position={new Vector2(150, -245)}>Rating</Txt>);

  // ===== ANIMATION =====

  yield* cardRef().opacity(1, 0.4, easeOutCubic);

  // Bars grow
  for (let i = 0; i < bars.length; i++) {
    yield* bars[i].size(new Vector2(barWidth, barHeights[i]), 0.25, easeOutBack);
  }

  yield* waitFor(0.3);

  // Line + dots
  yield* lineRef().opacity(0.7, 0.4, easeOutCubic);
  for (const dot of lineDots) {
    yield* dot.opacity(1, 0.1, linear);
  }

  // Labels
  yield* all(chartTitleRef().opacity(1, 0.3, linear), growthRef().opacity(1, 0.3, easeOutBack));
  yield* waitFor(0.5);

  // AI Insight
  yield* all(insightBgRef().opacity(0.15, 0.4, easeOutCubic), insightTextRef().opacity(1, 0.4, easeOutCubic));
  yield* waitFor(0.5);

  // Stats
  yield* all(
    stat1Ref().opacity(1, 0.3, easeOutBack), stat1LabelRef().opacity(1, 0.3, linear),
    stat2Ref().opacity(1, 0.3, easeOutBack), stat2LabelRef().opacity(1, 0.3, linear),
    stat3Ref().opacity(1, 0.3, easeOutBack), stat3LabelRef().opacity(1, 0.3, linear),
  );

  yield* waitFor(1.2);

  // Fade out
  yield* all(
    titleRef().opacity(0, 0.5, linear), cardRef().opacity(0, 0.5, linear), lineRef().opacity(0, 0.5, linear),
    chartTitleRef().opacity(0, 0.5, linear), growthRef().opacity(0, 0.5, linear),
    insightBgRef().opacity(0, 0.5, linear), insightTextRef().opacity(0, 0.5, linear),
    stat1Ref().opacity(0, 0.5, linear), stat1LabelRef().opacity(0, 0.5, linear),
    stat2Ref().opacity(0, 0.5, linear), stat2LabelRef().opacity(0, 0.5, linear),
    stat3Ref().opacity(0, 0.5, linear), stat3LabelRef().opacity(0, 0.5, linear),
  );
  for (const b of bars) b.opacity(0, 0.3, linear);
  for (const d of lineDots) d.opacity(0, 0.3, linear);

  yield* waitFor(0.5);
});