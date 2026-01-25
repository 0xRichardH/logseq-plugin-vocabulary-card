# Releasing

This project uses automated GitHub Actions workflows to handle releases. Simply update the version in `package.json` and push to main - the automation handles tag creation and publishing.

## Prerequisites

- All changes merged to `main`
- CI workflow passing (runs automatically on PRs)
- `package.json` version updated

## Automated Release Process

**The automation handles everything for you:**

1. **Update version in `package.json`**:
   ```bash
   # Edit package.json "version" field (e.g., 2.1.1 → 2.1.2)
   git add package.json
   git commit -S -m "chore: bump version to X.Y.Z"
   git push
   ```

2. **Wait for automation**:
   - CI workflow validates code quality (typecheck, tests, build)
   - Auto-tag workflow detects version bump and creates git tag
   - Publish workflow builds and creates GitHub release

3. **Monitor the release**:
   - Go to GitHub Actions to watch the workflows
   - Once complete, the release appears at: `https://github.com/<owner>/logseq-plugin-vocabulary-card/releases`

**That's it!** No manual git tag creation needed.

## Automation Workflows

The project uses three GitHub Actions workflows:

### 1. CI Workflow (`.github/workflows/ci.yml`)
**Triggers:** Every push to main + all pull requests  
**Purpose:** Validate code quality before merge

Quality gates:
1. Type checking (`bun run typecheck`)
2. Run tests (`bun test`)
3. Build verification (`bun run build`)
4. Verify build artifacts exist

### 2. Auto-Tag Workflow (`.github/workflows/auto-tag.yml`)
**Triggers:** Push to main when `package.json` changes  
**Purpose:** Automatically create git tags on version bumps

Actions:
1. Extracts version from `package.json`
2. Validates semantic versioning format (X.Y.Z)
3. Compares with latest git tag
4. Creates and pushes tag if version is newer (e.g., `v2.1.2`)
5. Skips if version unchanged
6. Fails if version downgrade detected

### 3. Publish Workflow (`.github/workflows/publish.yml`)
**Triggers:** When a git tag is pushed  
**Purpose:** Build and publish release

Actions:
1. Runs quality gates (typecheck, tests, build)
2. Packages files into zip
3. Creates GitHub Release
4. Uploads zip as release asset

## Versioning

Follow [Semantic Versioning](https://semver.org/):
- `MAJOR.MINOR.PATCH` (e.g., `v2.0.0`)
- Major: Breaking changes
- Minor: New features (backwards compatible)
- Patch: Bug fixes

## Manual Tag Creation (Fallback)

If you need to create a tag manually (bypassing automation):

```bash
git tag vX.Y.Z
git push origin vX.Y.Z
```

This will trigger the publish workflow directly.

## Troubleshooting

### CI Workflow Fails
- Fix the issues in your branch
- Push again - CI will re-run automatically
- Merge only when CI passes

### Auto-Tag Workflow Fails

**Version validation error:**
- Ensure version follows semantic versioning (X.Y.Z)
- No prefixes, suffixes, or prerelease tags (e.g., `2.1.1-beta` is invalid)

**Version downgrade detected:**
- Ensure new version is greater than the latest tag
- Check latest tag: `git describe --tags --abbrev=0`

**Version unchanged:**
- The workflow will skip (this is expected behavior)
- No tag is created if version hasn't changed

### Publish Workflow Fails
1. Check GitHub Actions logs for errors
2. Fix the issue locally
3. Delete the failed tag: `git tag -d vX.Y.Z && git push origin :refs/tags/vX.Y.Z`
4. Bump version in package.json
5. Push to main - automation will retry with new version
