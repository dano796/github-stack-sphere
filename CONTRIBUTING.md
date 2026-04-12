# Contributing to [github-stack-sphere](https://github.com/dano796/github-stack-sphere)

Thank you for considering contributing to GitHub Stack Sphere! Contributions that improve the quality and reliability of this project are always welcome.

To ensure a smooth collaboration, please read the following guidelines before getting started.

## Issue Tracker

Use the GitHub issue tracker to report bugs, request enhancements, or start discussions. Before opening a new issue, check if one already exists. If not, feel free to create it with as much context as possible — including the URL you used, the browser you tested in, and a screenshot or recording if applicable.

## Branch Naming

Please follow this naming convention when creating branches:

`feat/<feature-name>`

`fix/<description>`

For example: `fix/polar-icon-orbit` or `feat/add-color-param`.

## Pull Requests

To submit a pull request:

1. Fork the repository and create a new branch following the naming convention above.
2. Make your changes in the new branch.
3. Submit a pull request targeting the `main` branch.
4. Include a clear title, a description of your changes, and screenshots or recordings where applicable.

Before opening a pull request, make sure:

- Your changes are tested locally by running `node test-local.mjs` and verifying the animation in Chrome or Firefox.
- The generated SVG renders correctly and the animation is smooth.
- There are no JavaScript errors in the browser console when opening the SVG.
- If modifying the sphere algorithm, verify that all icons — including those near the poles — orbit correctly and no icon stays static.
- If adding a new query parameter, it must be validated and sanitized in `lib/validate.js` before use.

Pull requests that do not meet these requirements will not be merged.

## Conclusion

We appreciate your interest in contributing! By following these guidelines you can help us maintain a healthy and productive open-source community. We value your contributions and look forward to your pull requests!

If you have questions of any kind please reach out through the issue tracker.

Happy contributing!
