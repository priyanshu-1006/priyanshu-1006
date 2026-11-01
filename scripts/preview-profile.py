"""Local-only visual QA. Requires Python Markdown; no content is uploaded."""
from pathlib import Path
import markdown

root = Path(__file__).resolve().parent.parent
source = (root / "README.md").read_text(encoding="utf-8")
# GitHub parses Markdown within details by default; Python Markdown requires this flag.
source = source.replace("<details>", '<details markdown="1">')
body = markdown.markdown(source, extensions=["extra", "toc", "sane_lists"])
body = body.replace('href="#', 'href="/.preview/index.html#')
css = """
:root{color-scheme:light dark;--bg:#fff;--outside:#f6f8fa;--text:#1f2328;--muted:#59636e;--border:#d1d9e0;--accent:#0969da;--code:#eff1f3;--quote:#818b98}
@media(prefers-color-scheme:dark){:root{--bg:#0d1117;--outside:#010409;--text:#e6edf3;--muted:#9198a1;--border:#3d444d;--accent:#79b8ff;--code:#161b22;--quote:#59636e}}
*{box-sizing:border-box}body{margin:0;padding:32px 20px;background:var(--outside);color:var(--text);font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}
.repo-label{max-width:900px;margin:0 auto 14px;color:var(--muted);font-size:13px;letter-spacing:.3px}
article{max-width:900px;margin:auto;padding:32px;border:1px solid var(--border);border-radius:12px;background:var(--bg);overflow-wrap:break-word}
article>:first-child{margin-top:0}h1,h2,h3{line-height:1.25;font-weight:600;margin:24px 0 16px}h1{font-size:2em}h2{font-size:1.5em;padding-bottom:.3em;border-bottom:1px solid var(--border)}h3{font-size:1.25em}
p,table,blockquote,ul,ol{margin-top:0;margin-bottom:16px}li+li{margin-top:.25em}ul,ol{padding-left:2em}a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}a:focus-visible,summary:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
img{max-width:100%;box-sizing:content-box;height:auto;vertical-align:middle}picture{display:inline}table{border-spacing:0;border-collapse:collapse;display:block;width:max-content;max-width:100%;overflow:auto;font-size:14px}th,td{border:1px solid var(--border);padding:10px 13px;vertical-align:top}th{font-weight:600}tr:nth-child(2n){background:var(--outside)}
blockquote{padding:0 1em;border-left:4px solid var(--quote);color:var(--muted)}blockquote p:last-child{margin-bottom:0}details{margin-bottom:16px}summary{cursor:pointer;line-height:1.7}details[open]>summary{margin-bottom:16px}sub{font-size:12px;line-height:1.6;color:var(--muted)}code{font:13px ui-monospace,SFMono-Regular,Consolas,monospace;padding:.2em .4em;border-radius:5px;background:var(--code)}
@media(max-width:600px){body{padding:12px 8px}article{padding:16px;border-radius:8px;font-size:15px}h2{font-size:1.35em}h3{font-size:1.1em}.repo-label{font-size:11px}th,td{padding:8px;font-size:13px}}
"""
output = root / ".preview"
output.mkdir(exist_ok=True)
html = f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="/"><title>Priyanshu — profile README preview</title><style>{css}</style></head><body><div class="repo-label">priyanshu-1006 / README.md · LOCAL PREVIEW</div><article>{body}</article></body></html>'
(output / "index.html").write_text(html, encoding="utf-8")
light = html.replace("-dark.svg", "-light.svg")
light = light.replace("</style>", ":root{color-scheme:light;--bg:#fff;--outside:#f6f8fa;--text:#1f2328;--muted:#59636e;--border:#d1d9e0;--accent:#0969da;--code:#eff1f3;--quote:#818b98}</style>")
light = light.replace("/.preview/index.html#", "/.preview/light.html#")
(output / "light.html").write_text(light, encoding="utf-8")
print("Local preview ready at /.preview/index.html")
