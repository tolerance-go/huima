# Huima

[中文](https://github.com/tolerance-go/huima/blob/main/README.zh-CN.md)

![](cover.jpg)

Let me automatically handle the tedious task of comparing and reproducing dull design drafts! Export UI-consistent, clean, and tidy frontend code with just one click, allowing frontend engineers to focus on dynamic design and business logic development.

> The project is currently in development, and many features may not be stable. If you encounter any bugs or have something to tell us, feel free to leave a message in the [GitHub issue](https://github.com/tolerance-go/huima/issues). Yes, the code is also there, it's open source.

## Features

-  Export page code and static resources that match the design draft with a single click.
-  Support for automatic layout and generation of positioning styles.
-  Support for copying code of any node online.
-  Support for responsive layout units such as rem and vw.
-  Support for online preview, including font styles.
-  Support for converting styles of most node types to the web environment.

## Design Conventions

> Converting designs accurately into code is a challenging task that often requires close collaboration between designers and developers, fully understanding the working methods and limitations of each tool.

-  Rotation is not currently supported.

## Rendering Conventions

To generate more concise code, the following conventions are applied during rendering:

-  When rendering groups, only the outermost group is rendered by default if nested.
