#!/usr/bin/env bash
# THE PRINCIPLE PANEL'S LOOP — how public/video/blossom-loop.* was cut.
#
# The client supplied an 8.0s clip (1280x720, h264 + aac, 1.96MB). The
# panel needs a SHORT SEAMLESS loop, so the eight seconds become four by
# the standard infinite-loop blend rather than by a cut:
#
#     out(t) = (t/T)*S(t) + (1 - t/T)*S(t+T),  t in [0, T),  T = 4s
#
# which makes out(0) and out(T) the same frame by construction — the loop
# point is a fixed point of the blend, not a splice. Measured: mean frame
# difference across the loop point falls from 20.0/255 on a hard cut to
# 3.9/255. The camera is locked off and only petals and cloud move, so
# the dissolve has nothing static to ghost.
#
# Audio is dropped (the element is muted; the AAC track was ~15% of the
# file) and a VP9/WebM sibling is written for the browsers that take it.
# 1.96MB -> 1.03MB mp4 / 0.79MB webm.
#
# The 8s original is the client's and is not kept in the repo — this
# script is what makes the cut reproducible if they resupply it.
#
#   ./scripts/blossom-loop.sh path/to/original.mp4
set -euo pipefail
SRC="${1:?usage: blossom-loop.sh <original.mp4>}"
OUT=public/video/blossom-loop

ffmpeg -v error -i "$SRC" -filter_complex "\
[0:v]trim=0:4,setpts=PTS-STARTPTS,fps=24,format=yuv420p[a];\
[0:v]trim=4:8,setpts=PTS-STARTPTS,fps=24,format=yuv420p[b];\
[b][a]xfade=transition=fade:duration=4:offset=0,fps=24[v]" \
  -map "[v]" -an \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 24 -preset slow \
  -movflags +faststart "$OUT.mp4" -y

ffmpeg -v error -i "$OUT.mp4" \
  -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -pix_fmt yuv420p -an "$OUT.webm" -y

ls -la "$OUT.mp4" "$OUT.webm"
