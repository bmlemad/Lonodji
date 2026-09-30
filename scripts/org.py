"""Contact officiel, lu dans lib/contact.ts (seule source du numéro) : `from org import TELEPHONE`."""
import re
from pathlib import Path

_TS = (Path(__file__).resolve().parent.parent / "lib" / "contact.ts").read_text("utf8")
TELEPHONE = re.search(r'TELEPHONE = "([^"]+)"', _TS).group(1)
WHATSAPP = re.search(r'WHATSAPP = "([^"]+)"', _TS).group(1)
