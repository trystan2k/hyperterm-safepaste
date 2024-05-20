# hyperterm-safepaste

**IMPORTANT** I will no longer support this repository as I am not using Hyper terminal anymore.
If you need any change or fix, please fork the repository and make the changes you need.

I have moved to [Kitty](https://sw.kovidgoyal.net/kitty/) terminal which has a lot of features that I need and it is very fast.

**=========**

[![GitHub version](https://badge.fury.io/gh/trystan2k%2Fhyperterm-safepaste.svg)](https://badge.fury.io/gh/trystan2k%2Fhyperterm-safepaste)

[![Build](https://github.com/trystan2k/hyperterm-safepaste/workflows/Build-CI/badge.svg)](https://github.com/trystan2k/hyperterm-safepaste/actions)


Makes pasting into [Hyper™](https://hyper.is/) Terminal safe

## Demo

![Demo gif](https://raw.githubusercontent.com/zsol/hyperterm-safepaste/master/demo.gif)

## Features

- When pasting a single line, trims extra newlines from the end. This makes sure your command will not be executed automatically until you press enter.
- When pasting multiple lines, a popup will give you a chance to review and edit the text before sending it into the terminal. Escape cancels the paste.
