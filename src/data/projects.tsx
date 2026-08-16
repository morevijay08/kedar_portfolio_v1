import AceTernityLogo from "@/components/logos/aceternity";
import SlideShow from "@/components/slide-show";
import { Button } from "@/components/ui/button";
import { TypographyH3, TypographyP } from "@/components/ui/typography";
import { ArrowUpRight, ExternalLink, Link2, MoveUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
// Spline has no thesvg entry — keep the Three.js mark as its stand-in.
import { SiThreedotjs } from "react-icons/si";
const BASE_PATH = "/assets/projects-screenshots";

// Renders a brand SVG from /public as a monochrome glyph that inherits the
// surrounding text color (the skill dock styles every icon via currentColor),
// so full-color marks like Mistral flatten to match the rest of the set.
const MaskIcon = ({ src, title }: { src: string; title?: string }) => (
  <span
    role="img"
    aria-label={title}
    className="block bg-current"
    style={{
      width: "1em",
      height: "1em",
      WebkitMaskImage: `url(${src})`,
      maskImage: `url(${src})`,
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      maskPosition: "center",
      WebkitMaskSize: "contain",
      maskSize: "contain",
    }}
  />
);

const ProjectsLinks = ({ live, repo }: { live?: string; repo?: string }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-start gap-3 my-3 mb-8">
      {live && live !== "#" && (
        <Link
          className="font-mono underline flex gap-2"
          rel="noopener"
          target="_new"
          href={live}
        >
          <Button variant={"default"} size={"sm"}>
            Visit Website
            <ArrowUpRight className="ml-3 w-5 h-5" />
          </Button>
        </Link>
      )}
    </div>
  );
};

export type Skill = {
  title: string;
  bg: string;
  fg: string;
  icon: ReactNode;
};
// Brand chips sourced from thesvg CLI mono SVGs in /public/assets/logos,
// rendered via MaskIcon so each one inherits the dock's currentColor.
const brand = (title: string, file: string): Skill => ({
  title,
  bg: "black",
  fg: "white",
  icon: <MaskIcon src={`/assets/logos/${file}`} title={title} />,
});
const PROJECT_SKILLS = {
  next: brand("Next.js", "nextdotjs-mono.svg"),
  chakra: brand("Chakra UI", "chakra-ui-mono.svg"),
  node: brand("Node.js", "nodedotjs-mono.svg"),
  python: brand("Python", "python-mono.svg"),
  prisma: brand("Prisma", "prisma-mono.svg"),
  postgres: brand("PostgreSQL", "postgresql-mono.svg"),
  mongo: brand("MongoDB", "mongodb-mono.svg"),
  express: brand("Express", "express-mono.svg"),
  reactQuery: brand("React Query", "react-query-mono.svg"),
  shadcn: brand("shadcn/ui", "shadcn-ui-mono.svg"),
  // Not in the thesvg registry — keep the existing custom logo.
  aceternity: {
    title: "Aceternity",
    bg: "black",
    fg: "white",
    icon: <AceTernityLogo />,
  },
  tailwind: brand("Tailwind", "tailwind-css-mono.svg"),
  docker: brand("Docker", "docker-mono.svg"),
  // Not in the thesvg registry — keep the text mark.
  yjs: {
    title: "Y.js",
    bg: "black",
    fg: "white",
    icon: (
      <span>
        <strong>Y</strong>js
      </span>
    ),
  },
  firebase: brand("Firebase", "firebase-mono.svg"),
  sockerio: brand("Socket.io", "socketdotio-mono.svg"),
  js: brand("JavaScript", "javascript-mono.svg"),
  ts: brand("TypeScript", "typescript-mono.svg"),
  vue: brand("Vue.js", "vuedotjs-mono.svg"),
  react: brand("React.js", "react-mono.svg"),
  sanity: brand("Sanity", "sanity-mono.svg"),
  // Not in the thesvg registry — keep the Three.js stand-in.
  spline: {
    title: "Spline",
    bg: "black",
    fg: "white",
    icon: <SiThreedotjs />,
  },
  gsap: brand("GSAP", "gsap-mono.svg"),
  motion: brand("Motion", "motion.svg"),
  supabase: brand("Supabase", "supabase-mono.svg"),
  trpc: brand("tRPC", "trpc-mono.svg"),
  drizzle: brand("Drizzle ORM", "drizzle-mono.svg"),
  hono: brand("Hono", "hono-mono.svg"),
  redis: brand("Redis / BullMQ", "redis-mono.svg"),
  cloudflare: brand("Cloudflare", "cloudflare-mono.svg"),
  // React Native reuses the React mark.
  reactNative: brand("React Native", "react-mono.svg"),
  betterAuth: brand("Better Auth", "better-auth-mono.svg"),
  // Not in the thesvg registry — keep the text marks.
  zustand: {
    title: "Zustand",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">Zu</span>,
  },
  partykit: {
    title: "PartyKit",
    bg: "black",
    fg: "white",
    icon: <span className="text-base">🎈</span>,
  },
  hocuspocus: {
    title: "Hocuspocus",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">Hp</span>,
  },
  // React Flow ships under the xyflow brand.
  reactFlow: brand("React Flow", "xyflow-mono.svg"),
  codemirror: brand("CodeMirror", "codemirror-mono.svg"),
  // "Satori / sharp" — uses the sharp mark.
  satori: brand("Satori / sharp", "sharp-mono.svg"),
  turborepo: brand("Turborepo", "turborepo-mono.svg"),
  // Vercel AI SDK uses the Vercel mark.
  aiSDK: brand("Vercel AI SDK", "vercel-mono.svg"),
  anthropic: brand("Anthropic Claude", "anthropic-mono.svg"),
  mistral: brand("Mistral AI", "mistral-ai-mono.svg"),
  // Not in the thesvg registry — keep the text mark.
  nextIntl: {
    title: "next-intl",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">i18n</span>,
  },
  // Not in the thesvg registry — keep the text marks.
  expo: {
    title: "Expo",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">Expo</span>,
  },
  mcp: {
    title: "MCP",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">MCP</span>,
  },
};
export type Project = {
  id: string;
  category: string;
  title: string;
  src: string;
  previewSrc?: string;
  screenshots: string[];
  skills: { frontend: Skill[]; backend: Skill[] };
  content: React.ReactNode | any;
  github?: string;
  live: string;
};
const projects: Project[] = [
  {
    id: "storekit",
    category: "poster design",
    title: "Protect Wildlife",
    src: "/assets/projects-screenshots/storekit/landing.png",
    screenshots: ["full.webp"],
    skills: {
      frontend: [
        
      ],
      backend: [
       
      ],
    },
    live: "https://www.behance.net/gallery/241433967/PROTECT-WILDLIFE",
    // Private repo (commercial product) — intentionally no public source link
    get content() {
  return (
    <div className="my-6">
      <Image
          src="/assets/projects-screenshots/storekit/landing.png"
          alt="Protect Wildlife"
          width={1200}
          height={700}
          className="w-full rounded-lg object-cover"
      />
    </div>
  );
}
  },
  {
    id: "codingducks",
    category: "Symbol Logos",
    title: "IIT Department Logos",
    src: "/assets/projects-screenshots/codingducks/full.png",
    previewSrc: "/assets/projects-screenshots/codingducks/preview.png",
    screenshots: ["full.png"],
    skills: {
      frontend: [
        
      ],
      backend: [
        
      ],
    },
    live: "https://www.behance.net/gallery/253912767/IIT-Department-Logo",
    github: "https://github.com/Naresh-Khatri/Coding-Ducks",
    get content() {
  return (
    <div className="my-6">
      <Image
          src="/assets/projects-screenshots/codingducks/full.png"
          alt="IIT Department Logos"
          width={1200}
          height={700}
          className="w-full rounded-lg object-cover"
      />
    </div>
  );
}
  },
  {
    id: "praveen-masale",
    category: "Branding",
    title: "Pravin Masale",
    src: "/assets/projects-screenshots/praveen-masale/landing.png",
    previewSrc: "/assets/projects-screenshots/praveen-masale/preview.webp",
    screenshots: ["landing.png"],
    skills: { frontend: [], backend: [] },
    live: "https://www.behance.net/gallery/254284669/Pravin-Masale-Packaging",
    get content() {
      return (
        <div className="my-6">
          <Image
            src="/assets/projects-screenshots/praveen-masale/landing.png"
            alt="Pravin Masale branding"
            width={827}
            height={12000}
            className="w-full rounded-lg"
          />
        </div>
      );
    },
  },
  {
    id: "chitle",
    category: "Packaging",
    title: "Chitle",
    src: "/assets/projects-screenshots/chitle/landing.png",
    previewSrc: "/assets/projects-screenshots/chitle/preview.webp",
    screenshots: ["landing.png"],
    skills: { frontend: [], backend: [] },
    live: "https://www.behance.net/gallery/254284467/Chitale-Modak-Branding",
    get content() {
      return (
        <div className="my-6">
          <Image
            src="/assets/projects-screenshots/chitle/landing.png"
            alt="Chitle packaging"
            width={735}
            height={6389}
            className="w-full rounded-lg"
          />
        </div>
      );
    },
  },
  {
    id: "logos",
    category: "logo design",
    title: "Logos",
    src: "/assets/projects-screenshots/logos/landing.png",
    previewSrc: "/assets/projects-screenshots/logos/preview.webp",
    screenshots: ["landing.png"],
    skills: { frontend: [], backend: [] },
    live: "https://www.behance.net/gallery/254285317/Logo-design",
    get content() {
      return (
        <div className="my-6">
          <Image
            src="/assets/projects-screenshots/logos/landing.png"
            alt="Logo design collection"
            width={900}
            height={6434}
            className="w-full rounded-lg"
          />
        </div>
      );
    },
  },
  {
    id: "nescafe",
    category: "Campaign Design",
    title: "Nescafé Gold Blend",
    src: "/assets/projects-screenshots/nescafe/full.webp",
    previewSrc: "/assets/projects-screenshots/nescafe/preview.webp",
    screenshots: ["full.webp"],
    skills: { frontend: [], backend: [] },
    live: "https://www.behance.net/gallery/254285531/Nescafe-gold",
    get content() {
      return (
        <div className="my-6">
          <Image
            src="/assets/projects-screenshots/nescafe/full.webp"
            alt="Nescafé Gold Blend Raksha Bandhan campaign"
            width={2048}
            height={1576}
            className="w-full rounded-lg"
          />
        </div>
      );
    },
  },
  {
    id: "lexus",
    category: "Campaign Design",
    title: "Lexus ES 500e",
    src: "/assets/projects-screenshots/lexus/full.webp",
    previewSrc: "/assets/projects-screenshots/lexus/preview.webp",
    screenshots: ["full.webp"],
    skills: { frontend: [], backend: [] },
    live: "#",
    get content() {
      return (
        <div className="my-6">
          <Image
            src="/assets/projects-screenshots/lexus/full.webp"
            alt="Lexus ES 500e campaign"
            width={767}
            height={2048}
            className="w-full rounded-lg"
          />
        </div>
      );
    },
  },
];
export default projects;
