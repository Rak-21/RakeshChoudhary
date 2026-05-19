import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/* ─── Data ─────────────────────────────────────────────── */
const milestones = [
  { header: '1997 - The Beginning', subtext: '' },
  { header: '2020 - IIT (ISM), Dhanbad', subtext: 'Engineering Foundation' },
  { header: 'College Years', subtext: 'Community Leadership / Social Impact' },
  { header: 'Discovering Technology', subtext: 'Technology & Problem Solving' },
  { header: '2021–2024 - JSW Steel', subtext: 'Digital Transformation + Operations + Finance' },
  { header: '2024–Present - KPMG India', subtext: 'Strategy / Business Transformation / Governance' },
  { header: 'Leadership Perspective', subtext: 'Vision Beyond Execution' },
  { header: 'The Road Ahead', subtext: '' },
];

const storyBlocks = [
  {
    milestoneIndex: 0,
    content: [
      { type: 'p', text: 'I began my journey in Bokaro Steel City, Jharkhand, a place that shaped my belief in simplicity, discipline, and grounded thinking. Those early influences continue to define how I approach both life and work: keep things simple, solve meaningful problems, and create lasting value.' },
    ],
  },
  {
    milestoneIndex: 1,
    content: [
      { type: 'p', text: 'I graduated from IIT (ISM) Dhanbad in 2020 with a degree in Mining Engineering, where I developed a deep appreciation for large-scale industrial systems, operational complexity, and the discipline required to make critical processes reliable, safe, and efficient.' },
    ],
  },
  {
    milestoneIndex: 2,
    content: [
      { type: 'p', text: 'During college, my journey extended beyond academics through my association with Fast Forward India (FFI), a student-run NGO focused on educating underprivileged government school students. What started as community service gradually became a leadership journey, eventually leading me to head the DISHA chapter of the initiative.' },
      { type: 'p', text: 'That experience shaped me in meaningful ways. Working closely with students from underserved backgrounds taught me empathy, patience, communication, and the value of creating impact beyond professional success. It strengthened my belief that leadership is less about authority and more about responsibility, influence, and creating opportunities for others, values that continue to shape how I work and lead today.' },
    ],
  },
  {
    milestoneIndex: 3,
    content: [
      { type: 'p', text: 'Even while learning the mechanics of traditional industries, I was equally fascinated by technology and systems thinking. I was never interested in technology for its own sake. What intrigued me was its ability to simplify complexity, improve decision-making, and transform conventional operations into intelligent, efficient, and scalable systems.' },
    ],
  },
  {
    milestoneIndex: 4,
    content: [
      { type: 'p', text: 'My professional journey began at JSW Steel, where I worked at the intersection of industrial operations and digital transformation. Leading transformation initiatives across logistics, fleet operations, fuel management, reporting systems, and workflow automation gave me firsthand exposure to what it takes to convert ideas into measurable business outcomes.' },
      { type: 'quote', text: 'Transformation does not begin with technology. It begins with understanding operations.' },
      { type: 'p', text: 'Before systems can be optimized, processes must be understood. Before intelligence can be built, reliable data must exist. For me, digital transformation has always followed a simple principle:' },
      { type: 'quote', text: 'Capture authentic data. Convert it into actionable intelligence. Use that intelligence to drive better decisions, efficiency, and continuous improvement.' },
      { type: 'p', text: 'My subsequent transition into finance and operational planning broadened this perspective further. Exposure to cost structures, performance management, feasibility analysis, production planning, and business decision-making helped me move beyond implementation into strategic problem-solving.' },
    ],
  },
  {
    milestoneIndex: 5,
    content: [
      { type: 'p', text: 'This natural evolution led me to KPMG India, where my journey expanded from operational transformation into strategy, business transformation, and large-scale program governance. What I find most meaningful about this work is operating at the intersection of strategy and execution, where ideas are tested against operational realities, complexity, stakeholder engagements, regulatory constraints, and the challenge of driving change at scale.' },
      { type: 'p', text: 'Working across consulting, industrial operations, and government transformation has reinforced what I strongly believe:' },
      { type: 'quote', text: 'Sustainable transformation happens when strategy, execution, operations, and technology move together.' },
    ],
  },
  {
    milestoneIndex: 6,
    content: [
      { type: 'p', text: 'Along this journey, I have had the opportunity to work closely with senior business leaders, CXOs, policymakers, and bureaucratic leadership, gaining firsthand exposure to how strategic decisions are shaped at the highest levels.' },
      { type: 'p', text: 'These experiences have deepened my understanding of leadership beyond execution, helping me appreciate the importance of vision, long-term thinking, stakeholder alignment, and the discipline of continuous growth. They have also shaped my own aspiration to evolve not just as a transformation professional, but as a leader capable of driving meaningful change at scale.' },
    ],
  },
  {
    milestoneIndex: 7,
    content: [
      { type: 'p', text: 'Today, my focus is on helping organizations navigate complexity, unlock growth, and modernize operations through structured strategy, disciplined execution, and technology-led transformation.' },
      { type: 'p', text: 'And this is only the beginning, my long-term vision is to lead transformation that creates meaningful impact at scale, helping organizations not just improve systems, but rethink how they operate, make decisions, and grow in an increasingly dynamic world.' },
    ],
  },
];

/* ─── Component ────────────────────────────────────────── */
export default function Journey() {
  const [activeIndex, setActiveIndex] = useState(0);
  const blockRefs = useRef([]);

  /* Intersection Observer — fires when a story block enters center of viewport */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.milestone);
            if (!isNaN(idx)) setActiveIndex(idx);
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );

    blockRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const nodeRefs = useRef([]);
  const [lineHeights, setLineHeights] = useState({ progress: 0, bg: 0 });

  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;

    const updateLines = () => {
      const activeNode = nodeRefs.current[activeIndex];
      const lastNode = nodeRefs.current[milestones.length - 1];
      
      setLineHeights({
        progress: activeNode ? activeNode.offsetTop + 8 : 0,
        bg: lastNode ? lastNode.offsetTop + 8 : 0,
      });
    };

    const ro = new ResizeObserver(updateLines);
    ro.observe(el);
    updateLines();

    return () => ro.disconnect();
  }, [activeIndex]);

  /* ── Sticky top calculation ──
     We want: midpoint of timeline = midpoint of viewport
     So: top = 50vh - timelineHeight / 2
     CSS sticky handles the rest:
       Phase 1: scrolls naturally until top reaches this value
       Phase 2: sticks with midpoint at viewport center
       Phase 3: unsticks when parent bottom pushes it (flex height = story height)
  */
  const timelineRef = useRef(null);
  const [stickyTop, setStickyTop] = useState('0px');

  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;

    const recalc = () => {
      const h = el.offsetHeight;
      setStickyTop(`calc(50vh - ${h / 2}px)`);
    };

    recalc();

    // Recalculate if the timeline's size changes (fonts loading, etc.)
    const ro = new ResizeObserver(recalc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Render a single content item */
  const renderItem = (item, i, isBlockActive) => {
    // Colors based on user requirements:
    // Active: #0F172A (Light), #E2E8F0 (Dark)
    // Muted: #64748B (Both)
    const activeColorClass = isBlockActive 
      ? "text-[#0F172A] dark:text-[#E2E8F0]" 
      : "text-[#64748B]";

    if (item.type === 'quote') {
      return (
        <p key={i} className={`text-center italic text-accent text-base leading-relaxed transition-all duration-500 ${isBlockActive ? 'opacity-100' : 'opacity-75'}`}>
          "{item.text}"
        </p>
      );
    }
    if (item.type === 'highlight') {
      return (
        <p key={i} className={`text-base font-black text-glow leading-relaxed transition-all duration-500 ${isBlockActive ? 'text-accent' : 'text-textMuted'}`}>
          {item.text}
        </p>
      );
    }
    return (
      <p key={i} className={`text-base leading-relaxed text-justify font-semibold transition-all duration-500 ${activeColorClass}`}>
        {item.text}
      </p>
    );
  };

  return (
    <section id="journey" className="relative w-full" style={{ overflow: 'visible' }}>
      <div className="container mx-auto px-6 pb-32" style={{ maxWidth: '95%' }}>

        {/* ── Section Header (full width, above grid) ── */}
        <motion.div
          className="pt-24 pb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-black font-heading leading-tight">
            My{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#00f2fe] text-glow">
              Journey
            </span>
          </h2>
        </motion.div>

        {/* ── Two-Column Grid (starts at paragraph level) ── */}
        <div className="flex relative" style={{ gap: '4rem' }}>

          {/* ═══ LEFT: Story (75%) ═══ */}
          <div className="w-full lg:w-3/4 space-y-4">
            {storyBlocks.map((block, bIdx) => (
              <div
                key={bIdx}
                ref={(el) => (blockRefs.current[bIdx] = el)}
                data-milestone={block.milestoneIndex}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <div 
                  className="space-y-4 transition-all duration-700"
                  style={{ maxWidth: '95%' }}
                >
                  {block.content.map((item, i) => renderItem(item, i, block.milestoneIndex === activeIndex))}
                </div>
              </div>
            ))}

          </div>

          {/* ═══ RIGHT: Sticky Timeline (25%) — desktop only ═══ */}
          <div className="hidden lg:block w-1/4 relative">
            <div
              ref={timelineRef}
              className="sticky bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-[2rem] p-8 border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              style={{
                top: stickyTop,
              }}
            >
              <div className="relative">
                {/* Background track */}
                <div
                  className="absolute left-[8px] w-[2px] bg-borderBase rounded-full"
                  style={{ top: '8px', height: `${lineHeights.bg}px` }}
                />

                {/* Animated progress fill */}
                <div
                  className="absolute left-[8px] w-[2px] bg-accent origin-top rounded-full"
                  style={{
                    top: '8px',
                    height: `${lineHeights.progress}px`,
                    transition: 'height 0.6s cubic-bezier(.4,0,.2,1)',
                    boxShadow: '0 0 8px var(--accent-glow)',
                  }}
                />

                {/* Nodes */}
                <div className="flex flex-col">
                  {milestones.map((m, idx) => {
                    const isActive = idx === activeIndex;
                    const isPast   = idx < activeIndex;

                    return (
                      <div
                        key={idx}
                        ref={(el) => (nodeRefs.current[idx] = el)}
                        className="relative flex items-start gap-4 cursor-pointer group mb-8 last:mb-0"
                        onClick={() => {
                          blockRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                      >
                        {/* Node circle wrapper - centered on track */}
                        <div
                          className="absolute left-[8px] -translate-x-1/2 flex items-center justify-center z-10"
                          style={{ top: '8px' }}
                        >
                          {/* Mask to hide the timeline line behind the node */}
                          <div
                            className="absolute rounded-full bg-background"
                            style={{
                              width: isActive ? '16px' : '10px',
                              height: isActive ? '16px' : '10px',
                              zIndex: -1,
                            }}
                          />
                          <div
                            className="rounded-full border-2 transition-all duration-500"
                            style={{
                              width:  isActive ? '16px' : '10px',
                              height: isActive ? '16px' : '10px',
                              background: isActive
                                ? 'var(--accent)'
                                : isPast
                                  ? 'var(--accent)'
                                  : 'var(--surface)',
                              borderColor: isActive || isPast
                                ? 'var(--accent)'
                                : 'var(--text-muted)',
                              opacity: isActive ? 1 : isPast ? 0.6 : 0.8,
                              boxShadow: isActive
                                ? '0 0 14px var(--accent-glow), 0 0 28px var(--accent-glow)'
                                : 'none',
                            }}
                          />
                          {/* Ping on active */}
                          {isActive && (
                            <div
                              className="absolute rounded-full animate-ping"
                              style={{
                                width: '16px',
                                height: '16px',
                                background: 'var(--accent)',
                                opacity: 0.3,
                              }}
                            />
                          )}
                        </div>

                        {/* Label */}
                        <div
                          className="transition-all duration-500 pl-8"
                          style={{
                            fontFamily: "'Sora', system-ui, sans-serif",
                            marginTop: '-2px', // Fine-tune vertical alignment with node
                          }}
                        >
                          <div
                            className={`text-sm md:text-base leading-tight transition-all duration-500 ${isActive ? 'font-bold opacity-100' : 'font-semibold opacity-70'}`}
                            style={{
                              fontFamily: "'Sora', system-ui, sans-serif",
                              color: 'var(--accent)',
                            }}
                          >
                            {m.header}
                          </div>
                          {m.subtext && (
                            <div
                              className={`text-xs md:text-sm mt-1 transition-all duration-500 ${isActive ? 'font-semibold opacity-100' : 'font-normal opacity-70'}`}
                              style={{
                                fontFamily: "'Sora', system-ui, sans-serif",
                                color: isActive ? 'var(--text-main)' : 'var(--milestone-subtext)',
                              }}
                            >
                              {m.subtext}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
