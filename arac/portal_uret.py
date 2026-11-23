"""Portal kasasi: proje listesini giris sifresiyle sifreleyip portal.bin yazar.
Kaynak (git disi): C:/Kodlar/_Anahtarlar/portal/projeler.json ve sifre.txt (tek satir)
portal.bin = tuz16 | iv12 | AES-GCM; anahtar = PBKDF2-SHA256(sifre, tuz, 600000)."""
import hashlib, json, os, sys
from pathlib import Path
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

K = Path('C:/Kodlar/_Anahtarlar/portal')
sifre = (K / 'sifre.txt').read_text(encoding='utf-8-sig').strip()
if len(sifre) < 8:
    sys.exit('Sifre en az 8 karakter olmali')
veri = json.dumps(json.loads((K / 'projeler.json').read_text(encoding='utf-8')), ensure_ascii=False).encode()
hedef = Path(__file__).resolve().parent.parent / 'portal.bin'


def turet(tuz):
    return hashlib.pbkdf2_hmac('sha256', sifre.encode(), tuz, 600000, 32)


# Sifre degismediyse tuz korunur: kayitli cihazlar yeniden sifre sormasin
tuz = os.urandom(16)
if hedef.exists():
    e = hedef.read_bytes()
    try:
        AESGCM(turet(e[:16])).decrypt(e[16:28], e[28:], None)
        tuz = e[:16]
    except Exception:
        pass
iv = os.urandom(12)
hedef.write_bytes(tuz + iv + AESGCM(turet(tuz)).encrypt(iv, veri, None))
print('yazildi', hedef)
