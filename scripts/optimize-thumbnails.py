from pathlib import Path
from PIL import Image, ImageOps
import concurrent.futures, json
src=Path('public/sb-storage/thumbnails')
files=[p for p in src.iterdir() if p.suffix.lower() in {'.jpg','.jpeg','.png','.webp'}]
def opt(p):
 try:
  with Image.open(p) as im:
   im=ImageOps.exif_transpose(im)
   if im.mode not in ('RGB','RGBA'):im=im.convert('RGBA' if 'A' in im.getbands() else 'RGB')
   im.thumbnail((1280,1280), Image.Resampling.LANCZOS)
   out=p.with_suffix('.webp')
   im.save(out,'WEBP',quality=82,method=4)
   if out!=p:p.unlink()
   return p.name,out.name,out.stat().st_size,None
 except Exception as e:return p.name,None,0,str(e)
errors=[];total=0
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
 for i,(old,new,n,err) in enumerate(ex.map(opt,files),1):
  total+=n
  if err:errors.append((old,err))
  if i%300==0:print(i,round(total/1e6,1),'MB',flush=True)
print('done',len(files),'errors',len(errors),'MB',round(total/1e6,1))
Path('reference/optimize-errors.json').write_text(json.dumps(errors,indent=2))
