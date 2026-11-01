import { readFile, stat } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const readme = await readFile(resolve(root, 'README.md'), 'utf8')
const projects = JSON.parse(
  await readFile(resolve(root, 'data/projects.json'), 'utf8'),
)
const expected = [
  'little-code',
  'little-terminal',
  'nexsus-universe',
  'cognito-learning-hub',
  'fracturevision-ai',
  'nexsus-assist',
  'haazir',
  'washtro',
  'washing-bro',
  'aurorahai',
]
const errors = []
const references = [...readme.matchAll(/(?:src|srcset)="([^"]+)"/g)].map(
  (match) => match[1],
)
const local = [
  ...new Set(references.filter((url) => !url.startsWith('https://'))),
]
for (const file of local) {
  try {
    if (!(await stat(resolve(root, file))).isFile())
      errors.push(`Not a file: ${file}`)
  } catch {
    errors.push(`Missing asset: ${file}`)
  }
}
if (new Set(projects.map((p) => p.slug)).size !== projects.length)
  errors.push('Duplicate projects')
for (const [i, slug] of expected.entries())
  if (projects[i]?.slug !== slug)
    errors.push(`Project priority ${i + 1} should be ${slug}`)
for (const project of projects) {
  if (!readme.includes(project.title))
    errors.push(`Project missing from README: ${project.title}`)
  if (project.image)
    try {
      await stat(resolve(root, project.image))
    } catch {
      errors.push(`Missing project screenshot: ${project.slug}`)
    }
}
if (
  (readme.match(/<details>/g) || []).length !==
  (readme.match(/<\/details>/g) || []).length
)
  errors.push('Unbalanced expandable sections')
if (
  /github-readme-stats\.vercel\.app|activity-graph\.vercel\.app|ghchart\.rshah\.org|\/Little_Terminal\)/.test(
    readme,
  )
)
  errors.push('Unavailable live service or non-public source link in README')
if (!/September 2026–present/.test(readme))
  errors.push('GDGoC start date missing')
if (/localhost:|P:\\|C:\\/.test(readme))
  errors.push('Local path leaked into README')
if (/<script|<iframe|<style/i.test(readme))
  errors.push('README contains unsupported active markup')
if (
  !readme.includes('prefers-color-scheme: dark') ||
  !readme.includes('max-width: 600px')
)
  errors.push('Responsive theme artwork missing')
if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else
  console.log(
    `Profile check passed: ${projects.length} projects, ${local.length} local image references, complete priority order, public links and GitHub-compatible markup.`,
  )
