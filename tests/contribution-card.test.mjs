import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  contributionWeeks,
  contributionWindow,
  renderContributionCard,
} from '../lib/contribution-card.mjs'

const snapshot = JSON.parse(
  readFileSync(new URL('../data/github.json', import.meta.url)),
)

test('active cells have at least 3:1 contrast against empty cells in both themes', () => {
  const luminance = (hex) => {
    const rgb = hex
      .slice(1)
      .match(/../g)
      .map((v) => parseInt(v, 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722
  }
  for (const theme of ['dark', 'light']) {
    const image = renderContributionCard(snapshot, { theme })
    const cells = [
      ...image.matchAll(
        /<rect class="day"[^>]*fill="(#[a-f0-9]+)"[^>]*><title>[^<]*: (\d+) contributions/g,
      ),
    ].map((m) => ({ color: m[1], count: Number(m[2]) }))
    const empty = luminance(cells.find((c) => c.count === 0).color)
    for (const color of new Set(
      cells.filter((c) => c.count > 0).map((c) => c.color),
    )) {
      const active = luminance(color)
      assert.ok(
        (Math.max(active, empty) + 0.05) / (Math.min(active, empty) + 0.05) >=
          3,
        `${theme}: ${color}`,
      )
    }
  }
})

test('quarter panels preserve every actual contribution day exactly once', () => {
  const source = snapshot.calendar.days
  const panels = [0, 1, 2, 3].flatMap((segment) =>
    contributionWindow(source, segment).flat().filter(Boolean),
  )
  assert.deepEqual(
    panels,
    [...source].sort((a, b) => a.d.localeCompare(b.d)),
  )
  assert.equal(contributionWindow(source).length, 13)
  assert.equal(
    panels.reduce((n, d) => n + d.c, 0),
    source.reduce((n, d) => n + d.c, 0),
  )
})

test('weeks align to actual UTC weekdays and preserve gaps', () => {
  const weeks = contributionWeeks([
    { d: '2026-11-02', c: 2 },
    { d: '2026-11-04', c: 3 },
  ])
  assert.equal(weeks[0][0], null)
  assert.equal(weeks[0][1].c, 2)
  assert.equal(weeks[0][2], null)
  assert.equal(weeks[0][3].c, 3)
  assert.throws(() => contributionWeeks([{ d: '2026-02-30', c: 1 }]))
  assert.throws(() => contributionWindow(snapshot.calendar.days, 4))
})

test('both themes and compact layouts include real counts and no white empty cells', () => {
  for (const theme of ['light', 'dark'])
    for (const compact of [true, false]) {
      const image = renderContributionCard(snapshot, { theme, compact })
      const days = contributionWindow(snapshot.calendar.days)
        .flat()
        .filter(Boolean)
      assert.ok(
        image.includes(`${days.reduce((n, d) => n + d.c, 0)} contributions`),
      )
      assert.ok(image.includes('prefers-reduced-motion'))
      assert.equal((image.match(/class="day"/g) || []).length, days.length)
      assert.ok(!/<script|foreignObject|fill="#fff"/.test(image))
      assert.ok(image.includes(compact ? 'width="396"' : 'width="720"'))
    }
})
