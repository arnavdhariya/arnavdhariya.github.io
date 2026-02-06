#!/usr/bin/env python3
import datetime as dt
import os
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET

FEED_URL = os.environ.get("SUBSTACK_FEED_URL", "https://arnavdhariya.substack.com/feed")
OUTPUT_PATH = os.environ.get("OUTPUT_PATH", "_data/articles.yml")
MAX_ITEMS = int(os.environ.get("MAX_ITEMS", "10"))


def _strip_html(text):
    if not text:
        return ""
    return re.sub(r"<[^>]+>", "", text).strip()


def _format_date_rfc822(date_str):
    if not date_str:
        return ""
    try:
        # Example: Tue, 21 Jan 2025 10:00:00 GMT
        parsed = dt.datetime.strptime(date_str, "%a, %d %b %Y %H:%M:%S %Z")
        return parsed.date().isoformat()
    except Exception:
        return date_str


def fetch_feed(url):
    with urllib.request.urlopen(url) as resp:
        return resp.read()


def parse_items(xml_bytes):
    root = ET.fromstring(xml_bytes)
    channel = root.find("channel")
    if channel is None:
        return []
    items = channel.findall("item")
    results = []
    for item in items[:MAX_ITEMS]:
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip()
        pub_date = _format_date_rfc822((item.findtext("pubDate") or "").strip())
        description = _strip_html(item.findtext("description") or "")
        results.append(
            {
                "title": title,
                "subtitle": "",
                "outlet": "Substack",
                "date": pub_date,
                "url": link,
                "description": description,
            }
        )
    return results


def write_yaml(items, path):
    lines = []
    lines.append("# Auto-generated from Substack feed. Do not edit by hand.")
    for it in items:
        lines.append("- title: \"{}\"".format(it["title"].replace("\"", "\\\"")))
        if it["subtitle"]:
            lines.append("  subtitle: \"{}\"".format(it["subtitle"].replace("\"", "\\\"")))
        lines.append("  outlet: \"{}\"".format(it["outlet"]))
        lines.append("  date: \"{}\"".format(it["date"]))
        lines.append("  url: \"{}\"".format(it["url"]))
        lines.append("  description: \"{}\"".format(it["description"].replace("\"", "\\\"")))
        lines.append("")
    content = "\n".join(lines).rstrip() + "\n"
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def main():
    try:
        xml_bytes = fetch_feed(FEED_URL)
        items = parse_items(xml_bytes)
        if not items:
            print("No items parsed from feed.", file=sys.stderr)
            return 1
        write_yaml(items, OUTPUT_PATH)
        print(f"Wrote {len(items)} items to {OUTPUT_PATH}")
        return 0
    except Exception as exc:
        print(f"Failed: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
