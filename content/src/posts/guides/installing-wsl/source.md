---
title: "Installing Windows Subsystem for Linux (WSL)"
excerpt: "Step by step instructions for installing the Windows Subsystem for Linux, which gives you a proper development environment on Windows."
tags: ["installation"]
seo:
  description: "A beginner friendly guide to installing WSL (Windows Subsystem for Linux) on Windows 10 and 11, with clear step by step instructions and fixes for common problems."
  keywords:
    [
      "wsl",
      "install wsl",
      "windows subsystem for linux",
      "ubuntu on windows",
      "windows development environment",
      "learn to code"
    ]
---

## Introduction

WSL (the **Windows Subsystem for Linux**) is a feature of Windows, made by Microsoft, that runs a real Linux system inside your Windows machine. You need it because most programming tools are built first (and work best) on Linux and macOS, and WSL is how developers on Windows get access to all of that. It is the way Microsoft itself recommends doing development on Windows. Installing it takes about fifteen minutes, most of which is waiting, and you only need to do it once.

## Before you start

You need:

- **Windows 10 (version 2004 or later) or Windows 11.** Any Windows machine from the last few years is fine.
- **Administrator access** to the computer. If it is a family computer, you may need whoever set it up to type their password.

## Installing WSL

1. Click the **Start** button and type "powershell". You will see **Windows PowerShell** appear.
2. Do not just open it. Instead, right click it and choose **Run as administrator**. Windows will ask if you want to allow it to make changes: click **Yes**.
3. In the blue window that appears, type the following and press Enter:
   ```
   wsl --install
   ```
4. Windows will download and set everything up, including a Linux system called **Ubuntu** (the most popular version of Linux). This can take a few minutes.
5. When it asks you to, **restart your computer**.

<!-- SCREENSHOT: PowerShell running wsl --install -->

## Setting up Ubuntu

After the restart, a terminal window will open automatically to finish setting up Ubuntu. (If it does not, click Start, type "ubuntu", and open it.)

It will ask you to create a **username** and **password** for your Linux system:

1. Type a username (lowercase, no spaces) and press Enter.
2. Type a password and press Enter, then type it again to confirm.

One thing catches everyone out here: **when you type the password, nothing appears on the screen**. No dots, no stars, nothing. That is a Linux security feature, not a fault. Your typing is being registered, so just type the password and press Enter.

Do not forget this password. You will need it occasionally when installing things.

<!-- SCREENSHOT: Ubuntu first run asking for a username -->

## Checking it works

Close everything, then click **Start**, type "ubuntu", and open it. You should see a window with a prompt ending in `$`, waiting for you to type. Congratulations: that is a real Linux terminal, and you now have the same development environment as the professionals.

Try typing `ls` and pressing Enter. It lists the files in your current folder (there will not be many yet).

## Using WSL from VS Code

If you have [VS Code installed](/guides/installing-vscode), it can connect to WSL so your editor and your Linux terminal work together:

1. Open VS Code.
2. Open the Extensions panel (the four squares icon on the left, or Ctrl+Shift+X), search for **WSL**, and install the extension made by Microsoft.
3. Press Ctrl+Shift+P, type "WSL", and choose **WSL: Connect to WSL**. VS Code will reopen, connected to Ubuntu.

From now on, any terminal you open inside VS Code (Terminal menu, then New Terminal) is a Linux terminal. This is the setup we recommend for the rest of our guides.

## If something goes wrong

The most common problem is an error mentioning **virtualisation** (or "VT-x", "AMD-V", or "virtual machine platform"). WSL relies on a hardware feature that is switched off on some computers. Turning it on means changing a setting in your computer's BIOS, which varies by manufacturer. Search for your laptop's model name plus "enable virtualisation" for instructions, or ask in <a href="https://jiki.io/r/forum" target="_blank" rel="noopener noreferrer">our forum</a> and we will help you out.

For anything else, Microsoft's <a href="https://learn.microsoft.com/en-us/windows/wsl/install" target="_blank" rel="noopener noreferrer">official WSL installation guide</a> has a troubleshooting section, and again, the forum is always there.
