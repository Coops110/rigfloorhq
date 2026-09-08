#!/usr/bin/env python3
"""Publishes one video directly to the RigFloor HQ Facebook Page via the
Graph API -- the organic posting path chosen 2026-09-07 after finding the
connected Meta Ads MCP can only run paid ads or boost posts that already
exist (see [[RigFloorHQ Social Posting]]). Metricool is also not the plan;
its own Facebook OAuth connection was never fixed.

Requires a Page Access Token (not the Ads MCP's token -- a separate,
Page-scoped token with pages_manage_posts + pages_read_engagement +
pages_show_list). Set it as an environment variable, never hardcode it:

    setx RIGFLOORHQ_FB_PAGE_TOKEN "..."   (Windows, one-time)

A System User token from Business Manager is recommended over a short-lived
user-derived one -- it doesn't expire, so this script doesn't need a
re-auth step baked in.

Refuses to post a video that hasn't just passed verify-tiktok-sync.py against
the actual file in ready-to-upload/ -- run every time, never assumed from a
past check. Also refuses anything in HELD, regardless of what's passed in.

Requires: `pip install requests`

Run:
  python scripts/post-to-facebook.py 03
"""
import os
import subprocess
import sys
from pathlib import Path

import requests

HERE = Path(__file__).resolve().parent
REPO = HERE.parent
READY = REPO / "social" / "tiktok" / "ready-to-upload"

PAGE_ID = "1215544864984509"  # RigFloor HQ -- confirmed via ads_get_user_pages 2026-09-07
GRAPH_VERSION = "v22.0"

# Mirrors social/tiktok/ready-to-upload/SCHEDULE.md's "Posting order" table --
# keep both in sync manually if either changes, same convention the video-
# build scripts already use for keeping social/README.md in sync.
POSTS = {
    "03": {
        "file": "03-neutral-point.mp4",
        "message": (
            "Why drill pipe must never be in compression \U0001F447 "
            "Weight on bit doesn't come from pushing down at surface — it "
            "comes from letting the string's own weight rest on the bit. "
            "Cross the neutral point into the pipe and it buckles, fatigues "
            "at the tool joints, and parts.\n\n"
            "rigfloorhq.com/equipment/drill-string?utm_source=facebook&utm_medium=social&utm_campaign=03-neutral-point\n\n"
            "#neutralpoint #drillstring #drilling #oilfieldwork"
        ),
    },
    "06": {
        "file": "06-kill-sheet.mp4",
        "message": (
            "Free kill sheet calculator — runs right in your browser \U0001F447 "
            "Enter mud weight, SIDPP, TVD and slow pump rate, get kill mud "
            "weight, ICP and FCP instantly. No login, no install.\n\n"
            "rigfloorhq.com/calculators/kill-sheet?utm_source=facebook&utm_medium=social&utm_campaign=06-kill-sheet\n\n"
            "#killsheet #wellcontrol #drilling #oilfieldwork"
        ),
    },
    "07": {
        "file": "07-hydrostatic.mp4",
        "message": (
            "Check a mud weight against TVD in ten seconds \U0001F447 "
            "Mud weight and true vertical depth in, hydrostatic pressure and "
            "overbalance out — see exactly what happens when you push mud "
            "weight up.\n\n"
            "rigfloorhq.com/calculators/hydrostatic?utm_source=facebook&utm_medium=social&utm_campaign=07-hydrostatic\n\n"
            "#hydrostaticpressure #mudengineer #drilling #oilfieldwork"
        ),
    },
    "08": {
        "file": "08-mud-weight-window.mp4",
        "message": (
            "The gap you have to drill inside — and how narrow it gets "
            "\U0001F447 Set pore and fracture pressure, watch the window "
            "shrink until there's almost nothing left to drill inside.\n\n"
            "rigfloorhq.com/calculators/mud-weight-window?utm_source=facebook&utm_medium=social&utm_campaign=08-mud-weight-window\n\n"
            "#mudweightwindow #wellcontrol #drilling #oilfieldwork"
        ),
    },
}

HELD = {"01", "02", "05"}  # not yet checked by someone with rig experience -- do not post


def get_token() -> str:
    token = os.environ.get("RIGFLOORHQ_FB_PAGE_TOKEN")
    if not token:
        sys.exit(
            "RIGFLOORHQ_FB_PAGE_TOKEN is not set. This must be a Page Access "
            "Token for RigFloor HQ (pages_manage_posts scope), set as an "
            "environment variable -- never hardcoded. See this script's docstring."
        )
    return token


def verify_sync(vid_id: str):
    print(f"verifying {vid_id} is in sync before posting...")
    result = subprocess.run([sys.executable, str(HERE / "verify-tiktok-sync.py"), vid_id], cwd=REPO)
    if result.returncode != 0:
        sys.exit(f"verify-tiktok-sync.py failed for {vid_id} -- refusing to post an unverified file.")


def check_token(token: str):
    resp = requests.get(
        f"https://graph.facebook.com/{GRAPH_VERSION}/{PAGE_ID}",
        params={"fields": "id,name", "access_token": token},
    )
    resp.raise_for_status()
    data = resp.json()
    print(f"token OK -- posting as: {data.get('name')} ({data.get('id')})")


def post_video(vid_id: str, token: str) -> str:
    post = POSTS[vid_id]
    mp4 = READY / post["file"]
    if not mp4.exists():
        sys.exit(f"{mp4} not found -- nothing to post.")

    print(f"uploading {mp4.name} to Facebook Page {PAGE_ID}...")
    with open(mp4, "rb") as f:
        resp = requests.post(
            f"https://graph.facebook.com/{GRAPH_VERSION}/{PAGE_ID}/videos",
            data={"description": post["message"], "access_token": token},
            files={"source": (mp4.name, f, "video/mp4")},
        )
    if not resp.ok:
        sys.exit(f"Facebook rejected the upload: {resp.status_code} {resp.text}")
    video_id = resp.json().get("id")
    print(f"DONE -- posted, Facebook video id: {video_id}")
    return video_id


def main():
    if len(sys.argv) != 2:
        sys.exit(
            f"usage: post-to-facebook.py <id>\n"
            f"ready to post: {', '.join(sorted(POSTS))}\n"
            f"held, do not post: {', '.join(sorted(HELD))}"
        )
    vid_id = sys.argv[1]
    if vid_id in HELD:
        sys.exit(f"{vid_id} is held pending rig-experience review (see SCHEDULE.md) -- not posting.")
    if vid_id not in POSTS:
        sys.exit(f"unknown video id: {vid_id} (known: {', '.join(sorted(POSTS))})")

    token = get_token()
    verify_sync(vid_id)
    check_token(token)
    post_video(vid_id, token)


if __name__ == "__main__":
    main()
