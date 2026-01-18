# Releasing

This project uses GitHub Actions to automatically build and publish releases when a git tag is pushed.

## Prerequisites

- All changes merged to `main`
- Tests passing locally: `bun run typecheck && bun test`
- `package.json` version updated if needed

## Release Steps

1. **Update version in `package.json`** (if not already done):
   ```bash
   # Edit package.json "version" field
   git add package.json
   git commit -S -m "chore: bump version to X.Y.Z"
   git push
   ```

2. **Create and push a git tag**:
   ```bash
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```

3. **Monitor the release**:
   - Go to GitHub Actions to watch the build
   - Once complete, the release appears at: `https://github.com/<owner>/logseq-plugin-vocabulary-card/releases`

## What the CI Does

When a tag is pushed, the workflow:
1. Installs dependencies (`bun install`)
2. Runs tests (`bun test`)
3. Type checks (`bun run typecheck`)
4. Builds (`bun run build`)
5. Packages into a zip file
6. Creates a GitHub Release with the zip attached

## Versioning

Follow [Semantic Versioning](https://semver.org/):
- `MAJOR.MINOR.PATCH` (e.g., `v2.0.0`)
- Major: Breaking changes
- Minor: New features (backwards compatible)
- Patch: Bug fixes

## Troubleshooting

If the release fails:
1. Check GitHub Actions logs for errors
2. Fix the issue locally
3. Delete the tag if needed: `git tag -d vX.Y.Z && git push origin :refs/tags/vX.Y.Z`
4. Re-tag and push after fixing
