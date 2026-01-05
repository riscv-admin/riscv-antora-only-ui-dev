# RISC-V Antora UI Development

This project generates and packages the static resources that RISC-V uses for the [RISC-V Docs resource DEV site](https://riscv-admin.github.io/antora-dev.riscv.org/). 

This GitHub repository contains the UI pieces for Docs development. For Production UI, see [RISC-V Antora UI](https://github.com/riscv-admin/riscv-antora-only-ui).

The RISC-V Antora UI is used for RISC-V documentation: https://docs.riscv.org/


## Local build

Find information to preview and build the UI bundle locally, for use with the RISC-V documentation.

A more comprehensive tutorial for Antora can be found in the documentation at [docs.antora.org](https://docs.antora.org/).

### Prerequisites

To preview and bundle the RISC-V UI, you need the following software on your computer:

* [git](https://git-scm.com/) (command: `git`)
* [Node.js](https://nodejs.org/) (commands: `node` and `npm`)
* [Gulp CLI](http://gulpjs.com/) (command: `gulp`)

### Preview the UI

You can preview the UI offline.
The files in the `preview-src/` folder provide the sample content that allow you to see the UI in action.
In this folder, you'll primarily find pages written in AsciiDoc.
These pages provide a representative sample and kitchen sink of content from the real site.

To build the UI and preview it in a local web server, run the `preview` command:

```
npm install
gulp preview
```

You'll see a URL listed in the output of this command:

```
[12:00:00] Starting server...
[12:00:00] Server started http://localhost:5252
[12:00:00] Running server
```

Navigate to this URL to preview the site locally.

While this command is running, any changes you make to the source files will be instantly reflected in the browser.
This works by monitoring the project for changes, running the `preview:build` task if a change is detected, and sending the updates to the browser.

Press `Ctrl`+`C` to stop the preview server and end the continuous build.

### Package for Use with Antora

If you need to package the UI so you can use it to generate the documentation site locally, run the following command:

```
gulp bundle
```

If any errors are reported by lint, you'll need to fix them.

When the command completes successfully, the UI bundle will be available at `build/ui-bundle.zip`.
You can point Antora at this bundle using the `--ui-bundle-url` command-line option in your antora-playbook.yml file.

If you have the preview running, and you want to bundle without causing the preview to be clobbered, use:

```
gulp bundle:pack
```

The UI bundle will again be available at `build/ui-bundle.zip`.

## Extensions to the UI

You can find additional changes in the supplemental files section of the [antora-playbook.yml](https://github.com/riscv-admin/antora-dev.riscv.org/blob/main/antora/antora-playbook.yml).

## Authors

Development of Antora is led and sponsored by [OpenDevise Inc](https://opendevise.com/).

## Copyright and License

Copyright (C) 2017-present OpenDevise Inc. and the Antora Project.

Use of this software is granted under the terms of the [Mozilla Public License Version 2.0](https://www.mozilla.org/en-US/MPL/2.0/) (MPL-2.0).
See [LICENSE](https://github.com/spring-io/antora-ui-spring/blob/feat/gh-226/LICENSE) to find the full license text.

## Thanks
