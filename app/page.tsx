'use client';

import { useEffect, useState } from 'react';
import { JoinForm } from '@/components/join-form';

export default function Home() {
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  const handleJoinSuccess = () => {
    setHasJoined(true);
  };

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (elements.length === 0) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const element = entry.target as HTMLElement;
          const delay = Number(element.dataset.revealDelay ?? '0');
          element.style.transitionDelay = `${delay}ms`;
          element.classList.add('is-visible');
          observer.unobserve(element);
        });
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -8% 0px',
      }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 right-0 z-50 p-6 reveal" data-reveal data-reveal-delay="40">
        <button
          onClick={() => {
            const element = document.getElementById('manifesto');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-sm font-medium hover:opacity-70 transition-opacity"
        >
          Manifesto ↓
        </button>
      </nav>

      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-4xl">
          <div className="mb-8">
            <div className="mb-6 inline-flex flex-col items-end text-right leading-none">
              <span
                className="font-poppins font-semibold md:font-bold text-[11px] md:text-xs tracking-[0.24em] uppercase text-muted-foreground reveal wordmark-reveal"
                data-reveal
                data-reveal-delay="90"
              >
                Agentic Builders
              </span>
              <span
                className="mt-1 font-brand-mono text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-muted-foreground/80 reveal wordmark-reveal"
                data-reveal
                data-reveal-delay="160"
              >
                Africa
              </span>
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8 reveal" data-reveal data-reveal-delay="250">
            The future is built
          </h1>

          <p className="text-lg md:text-xl max-w-2xl leading-relaxed text-muted-foreground mb-12 reveal" data-reveal data-reveal-delay="350">
            By thinkers and builders who put humans first. We're gathering those who see opportunities where others see obstacles.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 reveal" data-reveal data-reveal-delay="450">
            <button
              onClick={() => {
                const element = document.getElementById('manifesto');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3 bg-primary text-primary-foreground font-medium hover:opacity-80 hover:-translate-y-0.5 transition-all duration-300"
            >
              Read the Manifesto
            </button>
            <button
              onClick={() => setShowJoinForm(true)}
              className="px-8 py-3 border border-primary text-primary font-medium hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5 transition-all duration-300"
            >
              Join Us
            </button>
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section
        id="manifesto"
        className="py-14 md:py-16 px-6 bg-primary text-primary-foreground"
      >
        <div className="max-w-4xl mx-auto">
          <article className="relative mx-auto max-w-3xl rounded-sm border border-primary-foreground/25 bg-primary-foreground text-primary shadow-[0_24px_60px_rgba(0,0,0,0.28)] reveal-soft" data-reveal data-reveal-delay="60">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.04),transparent_45%),linear-gradient(to_bottom,rgba(0,0,0,0.02),transparent_32%)]" />
            <div className="relative px-6 py-8 md:px-12 md:py-14">
              <header className="mb-8 md:mb-10">
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                  The Manifesto
                </h2>
                <div className="mt-4 h-px w-20 bg-primary/25" />
              </header>

              <div className="mx-auto max-w-[64ch] font-serif text-[1.05rem] md:text-[1.1rem] leading-[1.72] md:leading-[1.78] tracking-[0.002em] text-primary/95">
                <section className="space-y-3 md:space-y-3.5">
                  <p className="first-letter:float-left first-letter:text-5xl first-letter:font-semibold first-letter:leading-[0.9] first-letter:mr-2 first-letter:mt-1">
                    I used to avoid building things that felt like too much work but shallow in essence — sometimes I thought it was laziness. Recently, I realized the problem wasn’t laziness; it was <em>how we build</em>.
                  </p>
                  <p>
                    AI has made this even more obvious. This is familiar — it’s what happened with the PC, what happened with the internet. Now, with AI, we can take things even further.
                  </p>
                  <p>
                    But this isn’t just about AI. It’s about how we fundamentally think about systems — the bedrock of everything we create. Before AI, rigid systems gradually limited quality of life, forcing humans to be components rather than participants. AI accelerates awareness of these limits and demands a mindset for building systems that handle uncertainty while amplifying human potential.
                  </p>
                </section>

                <section className="mt-7 md:mt-8 pt-5 md:pt-6 border-t border-primary/15 space-y-3 md:space-y-3.5">
                  <p className="font-semibold">
                    Putting Humans First
                  </p>
                  <p>
                    Engineering — and the economy as a whole — is changing in real time. This shift demands one principle above all: putting humans first.
                  </p>
                  <p>
                    When the computer mouse was invented, it existed because <strong>Douglas Engelbart</strong> cared about improving how humans interact with technology. Today, pioneers like <strong>Bennett Omalu</strong> show us that careful observation and a human-first mindset can change lives. Together, they remind us: putting humans at the center of every system isn’t optional — it’s essential.
                  </p>
                </section>

                <section className="mt-7 md:mt-8 pt-5 md:pt-6 border-t border-primary/15 space-y-4">
                  <p className="font-semibold">
                    Imagine a World Where
                  </p>
                  <ul className="space-y-2.5 ml-2 md:ml-3">
                    <li className="flex items-start leading-[1.68] md:leading-[1.74]">
                      <span className="mr-3 mt-1 text-primary/70">—</span>
                      <span>Patients can finally read their doctor’s handwriting</span>
                    </li>
                    <li className="flex items-start leading-[1.68] md:leading-[1.74]">
                      <span className="mr-3 mt-1 text-primary/70">—</span>
                      <span>Healthcare continues beyond hospital walls</span>
                    </li>
                    <li className="flex items-start leading-[1.68] md:leading-[1.74]">
                      <span className="mr-3 mt-1 text-primary/70">—</span>
                      <span>Education meets people where they are</span>
                    </li>
                    <li className="flex items-start leading-[1.68] md:leading-[1.74]">
                      <span className="mr-3 mt-1 text-primary/70">—</span>
                      <span>Our environment becomes cleaner</span>
                    </li>
                    <li className="flex items-start leading-[1.68] md:leading-[1.74]">
                      <span className="mr-3 mt-1 text-primary/70">—</span>
                      <span>Talent turns into real opportunity</span>
                    </li>
                    <li className="flex items-start leading-[1.68] md:leading-[1.74]">
                      <span className="mr-3 mt-1 text-primary/70">—</span>
                      <span>People grow into better versions of themselves at their own pace</span>
                    </li>
                    <li className="flex items-start leading-[1.68] md:leading-[1.74]">
                      <span className="mr-3 mt-1 text-primary/70">—</span>
                      <span>Human contribution is recognized and rewarded in new ways</span>
                    </li>
                  </ul>
                  <p>
                    That world won’t appear on its own. It will be built — by thinkers who are also builders.
                  </p>
                </section>

                <section className="mt-7 md:mt-8 pt-5 md:pt-6 border-t border-primary/15 space-y-3 md:space-y-3.5">
                  <p className="font-semibold">
                    The Agentic Era
                  </p>
                  <p>
                    We are living in an era shaped by words. They’ve always shaped ideas, but now, with AI, they literally design systems, guide intelligence, and influence outcomes. Programming is no longer limited to code — it includes how we think, communicate, and create.
                  </p>
                  <p>
                    This community is not only for engineers. It is for anyone willing to think clearly and build intentionally.
                  </p>
                  <ul className="space-y-2.5 ml-2 md:ml-3">
                    <li className="flex items-start leading-[1.68] md:leading-[1.74]">
                      <span className="mr-3 mt-1 text-primary/70">—</span>
                      <span>If you’re lazy but obsessed with solving problems, this community is for you.</span>
                    </li>
                    <li className="flex items-start leading-[1.68] md:leading-[1.74]">
                      <span className="mr-3 mt-1 text-primary/70">—</span>
                      <span>If you’re an engineer, this community is for you.</span>
                    </li>
                    <li className="flex items-start leading-[1.68] md:leading-[1.74]">
                      <span className="mr-3 mt-1 text-primary/70">—</span>
                      <span>If you see opportunities where others see obstacles, this community is for you.</span>
                    </li>
                  </ul>
                </section>

                <section className="mt-7 md:mt-8 pt-5 md:pt-6 border-t border-primary/15 space-y-3 md:space-y-3.5">
                  <p className="font-semibold">
                    Join Us
                  </p>
                  <p>
                    We’re gathering builders, thinkers, and future shapers across Africa who are putting humans first. Be part of what’s being built. Invite the people you want to build the future with.
                  </p>
                  <p className="pt-2 font-semibold">
                    — Emmanuel Okanlawon
                  </p>
                </section>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="py-20 px-6 bg-background text-foreground">
        <div className="max-w-4xl mx-auto text-center reveal" data-reveal data-reveal-delay="100">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Be part of what's being built
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join a community of builders, thinkers, and future shapers across Africa who are putting humans first.
          </p>
          {hasJoined ? (
            <div className="space-y-4">
              <p className="text-lg font-semibold text-green-700">Submission received.</p>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                We review with care and move with intention.
              </p>
            </div>
          ) : (
            <button
              onClick={() => setShowJoinForm(true)}
              className="px-10 py-4 bg-primary text-primary-foreground font-medium text-lg hover:opacity-80 transition-opacity"
            >
              Join the Community
            </button>
          )}
        </div>
      </section>

      {/* Join Form Modal */}
      {showJoinForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl border border-border/70 shadow-xl max-w-3xl w-full h-[90vh] max-h-[820px] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-5 md:p-6 border-b border-border bg-background shrink-0">
              <h2 className="text-2xl font-bold">Join the Community</h2>
              <button
                onClick={() => setShowJoinForm(false)}
                className="text-2xl font-light hover:opacity-70 transition-opacity"
              >
                ×
              </button>
            </div>
            <div className="p-4 md:p-6 flex-1 overflow-hidden">
              <JoinForm onSuccess={handleJoinSuccess} />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-12 px-6 bg-primary text-primary-foreground text-center text-sm">
        <div className="inline-flex flex-col items-end text-right leading-none">
          <span
            className="font-poppins font-semibold md:font-bold text-xs tracking-[0.22em] uppercase reveal wordmark-reveal"
            data-reveal
            data-reveal-delay="80"
          >
            Agentic Builders
          </span>
          <span
            className="mt-1 font-brand-mono text-[10px] tracking-[0.18em] uppercase text-primary-foreground/80 reveal wordmark-reveal"
            data-reveal
            data-reveal-delay="180"
          >
            Africa
          </span>
        </div>
        <p className="mt-3 text-primary-foreground/70">© 2025</p>
      </footer>
    </main>
  );
}
