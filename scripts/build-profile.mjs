import { readFile, writeFile, mkdir, rename } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderContributionCard } from '../lib/contribution-card.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const path = (file) => resolve(root, file)
const json = async (file) => JSON.parse(await readFile(path(file), 'utf8'))
const xml = (s) =>
  String(s ?? '').replace(
    /[<>&"']/g,
    (s) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&apos;',
      })[s],
  )
const portfolio = 'https://priyanshu-hai.vercel.app'
const github = 'https://github.com/priyanshu-1006'
const snapshotUrl =
  'https://raw.githubusercontent.com/priyanshu-1006/PriyanshuHai/main/src/data/github.json'
const colors = {
  dark: {
    bg: '#101318',
    panel: '#171c24',
    line: '#303a49',
    ink: '#f3f2ed',
    muted: '#a8b2c1',
    blue: '#a0c5ff',
    gold: '#eac69f',
    glow: '#27466f',
  },
  light: {
    bg: '#f7f6f2',
    panel: '#eeefed',
    line: '#d2d8dd',
    ink: '#1a2535',
    muted: '#526276',
    blue: '#225b9d',
    gold: '#87501d',
    glow: '#c7dcef',
  },
}

function svg(width, height, label, content, defs = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title"><title id="title">${xml(label)}</title><defs>${defs}</defs>${content}</svg>\n`.replace(
    /[ \t]+$/gm,
    '',
  )
}

function text(x, y, value, size = 16, color = '#f3f2ed', attrs = '') {
  const font = attrs.includes('font-family=')
    ? ''
    : 'font-family="\'Segoe UI\',Arial,sans-serif"'
  return `<text x="${x}" y="${y}" ${font} font-size="${size}" fill="${color}" ${attrs}>${xml(value)}</text>`
}

function header(mode, mobile) {
  const c = colors[mode]
  const w = mobile ? 440 : 1100,
    h = mobile ? 410 : 398
  const x = mobile ? 26 : 54,
    nameSize = mobile ? 44 : 66
  const computer = mobile
    ? ''
    : `<g transform="translate(805 122)">
    <ellipse cx="77" cy="198" rx="133" ry="17" fill="${c.ink}" opacity=".06"/>
    <rect x="-26" y="-15" width="216" height="157" rx="18" fill="${c.panel}" stroke="${c.line}" stroke-width="2"/>
    <rect x="-12" y="-1" width="188" height="118" rx="8" fill="${c.bg}" stroke="${c.line}"/>
    ${text(3, 22, 'PRIYANSHU OS', 10, c.muted, 'letter-spacing="2"')}
    <path d="M4 43l8 7-8 7" fill="none" stroke="${c.blue}" stroke-width="2"/>
    ${text(22, 55, 'hello, world.', 15, c.blue, 'font-family="monospace"')}
    <rect x="22" y="70" width="118" height="4" rx="2" fill="${c.line}"/>
    <rect x="22" y="81" width="79" height="4" rx="2" fill="${c.line}"/>
    <circle cx="163" cy="130" r="3" fill="${c.blue}" class="pulse"/>
    <path d="M64 143v27H29l-11 12h132l-11-12h-35v-27" fill="${c.panel}" stroke="${c.line}" stroke-width="2"/>
    <rect x="-35" y="189" width="220" height="12" rx="4" fill="${c.panel}" stroke="${c.line}"/>
    ${Array.from({ length: 16 }, (_, i) => `<rect x="${-24 + i * 12}" y="193" width="7" height="3" rx="1" fill="${c.line}"/>`).join('')}
  </g>`
  return svg(
    w,
    h,
    'Priyanshu Chaurasia — engineer, founder, always building. Welcome to Priyanshu OS.',
    `
  <style>
    .orbit{transform-origin:${mobile ? '370px 102px' : '900px 150px'};animation:orbit 48s linear infinite}
    .pulse{animation:pulse 3s ease-in-out infinite}.cursor{animation:blink 1.1s steps(2,end) infinite}.type-line{animation:type 3s steps(24,end) both}
    @keyframes type{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
    @keyframes orbit{to{transform:rotate(360deg)}}@keyframes pulse{50%{opacity:.35}}@keyframes blink{50%{opacity:0}}
    @media(prefers-reduced-motion:reduce){.orbit,.pulse,.cursor,.type-line{animation:none}}
  </style>
  <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="22" fill="${c.bg}" stroke="${c.line}"/>
  <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="22" fill="url(#dots)" opacity=".32"/>
  <circle cx="${mobile ? 410 : 990}" cy="170" r="260" fill="url(#halo)"/>
  <g class="orbit" fill="none" stroke="${c.blue}" stroke-opacity=".16">
    <ellipse cx="${mobile ? 370 : 900}" cy="${mobile ? 102 : 150}" rx="${mobile ? 102 : 174}" ry="${mobile ? 48 : 77}" transform="rotate(-35 ${mobile ? '370 102' : '900 150'})"/>
    <circle cx="${mobile ? 448 : 1042}" cy="${mobile ? 55 : 90}" r="4" fill="${c.blue}"/>
  </g>
  <circle cx="${x + 5}" cy="39" r="4" fill="${c.blue}" class="pulse"/>
  ${text(x + 20, 44, 'PRIYANSHU OS / PERSONAL EDITION', mobile ? 10 : 12, c.muted, 'letter-spacing="2"')}
  <line x1="${x}" y1="65" x2="${w - x}" y2="65" stroke="${c.line}"/>
  ${text(x, mobile ? 132 : 145, 'Priyanshu', nameSize, c.ink, 'font-weight="750" letter-spacing="-2.5"')}
  ${text(x, mobile ? 184 : 216, 'Chaurasia.', nameSize, c.ink, 'font-weight="750" letter-spacing="-2.5"')}
  ${text(x, mobile ? 225 : 255, 'Engineer. Founder. Always building.', mobile ? 17 : 22, c.blue, 'font-weight="500"')}
  <g class="type-line">${text(x, mobile ? 265 : 292, '> I build the systems', mobile ? 16 : 17, c.gold, 'font-family="monospace"')}
  ${text(x, mobile ? 289 : 316, '  institutions run on.', mobile ? 16 : 17, c.gold, 'font-family="monospace"')}</g>
  <rect x="${mobile ? 226 : 267}" y="${mobile ? 276 : 303}" width="7" height="17" fill="${c.gold}" class="cursor"/>
  ${computer}
  <line x1="${x}" y1="${h - 53}" x2="${w - x}" y2="${h - 53}" stroke="${c.line}"/>
  ${text(x, h - 26, 'GORAKHPUR, INDIA', mobile ? 10 : 11, c.muted, 'letter-spacing="1.6"')}
  ${text(w - x, h - 26, 'CSE ’28 · MMMUT', mobile ? 10 : 11, c.muted, 'text-anchor="end" letter-spacing="1.2"')}
  `,
    `<pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="${c.muted}"/></pattern><radialGradient id="halo"><stop stop-color="${c.glow}" stop-opacity=".38"/><stop offset="1" stop-color="${c.bg}" stop-opacity="0"/></radialGradient>`,
  )
}

function button(label, subtitle, mode) {
  const c = colors[mode]
  return svg(
    190,
    60,
    label,
    `<rect x="1" y="1" width="188" height="58" rx="11" fill="${c.panel}" stroke="${c.line}"/>${text(15, 26, label, 14, c.ink, 'font-weight="600"')}${text(15, 44, subtitle, 8, c.muted, 'letter-spacing=".8"')}${text(168, 31, '↗', 20, c.blue, 'text-anchor="middle"')}`,
  )
}

function section(label, subtitle, mode) {
  const c = colors[mode]
  return svg(
    1100,
    90,
    `${label}. ${subtitle}`,
    `<rect x="1" y="1" width="1098" height="88" rx="15" fill="${c.bg}" stroke="${c.line}"/><rect x="24" y="25" width="4" height="40" rx="2" fill="${c.blue}"/>${text(45, 39, label, 24, c.ink, 'font-weight="650"')}${text(45, 64, subtitle, 14, c.muted)}<path d="M1020 45h45m-10-10 10 10-10 10" fill="none" stroke="${c.blue}" stroke-width="2"/>`,
  )
}

function picture(stem, alt, width = '100%', mobile = false) {
  return `<picture>\n${mobile ? `  <source media="(max-width: 600px) and (prefers-color-scheme: dark)" srcset="assets/generated/${stem}-mobile-dark.svg">\n  <source media="(max-width: 600px)" srcset="assets/generated/${stem}-mobile-light.svg">\n` : ''}  <source media="(prefers-color-scheme: dark)" srcset="assets/generated/${stem}-dark.svg">\n  <img src="assets/generated/${stem}-light.svg" alt="${xml(alt)}" width="${width}">\n</picture>`
}

const shortBlurbs = {
  'little-code':
    'An AI coding companion inside its own Code-OSS desktop app. Ask, plan, review edits and run supervised agents in the workspace — with local project memory, MCP tools and cloud or local models.',
  'little-terminal':
    'A native Rust terminal with GPU rendering and real Windows ConPTY sessions. Split workspaces, manage services and review AI actions in a terminal built around an actual shell.',
  'fracturevision-ai':
    'Three complementary models for fracture classification and localisation, with Grad-CAM explanations. Built and evaluated as a research prototype; fifth place and special mention at Xpecto ’26, IIT Mandi.',
}

function projectContent(project, index) {
  const image = project.image
    ? `<a href="${project.caseStudy}"><img src="${project.image}" alt="${xml(project.title)} — actual product screenshot" width="100%"></a>\n\n`
    : ''
  const brand = {
    'little-code': 'little-code.png',
    'little-terminal': 'little-terminal.png',
    'nexsus-universe': 'nexsus.webp',
    washtro: 'washtro.svg',
  }[project.slug]
  const title = `${brand ? `<img src="assets/brands/${brand}" width="26" height="26" alt=""> ` : ''}${String(index + 1).padStart(2, '0')} / ${project.title}`
  const links = [
    `[Case study ↗](${project.caseStudy})`,
    project.links.live ? `[Visit website ↗](${project.links.live})` : null,
    project.links.github && project.slug !== 'little-terminal'
      ? `[Source ↗](${project.links.github})`
      : null,
  ]
    .filter(Boolean)
    .join(' · ')
  const content = `${image}${shortBlurbs[project.slug] || project.blurb}\n\n**Built with:** ${project.tech.slice(0, 6).join(' · ')}\n\n${links}\n`
  if (index < 2) return `### ${title}\n\n${content}`
  return `<details>\n<summary><strong>${String(index + 1).padStart(2, '0')} / ${xml(project.title)}</strong> · ${xml(project.tech.slice(0, 2).join(' / '))}</summary>\n\n${content}\n</details>\n`
}

function markdown(projects, profile, snapshot) {
  const badgeQuery = new URLSearchParams({
    url: snapshotUrl,
    query: '$.calendar.total',
    label: 'Year contributions',
    color: '9abfff',
    labelColor: '171b22',
    style: 'for-the-badge',
  })
  const publicRepos = new URLSearchParams({
    url: snapshotUrl,
    query: '$.user.publicRepos',
    label: 'Public repos',
    color: '9abfff',
    labelColor: '171b22',
    style: 'for-the-badge',
  })
  const rows = projects
    .slice(10)
    .map(
      (p) =>
        `| [${p.title}](${p.caseStudy}) | ${p.blurb} | ${p.links.live ? `[Website ↗](${p.links.live})` : `[Case study ↗](${p.caseStudy})`} |`,
    )
    .join('\n')
  const icon = (name, title) =>
    `<img src="assets/generated/tech-${name}.svg" width="36" height="36" alt="${title}" title="${title}">`
  const buttons = [
    ['portfolio', 'Enter my portfolio', portfolio],
    ['linkedin', 'Connect on LinkedIn', profile.socials.linkedin],
    ['email', 'Email me', `mailto:${profile.email}`],
    ['resume', 'Read my résumé', `${portfolio}/resume.pdf`],
  ]
    .map(
      ([stem, label, href]) =>
        `<a href="${href}">${picture(stem, label, '160')}</a>`,
    )
    .join('\n')
  return `<!-- Generated by scripts/build-profile.mjs from the portfolio catalogue. -->
${picture('hero', 'Priyanshu Chaurasia. Engineer, founder, always building. Welcome to Priyanshu OS.', '100%', true)}

<p align="center">
${buttons}
</p>

<p align="center">
  <a href="#selected-work">Selected work</a> &nbsp; / &nbsp; <a href="#toolbox">Toolbox</a> &nbsp; / &nbsp; <a href="#live-activity">Live activity</a> &nbsp; / &nbsp; <a href="#the-story-so-far">My story</a>
</p>

## I build the systems institutions run on.

I'm **Priyanshu Chaurasia**, a third-year **Computer Science & Engineering student at MMMUT, Gorakhpur (2024–2028)**. I build developer tools, campus infrastructure and operational software — from native Rust terminals to the systems behind two startups.

I like starting with an architecture diagram and staying until people can use what I build.

> **Open to internships and SDE roles.** Interested in developer experience, full-stack engineering and applied AI? [Let's talk ↗](mailto:${profile.email})

### Currently building & leading

| Where | What I do |
| :--- | :--- |
| <img src="assets/brands/nexsus.webp" width="24" height="24" alt=""> **[Nexsus](https://mmmut.app)** | **Founder & President** · A registered campus society and a shared digital ecosystem. Five web portals, two mobile apps, five RAG assistants; the CSE department uses its timetable. |
| <img src="assets/brands/gryork.webp" width="24" height="24" alt=""> **[Gryork](https://www.gryork.com)** | **CTO** · Architecture for a bill-discounting marketplace connecting EPCs, subcontractors and NBFCs. |
| <img src="assets/brands/washtro.svg" width="24" height="24" alt=""> **[Washtro](https://www.washtro.com)** | **CTO** · Garment-level tracking, custody trails and operations for a laundry chain. |
| <img src="assets/brands/gdg.svg" width="30" height="22" alt=""> **[GDG on Campus, MMMUT](https://gdg.mmmut.app)** | **Organiser & Campus Lead · September 2026–present.** Previously Executive Member; built the chapter website and its induction system. |

### A few things that reached the real world

- **National winner**, Upskill India Challenge at **IIT Bombay Techfest ’25** — Cognito Learning Hub, a twelve-service learning platform.
- **₹2.5 lakh grant** awarded to Gryork on the technical architecture I designed, at **IIIT Allahabad**.
- **200+ admissions into MMMUT** through Nexsus counselling, with 900 students reached and 450 mentorship sessions.
- **85+ students taught** agentic AI and full-stack development through Gryork Techpreneur 2026.

<a id="selected-work"></a>

## Selected work

${picture('work', 'From developer tools to systems people depend on. Open a project below to explore screenshots and architecture.')}

Two developer tools up front. Open the other projects to see their screenshots, stack and case studies.

${projects.slice(0, 10).map(projectContent).join('\n')}

<details>
<summary><strong>More from the workshop — ${projects.length - 10} projects</strong></summary>

Campus tools, evidence-led AI prototypes, startup systems and the earlier projects that shaped how I build. Team projects are described in their linked case studies.

| Project | What it does | Explore |
| :--- | :--- | :--- |
${rows}

### ManakMitra & SatyaDwar

<a href="${portfolio}/projects/manakmitra"><img src="assets/projects/manakmitra.webp" alt="ManakMitra — standards discovery and compliance workspace" width="100%"></a>

**ManakMitra:** Evidence-grounded Indian Standards discovery, certification checks and laboratory search. [Case study ↗](${portfolio}/projects/manakmitra) · [Website ↗](https://manakmitra.me)

<a href="${portfolio}/projects/satyadwar"><img src="assets/projects/satyadwar.webp" alt="SatyaDwar — offline-first identity document screening prototype" width="100%"></a>

**SatyaDwar:** Offline-first document screening with signed-QR verification, OCR comparisons and itemised evidence. [Case study ↗](${portfolio}/projects/satyadwar)

</details>

<details>
<summary><strong>Explore Priyanshu OS — this profile, as an interactive computer</strong></summary>

<a href="${portfolio}"><img src="assets/portfolio.jpg" alt="Priyanshu OS portfolio with a 3D retro computer, desktop apps and project case studies" width="100%"></a>

A 3D computer you can enter, an XP-inspired desktop, a searchable project library, a working terminal, a calendar and a question-based guide. Built with **React, Three.js and Vite**.

[Enter the computer ↗](${portfolio}) · [Browse all case studies ↗](${portfolio}/projects)

</details>

<a id="toolbox"></a>

## Toolbox

${icon('typescript', 'TypeScript')} &nbsp; ${icon('javascript', 'JavaScript')} &nbsp; ${icon('python', 'Python')} &nbsp; ${icon('rust', 'Rust')} &nbsp; ${icon('react', 'React')} &nbsp; ${icon('nextjs', 'Next.js')} &nbsp; ${icon('nodejs', 'Node.js')}

${icon('fastapi', 'FastAPI')} &nbsp; ${icon('postgressql', 'PostgreSQL')} &nbsp; ${icon('mongodb', 'MongoDB')} &nbsp; ${icon('redis', 'Redis')} &nbsp; ${icon('docker', 'Docker')} &nbsp; ${icon('pytorch', 'PyTorch')} &nbsp; ${icon('prisma', 'Prisma')}

| Layer | Tools I use |
| :--- | :--- |
| **Languages** | TypeScript · JavaScript · Python · Rust · Java · C++ · SQL |
| **Interfaces** | React · Next.js · React Native / Expo · Tailwind CSS · Vite |
| **Services & data** | Node.js · Express · NestJS · FastAPI · Prisma · PostgreSQL · MongoDB · Redis |
| **Applied AI** | RAG · LangChain · LangGraph · pgvector · PyTorch · vision transformers · YOLO · Grad-CAM |
| **Shipping** | Docker · Vercel · Railway · Render · Turborepo · Playwright · Git |

<details>
<summary><strong>How those tools connect</strong></summary>

1. **Start with the workflow.** Who uses it, and which state transitions must be trusted?
2. **Design the data and boundaries.** Permissions, append-only audit trails, validation and failure paths come before extra screens.
3. **Build the interface and the service together.** Browser, mobile or native, depending on the job.
4. **Add AI where the evidence supports it.** Retrieval with citations, reviewed actions and model explanations.
5. **Ship, observe, improve.** The department timetable and startup operations make the feedback loop very real.

</details>

<a id="live-activity"></a>

## Live activity

<p>
  <a href="${github}?tab=followers"><img src="https://img.shields.io/github/followers/priyanshu-1006?style=for-the-badge&amp;labelColor=171b22&amp;color=9abfff&amp;logo=github&amp;logoColor=white&amp;label=Followers" alt="Live GitHub follower count"></a>
  <a href="${github}?tab=repositories"><img src="https://img.shields.io/github/stars/priyanshu-1006?style=for-the-badge&amp;labelColor=171b22&amp;color=9abfff&amp;logo=github&amp;logoColor=white&amp;label=Stars" alt="Live stars across public repositories"></a>
  <a href="${portfolio}/overview"><img src="https://img.shields.io/badge/dynamic/json?${badgeQuery.toString().replace(/&/g, '&amp;')}" alt="Rolling-year contribution count from the portfolio's refreshed public snapshot"></a>
  <a href="${github}?tab=repositories"><img src="https://img.shields.io/badge/dynamic/json?${publicRepos.toString().replace(/&/g, '&amp;')}" alt="Public repository count from the portfolio's refreshed snapshot"></a>
</p>

<a href="${portfolio}/overview#github">${picture('activity-grid', 'Recent contribution rhythm. High-contrast calendar for the latest thirteen weeks. Click to inspect days in the live portfolio.', '100%', true).replace(/\n\s*/g, '')}</a>

**[Explore day by day ↗](${portfolio}/overview#github)** · [Open GitHub’s native calendar ↗](${github}?tab=overview)

Click the card to inspect dates in the live portfolio. Open the panels below to explore the whole year or read exact daily counts.

<details>
<summary><strong>Expand the full year — four readable panels</strong></summary>

${[0, 1, 2, 3].map((part) => picture(`activity-part-${part + 1}`, `Rolling-year contribution calendar, panel ${part + 1} of four`, '100%', true)).join('\n\n')}

</details>

<p>
  <a href="${github}/Little_Code"><img src="https://img.shields.io/github/last-commit/priyanshu-1006/Little_Code?style=flat-square&amp;labelColor=171b22&amp;color=9abfff&amp;label=Little%20Code" alt="Little Code's latest public commit"></a>
  <a href="${github}/PriyanshuHai"><img src="https://img.shields.io/github/last-commit/priyanshu-1006/PriyanshuHai?style=flat-square&amp;labelColor=171b22&amp;color=9abfff&amp;label=Portfolio" alt="Portfolio's latest public commit"></a>
</p>

<sub>Live badges use their providers' caches and the portfolio's daily snapshot. The blue cards are a saved snapshot, dated inside each card. Contribution counts can include private activity; public code links show public work.</sub>

<details>
<summary><strong>Inspect the last seven days & recent public commits</strong></summary>

Saved ${new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' }).format(new Date(snapshot.generatedAt))}. Select a date to open its GitHub activity.

| Day (UTC) | Contributions | Inspect |
| :--- | ---: | :--- |
${snapshot.calendar.days
  .slice(-7)
  .reverse()
  .map(
    (day) =>
      `| ${day.d} | **${day.c}** | [View day ↗](${github}?tab=overview&from=${day.d}&to=${day.d}) |`,
  )
  .join('\n')}

${snapshot.history.commits
  .slice(0, 3)
  .map(
    (c) =>
      `- [\`${c.shortSha}\`](${c.url}) · **${c.repoName}** · ${c.message.replace(/[\n\r]/g, ' ').replace(/[\[\]<>]/g, '')}`,
  )
  .join('\n')}

The cards and daily log are stored here, so they stay visible when external image services are unavailable. [How they refresh](docs/profile-maintenance.md).

</details>

<a id="the-story-so-far"></a>

## The story so far

| When | The next thing I built |
| :--- | :--- |
| **2024** | Joined MMMUT for B.Tech CSE. Managed mess operations for a 300+ student hostel in first year. |
| **2025** | Shipped BookEase during an internship. Became CTO at Gryork. Built Haazir; started Nexsus in November. Won the Upskill India Challenge at IIT Bombay Techfest in December. |
| **2026** | Nexsus became a registered university society. Took on Washtro's architecture; taught the Gryork Techpreneur programme. Became **GDGoC Organiser & Campus Lead in September**. Built Little Code and Little Terminal. |
| **Now** | Building developer tools and maintaining platforms that real students, teams and businesses rely on. |

<details>
<summary><strong>A project that changed how I think</strong></summary>

**QuizWise AI started with my mother, a school teacher.** I wanted a tool that could turn a topic or PDF into a question paper. It pushed me beyond building screens and into designing a complete workflow: extraction, generation, review and delivery.

That thread runs through the rest of my work — find an everyday problem, understand the people around it, and build the system all the way through.

[Read “The Architecture of an Idea” ↗](${portfolio}/The_Architecture_Of_An_Idea.pdf)

</details>

## Let's build something useful.

For internships, SDE opportunities, developer tools or an interesting systems problem:

<p>
  <a href="${profile.socials.linkedin}"><img src="assets/brands/linkedin.svg" width="26" height="26" alt="LinkedIn"></a> &nbsp; <a href="${profile.socials.linkedin}">LinkedIn</a> &nbsp; / &nbsp;
  <a href="mailto:${profile.email}">Email</a> &nbsp; / &nbsp;
  <a href="${profile.socials.instagram}"><img src="assets/brands/instagram.svg" width="24" height="24" alt="Instagram"></a> &nbsp; <a href="${profile.socials.instagram}">Instagram</a> &nbsp; / &nbsp;
  <a href="${portfolio}">Portfolio</a>
</p>

<sub>Built with care in Gorakhpur. Source, screenshots and the systems behind the story are one click away.</sub>
`
}

function validateSnapshot(s) {
  if (
    s?.user?.login !== 'priyanshu-1006' ||
    !Number.isFinite(Date.parse(s.generatedAt)) ||
    !Array.isArray(s.calendar?.days) ||
    s.calendar.days.length < 300 ||
    !Array.isArray(s.history?.commits) ||
    !s.history.commits.length ||
    !Number.isFinite(s.calendar.total)
  )
    throw new Error(
      'Expected a complete public PriyanshuHai snapshot; existing files were left intact.',
    )
  for (const day of s.calendar.days)
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(day.d) ||
      !Number.isInteger(day.c) ||
      day.c < 0
    )
      throw new Error('Invalid contribution day in snapshot.')
  for (const commit of s.history.commits)
    if (
      !/^https:\/\/github\.com\/[^/]+\/[^/]+\/commit\/[a-f0-9]{40}$/.test(
        commit.url,
      ) ||
      typeof commit.message !== 'string' ||
      typeof commit.repoName !== 'string' ||
      !/^[a-f0-9]{7,12}$/.test(commit.shortSha)
    )
      throw new Error('Invalid public commit in snapshot.')
}

let snapshot = await json('data/github.json')
if (process.argv.includes('--refresh')) {
  let response
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      response = await fetch(snapshotUrl, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(30000),
      })
      break
    } catch {
      if (attempt === 3) {
        console.error(
          'Could not reach the portfolio public snapshot after 3 attempts. The README and saved data are unchanged. Try npm run refresh again when the connection is available.',
        )
        process.exit(1)
      }
      console.warn(
        `Public snapshot connection failed; retrying (${attempt}/3).`,
      )
    }
  }
  if (!response.ok)
    throw new Error(
      `Portfolio snapshot returned HTTP ${response.status}; keeping the saved snapshot.`,
    )
  const next = await response.json()
  validateSnapshot(next)
  if (Date.parse(next.generatedAt) < Date.parse(snapshot.generatedAt))
    throw new Error(
      'Upstream snapshot is older than the saved version; no files changed.',
    )
  snapshot = next
  await writeFile(
    path('data/github.json.tmp'),
    JSON.stringify(snapshot, null, 2) + '\n',
  )
  await rename(path('data/github.json.tmp'), path('data/github.json'))
}
validateSnapshot(snapshot)
const [projects, profile] = await Promise.all([
  json('data/projects.json'),
  json('data/profile.json'),
])
await mkdir(path('assets/generated'), { recursive: true })
for (const name of [
  'typescript',
  'javascript',
  'python',
  'rust',
  'react',
  'nextjs',
  'nodejs',
  'fastapi',
  'postgressql',
  'mongodb',
  'redis',
  'docker',
  'pytorch',
  'prisma',
]) {
  const source = await readFile(path(`assets/tech/${name}.svg`), 'utf8')
  const [, attributes, content] = source.match(
    /<svg\b([^>]*)>([\s\S]*)<\/svg>\s*$/,
  )
  const cleaned = attributes.replace(
    /\s(?:width|height|x|y)=(?:"[^"]*"|'[^']*')/g,
    '',
  )
  await writeFile(
    path(`assets/generated/tech-${name}.svg`),
    svg(
      128,
      128,
      name,
      `<rect x="1" y="1" width="126" height="126" rx="24" fill="#f3f4f6" stroke="#cbd2db"/><svg${cleaned} x="16" y="16" width="96" height="96">${content}</svg>`,
    ),
  )
}
for (const mode of ['dark', 'light']) {
  await writeFile(
    path(`assets/generated/hero-${mode}.svg`),
    header(mode, false),
  )
  await writeFile(
    path(`assets/generated/hero-mobile-${mode}.svg`),
    header(mode, true),
  )
  for (const [stem, label, sub] of [
    ['portfolio', 'Enter my portfolio', 'THE INTERACTIVE EDITION'],
    ['linkedin', 'LinkedIn', 'LET’S CONNECT'],
    ['email', 'Say hello', 'WRITE ME A NOTE'],
    ['resume', 'Résumé', 'THE SHORT VERSION'],
  ])
    await writeFile(
      path(`assets/generated/${stem}-${mode}.svg`),
      button(label, sub, mode),
    )
  await writeFile(
    path(`assets/generated/work-${mode}.svg`),
    section(
      'From tools to infrastructure.',
      'A few things I built, shipped and kept improving.',
      mode,
    ),
  )
  await writeFile(
    path(`assets/generated/activity-grid-${mode}.svg`),
    renderContributionCard(snapshot, { theme: mode }),
  )
  await writeFile(
    path(`assets/generated/activity-grid-mobile-${mode}.svg`),
    renderContributionCard(snapshot, { theme: mode, compact: true }),
  )
  for (let part = 0; part < 4; part++) {
    await writeFile(
      path(`assets/generated/activity-part-${part + 1}-${mode}.svg`),
      renderContributionCard(snapshot, { theme: mode, segment: part }),
    )
    await writeFile(
      path(`assets/generated/activity-part-${part + 1}-mobile-${mode}.svg`),
      renderContributionCard(snapshot, {
        theme: mode,
        segment: part,
        compact: true,
      }),
    )
  }
}
await writeFile(path('README.md'), markdown(projects, profile, snapshot))
console.log(
  `Built profile: ${projects.length} projects, dark/light artwork, mobile headers and saved public activity (${snapshot.generatedAt}).`,
)
