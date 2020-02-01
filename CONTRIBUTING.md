# Contributing
1. Read this document.
2. Fork.
3. Contribute. All new branches should correspond to an issue. 

# Tools
## [npm](https://www.npmjs.com/)
## [ghi](https://github.com/stephencelis/ghi)
Wrapper for git that allows for command line editing of github issues. 
## [hub](https://hub.github.com/)
Used to create pull-requests from the command line.
## [gren](https://github-tools.github.io/github-release-notes/)
Automatic release notes. 

# Versioning
We use Semantic Versioning, see [semver.org](https://semver.org/) for details,
as interpreted by Hadley Wickham [here](http://r-pkgs.had.co.nz/release.html). A
version number is MAJOR.MINOR.PATCH, for example 1.0.9. Only master releases are
versioned.

> Increment patch, e.g. 0.8.2 for a patch: you’ve fixed bugs without adding any
> significant new features. I’ll often do a patch release if, after release, I
> discover a show-stopping bug that needs to be fixed ASAP. Most releases will
> have a patch number of 0.

> Increment minor, e.g. 0.9.0, for a minor release. A minor release can include
> bug fixes, new features and changes in backward compatibility. This is the
> most common type of release. It’s perfectly fine to have so many minor
> releases that you need to use two (or even three!) digits, e.g. 1.17.0.
 
> Increment major, e.g. 1.0.0, for a major release. This is best reserved for
> changes that are not backward compatible and that are likely to affect many
> users. Going from 0.b.c to 1.0.0 typically indicates that your package is
> feature complete with a stable API.
 
> In practice, backward compatibility is not an all-or-nothing threshold. For
> example, if you make an API-incompatible change to a rarely-used part of your
> code, it may not deserve a major number change. But if you fix a bug that many
> people depend on, it will feel like an API breaking change. Use your best
> judgement.

# Git workflow
Inspired by [Vincent Driessen's Git branching
model](https://nvie.com/posts/a-successful-git-branching-model/). In short, we
use the following branches:

## `master`
Main release branch. Stable version. 

## `release-*`
Release branch for release *. The release branch corresponding to an upcoming
version 1.0.5 would be called release-v1.0.5. Branched from develop. Merged into
develop and master to bump version when stable.

## `develop`
Branched from `master`. Bleeding edge version. 

## `hotfix-*`
Branched from `master`. Merged into `master` and `develop`. Used only to fix
critical bugs. A hotfix must fix a github issue and result in a patch release.

## `iss*`
Feature and less critical bug fixes branches, where * references a GitHub
issue. Branched from develop. Merged into develop. Use a version label in the
format v1.0.0 to indicate which version the fix of the issue should be included
in. This is a temporary solution, ideally we should use milestones for this but
`ghi` does not support the creation of milestones yet and we don't want to leave
the command line now do we... See
[here](https://github.com/stephencelis/ghi/issues/321) for a discussion and
updates on this.

# Issues
We use github [issues](https://github.com/martingerdin/bengaltiger/issues) to
track bugs, new features and produce release notes and changelogs using
`gren`. To make sure `gren` produces beautiful release notes and changelogs for
us, follow these advice:

> 1. Start the title with a verb (e.g. Change header styles)
> 2. Use the imperative mood in the title (e.g. Fix, not Fixed or Fixes header styles)
> 3. Use labels wisely and assign one label per issue

Bugs should be labelled `bug`, enhancements should be labelled `enhancement`,
and new functions should be labelled `function`. 

## Commit messages
Should be written in sentence case, be informative, and make sense. Please
follow `gren`'s advice:

> 1. Start the subject line with a verb (e.g. Change header styles)
> 2. Use the imperative mood in the subject line (e.g. Fix, not Fixed or Fixes header styles)
> 3. Limit the subject line to about 50 characters
> 4. Do not end the subject line with a period
> 5. Separate subject from body with a blank line
> 6. Wrap the body at 72 characters
> 7. Use the body to explain what and why not how

Further, we encourage you
to
["Commit Often, Perfect Later"](https://sethrobertson.github.io/GitBestPractices/).

## Tagging
Tags should only be used to mark new master releases. Master releases should be
tagged with version number. Only annoted tags should be used. The annoted tag
message should read "Version MAJOR.MINOR.PATCH".

## Merging
Merging should be done using the `--no-ff` flag to preserve branch topology.

## Complete workflow example, for app maintainers
```
git checkout develop
ghi open -m "Always show warnings" -L enhancement -L v1.0.0
git checkout -b iss33
# Work on feature
git add feature.js
git commit -m "Close #33 - Always show warnings"
git checkout develop
git merge iss33 --no-ff -m "Merge enhancement into develop"
# If new feature should be merged with master and result in new release
git checkout release-v1.0.0
git merge develop --no-ff -m "Add updates to relase branch"
git checkout master
git merge release-v1.0.0 --no-ff -m "Release version 1.0.0"
git push
# Change version number in package.json, increment PATCH
git add package.json
git commit -m "Update version number"
git push
git tag -a v1.1.0 -m "Version 1.1.0" # See note below
git push --tags
gren release 
gren changelog --override
git add CHANGELOG.md
git commit -m "Update CHANGELOG"
git push
git branch -d release-v1.0.0
git checkout develop
git merge master --no-ff -m "Merge new release into develop"
```

To make sure that `gren` includes closed issues in the correct release notes
it's important to push commits that closes issues before the "tag commit" is
created and pushed. See [this
issue](https://github.com/github-tools/github-release-notes/issues/181) for a
discussion on this.
