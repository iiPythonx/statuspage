# Copyright (c) 2023-2024 iiPython

# Modules
import json
from time import time
from pathlib import Path
from gzip import compress, decompress

from requests import Session

# Initialization
root = Path(__file__).parents[2] / "static"
urls = json.loads((root / "urls.json").read_text())
session = Session()

# Load existing data
status_info, status_file = [], root / "main.gz"
if status_file.is_file():
    status_info = decompress(status_file.read_bytes()).decode().split("|")

# Handle shifting existing data
current_time = round(time())
if not status_info:
    status_info += [current_time, *[0] * 47]

offsets = [int(o) for o in status_info[2:48]] + [0]
timestamps = [int(status_info[0]) - offset for offset in offsets]
status_info = [current_time] + [current_time - t for t in timestamps] + status_info[48:]

# Perform status checks
for index, (_, url) in enumerate(urls):
    down, up = 48 * (index + 1), 48 * (index + 2)
    if down >= len(status_info):
        status_info += [-1] * 48

    try:
        response = session.get(f"{url}/_statuscheck/{current_time}", timeout = 10, allow_redirects = False)
        if response.status_code != 404:
            raise Exception()

        response = round(response.elapsed.total_seconds() * 1000, 1)

    except Exception:
        response = 0

    status_info = status_info[:down] + \
                  status_info[(down + 1):up] + [response] + \
                  status_info[up:]

# Save to disk
status_file.write_bytes(compress("|".join(map(lambda x: str(x), status_info)).encode("ascii")))