import { motion } from 'framer-motion';

export default function Impact() {
  return (
    <section 
      id="impact" 
      className="relative w-full min-h-screen flex flex-col items-center justify-center py-16 lg:py-24 px-4 md:px-12 z-20 overflow-hidden"
      style={{
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
      }}
    >
      <div className="w-full max-w-full flex flex-col h-full justify-between gap-6">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center relative w-full pt-8">
          <div className="z-10" style={{ paddingLeft: '3rem', maxWidth: '50rem' }}>
            <h4 className="text-accent font-mono tracking-widest uppercase mb-3 flex items-center gap-2" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
              <span className="w-1 bg-accent inline-block rounded-full" style={{ height: '1.5rem' }}></span>
              Impact
            </h4>
            <h2 className="font-bold text-textMain font-sora" style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>
              Bridging Strategy, Operations & Technology
            </h2>
            <p className="text-textMuted text-base md:text-lg">
              Turning strategic intent into business transformation across industries and ecosystems.
            </p>
          </div>
          
          {/* Fading Illustration Placeholder */}
          <div className="absolute right-0 top-0 h-full w-full pointer-events-none hidden md:block" style={{
            maskImage: 'linear-gradient(to left, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%)',
            WebkitMaskImage: 'linear-gradient(to left, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%)',
            backgroundImage: 'url("/impact-illustration.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '70%',
            opacity: 0.7
          }}>
          </div>
        </div>

        {/* Book Wrapper */}
        <div className="w-full flex-grow flex justify-center px-0 lg:px-12">
          {/* Book Container */}
          <div className="flex flex-col lg:flex-row w-full max-w-[1400px] bg-surface/50 backdrop-blur-xl border border-borderBase shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl relative overflow-hidden">
            
            {/* Book Base Background (static shading) */}
            <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2 pointer-events-none z-0">
                <div className="h-full border-r border-borderBase/50 bg-gradient-to-r from-transparent to-black/5" />
                <div className="hidden lg:block h-full bg-gradient-to-l from-transparent to-black/5" />
            </div>

            {/* LEFT PAGE - KPMG */}
            <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col relative z-10 bg-surface shadow-[inset_-20px_0_40px_rgba(0,0,0,0.05)] dark:shadow-[inset_-20px_0_40px_rgba(0,0,0,0.5)] bg-gradient-to-r from-surface to-surface/95 border-b lg:border-b-0 lg:border-r border-borderBase/50 transition-colors duration-500" style={{ borderRightWidth: '0.5px', borderRightColor: 'rgba(255, 255, 255, 0.4)' }}>
            {/* Top Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="h-[3.6rem] flex items-center">
                {/* Fallback to text if logo not found */}
                <img src="/kpmg-logo.png" alt="KPMG" className="h-full object-contain" onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }} />
                <span className="hidden text-4xl font-black text-accent tracking-tighter opacity-80">
                  KPMG
                </span>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-accent font-mono text-xs tracking-widest uppercase block mb-1">2024 – PRESENT</span>
                <h3 className="text-2xl font-bold font-sora" style={{ color: '#0033FF' }}>KPMG India</h3>
                <span className="text-[10px] tracking-widest text-textMuted uppercase mt-1 block">Strategy | Business Transformation | Governance</span>
              </div>
            </div>

            <hr className="border-black/10 dark:border-white/10 my-4" />

            <p className="text-sm text-textMuted mb-4 leading-relaxed">
              Driving strategy-led transformation and program governance for large enterprises and public sector clients.
            </p>

            {/* Key Focus Areas */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 flex items-center justify-center text-accent">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
                    <circle cx="12" cy="12" r="6" strokeWidth="1.5"/>
                    <circle cx="12" cy="12" r="2" strokeWidth="1.5"/>
                  </svg>
                </div>
                <h4 className="font-bold text-textMain uppercase tracking-wider text-sm">Key Focus Areas</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 pl-2 lg:pl-4">
                <div className="text-xs text-textMuted flex items-start gap-2"><span className="text-accent mt-0.5">•</span> <span>Business Transformation</span></div>
                <div className="text-xs text-textMuted flex items-start gap-2"><span className="text-accent mt-0.5">•</span> <span>Operating Model Transformation</span></div>
                <div className="text-xs text-textMuted flex items-start gap-2"><span className="text-accent mt-0.5">•</span> <span>Growth Strategy Development</span></div>
                <div className="text-xs text-textMuted flex items-start gap-2"><span className="text-accent mt-0.5">•</span> <span>Digital Governance</span></div>
              </div>
            </div>

            {/* Positions Held */}
            <div className="mb-8">
              <div className="pl-4 border-l-2 border-accent/50 ml-4 space-y-2 relative">
                <div className="relative">
                  <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-accent ring-4 ring-surface dark:ring-[#0B1120]"></span>
                  <p className="text-sm font-semibold text-textMain">Senior Consultant - <span className="italic text-textMuted font-normal">March 2026 - Present</span></p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-accent ring-4 ring-surface dark:ring-[#0B1120]"></span>
                  <p className="text-sm font-semibold text-textMain">Business Consultant - <span className="italic text-textMuted font-normal">Nov 2024 - March 2026</span></p>
                </div>
              </div>
            </div>

            {/* Key Impact */}
            <div className="flex-grow flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                  </div>
                  <h4 className="font-bold text-textMain uppercase tracking-wider text-sm">KEY IMPACT</h4>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-[0.85rem] leading-[1.2rem] text-textMuted text-justify">Developed <span className="text-accent font-semibold">growth and expansion strategies</span> for industrial clients, including portfolio diversification and adjacent market entry opportunities.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-[0.85rem] leading-[1.2rem] text-textMuted text-justify">Delivered <span className="text-accent font-semibold">market intelligence and strategic assessments</span> through competitor benchmarking, value chain analysis, and opportunity evaluation.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-[0.85rem] leading-[1.2rem] text-textMuted text-justify">Designed <span className="text-accent font-semibold">digital strategy roadmaps</span> for new business initiatives, covering operating models, partnership pathways, and capability development.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-[0.85rem] leading-[1.2rem] text-textMuted text-justify">Led <span className="text-accent font-semibold">program governance and transformation oversight</span> for a large-scale government-led digital transformation initiative.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-[0.85rem] leading-[1.2rem] text-textMuted text-justify">Managed <span className="text-accent font-semibold">stakeholder coordination across government bodies, implementation partners, and system integrators</span> to drive aligned execution.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-[0.85rem] leading-[1.2rem] text-textMuted text-justify">Drove <span className="text-accent font-semibold">large-scale ecosystem transformation</span>, including onboarding of <span className="text-accent font-semibold">1,000+ stakeholders</span> onto digital governance platforms.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-[0.85rem] leading-[1.2rem] text-textMuted text-justify">Drove <span className="text-accent font-semibold">cross-platform integrations, regulatory compliance, and implementation assurance</span> to strengthen digital governance and operational effectiveness.</span>
                  </li>
                </ul>
              </div>
              

            </div>
          </div>

          {/* RIGHT PAGE - JSW */}
          <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col relative z-10 bg-surface shadow-[inset_20px_0_40px_rgba(0,0,0,0.05)] dark:shadow-[inset_20px_0_40px_rgba(0,0,0,0.5)] bg-gradient-to-l from-surface to-surface/95 transition-colors duration-500">
            {/* Top Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="h-[4.32rem] flex items-center">
                {/* Fallback to text if logo not found */}
                <img src="/jsw-logo.png" alt="JSW" className="h-full object-contain" onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }} />
                <span className="hidden text-4xl font-black text-accent tracking-tighter opacity-80 italic">
                  JSW
                </span>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-accent font-mono text-xs tracking-widest uppercase block mb-1">2021 – 2024</span>
                <h3 className="text-2xl font-bold font-sora" style={{ color: '#0033FF' }}>JSW Steel</h3>
                <span className="text-[10px] tracking-widest text-textMuted uppercase mt-1 block">Digital Transformation | Operations | Finance</span>
              </div>
            </div>

            <hr className="border-black/10 dark:border-white/10 my-4" />

            <p className="text-sm text-textMuted mb-4 leading-relaxed">
              Worked at the intersection of industrial operations and digital transformation to drive efficiency, intelligence and impact.
            </p>

            {/* Key Focus Areas */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 flex items-center justify-center text-accent">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
                    <circle cx="12" cy="12" r="6" strokeWidth="1.5"/>
                    <circle cx="12" cy="12" r="2" strokeWidth="1.5"/>
                  </svg>
                </div>
                <h4 className="font-bold text-textMain uppercase tracking-wider text-sm">Key Focus Areas</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 pl-2 lg:pl-4">
                <div className="text-xs text-textMuted flex items-start gap-2"><span className="text-accent mt-0.5">•</span> <span>Digital Transformation</span></div>
                <div className="text-xs text-textMuted flex items-start gap-2"><span className="text-accent mt-0.5">•</span> <span>Workflow Automation</span></div>
                <div className="text-xs text-textMuted flex items-start gap-2"><span className="text-accent mt-0.5">•</span> <span>Project Management</span></div>
                <div className="text-xs text-textMuted flex items-start gap-2"><span className="text-accent mt-0.5">•</span> <span>Mine Finance</span></div>
              </div>
            </div>

            {/* Key Impact */}
            <div className="flex-grow flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                  </div>
                  <h4 className="font-bold text-textMain uppercase tracking-wider text-sm">KEY IMPACT</h4>
                </div>
                
                {/* Block 1: Finance */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0"></span>
                    <h5 className="text-sm font-semibold text-textMain">Deputy Manager – Finance <span className="italic text-textMuted font-normal text-xs ml-1">- Feb 2024 - Nov 2024</span></h5>
                  </div>
                  <ul className="space-y-3 pl-3 border-l border-borderBase/50 ml-1.5">
                    <li className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="text-[0.85rem] leading-[1.2rem] text-textMuted text-justify">Managed <span className="text-accent font-semibold">operational cost monitoring, financial performance tracking, and production planning</span> for large-scale mining operations.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="text-[0.85rem] leading-[1.2rem] text-textMuted text-justify">Identified <span className="text-accent font-semibold">cost optimization and continuous improvement opportunities</span> to enhance operational efficiency and business performance.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="text-[0.85rem] leading-[1.2rem] text-textMuted text-justify">Supported <span className="text-accent font-semibold">feasibility assessments, commercial structuring, contract management, and production reconciliation</span> to strengthen strategic decision-making.</span>
                    </li>
                  </ul>
                </div>

                {/* Block 2: Digital Transformation */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0"></span>
                    <h5 className="text-sm font-semibold text-textMain">Deputy Manager – Digital Transformation <span className="italic text-textMuted font-normal text-xs ml-1">- January 2021 - January 2024</span></h5>
                  </div>
                  <ul className="space-y-3 pl-3 border-l border-borderBase/50 ml-1.5">
                    <li className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="text-[0.85rem] leading-[1.2rem] text-textMuted text-justify">Developed and executed the <span className="text-accent font-semibold">enterprise digital transformation roadmap</span>, aligning technology initiatives with operational priorities and business goals.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="text-[0.85rem] leading-[1.2rem] text-textMuted text-justify">Led <span className="text-accent font-semibold">end-to-end transformation programs</span> across logistics, fleet operations, fuel management, quality systems, reporting, and operational monitoring.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="text-[0.85rem] leading-[1.2rem] text-textMuted text-justify">Delivered high-impact operational improvements, including <span className="text-accent font-semibold">40% reduction in truck turnaround time, 25% reduction in refuelling frequency</span>, and <span className="text-accent font-semibold">20% improvement in bowser efficiency</span> through process redesign and digital interventions.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="text-[0.85rem] leading-[1.2rem] text-textMuted text-justify">Built <span className="text-accent font-semibold">internal business applications, workflow automation solutions, and decision-support systems</span> using Microsoft Power Platform and low-code technologies.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="text-[0.85rem] leading-[1.2rem] text-textMuted text-justify">Collaborated with leadership, operations teams, and technology stakeholders to drive <span className="text-accent font-semibold">program execution, adoption, governance, and continuous process improvement</span>.</span>
                    </li>
                  </ul>
                </div>
              </div>
              

            </div>
          </div>

          {/* Middle Book Crease Binding (Visible only on Desktop) */}
          <div className="hidden lg:flex absolute inset-y-0 left-1/2 w-8 -translate-x-1/2 bg-gradient-to-r from-transparent via-borderBase/20 to-transparent pointer-events-none z-20 justify-center items-center">
              <div className="w-[1px] h-full bg-borderBase/30 shadow-[0_0_10px_rgba(0,0,0,0.5)]"></div>
          </div>
        </div>
        </div>

        {/* Footer Quote */}
        <div className="w-full text-center pb-4 mt-2">
          <p className="text-textMuted italic text-sm md:text-base font-sora">
            <span className="text-accent text-lg font-bold">“</span> Transformation is not about tools. It is about clarity, discipline and creating lasting impact. <span className="text-accent text-lg font-bold">”</span>
          </p>
        </div>
      </div>
    </section>
  );
}
