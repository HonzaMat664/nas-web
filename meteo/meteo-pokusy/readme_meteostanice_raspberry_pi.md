# 🛰️ Meteostanice na Raspberry Pi – instalační postup

Tento dokument popisuje **kompletní postup instalace meteostanice** na nové Raspberry Pi (meteo1, meteo2, meteo3…).
Postup zahrnuje:
- Python + virtuální prostředí (venv)
- I2C senzory
- systemd službu s watchdogem
- automatické odesílání CSV souborů na GitHub

---

## 0️⃣ Základ systému

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y \
  python3 \
  python3-venv \
  python3-pip \
  git \
  i2c-tools
```

### Zapnutí I2C
```bash
sudo raspi-config
# Interface Options → I2C → Enable
sudo reboot
```

Kontrola čidel:
```bash
i2cdetect -y 1
```

---

## 1️⃣ Projektový adresář

```bash
mkdir -p ~/meteo
cd ~/meteo
```

---

## 2️⃣ Virtuální prostředí (POVINNÉ)

```bash
python3 -m venv venv
source venv/bin/activate
```

Správně aktivní venv poznáš podle promptu:
```
(venv) honza@meteoX:~/meteo $
```

---

## 3️⃣ Python knihovny

Instaluj pouze potřebné balíčky:

```bash
pip install \
  requests \
  smbus2 \
  adafruit-circuitpython-bmp280 \
  adafruit-circuitpython-ahtx0 \
  systemd-python
```

`systemd-python` je nutný pro **watchdog**.

---

## 4️⃣ Skript meteostanice

Zkopíruj `meteostanice.py` ze staré instalace:

```bash
scp honza@METEO1_IP:/home/honza/meteostanice.py ~/meteo/
```

Test ručním spuštěním:
```bash
python meteostanice.py
```

Musí:
- číst I2C čidla
- zapisovat CSV
- běžet bez výjimek

---

## 5️⃣ Webový adresář (CSV)

```bash
sudo mkdir -p /var/www/html/meteostanice
sudo chown -R honza:honza /var/www/html/meteostanice
```

---

## 6️⃣ systemd služba + watchdog

### `/etc/systemd/system/meteostanice.service`

```ini
[Unit]
Description=Meteostanice Python Script
After=network.target

[Service]
Type=notify
User=honza
ExecStart=/home/honza/meteo/venv/bin/python /home/honza/meteostanice.py
Restart=always
RestartSec=5
WatchdogSec=30
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Aktivace služby:
```bash
sudo systemctl daemon-reload
sudo systemctl enable meteostanice
sudo systemctl start meteostanice
```

Kontrola:
```bash
systemctl status meteostanice
journalctl -u meteostanice -f
```

---

## 7️⃣ GitHub repozitář

Repozitář: `nas-web`

```bash
cd ~
git clone https://github.com/HonzaMat664/nas-web.git
```

Ověření:
```bash
ls -a ~/nas-web | grep .git
```

---

## 8️⃣ update-data.sh (automatický push CSV)

📍 Umístění: `/home/honza/update-data.sh`

```bash
#!/bin/bash

REPO="$HOME/nas-web"
SRC="/var/www/html/meteostanice"
LOG="$HOME/update-data.log"

cd "$REPO" || exit 1

git pull --rebase >>"$LOG" 2>&1

cp "$SRC/data2.csv" "$REPO/" || exit 1
cp "$SRC/pressure_correction2.csv" "$REPO/" || exit 1

if git diff --quiet; then
  echo "$(date): Žádné změny k pushnutí" >>"$LOG"
  exit 0
fi

git add data2.csv pressure_correction2.csv
git commit -m "Auto-update CSV z meteostanice2" >>"$LOG" 2>&1
git push >>"$LOG" 2>&1
```

```bash
chmod +x ~/update-data.sh
```

---

## 9️⃣ Cron – automatické spouštění

```bash
crontab -e
```

Přidat:
```cron
* * * * * /home/honza/update-data.sh
```

Kontrola běhu:
```bash
sudo journalctl -u cron -f
tail -f ~/update-data.log
```

---

## 🔍 Diagnostika

### Meteostanice
```bash
systemctl status meteostanice
journalctl -u meteostanice -f
```

### Git
```bash
cd ~/nas-web
git status
git log --oneline --decorate -5
```

### CSV soubory
```bash
ls -l /var/www/html/meteostanice/
tail data2.csv
```

---

## 🧠 Architektura (stručně)

- **meteostanice.py** → měří senzory, zapisuje CSV
- **systemd** → hlídá běh + watchdog
- **update-data.sh** → kopíruje CSV → commit → push
- **cron** → pravidelně spouští update-data.sh
- **GitHub** → archiv / publikace dat

---

✔️ Tento README slouží jako **oficiální instalační manuál** pro další meteostanice.

