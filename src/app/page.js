"use client";
import Head from 'next/head'
import { useRef } from 'react'

export default function Home() {
  const primaryColor = '#b395e3';
  const secondaryColor = '#8a254e';
  const accentColor = '#cb4a3d';
  const bgColor = '#06030a';
  const textColor = '#ece4f8';

  const carouselRef = useRef(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Head>
        <title>Insider Campus - The Student Insider Network</title>
      </Head>

      <div style={{ backgroundColor: bgColor, color: textColor }} className="min-h-screen font-sans overflow-x-hidden">
        {/* Glow Effects */}
        <div className="fixed top-[-10%] left-[20%] w-[60%] h-[50%] bg-[#b395e3] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

        {/* Header */}
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4">
          <nav className="backdrop-blur-xl bg-[#ffffff0a] border border-[#ffffff15] rounded-full px-6 py-3 flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-black"></div>
              </div>
              <span className="text-sm font-semibold tracking-wide">Inside Campus</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/70">
              <a href="#" className="hover:text-white transition bg-[#ffffff10] px-4 py-1.5 rounded-full border border-white/10 text-white shadow-inner">Features</a>
              <a href="#" className="hover:text-white transition">Data & Ethics</a>
              <a href="#" className="hover:text-white transition">Why-Investors</a>
              <a href="#" className="hover:text-white transition">Videos</a>
            </div>

            <div className="flex items-center gap-5 text-sm font-medium">
              <a href="#" className="hover:text-white text-white/70 transition">Sign In</a>
              <button className="bg-white text-black px-5 py-2 rounded-full flex items-center gap-2 hover:bg-opacity-90 font-semibold shadow-lg cursor-pointer">
                Sign-up 
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="relative pt-40 pb-20 text-center">
          
          {/* Background Images / Mosaic */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-50 select-none">
            {/* Top Right Grid Images */}
            <div className="absolute right-[5%] top-[10%] w-160 h-100 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
               <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600" className="w-full h-full object-cover" alt="campus" />
            </div>
            <div className="absolute right-[9%] top-[40%] w-100 h-75 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
               <img src="https://i.pinimg.com/736x/cc/a4/ed/cca4eddf6eb5ddadb356322404e056f7.jpg" className="w-full h-full object-cover" alt="students" />
            </div>
            {/* Top Left Grid Images */}
            <div className="absolute left-[14%] top-[18%] w-100 h-60 rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-100">
               <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600" className="w-full h-full object-cover" alt="group" />
            </div>
            <div className="absolute left-[5%] top-[35%] w-160 h-100 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
               <img src="https://i.pinimg.com/736x/cf/fe/1f/cffe1fe8cc6044afb78bf8280589855c.jpg" className="w-full h-full object-cover" alt="group" />
            </div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto space-y-8 px-4">
            <h1 className="text-[5rem] font-bold leading-[1.1] tracking-tight text-white drop-shadow-2xl">
              The insider network <br/>
              every student <span style={{color: primaryColor}}>deserves.</span>
            </h1>
            
            <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
              Verified access share the associate ships, referrals and placement and
              that how to days make minutes-es-my syrups. No maps, no games 
              — just speedstart, on time.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 pt-4">
              <div className="flex items-center gap-4">
                <button style={{ backgroundColor: primaryColor }} className="px-8 py-3.5 rounded-full text-black font-semibold hover:bg-opacity-90 flex items-center gap-2 text-sm shadow-[0_0_20px_rgba(179,149,227,0.3)] cursor-pointer hover:brightness-120 transition">
                  Continue with Google
                </button>
                <button className="px-8 py-3.5 rounded-full text-white font-semibold hover:bg-white/5 flex items-center gap-2 text-sm border border-white/20 cursor-pointer">
                  See how it works
                </button>
              </div>
              <p className="text-xs text-white/40 uppercase tracking-widest mt-2">Equipment - Book with Change daily</p>
            </div>
          </div>

          {/* App Mockup UI Overlay */}
          <div className="relative z-20 mt-16 max-w-5xl mx-auto px-4">
             <div className="backdrop-blur-2xl bg-[#13092280] border border-[#ffffff15] rounded-3xl p-6 shadow-2xl overflow-hidden">
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-white/20"></div>
                  <div className="w-3 h-3 rounded-full bg-white/20"></div>
                  <div className="w-3 h-3 rounded-full bg-white/20"></div>
                  <span className="text-xs text-white/30 ml-2">Some sub-text recently displayed</span>
                </div>
                
                <div className="flex gap-8">
                  {/* Sidebar */}
                  <div className="w-48 flex flex-col gap-3 text-left">
                     <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm">Feeds</div>
                     <div className="text-white/50 px-4 py-1 text-sm hover:text-white transition">Product</div>
                     <div className="text-white/50 px-4 py-1 text-sm hover:text-white transition">Community</div>
                     <div className="text-white/50 px-4 py-1 text-sm hover:text-white transition">Directory</div>
                     <div className="text-white/50 px-4 py-1 text-sm hover:text-white transition">Jobs</div>
                  </div>
                  
                  {/* Main Content Area */}
                  <div className="flex-1 flex flex-col gap-4">
                     {/* Card 1 */}
                     <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex gap-4 text-left items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Trend</span>
                            <span className="text-white/50 text-xs">Someone out there</span>
                          </div>
                          <h4 className="text-sm font-semibold">Building Responsive React Apps with Tailwind (Part 1)</h4>
                        </div>
                        <div className="text-right">
                          <div className="text-white/40 text-xs">Date added</div>
                          <div className="text-sm">Nov 17 - Afternoon</div>
                        </div>
                     </div>
                     
                     {/* Card 2 */}
                     <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex gap-4 text-left items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-orange-500/20 text-orange-400 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Workshop</span>
                            <span className="text-white/50 text-xs">Tech Event Campus</span>
                          </div>
                          <h4 className="text-sm font-semibold">Quick Chat by mark down on writing</h4>
                        </div>
                        <div className="text-right">
                          <div className="text-white/40 text-xs">Location</div>
                          <div className="text-sm">New York, AND JNyy</div>
                        </div>
                     </div>
                  </div>

                  {/* Profile Section */}
                  <div className="w-56 text-left border-l border-white/10 pl-6 flex flex-col items-center pt-2">
                     <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" className="w-16 h-16 rounded-full border-2 border-[#b395e3] mb-3 object-cover" alt="Profile" />
                     <h4 className="font-semibold text-sm">Himanshu Singh Dangi</h4>
                     <p className="text-xs text-white/40 text-center mb-4">Software Engineering Student</p>
                     <button className="w-full cursor-pointer bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg py-2 text-xs font-semibold flex items-center justify-center gap-2 transition">
                       View full portfolio
                     </button>
                     <button className="w-full mt-2 text-xs cursor-pointer font-medium text-white/60 hover:text-white transition flex items-center justify-center gap-2">
                       <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                       Start a message
                     </button>
                  </div>
                </div>
             </div>
          </div>
          
          {/* Bottom Images Row */}
          <div className="flex justify-center gap-4 mt-8 opacity-60">
             <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300" className="w-48 h-32 object-cover rounded-xl border border-white/10" alt="Students" />
             <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=300" className="w-64 h-32 object-cover rounded-xl border border-white/10" alt="Meeting" />
             <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300" className="w-48 h-32 object-cover rounded-xl border border-white/10" alt="Co-working" />
             <img src="https://i.pinimg.com/1200x/54/ad/d9/54add9aba56878ea2ddd0fe4645cf4c4.jpg" className="w-64 h-32 object-cover rounded-xl border border-white/10" alt="Desk" />
             <img src="https://i.pinimg.com/1200x/5a/18/48/5a1848494553c45fb5e5aeabecf68388.jpg" className="w-48 h-32 object-cover rounded-xl border border-white/10" alt="Discussion" />
          </div>
        </main>

        

        {/* Structured Intelligence Section */}
        <section className="relative py-32 container mx-auto px-4 max-w-6xl">
          {/* Circuit Board Graphics (Simplified SVG Background) */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none z-0" 
               style={{ backgroundImage: 'radial-gradient(circle at 10% 50%, #b395e3 0%, transparent 50%), linear-gradient(90deg, #ffffff05 1px, transparent 1px), linear-gradient(0deg, #ffffff05 1px, transparent 1px)', backgroundSize: '100% 100%, 40px 40px, 40px 40px'}}>
             <svg width="100%" height="100%" className="absolute inset-0">
                <path d="M 100 200 L 300 200 L 350 250 L 500 250" fill="none" stroke="#b395e3" strokeWidth="1" opacity="0.5"/>
                <path d="M 800 100 L 700 100 L 650 150 L 500 150" fill="none" stroke="#b395e3" strokeWidth="1" opacity="0.5"/>
             </svg>
          </div>

          <div className="relative z-10 max-w-2xl mb-16 space-y-4">
            <p className="text-[10px] text-[#b395e3] font-bold tracking-widest uppercase">The Slide Hop</p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">Structured intelligence, <br/>not another social feed.</h2>
            <p className="text-white/60 text-lg">
              Every yern drigged by college, branch and orginazy — and ualiklid by us fuse bal stick, so facek in your flake.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {[
              { 
                icon: <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>, 
                title: 'Escape apeaste fares', desc: 'Texpage try catopee 4to, reach and post onuntry, level down accordasy core.' 
              },
              { 
                icon: <path d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>,
                title: 'Pass admission', desc: 'Pury gins Acluxact to nex tiny centied unifao beSec keep out tinul linled' 
              },
              { 
                icon: <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"></path>,
                title: 'Credibility scoring', desc: 'Everyom endowy pgs Njvernel neednot confi Apied or ns 8t a paits' 
              },
              { 
                icon: <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path>,
                title: 'Urgent cares', desc: '1 lam uxotcare neescssates and icarect a conipilnk ecacdone jitsd read' 
              },
              { 
                icon: <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"></path>,
                title: 'Internship pipeline', desc: 'Vation oncl cross Vs, omme cocaps avjnews and iscre and ends ive old.' 
              },
              { 
                icon: <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"></path>,
                title: 'verified college badge', desc: 'Lujh in ovot your inriege ather all ohfon comijteator jinsld ye.' 
              },
            ].map(feature => (
              <div key={feature.title} className="group border border-[#ffffff10] rounded-2xl p-6 bg-[#ffffff03] backdrop-blur-sm space-y-4 hover:bg-[#ffffff08] transition relative overflow-hidden">
                <div className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#ffffff0a] border border-[#ffffff10] flex items-center justify-center text-[#b395e3]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">{feature.icon}</svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Missed Opportunities Section */}
        <section className="relative py-24 border-y border-white/5 bg-[#0b0614] overflow-hidden">
          <div className="absolute left-[-10%] top-[40%] w-[40%] h-[60%] bg-[#cb4a3d] rounded-full blur-[180px] opacity-10 pointer-events-none"></div>
          
          <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
            <div className="space-y-6 flex flex-col justify-center">
              <p className="text-[10px] text-[#b395e3] font-bold tracking-widest uppercase">THE THIN NATION</p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">Most students miss opportunities they were qualified for.</h2>
              <p className="text-lg text-white/60">
                Not because that basest coample -- But ceacurs the tmatelation thats made Haider soncin tonntcges dowplc_ speeel firors and place of inosmtmosness they were none the space.
              </p>
              <p className="text-lg text-[#b395e3]/80">
                12S04 E3ITON wo seskeot recod and recinocogy are a dictassuns, outfales thre eaed i & aepry updatea of jomresls.
              </p>
            </div>
            
            <div className="space-y-4">
              {[
                { title: 'OAD TO TOO GOT DECIDED', isActive: true, icon: 'A' },
                { title: 'Answers please', desc: 'Do uldelites, ensures iis momile encl preciseus all msjelcavy and asline. The neeitoard uia laol ijm.', isActive: false, icon: 'B' },
                { title: 'Total Keywords', isActive: false, icon: 'C' },
              ].map((feature, idx) => (
                <div key={idx} className={`border ${feature.isActive ? 'border-[#b395e3]/40 bg-[#b395e3]/5' : 'border-white/10 bg-[#ffffff03]'} rounded-xl p-5 backdrop-blur-sm flex flex-col justify-center cursor-pointer hover:border-white/20 transition`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded border ${feature.isActive ? 'border-[#b395e3] text-[#b395e3]' : 'border-white/20 text-white/40'} flex items-center justify-center text-xs font-bold`}>
                        {feature.icon === 'A' ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 3.8l6.1 12.2H5.9L12 5.8z"/></svg> : null}
                        {feature.icon === 'B' ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> : null}
                        {feature.icon === 'C' ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg> : null}
                      </div>
                      <h3 className={`font-semibold ${feature.isActive ? 'text-[#b395e3]' : 'text-white/80'}`}>{feature.title}</h3>
                    </div>
                    {feature.isActive ? (
                       <svg className="w-4 h-4 text-[#b395e3] opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                    ) : (
                       <svg className="w-3 h-3 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    )}
                  </div>
                  {feature.isActive && (
                    <div className="mt-4 pl-12 text-sm text-white/60">
                      O swuaim to thio aee gead suinng sums ixeva sorgne. IM Irito the coidng Sign
                    </div>
                  )}
                  {feature.desc && !feature.isActive && (
                    <div className="mt-2 pl-12 text-sm text-white/40">
                      {feature.desc}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Carousel Section */}
        <section className="py-24 container mx-auto px-4 max-w-7xl relative overflow-hidden">
           <div className="flex flex-col md:flex-row gap-12 items-end mb-12 px-4 max-w-6xl mx-auto">
             <div className="max-w-md">
                <p className="text-[10px] text-white/40 font-bold tracking-widest uppercase mb-4">VOICES</p>
                <h2 className="text-4xl font-bold leading-tight tracking-tight">From students who used to be on the outside.</h2>
             </div>
             
             {/* Carousel arrows */}
             <div className="flex-1 flex justify-end gap-3 pb-2">
                 <button onClick={scrollLeft} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition cursor-pointer">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                 </button>
                 <button onClick={scrollRight} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition cursor-pointer">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                 </button>
             </div>
           </div>

           {/* Carousel Track */}
           <div ref={carouselRef} className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide no-scrollbar -mx-4 px-4 md:px-0 md:mx-auto max-w-6xl relative z-10">
             
             {[
               { 
                 quote: "I found I had a more accountaint as da become need to, he try to be forve been incelved.",
                 name: "Dave", role: "Primary - UI/UX readed", initial: "D" 
               },
               { 
                 quote: "Let nu programme design here, eve coner Fancity really we those as a Cllsted.",
                 name: "Hant", role: "Primary - SDS Faind", initial: "H" 
               },
               { 
                 quote: "Lets proasction side weedlee E52s. I s the need to serp. th Je as t Comp.",
                 name: "Mark", role: "Indon Univat on 2 Mhu bus", initial: "M" 
               },
               { 
                 quote: "So aexperime ev Miniohe gner to the be reting to ba th mrdary",
                 name: "Chris", role: "Design - Art director", initial: "C" 
               }
             ].map((review, i) => (
               <div key={i} className="min-w-[320px] md:min-w-[380px] snap-center flex-shrink-0 bg-[#ffffff05] border border-white/10 rounded-3xl p-8 flex flex-col justify-between hover:bg-[#ffffff08] transition h-[220px]">
                 <p className="text-[15px] text-white/80 leading-relaxed font-medium">"{review.quote}"</p>
                 <div className="flex items-center gap-4 mt-6">
                   <div className="w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-[#b395e3] font-bold">
                     {review.initial}
                   </div>
                   <div>
                     <p className="text-sm font-bold">{review.name}</p>
                     <p className="text-xs text-white/40">{review.role}</p>
                   </div>
                 </div>
               </div>
             ))}

           </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 max-w-6xl mb-24 relative z-10 mt-10">
          <div className="rounded-[2.5rem] p-12 md:p-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #130a1c 0%, #2f1225 100%)' }}>
            <div className="absolute right-[-10%] bottom-[-20%] w-[50%] h-[150%] bg-gradient-to-l from-[#cb4a3d] to-transparent opacity-10 rotate-12 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="space-y-6 max-w-xl">
                <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight text-white drop-shadow-md">
                  Stop hearing about<br/>opportunities after they close.
                </h2>
                <p className="text-lg text-white/60 leading-relaxed">
                  Avalable on lexing unioets your colligs ninos ona get limited on euplo a robsote
                </p>
                <div className="pt-4">
                  <button style={{ backgroundColor: primaryColor }} className="px-8 py-3.5 cursor-pointer rounded-full text-black font-bold hover:bg-opacity-90 flex items-center gap-2 transform transition hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(179,149,227,0.4)]">
                    Get Early 
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                </div>
              </div>

              <div className="flex-shrink-0 text-[#ffffff10] relative">
                 {/* Decorative Star/Sparkle Symbol */}
                 <svg width="150" height="150" viewBox="0 0 24 24" fill="currentColor" className="text-white/20 drop-shadow-2xl">
                    <path d="M12 0l2 9 9 2-9 2-2 9-2-9-9-2 9-2 2-9z"/>
                 </svg>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
