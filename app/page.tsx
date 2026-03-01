'use client';

import { useState } from 'react';
import { JoinForm } from '@/components/join-form';

export default function Home() {
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  const handleJoinSuccess = () => {
    setHasJoined(true);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 right-0 z-50 p-6">
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
            <h2 className="text-sm tracking-wide mb-6 text-muted-foreground">
              AGENTIC BUILDERS
            </h2>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8">
            The future is built
          </h1>

          <p className="text-lg md:text-xl max-w-2xl leading-relaxed text-muted-foreground mb-12">
            By thinkers and builders who put humans first. We're gathering those who see opportunities where others see obstacles.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                const element = document.getElementById('manifesto');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3 bg-primary text-primary-foreground font-medium hover:opacity-80 transition-opacity"
            >
              Read the Manifesto
            </button>
            <button
              onClick={() => setShowJoinForm(true)}
              className="px-8 py-3 border border-primary text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Join Us
            </button>
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section
        id="manifesto"
        className="py-20 px-6 bg-primary text-primary-foreground"
      >
        <div className="max-w-4xl mx-auto space-y-12">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold mb-12">
              The Manifesto
            </h2>
          </div>

          <article className="space-y-8 leading-relaxed">
            {/* Opening */}
            <div className="space-y-6">
              <p className="text-lg">
                This started with a personal realization.
              </p>
              <p className="text-lg">
                I used to avoid building things that felt like too much work but shallow in essence — sometimes I thought it was just laziness.
              </p>
              <p className="text-lg">
                Recently, I realized the problem wasn't laziness — it was how we build.
              </p>
              <p className="text-lg">
                AI has made this even more obvious.
              </p>
            </div>

            {/* The Pattern */}
            <div className="space-y-6 pt-6">
              <p className="text-lg">
                This is familiar. This is what happened with the PC. This is what happened with the internet.
              </p>
              <p className="text-lg">
                Now, with AI, we can take things even further.
              </p>
              <p className="text-lg">
                But here's the interesting part: this isn't just about AI.
              </p>
              <p className="text-lg">
                It's about how we fundamentally think about systems — the bedrock of what is to be built.
              </p>
            </div>

            {/* Systems & Humans */}
            <div className="space-y-6 pt-6">
              <p className="text-lg">
                Before AI, rigid systems gradually limited quality of life. They forced humans to be a component of the system rather than interacting with it.
              </p>
              <p className="text-lg">
                AI is accelerating awareness of these limits, and it demands the right mindset for building systems that can handle uncertainty and amplify human potential.
              </p>
              <p className="text-lg">
                As a result, engineering — and the economy as a whole — is changing in real time.
              </p>
              <p className="text-lg">
                And this shift demands something important: putting humans first.
              </p>
            </div>

            {/* The Parallels */}
            <div className="space-y-6 pt-6">
              <p className="text-lg">
                When the computer mouse was invented, it existed because someone cared deeply about improving how humans interact with technology.
              </p>
              <p className="text-lg">
                Today, we stand at a similar crossroads — this time with AI.
              </p>
              <p className="text-lg">
                AI can do immense good.
              </p>
              <p className="text-lg">
                It can also cause immense harm.
              </p>
              <p className="text-lg">
                The difference will not be the technology itself, but the people who choose to act.
              </p>
            </div>

            {/* The Vision */}
            <div className="space-y-8 pt-8 border-t border-primary-foreground/30">
              <p className="text-lg font-semibold">
                Imagine a world where:
              </p>
              <ul className="space-y-4 ml-6">
                <li className="text-lg flex items-start">
                  <span className="mr-4 mt-1">—</span>
                  <span>patients can finally understand their doctor's handwriting</span>
                </li>
                <li className="text-lg flex items-start">
                  <span className="mr-4 mt-1">—</span>
                  <span>healthcare continues beyond hospital walls</span>
                </li>
                <li className="text-lg flex items-start">
                  <span className="mr-4 mt-1">—</span>
                  <span>education meets people where they are</span>
                </li>
                <li className="text-lg flex items-start">
                  <span className="mr-4 mt-1">—</span>
                  <span>our environment becomes cleaner</span>
                </li>
                <li className="text-lg flex items-start">
                  <span className="mr-4 mt-1">—</span>
                  <span>talent turns into real opportunity</span>
                </li>
                <li className="text-lg flex items-start">
                  <span className="mr-4 mt-1">—</span>
                  <span>people grow into better versions of themselves at their own pace</span>
                </li>
                <li className="text-lg flex items-start">
                  <span className="mr-4 mt-1">—</span>
                  <span>human contribution is recognized and rewarded in new ways</span>
                </li>
              </ul>
            </div>

            {/* The Call */}
            <div className="space-y-6 pt-6">
              <p className="text-lg">
                That world won't appear on its own.
              </p>
              <p className="text-lg">
                It will be built - by thinkers who are also builders.
              </p>
            </div>

            {/* Words & Systems */}
            <div className="space-y-6 pt-6 border-t border-primary-foreground/30">
              <p className="text-lg">
                We are now living in an era shaped by words. They have always shaped ideas, but now, with AI, they are literally designing systems, guiding intelligence, and influencing outcomes.
              </p>
              <p className="text-lg">
                Programming is no longer limited to code — it includes how we think, communicate, and create.
              </p>
            </div>

            {/* Inclusivity */}
            <div className="space-y-6 pt-6">
              <p className="text-lg">
                This community is not only for engineers.
              </p>
              <p className="text-lg">
                It is for anyone willing to think clearly and build intentionally.
              </p>
            </div>

            {/* Who We're Looking For */}
            <div className="space-y-6 pt-6 border-t border-primary-foreground/30">
              <p className="text-lg">
                If you're lazy but obsessed with solving problems, this community is for you.
              </p>
              <p className="text-lg">
                If you're an engineer, this community is for you.
              </p>
              <p className="text-lg">
                If you see opportunities where others see obstacles, this community is for you.
              </p>
            </div>

            {/* The Call to Action */}
            <div className="space-y-6 pt-8 border-t border-primary-foreground/30">
              <p className="text-lg font-semibold">
                We're gathering builders, thinkers, and future shapers.
              </p>
              <p className="text-lg">
                If you've already joined, invite the people you want to help build the future with.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="py-20 px-6 bg-background text-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Be part of what's being built
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join a community of builders, thinkers, and future shapers across Africa who are putting humans first.
          </p>
          {hasJoined ? (
            <div className="space-y-4">
              <p className="text-lg font-semibold text-green-700">Welcome to Agentic Builders!</p>
              <a
                href="https://dub.sh/agenticbuilders"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-10 py-4 bg-primary text-primary-foreground font-medium text-lg hover:opacity-80 transition-opacity"
              >
                Join Our Community →
              </a>
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
        <p className="text-primary-foreground/70">
          Agentic Builders - Africa © 2025
        </p>
      </footer>
    </main>
  );
}
