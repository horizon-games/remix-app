{ pkgs ? import <nixpkgs> {} }:

# a simple x11 env
(pkgs.buildFHSUserEnv {
  name = "fhs";
  targetPkgs = pkgs: with pkgs; [
    coreutils
    alsaLib
    atk
    at-spi2-atk
    at-spi2-core
    cairo
    cups
    dbus
    expat
    file
    fontconfig
    freetype 
    gdb
    gdk_pixbuf
    git 
    glib 
    glibc
    gtk2
    gtk3
    libarchive
    libnotify
    libxml2
    libxslt
    libuuid
    mesa_glu
    pango
    rxvt_unicode.terminfo
    curl
    openal
    openssl_1_0_2
    netcat
    nspr
    nss
    strace
    udev
    watch
    wget
    which
    xorg.libXxf86vm
    xorg.libX11
    xorg.libXScrnSaver
    xorg.libXcomposite
    xorg.libXcursor
    xorg.libXdamage
    xorg.libXext
    xorg.libXfixes
    xorg.libXi
    xorg.libXrandr
    xorg.libXrender
    xorg.libXtst
    xorg.libxcb
    xorg.xcbutilkeysyms
    zlib
    zsh
  ];
  runScript = "bash";
}).env
