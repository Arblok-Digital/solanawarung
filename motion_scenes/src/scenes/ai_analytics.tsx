import {makeScene2D, Circle, Txt, Line, Rect, Node} from '@motion-canvas/2d';
import {all, createRef, easeOutBack, easeOutCubic, linear, waitFor, Vector2} from '@motion-canvas/core';

const BG = '#0A0A0F';
const GREEN = '#14F195';
const PURPLE = '#9945FF';
const YELLOW = '#FFD700';
const CYAN = '#00E1F0';
const GLASS_BG = 'rgba(13, 13, 18, 0.7)';

export const meta = { name: 'AIAnalytics' };

export default makeScene2D(function* (view) {
  view.fill(BG);

  const titleRef = createRef<Txt>();
  view.add(<Txt ref={titleRef} fontSize={72} fontWeight={700} fontFamily="Arial" fill={GREEN} position={new Vector2(0, -450)}>AI Analytics Dashboard</Txt>);

  // Dashboard Card
  const cardRef = createRef<Rect>();
  view.add(<Rect ref={cardRef} size={[1200, 700]} radius={24} fill={GLASS_BG} stroke={PURPLE} lineWidth={3} opacity={0} position={new Vector2(0, 0)} />);

  // Bar Chart
  const barHeights = [180, 360, 240, 450, 300, 390, 150];
  const barColors = [GREEN, PURPLE, CYAN, GREEN, PURPLE, CYAN, GREEN];
  const barWidth = 80;
  const barGap = 140;
  const startX = -420;
  const baseY = 250;

  const bars: Rect[] = [];
  for (let i = 0; i < barHeights.length; i++) {
    const ref = createRef<Rect>();
    view.add(
      <Rect
        ref={ref}
        size={[barWidth, 0]}
        radius={8}
        fill={barColors[i]}
        opacity={0.8}
        position={new Vector2(startX + i * barGap, baseY)}
      />
    );
    bars.push(ref());
  }

  // Line overlay dots
  const lineDots: Circle[] = [];
  for (let i = 0; i < barHeights.length; i++) {
    const ref = createRef<Circle>();
    view.add(<Circle ref={ref} size={16} fill={YELLOW} opacity={0} position={new Vector2(startX + i * barGap, baseY - barHeights[i])} />);
    lineDots.push(ref());
  }

  const lineRef = createRef<Line>();
  view.add(
    <Line
      ref={lineRef}
      points={barHeights.map((h, i) => new Vector2(startX + i * barGap, baseY - h))}
      stroke={YELLOW}
      lineWidth={6}
      end={0}
      opacity={0}
    />
  );

  // Labels
  const chartTitleRef = createRef<Txt>();
  const growthRef = createRef<Txt>();
  view.add(<Txt ref={chartTitleRef} fontSize={28} fill="#888888" fontFamily="Arial" opacity={0} position={new Vector2(-420, -100)}>Pendapatan Mingguan</Txt>);
  view.add(<Txt ref={growthRef} fontSize={32} fill={GREEN} fontWeight={700} fontFamily="Arial" opacity={0} position={new Vector2(420, -100)}>+24% MoM</Txt>);

  // AI Insight
  const insightBgRef = createRef<Rect>();
  const insightTextRef = createRef<Txt>();
  view.add(<Rect ref={insightBgRef} size={[900, 80]} radius={40} fill="rgba(153,69,255,0.3)" stroke={PURPLE} lineWidth={2} opacity={0} position={new Vector2(0, 300)} />);
  view.add(<Txt ref={insightTextRef} fontSize={32} fill="#ffffff" fontFamily="Arial" opacity={0} position={new Vector2(0, 300)}>{'🤖 Kopi Gayo best seller! Stok habis dalam 3 hari'}</Txt>);

  // Stats
  const stat1Ref = createRef<Txt>(); const stat1LabelRef = createRef<Txt>();
  const stat2Ref = createRef<Txt>(); const stat2LabelRef = createRef<Txt>();
  const stat3Ref = createRef<Txt>(); const stat3LabelRef = createRef<Txt>();

  view.add(<Txt ref={stat1Ref} fontSize={64} fill={GREEN} fontWeight={700} fontFamily="Arial" opacity={0} position={new Vector2(-350, -250)}>Rp 2,4jt</Txt>);
  view.add(<Txt ref={stat1LabelRef} fontSize={24} fill="#888888" fontFamily="Arial" opacity={0} position={new Vector2(-350, -190)}>Total Penjualan</Txt>);
  view.add(<Txt ref={stat2Ref} fontSize={64} fill={GREEN} fontWeight={700} fontFamily="Arial" opacity={0} position={new Vector2(0, -250)}>128</Txt>);
  view.add(<Txt ref={stat2LabelRef} fontSize={24} fill="#888888" fontFamily="Arial" opacity={0} position={new Vector2(0, -190)}>Pesanan</Txt>);
  view.add(<Txt ref={stat3Ref} fontSize={64} fill={GREEN} fontWeight={700} fontFamily="Arial" opacity={0} position={new Vector2(350, -250)}>4.8⭐</Txt>);
  view.add(<Txt ref={stat3LabelRef} fontSize={24} fill="#888888" fontFamily="Arial" opacity={0} position={new Vector2(350, -190)}>Rating</Txt>);

  // ===== ANIMATION =====

  yield* cardRef().opacity(1, 0.4, easeOutCubic);

  // Bars grow
  // Note: size property animated with Vector2([barWidth, height]). Position adjustment to keep bottom anchored: y = baseY - height/2 
  for (let i = 0; i < bars.length; i++) {
    yield* all(
      bars[i].size(new Vector2(barWidth, barHeights[i]), 0.25, easeOutBack),
      bars[i].position(new Vector2(startX + i * barGap, baseY - barHeights[i] / 2), 0.25, easeOutBack)
    );
    yield* waitFor(0.05);
  }

  yield* waitFor(0.2);

  // Line + dots
  yield* lineRef().opacity(0.8, 0.1);
  yield* lineRef().end(1, 0.6, easeOutCubic);
  
  for (const dot of lineDots) {
    yield* dot.opacity(1, 0.1, linear);
  }

  // Labels
  yield* all(chartTitleRef().opacity(1, 0.3, linear), growthRef().opacity(1, 0.3, easeOutBack));
  yield* waitFor(0.3);

  // AI Insight
  yield* all(insightBgRef().opacity(1, 0.4, easeOutCubic), insightTextRef().opacity(1, 0.4, easeOutCubic));
  yield* waitFor(0.3);

  // Stats
  yield* all(
    stat1Ref().opacity(1, 0.3, easeOutBack), stat1LabelRef().opacity(1, 0.3, linear),
    stat2Ref().opacity(1, 0.3, easeOutBack), stat2LabelRef().opacity(1, 0.3, linear),
    stat3Ref().opacity(1, 0.3, easeOutBack), stat3LabelRef().opacity(1, 0.3, linear),
  );

  yield* waitFor(1.0);

  // Fade out
  yield* all(
    titleRef().opacity(0, 0.4, linear), cardRef().opacity(0, 0.4, linear), lineRef().opacity(0, 0.4, linear),
    chartTitleRef().opacity(0, 0.4, linear), growthRef().opacity(0, 0.4, linear),
    insightBgRef().opacity(0, 0.4, linear), insightTextRef().opacity(0, 0.4, linear),
    stat1Ref().opacity(0, 0.4, linear), stat1LabelRef().opacity(0, 0.4, linear),
    stat2Ref().opacity(0, 0.4, linear), stat2LabelRef().opacity(0, 0.4, linear),
    stat3Ref().opacity(0, 0.4, linear), stat3LabelRef().opacity(0, 0.4, linear),
  );
  for (const b of bars) b.opacity(0, 0.3, linear);
  for (const d of lineDots) d.opacity(0, 0.3, linear);

  yield* waitFor(0.3);
});