# Product Hunt Visual Assets

Generated on: 2026-03-23

## Files

| # | File | Size | Description |
|---|------|------|-------------|
| 0 | `00-thumbnail-240.svg` | 5.6 KB | Product Hunt gallery thumbnail (240×240) |
| 1 | `01-hero-skill-tree.png` | 75 KB | Skill tree visualization with vibrant nodes |
| 2 | `02-profile-page.png` | 97 KB | User profile with skill badges and stats |
| 3 | `03-share-card.png` | 88 KB | Share card generator with QR code |
| 4 | `04-mobile-view.png` | 29 KB | Responsive mobile view |
| 5 | `05-leaderboard.png` | 96 KB | Community leaderboard page |
| 6 | `06-demo-static.png` | - | Demo showing interactive features |

## Usage

Upload screenshots 01-05 to Product Hunt gallery in order.
Use the thumbnail as the listing icon.

## Demo GIF

For a full animated GIF demo, use the following with ffmpeg:
```bash
ffmpeg -i frame_%03d.png -vf "fps=10,scale=1280:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer" demo.gif
```

Or use an online GIF maker with the generated frames.
