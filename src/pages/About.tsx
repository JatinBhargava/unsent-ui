import Navbar from "../components/Navbar";

export default function About() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f2ee] px-4 py-8 sm:px-6 sm:py-12 flex justify-center">
      <div className="pointer-events-none absolute -top-24 left-[-6rem] h-72 w-72 rounded-full bg-amber-200/45 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-6rem] right-[-5rem] h-72 w-72 rounded-full bg-cyan-200/45 blur-3xl" />

      <div className="w-full max-w-4xl">
        <Navbar />

        <header className="mb-12 sm:mb-16 text-center">
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-gray-900">
            About <span className="italic">Me</span>
          </h1>
          <p className="mt-3 sm:mt-4 text-gray-600 text-xs sm:text-sm max-w-2xl mx-auto px-2 leading-relaxed">
            Hi, I&apos;m Jatin Bhargava 👋
          </p>
        </header>

        <main className="pb-10">
          <section className="mb-14 sm:mb-16">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500 mb-3">
              Who I Am
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-gray-800 max-w-3xl">
              I&apos;m a software engineer and technology enthusiast passionate about
              building scalable applications and solving real-world problems
              through technology. My interests include backend development,
              distributed systems, event-driven architectures, AI engineering,
              and product development.
            </p>
          </section>

          <section className="mb-14 sm:mb-16">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500 mb-3">
              Why Unsent Exists
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-gray-800 max-w-3xl">
              Unsent was born from a simple feeling: not every thought needs a
              stage, but every honest thought deserves a home. In a world built
              for instant reactions, this project creates space for quiet
              reflection. It is designed for the pages people never publish, the
              drafts they keep for years, and the emotions they are still
              learning how to name.
            </p>
          </section>

          <section className="mb-14 sm:mb-16">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500 mb-3">
              Technologies & Focus
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-gray-800 max-w-3xl">
              I enjoy working with technologies like Java, Spring Boot, Kafka,
              PostgreSQL, React, Microservices, and Cloud-based systems.
              Alongside development, I actively explore AI agents,
              recommendation systems, financial technology solutions, and
              intelligent automation.
            </p>
          </section>

          <section className="mb-14 sm:mb-16">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500 mb-3">
              A Hub For Artists & Writers
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-gray-800 max-w-3xl">
              I see this platform as more than a diary app. It can become a
              meaningful hub for artists, writers, thinkers, and quiet creators
              who want to share what lives inside their hearts. Poems, letters,
              sketches of memory, unfinished ideas, life lessons, and personal
              transformations all belong here. Unsent has the potential to hold
              stories that people carry for years and finally decide to express.
            </p>
          </section>

          <section className="mb-14 sm:mb-16">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500 mb-3">
              About The Product
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-gray-800 max-w-3xl">
              This diary application was created as a personal space to capture
              thoughts, memories, daily experiences, goals, and reflections.
              The idea is simple - helping people organize moments, track
              progress, and preserve memories in a clean and meaningful way.
            </p>
          </section>

          <section className="mb-14 sm:mb-16">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500 mb-3">
              Storytelling Vision
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-gray-800 max-w-3xl">
              The long-term vision is to shape Unsent into a living archive of
              human feeling: a place where one person writes from pain, another
              writes from hope, and both feel understood. Each entry can become
              a bridge between strangers. Over time, these small pages can grow
              into collective memory - proof that ordinary lives carry
              extraordinary stories.
            </p>
          </section>

          <section className="mb-14 sm:mb-16">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500 mb-3">
              Outside Coding
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-gray-800 max-w-4xl">
              Outside coding, I enjoy learning new technologies, fitness,
              traveling, reading, and creating projects that combine innovation
              with practical impact.
            </p>
          </section>

          <section className="mb-14 sm:mb-16">
            <blockquote className="max-w-3xl border-l-4 border-cyan-300 pl-4 italic text-gray-900 text-base sm:text-xl leading-relaxed">
              &ldquo;I have always imagined that Paradise will be a kind of
              library.&rdquo; - Jorge Luis Borges
            </blockquote>
          </section>

          <section>
            <blockquote className="max-w-3xl border-l-4 border-amber-300 pl-4 italic text-gray-900 text-base sm:text-xl leading-relaxed">
              &ldquo;Small daily entries create big life stories.&rdquo;
            </blockquote>
          </section>
        </main>
      </div>
    </div>
  );
}
