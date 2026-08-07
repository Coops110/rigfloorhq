# Generates 1080x1920 frames for short-form video from the site's own content.
#
# Output goes to social/tiktok/ and is gitignored — these are binaries, not site
# assets. Regenerate rather than commit them.
#
# SAFE ZONES: all content sits inside x 80-880 and y 250-1430. TikTok's own UI
# covers roughly the bottom 450px and the right 200px, so anything placed there
# is hidden behind buttons and captions. Do not widen the box.
#
# Fonts are deliberately the Windows defaults rather than the site's Barlow
# Condensed and IBM Plex Mono, which are not installed locally. The frames are
# close enough in character and this avoids a font dependency.

Add-Type -AssemblyName System.Drawing

$repo = Split-Path -Parent $PSScriptRoot
$out  = Join-Path $repo 'social\tiktok'
New-Item -ItemType Directory -Force -Path $out | Out-Null

$ink   = [System.Drawing.ColorTranslator]::FromHtml('#0e0f11')
$steel = [System.Drawing.ColorTranslator]::FromHtml('#1c2130')
$rust  = [System.Drawing.ColorTranslator]::FromHtml('#c94a1f')
$ember = [System.Drawing.ColorTranslator]::FromHtml('#f07038')
$amber = [System.Drawing.ColorTranslator]::FromHtml('#e8a020')
$mist   = [System.Drawing.ColorTranslator]::FromHtml('#d1d8e4')
$danger = [System.Drawing.ColorTranslator]::FromHtml('#ef4444')
$white  = [System.Drawing.Color]::White

function New-Frame {
  param($Path, $Eyebrow, $Headline, $Body, $Footer, $Accent, [switch]$Warning)

  $W = 1080; $H = 1920
  $bmp = New-Object System.Drawing.Bitmap($W, $H)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.TextRenderingHint = 'ClearTypeGridFit'

  $rect = New-Object System.Drawing.Rectangle(0, 0, $W, $H)
  $grad = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $script:ink, $script:steel, 60)
  $g.FillRectangle($grad, $rect)

  # Warning frames get a red bar and a red rule, so the safety card is visually
  # distinct from the content cards at a glance rather than only in wording.
  $barCol = if ($Warning) { $script:danger } else { $script:rust }
  $g.FillRectangle((New-Object System.Drawing.SolidBrush($barCol)), 0, 0, $W, 14)
  if ($Warning) {
    $g.FillRectangle((New-Object System.Drawing.SolidBrush($script:danger)), 80, 320, 140, 8)
  }

  # Derrick lines, placed right where the TikTok buttons sit so they read as
  # texture rather than competing with anything.
  $pen = New-Object System.Drawing.Pen((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(18, 232, 160, 32))), 4)
  for ($i = 0; $i -lt 10; $i++) { $g.DrawLine($pen, (720 + $i * 70), 1920, (940 + $i * 70), 300) }

  $sf = New-Object System.Drawing.StringFormat
  $x = 80; $wBox = 800

  $fEye = New-Object System.Drawing.Font('Consolas', 30, [System.Drawing.FontStyle]::Bold)
  $g.DrawString($Eyebrow, $fEye, (New-Object System.Drawing.SolidBrush($script:ember)),
    (New-Object System.Drawing.RectangleF($x, 250, $wBox, 60)), $sf)

  $accentCol = if ($Accent) { $Accent } else { $script:white }
  $fHead = New-Object System.Drawing.Font('Arial', 82, [System.Drawing.FontStyle]::Bold)
  $g.DrawString($Headline, $fHead, (New-Object System.Drawing.SolidBrush($accentCol)),
    (New-Object System.Drawing.RectangleF($x, 330, $wBox, 620)), $sf)

  if ($Body) {
    $fBody = New-Object System.Drawing.Font('Segoe UI', 40)
    $g.DrawString($Body, $fBody, (New-Object System.Drawing.SolidBrush($script:mist)),
      (New-Object System.Drawing.RectangleF($x, 980, $wBox, 420)), $sf)
  }
  if ($Footer) {
    $fFoot = New-Object System.Drawing.Font('Consolas', 32, [System.Drawing.FontStyle]::Bold)
    $g.DrawString($Footer, $fFoot, (New-Object System.Drawing.SolidBrush($script:amber)),
      (New-Object System.Drawing.RectangleF($x, 1370, $wBox, 60)), $sf)
  }

  $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
}

# Scripts and captions for each of these are in social/README.md.
$topics = @(
  @{ id = '01-differential-sticking'; frames = @(
    @{ e = 'STUCK PIPE'; h = 'The one thing you should NOT do is pull harder.'; b = $null; f = $null; a = $white },
    @{ e = 'WHY'; h = 'Force = pressure difference x contact area'; b = 'Tension reduces neither of them.'; f = $null; a = $white },
    @{ e = 'WORSE'; h = 'In a deviated hole, pulling presses the string harder into the wall.'; b = 'Which increases the contact area the pressure acts on.'; f = $null; a = $white },
    @{ e = 'THE FIX'; h = 'You do not out-pull it. You lower the pressure.'; b = 'Full breakdown of the three conditions:'; f = 'rigfloorhq.com'; a = $ember }
  ) },
  @{ id = '02-hole-cleaning'; frames = @(
    @{ e = 'HOLE CLEANING'; h = 'Horizontal wells are not the hardest to clean.'; b = $null; f = $null; a = $white },
    @{ e = 'WHY'; h = 'Past 50 degrees, cuttings settle sideways and leave the flow entirely.'; b = 'They stop being carried. They start accumulating.'; f = $null; a = $white },
    @{ e = 'THE REAL PROBLEM'; h = '45 to 60 degrees.'; b = 'Beds form AND have a slope to avalanche down. Near horizontal they just sit still.'; f = $null; a = $ember },
    @{ e = 'CHECK IT'; h = 'Count what comes over the shakers against what you drilled.'; b = 'Cheapest diagnostic on the rig:'; f = 'rigfloorhq.com'; a = $white }
  ) },
  @{ id = '03-neutral-point'; frames = @(
    @{ e = 'DRILL STRING'; h = 'Weight on bit does not come from pushing down.'; b = $null; f = $null; a = $white },
    @{ e = 'THE RULE'; h = 'Collars are built for compression. Drill pipe is built for tension.'; b = $null; f = $null; a = $white },
    @{ e = 'NEUTRAL POINT'; h = 'It must stay inside the collars.'; b = 'Put drill pipe into compression and it buckles, fatigues at the tool joints, and eventually parts.'; f = $null; a = $ember },
    @{ e = 'FULL EXPLANATION'; h = 'Why collar weight is sized before you ever pick up.'; b = $null; f = 'rigfloorhq.com'; a = $white }
  ) },
  @{ id = '04-6g-welding'; frames = @(
    @{ e = 'RIG WELDING'; h = 'One welding test. The rest are included.'; b = $null; f = $null; a = $white },
    @{ e = 'POSITIONS'; h = '1G rotates the pipe. You never leave flat.'; b = 'Which is why it qualifies you for almost nothing.'; f = $null; a = $white },
    @{ e = '6G'; h = 'Pipe fixed at 45 degrees. Every position in one weld.'; b = 'No comfortable place to start.'; f = $null; a = $ember },
    @{ e = 'WHY IT MATTERS'; h = 'On a rig you cannot rotate a mud line to suit yourself.'; b = 'Full certification guide:'; f = 'rigfloorhq.com'; a = $white }
  ) },
  @{ id = '05-torque-and-drag'; frames = @(
    @{ e = 'EARLY WARNING'; h = 'By the time torque looks high, you have been in trouble for hours.'; b = $null; f = $null; a = $white },
    @{ e = 'THE MISTAKE'; h = 'Watching the number.'; b = 'Torque depends on depth, angle, mud and hole size. The value alone tells you nothing.'; f = $null; a = $white },
    @{ e = 'THE SIGNAL'; h = 'The gap between measured and modelled.'; b = 'It opens several connections before the number ever looks alarming.'; f = $null; a = $ember },
    @{ e = 'READ THE TREND'; h = 'Most stuck pipe was visible in this data for hours.'; b = $null; f = 'rigfloorhq.com'; a = $white }
  ) },

  # ── CALCULATOR SCREEN RECORDINGS ─────────────────────────────
  # These bookend a screen recording rather than standing alone:
  #   frame1  hook            (~2s)
  #   [ screen recording of the calculator, 20-30s ]
  #   frame2  WARNING         (~3s, hold it long enough to read)
  #   frame3  close           (~3s)
  #
  # The warning frame is not optional. Publishing a kill sheet demo without it
  # contradicts the site's own terms, which state the calculators are unverified
  # teaching tools and must not drive decisions on a live well.
  @{ id = '06-kill-sheet'; frames = @(
    @{ e = 'FREE TOOL'; h = 'Shut-in pressures recorded. Where does kill mud weight come from?'; b = $null; f = $null; a = $white },
    @{ e = 'BEFORE YOU USE IT'; h = 'Learning tool only.'; b = 'Unverified. It does not know your well, your fluid or your equipment. On a live well, use your company approved kill sheet, verified by your well control supervisor.'; f = $null; a = $danger; w = $true },
    @{ e = 'FREE, NO SIGNUP'; h = 'Runs in your browser. Nothing you type leaves your phone.'; b = $null; f = 'rigfloorhq.com'; a = $white }
  ) },
  @{ id = '07-hydrostatic'; frames = @(
    @{ e = 'FREE TOOL'; h = 'Mud weight and depth in. Overbalance out.'; b = $null; f = $null; a = $white },
    @{ e = 'BEFORE YOU USE IT'; h = 'Learning tool only.'; b = 'A reference calculation, not an operational authority. Verify every number you rely on by an approved method.'; f = $null; a = $danger; w = $true },
    @{ e = 'FREE, NO SIGNUP'; h = 'Check a mud weight against TVD in about ten seconds.'; b = $null; f = 'rigfloorhq.com'; a = $white }
  ) },
  @{ id = '08-mud-weight-window'; frames = @(
    @{ e = 'FREE TOOL'; h = 'Pore pressure at the bottom. Fracture pressure at the top. You live in between.'; b = $null; f = $null; a = $white },
    @{ e = 'BEFORE YOU USE IT'; h = 'Learning tool only.'; b = 'Simplified assumptions. Use your well programme and the direction of your supervisor for anything operational.'; f = $null; a = $danger; w = $true },
    @{ e = 'FREE, NO SIGNUP'; h = 'See the safe window, and how narrow it gets.'; b = $null; f = 'rigfloorhq.com'; a = $white }
  ) }
)

$n = 0
foreach ($t in $topics) {
  $i = 1
  foreach ($f in $t.frames) {
    New-Frame -Path (Join-Path $out ("{0}-frame{1}.png" -f $t.id, $i)) `
      -Eyebrow $f.e -Headline $f.h -Body $f.b -Footer $f.f -Accent $f.a -Warning:([bool]$f.w)
    $i++; $n++
  }
}
Write-Output "Generated $n frames in $out"
