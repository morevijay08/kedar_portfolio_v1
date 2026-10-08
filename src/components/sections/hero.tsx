import Link from "next/link";
import { File } from "lucide-react";
import { SiBehance, SiLinkedin } from "react-icons/si";
import { Button } from "../ui/button";
import { config } from "@/data/config";
import SectionWrapper from "../ui/section-wrapper";

const resumeUrl =
  "https://drive.google.com/file/d/1cuxoc455ehGvto8NZV_hEPjrfSNdRQhq/view?usp=sharing";

const stats = [
  { value: "1.5", label: "Years experience" },
  { value: "40+", label: "Projects completed" },
  { value: "20+", label: "Happy clients" },
];

const HeroSection = () => {
  return (
    <SectionWrapper
      id="hero"
      className="relative min-h-screen w-full overflow-hidden"
    >
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes about-text-wobble {
            0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
            25% { transform: translate3d(-2px, 1px, 0) rotate(-0.75deg); }
            55% { transform: translate3d(2px, -1px, 0) rotate(0.75deg); }
            78% { transform: translate3d(-1px, 0, 0) rotate(-0.3deg); }
          }
          .about-wobble { display: inline-block; transform-origin: center bottom; }
          .about-wobble:hover { animation: about-text-wobble 420ms ease-in-out both; }
        }
      `}</style>

      {/* Portrait will sit over this soft glow later; it is deliberately empty now. */}
      <div className="pointer-events-none absolute left-[61%] top-[61%] h-[32rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-700/20 blur-[130px]" />

      {/* Desktop composition copied from the reference positioning. */}
      <div className="relative hidden min-h-screen w-full md:block">
        <div className="absolute left-[27%] right-[5%] top-28 z-0 flex items-start justify-between font-display text-[clamp(6.5rem,12.5vw,12.5rem)] font-extrabold leading-[0.72] tracking-[-0.09em] text-red-700/90">
          <span className="about-wobble cursor-default">ABOUT</span>
          <span className="about-wobble cursor-default">ME</span>
        </div>

        <img
          src="/assets/about-portrait.png"
          alt="Portrait of Kedar Dixit"
          style={{
            left: "63%",
            top: "7%",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 72%, rgba(0,0,0,0.72) 84%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 72%, rgba(0,0,0,0.72) 84%, transparent 100%)",
          }}
          className="pointer-events-none absolute z-[5] h-[min(95vh,900px)] w-auto max-w-none -translate-x-1/2 select-none object-contain drop-shadow-[0_28px_48px_rgba(55,0,0,0.32)]"
        />

        {/* Left identity and working links */}
        <section className="absolute left-[4.5%] top-[26%] z-10 w-[22rem]">
          <p className="about-wobble mb-3 font-serif text-4xl italic leading-[0.85] text-foreground">
            Hello,
            <br />I&apos;m
          </p>
          <h1 className="about-wobble font-display text-[7.6rem] font-extrabold leading-[0.78] tracking-[-0.09em] text-foreground">
            KEDAR
            <br />
            DIXIT
          </h1>
          <p className="about-wobble mt-7 text-xl font-bold text-foreground">
            Visual Graphics Designer
          </p>

          <div className="mt-6 flex w-fit flex-col gap-3">
            <Link href={resumeUrl} target="_blank" className="cursor-can-hover">
              <Button className="h-16 min-w-60 rounded-none bg-foreground px-8 text-xl font-extrabold text-background transition-transform hover:-translate-y-1 hover:bg-foreground/90">
                <File className="mr-2 size-5" />
                Resume
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="#contact" className="cursor-can-hover">
                <Button variant="outline" className="h-12 border-border/70 bg-background/65 px-5 text-base font-bold transition-transform hover:-translate-y-1">
                  Hire Me
                </Button>
              </Link>
              <Link href={config.social.behance} target="_blank" aria-label="Behance" className="cursor-can-hover">
                <Button variant="outline" className="size-12 border-border/70 bg-background/65 p-0 transition-transform hover:-translate-y-1">
                  <SiBehance className="size-6" />
                </Button>
              </Link>
              <Link href={config.social.linkedin} target="_blank" aria-label="LinkedIn" className="cursor-can-hover">
                <Button variant="outline" className="size-12 border-border/70 bg-background/65 p-0 transition-transform hover:-translate-y-1">
                  <SiLinkedin className="size-6" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Middle description: starts exactly beneath ABOUT, never overlaps Kedar. */}
        <section className="absolute left-[30%] top-[55%] z-10 w-60">
          <p className="about-wobble mb-3 text-xl font-bold leading-none text-red-500">
            GRAPHIC
            <br />
            DESIGNER
          </p>
          <p className="about-wobble text-base leading-[1.4] text-foreground/90">
            I create bold, visually engaging designs that combine creativity
            with purpose. Passionate about strong visual identities, thoughtful
            composition, and details that turn ideas into impactful designs.
          </p>
          <p className="about-wobble mt-6 flex items-center gap-2 text-sm font-extrabold uppercase text-foreground">
            <span className="size-3 rounded-full bg-red-700 shadow-[0_0_18px_rgba(220,38,38,0.9)]" />
            Exploring possibilities
          </p>
        </section>

        {/* Right message and facts remain at the far edge, leaving portrait space clear. */}
        <aside className="absolute right-[4.5%] top-[56%] z-10 w-48">
          <div className="mb-16 flex items-start gap-4">
            <span className="mt-1 size-12 shrink-0 rounded-full border-2 border-red-700/80 shadow-[0_0_24px_rgba(220,38,38,0.35)]" />
            <p className="about-wobble text-xl leading-[1.35] text-foreground">
              Creating visuals that speak before words do.
            </p>
          </div>

          <div className="divide-y divide-border/50 border-y border-border/50">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-4 py-3">
                <span className="about-wobble font-display text-4xl font-extrabold tracking-[-0.08em] text-red-600">
                  {stat.value}
                </span>
                <span className="about-wobble max-w-20 text-xs font-medium uppercase leading-[1.2] tracking-wide text-foreground/90">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Mobile keeps every element readable in a natural vertical layout. */}
      <div className="relative z-10 flex min-h-screen flex-col gap-8 px-6 pb-16 pt-28 md:hidden">
        <div className="flex justify-between gap-8 font-display text-6xl font-extrabold leading-none tracking-[-0.08em] text-red-700">
          <span className="about-wobble">ABOUT</span>
          <span className="about-wobble">ME</span>
        </div>
        <p className="about-wobble font-serif text-3xl italic">Hello,<br />I&apos;m</p>
        <h1 className="about-wobble font-display text-7xl font-extrabold leading-[0.78] tracking-[-0.09em]">KEDAR<br />DIXIT</h1>
        <p className="about-wobble text-lg font-bold">Visual Graphics Designer</p>
        <div className="flex flex-wrap gap-3">
          <Link href={resumeUrl} target="_blank"><Button>Resume</Button></Link>
          <Link href="#contact"><Button variant="outline">Hire Me</Button></Link>
          <Link href={config.social.behance} target="_blank"><Button variant="outline"><SiBehance /></Button></Link>
          <Link href={config.social.linkedin} target="_blank"><Button variant="outline"><SiLinkedin /></Button></Link>
        </div>
        <div className="max-w-xs">
          <p className="about-wobble mb-3 text-lg font-bold text-red-500">GRAPHIC<br />DESIGNER</p>
          <p className="about-wobble text-sm leading-relaxed">I create bold, visually engaging designs that combine creativity with purpose. Passionate about strong visual identities, thoughtful composition, and details that turn ideas into impactful designs.</p>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default HeroSection;
