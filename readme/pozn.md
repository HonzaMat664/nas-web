DENIK

6.2.	 hw problem vse odpojeno. znovu propájeno, ok
7.2.	 nedůsledná analýza sk a usb karet, zmatek

8.2.	 udelalo se mi zle
9.2.	 zmizení meteostanice.py, nevím jak


<pre> „preformatted text“ (předformátovaný text).zachová text přesně tak, jak ho napíšeš.

změna IP adresy a GIT
sudo nano /etc/systemd/network/10-wlan0.network

obsah:
[Match]
Name=wlan0

[Network]
Address=192.168.1.156/24
Gateway=192.168.1.1
DNS=192.168.1.1

sudo systemctl enable systemd-networkd # důležité, aby i po restartu zůstala nově nastavená adresa

restart:
sudo systemctl restart systemd-networkd
hostname -I

156 testunor.  116
157 meteo.  101
158 meteo2 106

vypnutí myši v terminalu

printf '\e[?1000l'
printf '\e[?1002l'
printf '\e[?1006l'
nebo 
reset
nebo
tput reset
nebo
printf '\033[?1000l\033[?1002l\033[?1003l\033[?1006l'

MC
mc --nosubshell # když se není možno připojit pomocí SFTP

# nas-web
│
├── menu.html
├── css/
│   └── style.css
├── data
├── meteo
├── hifi
├── vlaky
├── js/
│   └── menu.js
│
├── index.html
└── pokusy/
    └── vzor.html
	
Snapshot zálohování

Tento projekt používá automatický snapshot skript (snapshot.sh), který se spouští pomocí systemd timeru.

Skript při každém spuštění:
	•	vytvoří novou složku se časovým razítkem na NASu (/mnt/nas/snapshots/YYYY-MM-DD_HH-MM-SS)
	•	pomocí rsync zálohuje aktuální stav projektů (nas-web, meteostanice)
	•	vytváří archiv (tar.gz) systémových konfigurací (/etc/fstab, /etc/systemd/system)
	•	zapisuje průběh do logu

Pro úsporu místa se automaticky udržují pouze poslední 2 snapshoty (aktuální a předchozí), starší jsou mazány.

Výsledkem je jednoduchá a rychlá záloha, která umožňuje snadné obnovení dat i konfigurace systému.	

<p class="highlight">POZOR: Vysoká teplota!</p> # zvýraznění textu žlutou, v css je definován highlight


