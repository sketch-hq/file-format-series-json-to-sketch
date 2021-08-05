# File Format Series: JSON to Sketch

This repository contains the source code for the [File Format Series: JSON to Sketch](#) blog post.

Please refer to the article for instructions on how to use the code.

## Requirements

You'll need some familiarity with [TypeScript](https://typescriptlang.org), and a reasonably recent version of [node](https://nodejs.org) installed. For code editing, we recommend you use [Visual Studio Code](https://code.visualstudio.com). You don't need Sketch, or a Mac: you can run the sample code in any operating system.

## GitHub Action

The repository includes a GitHub Action (in [`.github/workflows`](https://github.com/sketch-hq/file-format-series-json-to-sketch/blob/main/.github/workflows/update-sketch.yml)) that runs when there's a change to the `colors.json` file on the `main` branch.

The action will read the data in `colors.json`, update the `color-library.sketch` document, and commit it to the repo.
