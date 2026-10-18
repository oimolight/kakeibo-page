# Commit Guidelines

Follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).

```
<type>(<optional scope>): <subject>

<optional body: explain what and why, wrapped at 72 chars>

<optional footer: BREAKING CHANGE:, Closes #123, Co-authored-by:>
```

## Rules

- Subject: imperative mood, lowercase, no trailing period, 50 chars or fewer (72 max)
- Body: separated from the subject by a blank line; explain *why*, not *how*
- One logical change per commit (atomic); do not mix unrelated changes
  - Exception: a new repository's first commit may bundle the initial scaffold (`chore: initial commit`)
- Breaking changes: add `!` after the type/scope (`feat!:`) and a `BREAKING CHANGE:` footer
- Never commit secrets or generated files

## Types

| type     | use for                                          |
|----------|--------------------------------------------------|
| feat     | a new feature                                    |
| fix      | a bug fix                                        |
| docs     | documentation only                               |
| style    | formatting only (no behavior change)             |
| refactor | code change that neither fixes a bug nor adds a feature |
| perf     | performance improvement                          |
| test     | adding or fixing tests                           |
| build    | build system or dependencies                     |
| ci       | CI configuration                                 |
| chore    | other maintenance (e.g. `.gitignore`)            |

## Examples

- `feat: add kakeibo page with expense list`
- `fix(index): correct total calculation`
- `chore: add .gitignore`
- `docs: add commit guidelines`
