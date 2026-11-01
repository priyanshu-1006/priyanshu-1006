// Self-contained GitHub-compatible SVG artwork. No JavaScript runs in the image.
const DAY = 86400000
const escape = (value) =>
  String(value).replace(
    /[<>&"']/g,
    (c) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&apos;',
      })[c],
  )
const theme = {
  dark: {
    bg: '#101722',
    ink: '#f1f5fc',
    muted: '#b4c3d6',
    border: '#40516a',
    empty: '#263347',
    ramp: ['#5688c8', '#80a9e5', '#a9cbff', '#d9e9ff'],
    accent: '#9bc4ff',
    badge: '#233854',
  },
  light: {
    bg: '#f7f9fc',
    ink: '#172b45',
    muted: '#4b617c',
    border: '#b9c7d8',
    empty: '#e1e7ef',
    ramp: ['#527db6', '#3d69a1', '#285589', '#173c6e'],
    accent: '#225c9f',
    badge: '#e2ecf8',
  },
}
const label = (x, y, value, size, color, extra = '') =>
  `<text x="${x}" y="${y}" font-family="'Segoe UI',Arial,sans-serif" font-size="${size}" fill="${color}" ${extra}>${escape(value)}</text>`
const dateLabel = (d, monthOnly = false) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    ...(monthOnly
      ? { month: 'short' }
      : { day: 'numeric', month: 'short', year: 'numeric' }),
  }).format(new Date(`${d}T00:00:00Z`))

export function contributionWeeks(days) {
  const sorted = [...days].sort((a, b) => a.d.localeCompare(b.d))
  if (!sorted.length) throw new Error('Contribution days are required.')
  const seen = new Set()
  for (const day of sorted) {
    const timestamp = Date.parse(`${day.d}T00:00:00Z`)
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(day.d) ||
      !Number.isFinite(timestamp) ||
      new Date(timestamp).toISOString().slice(0, 10) !== day.d ||
      !Number.isInteger(day.c) ||
      day.c < 0 ||
      seen.has(day.d)
    )
      throw new Error('Invalid contribution day.')
    seen.add(day.d)
  }
  const start = Date.parse(`${sorted[0].d}T00:00:00Z`)
  const sunday = start - new Date(start).getUTCDay() * DAY
  const weeks = []
  for (const day of sorted) {
    const timestamp = Date.parse(`${day.d}T00:00:00Z`)
    const index = Math.floor((timestamp - sunday) / (7 * DAY))
    weeks[index] ??= Array(7).fill(null)
    weeks[index][new Date(timestamp).getUTCDay()] = day
  }
  return Array.from(
    { length: weeks.length },
    (_, i) => weeks[i] || Array(7).fill(null),
  )
}

export function contributionWindow(days, segment = null) {
  const weeks = contributionWeeks(days)
  if (segment === null) return weeks.slice(-13)
  if (!Number.isInteger(segment) || segment < 0 || segment > 3)
    throw new Error('Segment must be 0–3.')
  const base = Math.floor(weeks.length / 4),
    remainder = weeks.length % 4
  const start = segment * base + Math.min(segment, remainder)
  return weeks.slice(start, start + base + (segment < remainder ? 1 : 0))
}

export function renderContributionCard(snapshot, options = {}) {
  const c = theme[options.theme === 'light' ? 'light' : 'dark']
  const compact = options.compact === true
  const weeks = contributionWindow(
    snapshot.calendar.days,
    options.segment ?? null,
  )
  const days = weeks.flat().filter(Boolean)
  if (!days.length) throw new Error('The selected window is empty.')
  const count = days.reduce((sum, day) => sum + day.c, 0)
  const active = days.filter((day) => day.c > 0).length
  const width = compact ? 396 : 720,
    height = compact ? 432 : 374
  const step = compact ? 24 : 29,
    cell = compact ? 18 : 23
  const x = compact ? 42 : 48,
    y = compact ? 170 : 109
  const palette = [c.empty, ...c.ramp]
  const level = (n) => (n === 0 ? 0 : n < 4 ? 1 : n < 8 ? 2 : n < 16 ? 3 : 4)
  let previousMonth = ''
  const months = weeks
    .map((week, i) => {
      const first = week.find(Boolean)
      if (!first) return ''
      const month = first.d.slice(0, 7)
      if (month === previousMonth) return ''
      previousMonth = month
      return label(
        x + i * step,
        y - 14,
        dateLabel(first.d, true),
        compact ? 12 : 13,
        c.muted,
      )
    })
    .join('')
  const cells = weeks
    .map((week, wi) =>
      week
        .map((day, di) =>
          day
            ? `<rect class="day" x="${x + wi * step}" y="${y + di * step}" width="${cell}" height="${cell}" rx="4" fill="${palette[level(day.c)]}" stroke="${day.c ? 'none' : c.border}" stroke-width=".7" style="animation-delay:${wi * 16}ms"><title>${day.d}: ${day.c} contributions</title></rect>`
            : '',
        )
        .join(''),
    )
    .join('')
  const dayNames = [
    [1, 'Mon'],
    [3, 'Wed'],
    [5, 'Fri'],
  ]
    .map(([index, name]) =>
      label(
        x - 11,
        y + index * step + cell * 0.7,
        name,
        compact ? 10 : 11,
        c.muted,
        'text-anchor="end"',
      ),
    )
    .join('')
  const range = `${dateLabel(days[0].d)} — ${dateLabel(days.at(-1).d)}`
  const updated = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(snapshot.calendar.fetchedAt || snapshot.generatedAt))
  const summary = compact
    ? `${label(28, 105, count.toLocaleString('en-IN'), 30, c.ink, 'font-weight="700"')}${label(28, 126, 'contributions in view', 12, c.muted)}${label(224, 105, active, 30, c.ink, 'font-weight="700"')}${label(224, 126, 'active days', 12, c.muted)}`
    : `${label(497, 132, count.toLocaleString('en-IN'), 38, c.ink, 'font-weight="700"')}${label(497, 155, 'contributions in view', 13, c.muted)}${label(497, 212, active, 30, c.ink, 'font-weight="650"')}${label(497, 234, `active days / ${days.length}`, 13, c.muted)}${label(497, 285, snapshot.calendar.total.toLocaleString('en-IN'), 25, c.accent, 'font-weight="650"')}${label(497, 306, 'over the full rolling year', 12, c.muted)}`
  const legendY = compact ? 363 : 318
  const legend = `${label(x, legendY + 12, 'Less', 11, c.muted)}${palette.map((color, i) => `<rect x="${x + 35 + i * 20}" y="${legendY}" width="14" height="14" rx="3" fill="${color}" stroke="${i ? 'none' : c.border}"/>`).join('')}${label(x + 143, legendY + 12, 'More', 11, c.muted)}`
  const title =
    options.segment == null
      ? 'Recent rhythm.'
      : `The year / ${options.segment + 1} of 4.`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc"><title id="title">${escape(title)} ${count} contributions across ${active} active days.</title><desc id="desc">${escape(range)}. Dark and light blue cells indicate contribution intensity. Data updated ${escape(updated)}. Open the linked portfolio for keyboard-accessible day inspection.</desc><style>.day{animation:appear .45s ease-out both}@keyframes appear{from{opacity:.4}to{opacity:1}}@media(prefers-reduced-motion:reduce){.day{animation:none}}</style><rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="18" fill="${c.bg}" stroke="${c.border}"/>${label(28, 37, title, compact ? 23 : 24, c.ink, 'font-weight="700"')}${label(28, 61, range, compact ? 12 : 13, c.muted)}${summary}${months}${dayNames}${cells}${legend}<line x1="28" x2="${width - 28}" y1="${height - 35}" y2="${height - 35}" stroke="${c.border}"/>${label(28, height - 14, `UPDATED ${updated.toUpperCase()} · UTC CALENDAR`, compact ? 10 : 11, c.muted, 'letter-spacing=".5"')}${label(width - 28, height - 14, 'EXPLORE ↗', compact ? 10 : 11, c.accent, 'text-anchor="end" font-weight="600"')}</svg>\n`
}
