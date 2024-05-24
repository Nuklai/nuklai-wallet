[Setup]
AppName=Nuklai Wallet
AppVersion=1.0
DefaultDirName={autopf}\Nuklai Wallet
DefaultGroupName=Nuklai Wallet
OutputBaseFilename=nuklai-wallet-installer
Compression=lzma
SolidCompression=yes

[Files]
Source: "path\to\your\nuklai-wallet.exe"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\Nuklai Wallet"; Filename: "{app}\nuklai-wallet.exe"
Name: "{group}\Uninstall Nuklai Wallet"; Filename: "{uninstallexe}"
