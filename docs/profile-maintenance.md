# Maintaining this profile

This is the source for [github.com/priyanshu-1006](https://github.com/priyanshu-1006). The profile repository name must stay `priyanshu-1006` and the published README must be `README.md` on its default branch.

## What updates live

The profile does not require GitHub Actions, a PAT, an API key or an additional deployment.

| Component                                              | Source                                                                          | Update behaviour                                                                                                                                                            |
| ------------------------------------------------------ | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Followers, public stars, latest commit badges          | Shields.io's public GitHub badges                                               | The provider refreshes the image through its own cache. No profile commit is needed.                                                                                        |
| Rolling-year contribution and public repository badges | Shields.io dynamic JSON badges reading `PriyanshuHai/main/src/data/github.json` | Reflects the portfolio's saved snapshot, refreshed by the existing local daily automation. Public repo metadata may remain cached if GitHub's core REST quota is exhausted. |
| Contribution calendar                                  | `ghchart.rshah.org/8cb8ff/priyanshu-1006`                                       | Fetches the public GitHub calendar through the provider's cache. GitHub's image proxy may also cache the image.                                                             |
| Saved build log and recent public commits              | `data/github.json` → `assets/generated/activity-*.svg`                          | A repository-hosted backup. Updates only after running `npm run refresh` and publishing the generated changes. It is labelled as a dated snapshot.                          |
| Project screenshots, roles, story and stack            | Portfolio catalogue copied into this repository                                 | Edited locally, built and pushed as normal content.                                                                                                                         |

The native GitHub contribution graph remains the authoritative record. Contribution totals can include private activity counts; public commit search is a limited index of public commits, not a complete history. Repository-primary-language aggregates are deliberately not presented as proficiency percentages.

Third-party image services may occasionally be unavailable. All project screenshots, header artwork, icons and the saved activity backup are kept in this repository, so the main profile remains useful without them. Only public data is passed to image providers.

## Build and refresh

Node.js 22 or later is sufficient. There are no npm dependencies to install.

```powershell
npm run build    # Rebuild README and SVG artwork using saved JSON
npm run check    # Check assets, project order and README markup
npm run refresh  # Fetch the portfolio's public snapshot, then rebuild
```

The refresh command validates the username, contribution days and canonical public commit URLs. Failed requests, malformed snapshots and older snapshots are rejected before replacing the saved data. It never commits or pushes.

Before publishing refreshed snapshot images:

```powershell
git diff --stat
git diff -- README.md
git add README.md assets/generated data/github.json
git commit -m "chore: refresh profile activity snapshot"
git push origin HEAD:main
```

For the initial redesign, include the new scripts, data, docs, icons and screenshots as well. Review `git status --short` first. The build and refresh commands leave publishing to a normal Git commit and push.

The live images work independently of this local refresh command. No new daily profile automation has been enabled. The existing portfolio automation remains restricted to the portfolio's `src/data/github.json`.

## Edit projects or the design

- `data/projects.json` contains all 25 portfolio projects in the requested editorial order. The first ten are the selected-work accordion. The first two are expanded into full screenshot-led sections.
- `data/profile.json` holds contact and profile metadata copied from the portfolio.
- `scripts/build-profile.mjs` holds the narrative, section layout, SVG art and live-image URLs.
- `assets/projects/` holds original project screenshots, including the latest Little Code and Little Terminal images and the Aurora 3D map. No screenshot is cropped into a fixed-height card.
- `assets/brands/` and `assets/tech/` reuse the supplied brand and technology marks. These marks belong to their respective owners.
- Legacy root-level images remain intact to preserve any old external links.

Run `npm run build` after editing a data file or the generator. The header and buttons have light/dark artwork; the header also has mobile variants. SVG animation honours `prefers-reduced-motion` and there is a plain-text description beneath it.

Source links are shown only for confirmed public repositories. Little Terminal has a public website link; its source was not publicly accessible at the time of the upgrade. Team projects such as Cognito and ManakMitra retain their actual repository owner rather than implying sole authorship.

## Why the components use Markdown and images

GitHub profile READMEs cannot run the portfolio's React components. The profile uses native `<details>` disclosure sections, anchor navigation and `<picture>` theme variants. SVGs contain no JavaScript, remote fonts, foreignObject markup or external resources.

References: [GitHub profile README](https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme), [responsive theme images](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/quickstart-for-writing-on-github), [collapsible sections](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/organizing-information-with-collapsed-sections), [Shields dynamic JSON](https://shields.io/badges/dynamic-json-badge), [contribution chart source](https://github.com/2016rshah/githubchart-api).
