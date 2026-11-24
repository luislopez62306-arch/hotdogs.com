"""Recorta un objeto de su fondo liso. Uso: python recortar.py entrada salida.png [tolerancia=25] [erosion=1]"""
import sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as nd

src, dst = sys.argv[1], sys.argv[2]
tol = float(sys.argv[3]) if len(sys.argv) > 3 else 25
ero = int(sys.argv[4]) if len(sys.argv) > 4 else 1
im = Image.open(src).convert('RGBA')
a = np.asarray(im)[..., :3].astype(float)
border = np.concatenate([a[:6].reshape(-1, 3), a[-6:].reshape(-1, 3), a[:, :6].reshape(-1, 3), a[:, -6:].reshape(-1, 3)])
bg = np.median(border, 0)
m = np.sqrt(((a - bg) ** 2).sum(-1)) > tol
m &= np.asarray(im)[..., 3] > 128
m = nd.binary_opening(m, iterations=2)
lab, n = nd.label(m)
sizes = nd.sum(m, lab, range(1, n + 1))
keep = lab == (np.argmax(sizes) + 1)
keep = nd.binary_fill_holes(keep)
if ero:
    keep = nd.binary_erosion(keep, iterations=ero)
al = Image.fromarray((keep * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1))
im.putalpha(al)
im.crop(al.point(lambda v: 255 if v > 10 else 0).getbbox()).save(dst)
