# Bump Homebrew cask Action

This action is working for bumping homebrew cask automatically.

## Inputs

## `token`
**Required** Homebrew Github api token.

## `package`
The package need bumping.

**Recommendation** Cask package maintainer use this.

## `bump_gist_raw_link`
Gist raw url of package list.
**Recommendation** Please suggest cask package maintainer use this action to bumping up when they release.

## `name`
Github user name. Default `${{ github.actor }}`.

## `email`
Github user email.

## message
The message when you create pull request via `brew bump-cask-pr`. 

Default `"Automatic bumping by [Bump Homebrew Cask Action](https://github.com/EINDEX/bump-homebrew-cask-action)"`

## Example usage

### For maintainer

```yaml
uses: eindex/bump-homebrew-cask-action
with:
  token: ${{ secrets.HOMEBREW_GITHUB_API_TOKEN }}
  package: '<name of the package>'
```

### For non-maintainer
```yaml
uses: eindex/bump-homebrew-cask-action
with:
  token: ${{ secrets.HOMEBREW_GITHUB_API_TOKEN }}
  bump_gist_raw_link: '<link_to_gist_raw>'
```

Example for gist content
```text
cask-package1
cask-package2
cask-package3
```
