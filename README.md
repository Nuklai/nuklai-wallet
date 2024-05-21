# Nuklai Wallet

The Nuklai Wallet is the native wallet for the Nuklai network, designed to provide users with a comprehensive and user-friendly interface for managing their assets and interacting with the Nuklai blockchain. Below are the features and functionalities integrated into the Nuklai Wallet:

## Features

**1. Local Wallet:**

- Manage your assets securely within the wallet.
- Access and manage private keys and public keys.

**2. Network Connectivity:**

- Connect to various networks such as Devnet, Testnet, and Mainnet directly from the wallet UI.

**3. Local Blockchain Explorer:**

- View detailed information about the Nuklai blockchain directly within the wallet.
- Explore blocks, transactions, tokens, and other blockchain data.

**4. Faucet Integration:**

- Request test NAI tokens to your wallet using the integrated faucet service.
- Easily acquire tokens for testing and development purposes.

**5. Mint Page:**

- Create and mint tokens to any address.
- Customize tokens according to your needs and transfer them seamlessly.

**6. Feed Page:**

- Post messages and URLs to the blockchain within a transaction memo.
- Use the feed as a mini blog to share updates and information.

**7. Transactions History:**

- View a comprehensive history of all transactions made with your wallet.
- Track incoming and outgoing transactions, including detailed transaction metadata.

**8. Wallet Details:**

- Access detailed information about your wallet, including private key, public key, and account balances.

**9. Nuklai Subnet Details:**

- View essential details about the Nuklai Subnet such as chainID and subnetID.

**10. Custom RPC URL:**

- Update the Nuklai RPC URL to point to any URL of your choice.
- Connect to your local Nuklai Subnet or any custom Nuklai Subnet deployed elsewhere.
- This feature is particularly useful for developers running a local instance of the Nuklai Subnet.

## Build

```bash
./scripts/build.sh
```

## Run

```bash
cp .env.example .env;
wails dev
```

By default, it'll open a new desktop app for the wallet however, you can also go to [http://localhost:34115](http://localhost:34115) on your browser to interact with the wallet.

## Debug

When running `./scripts/dev.sh`, if you see an error like:

```
# pkg-config --cflags  -- gtk+-3.0 webkit2gtk-4.0 gio-unix-2.0 gtk+-3.0 webkit2gtk-4.0 gio-unix-2.0 gtk+-3.0 webkit2gtk-4.0
Package gtk+-3.0 was not found in the pkg-config search path.
Perhaps you should add the directory containing `gtk+-3.0.pc'
to the PKG_CONFIG_PATH environment variable
No package 'gtk+-3.0' found
Package webkit2gtk-4.0 was not found in the pkg-config search path.
Perhaps you should add the directory containing `webkit2gtk-4.0.pc'
to the PKG_CONFIG_PATH environment variable
No package 'webkit2gtk-4.0' found
Package gio-unix-2.0 was not found in the pkg-config search path.
Perhaps you should add the directory containing `gio-unix-2.0.pc'
to the PKG_CONFIG_PATH environment variable
No package 'gio-unix-2.0' found
Package gtk+-3.0 was not found in the pkg-config search path.
Perhaps you should add the directory containing `gtk+-3.0.pc'
to the PKG_CONFIG_PATH environment variable
No package 'gtk+-3.0' found
Package webkit2gtk-4.0 was not found in the pkg-config search path.
Perhaps you should add the directory containing `webkit2gtk-4.0.pc'
to the PKG_CONFIG_PATH environment variable
No package 'webkit2gtk-4.0' found
Package gio-unix-2.0 was not found in the pkg-config search path.
Perhaps you should add the directory containing `gio-unix-2.0.pc'
to the PKG_CONFIG_PATH environment variable
No package 'gio-unix-2.0' found
Package gtk+-3.0 was not found in the pkg-config search path.
Perhaps you should add the directory containing `gtk+-3.0.pc'
to the PKG_CONFIG_PATH environment variable
No package 'gtk+-3.0' found
Package webkit2gtk-4.0 was not found in the pkg-config search path.
Perhaps you should add the directory containing `webkit2gtk-4.0.pc'
to the PKG_CONFIG_PATH environment variable
No package 'webkit2gtk-4.0' found
pkg-config: exit status 1

Build error - exit status 1
```

You should probably install the required packages in your system.

On Ubuntu/Debian-based systems:

```bash
sudo apt-get update
sudo apt-get install -y libgtk-3-dev libwebkit2gtk-4.0-dev libgirepository1.0-dev
```

On Fedora:

```bash
sudo dnf install -y gtk3-devel webkit2gtk3-devel gobject-introspection-devel
```

On Arch Linux:

```bash
sudo pacman -Syu gtk3 webkit2gtk gobject-introspection
```

On Mac:

```bash
sudo port install webkit2-gtk
```

Then, try running `./scripts/build.sh` again

If you run the command `./scripts/build.sh` in a vscode terminal and encounter the error `symbol lookup error: /snap/core20/current/lib/x86_64-linux-gnu/libpthread.so.0: undefined symbol: __libc_pthread_init, version GLIBC_PRIVATE`, you should run the command in a console.
