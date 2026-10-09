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

function Get-FitFont {
  # Longer lines at a fixed font size were overflowing their box and getting
  # clipped mid-word (GDI+ DrawString clips to the RectangleF bounds instead
  # of shrinking to fit). Step the size down until the wrapped text actually
  # fits the box height, so nothing on screen gets cut off.
  param($Graphics, $Text, $FamilyName, $Style, $MaxSize, $MinSize, $BoxWidth, $BoxHeight)
  for ($size = $MaxSize; $size -ge $MinSize; $size -= 2) {
    $font = New-Object System.Drawing.Font($FamilyName, $size, $Style)
    $measured = $Graphics.MeasureString($Text, $font, $BoxWidth)
    if ($measured.Height -le $BoxHeight) { return $font }
    $font.Dispose()
  }
  return New-Object System.Drawing.Font($FamilyName, $MinSize, $Style)
}

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
  $fHead = Get-FitFont $g $Headline 'Arial' ([System.Drawing.FontStyle]::Bold) 82 40 $wBox 620
  $g.DrawString($Headline, $fHead, (New-Object System.Drawing.SolidBrush($accentCol)),
    (New-Object System.Drawing.RectangleF($x, 330, $wBox, 620)), $sf)

  if ($Body) {
    $fBody = Get-FitFont $g $Body 'Segoe UI' ([System.Drawing.FontStyle]::Regular) 40 26 $wBox 420
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
    @{ e = 'DIFFERENTIAL STICKING'; h = 'The one thing you should NOT do is pull harder.'; b = $null; f = $null; a = $white },
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
    @{ e = 'READ THE TREND'; h = 'Torque and drag give more warning than almost anything else on the rig.'; b = 'But only against a calibrated baseline.'; f = 'rigfloorhq.com'; a = $white }
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
    @{ e = 'FREE TOOL: KILL SHEET'; h = 'Shut-in pressures recorded. Where does kill mud weight come from?'; b = $null; f = $null; a = $white },
    @{ e = 'BEFORE YOU USE IT'; h = 'Learning tool only.'; b = 'Unverified. It does not know your well, your fluid or your equipment. On a live well, use your company approved kill sheet, verified by your well control supervisor.'; f = $null; a = $danger; w = $true },
    @{ e = 'FREE, NO SIGNUP'; h = 'Runs in your browser. Nothing you type leaves your phone.'; b = $null; f = 'rigfloorhq.com'; a = $white }
  ) },
  @{ id = '07-hydrostatic'; frames = @(
    @{ e = 'FREE TOOL: HYDROSTATIC'; h = 'Mud weight and depth in. Overbalance out.'; b = $null; f = $null; a = $white },
    @{ e = 'BEFORE YOU USE IT'; h = 'Learning tool only.'; b = 'A reference calculation, not an operational authority. Verify every number you rely on by an approved method.'; f = $null; a = $danger; w = $true },
    @{ e = 'FREE, NO SIGNUP'; h = 'Check a mud weight against TVD in about ten seconds.'; b = $null; f = 'rigfloorhq.com'; a = $white }
  ) },
  @{ id = '08-mud-weight-window'; frames = @(
    @{ e = 'FREE TOOL: MUD WEIGHT WINDOW'; h = 'Pore pressure at the bottom. Fracture pressure at the top. You live in between.'; b = $null; f = $null; a = $white },
    @{ e = 'BEFORE YOU USE IT'; h = 'Learning tool only.'; b = 'Simplified assumptions. Use your well programme and the direction of your supervisor for anything operational.'; f = $null; a = $danger; w = $true },
    @{ e = 'FREE, NO SIGNUP'; h = 'See the safe window, and how narrow it gets.'; b = $null; f = 'rigfloorhq.com'; a = $white }
  ) },
  @{ id = '09-mud-weight-converter'; frames = @(
    @{ e = 'FREE TOOL: MUD WEIGHT CONVERTER'; h = 'ppg, specific gravity, psi per foot, kg per m3 -- one number, five names.'; b = $null; f = $null; a = $white },
    @{ e = 'BEFORE YOU USE IT'; h = 'Learning tool only.'; b = 'A unit conversion, not a substitute for your mud report or lab result. Verify anything operational through your normal channels.'; f = $null; a = $danger; w = $true },
    @{ e = 'FREE, NO SIGNUP'; h = 'Type into any box. Every other unit updates instantly.'; b = $null; f = 'rigfloorhq.com'; a = $white }
  ) },

  # ── HOOK-REBUILD CALCULATOR RECORDINGS (12-15) ───────────────
  # Frame1 is no longer a topic-lead-in sentence -- retention data showed
  # viewers bailing in the first 0-3 seconds, diagnosed as a hook problem.
  # Frame1 now shows the actual number/payoff itself (bold, short), matching
  # the exact spoken hook line, which now plays as real audio here instead
  # of the old 2s of silence (see make-tiktok-recordings.py, 2026-09-24).
  @{ id = '12-ecd'; frames = @(
    @{ e = "WHILE YOU'RE CIRCULATING"; h = '12.00 -> 12.41 PPG'; b = $null; f = $null; a = $ember },
    @{ e = 'BEFORE YOU USE IT'; h = 'Learning tool only.'; b = 'Reference tool, not an operational authority. Real ECD decisions belong to the mud engineer and certified well control supervisor.'; f = $null; a = $danger; w = $true },
    @{ e = 'FREE, NO SIGNUP'; h = 'Free ECD calculator. No login.'; b = $null; f = 'rigfloorhq.com'; a = $white }
  ) },
  @{ id = '13-gas-migration'; frames = @(
    @{ e = 'SHUT-IN WELL'; h = '50 PSI/HR. NO PUMPS RUNNING.'; b = $null; f = $null; a = $ember },
    @{ e = 'BEFORE YOU USE IT'; h = 'Learning tool only.'; b = "Reference only. Run the volumetric method under your company's approved well control procedure."; f = $null; a = $danger; w = $true },
    @{ e = 'FREE, NO SIGNUP'; h = 'Free gas migration calculator. No login.'; b = $null; f = 'rigfloorhq.com'; a = $white }
  ) },
  @{ id = '14-buoyancy'; frames = @(
    @{ e = 'SAME STRING, SAME MUD'; h = '16.52 vs 9.30 LB/FT'; b = $null; f = $null; a = $ember },
    @{ e = 'BEFORE YOU USE IT'; h = 'Learning tool only.'; b = 'Reference only. Use actual pipe OD and ID from the tally book, and confirmed fluid weights, for a real calculation.'; f = $null; a = $danger; w = $true },
    @{ e = 'FREE, NO SIGNUP'; h = 'Free buoyancy calculator. No login.'; b = $null; f = 'rigfloorhq.com'; a = $white }
  ) },
  @{ id = '15-riser-margin'; frames = @(
    @{ e = 'IF THE RISER GOES'; h = 'MARGIN: 1.85 PPG'; b = $null; f = $null; a = $ember },
    @{ e = 'BEFORE YOU USE IT'; h = 'Learning tool only.'; b = "Reference only. Riser margin is one input to your well's kick tolerance and shut-in procedure, decided by your drilling program."; f = $null; a = $danger; w = $true },
    @{ e = 'FREE, NO SIGNUP'; h = 'Free riser margin calculator. No login.'; b = $null; f = 'rigfloorhq.com'; a = $white }
  ) },

  # ── BATCH 16-19: bullheading, pipe pull margin, bit torque, lag/volume ──
  # Same hook-first shape as 12-15: frame1 shows the real number swing
  # itself, spoken as its own audio clip, not a topic lead-in.
  @{ id = '16-bullheading'; frames = @(
    @{ e = 'AS KILL FLUID GOES IN'; h = '2,050 -> 1,738 PSI'; b = $null; f = $null; a = $ember },
    @{ e = 'BEFORE YOU USE IT'; h = 'Learning tool only.'; b = "Reference tool, not an operational authority. A real bullhead job runs under your company's approved well-kill procedure, with engineering sign-off."; f = $null; a = $danger; w = $true },
    @{ e = 'FREE, NO SIGNUP'; h = 'Free bullheading calculator. No login.'; b = $null; f = 'rigfloorhq.com'; a = $white }
  ) },
  @{ id = '17-pipe-pull-margin'; frames = @(
    @{ e = 'WET PIPE vs DRY PIPE'; h = '441.9 -> 1,830.0 FT'; b = $null; f = $null; a = $ember },
    @{ e = 'BEFORE YOU USE IT'; h = 'Learning tool only.'; b = "Reference tool, not an operational authority. Actual swab margin depends on trip speed and gel strength too -- use your company's approved trip sheet."; f = $null; a = $danger; w = $true },
    @{ e = 'FREE, NO SIGNUP'; h = 'Free pipe pull margin calculator. No login.'; b = $null; f = 'rigfloorhq.com'; a = $white }
  ) },
  @{ id = '18-bit-torque'; frames = @(
    @{ e = "MAKE-UP TORQUE ISN'T A FEEL"; h = '18,000 -> 23,500 FT-LB'; b = $null; f = $null; a = $ember },
    @{ e = 'BEFORE YOU USE IT'; h = 'Learning tool only.'; b = "Reference tool, not an operational authority. Always check the specific bit's own spec sheet -- thread condition and compound shift the real number."; f = $null; a = $danger; w = $true },
    @{ e = 'FREE, NO SIGNUP'; h = 'Free bit torque chart. No login.'; b = $null; f = 'rigfloorhq.com'; a = $white }
  ) },
  @{ id = '19-lag-and-volume'; frames = @(
    @{ e = 'SAME PUMP, TWO DIFFERENT LAGS'; h = '37.0 -> 96.6 MIN'; b = $null; f = $null; a = $ember },
    @{ e = 'BEFORE YOU USE IT'; h = 'Learning tool only.'; b = 'Reference tool, not an operational authority. Measure pump output against your actual equipment -- a worn pump throws off every number below it.'; f = $null; a = $danger; w = $true },
    @{ e = 'FREE, NO SIGNUP'; h = 'Free lag and volume calculator. No login.'; b = $null; f = 'rigfloorhq.com'; a = $white }
  ) },

  # ── BATCH 20-22: flange & ring gasket, ton-mile, drill pipe tally ──
  @{ id = '20-flange-ring-gasket'; frames = @(
    @{ e = 'WRONG RING GASKET'; h = 'LOOKS SEATED. FAILS AT TEST PRESSURE.'; b = $null; f = $null; a = $ember },
    @{ e = 'BEFORE YOU USE IT'; h = 'Learning tool only.'; b = "Reference only. Confirm bore size and pressure rating against the flange's own data plate before ordering studs or gaskets."; f = $null; a = $danger; w = $true },
    @{ e = 'FREE, NO SIGNUP'; h = 'Free flange and ring gasket lookup. No login.'; b = $null; f = 'rigfloorhq.com'; a = $white }
  ) },
  @{ id = '21-ton-mile'; frames = @(
    @{ e = 'ONE 500-FT TRIP'; h = '45.4 TON-MILES'; b = $null; f = $null; a = $ember },
    @{ e = 'BEFORE YOU USE IT'; h = 'Learning tool only.'; b = "Reference only. Track cumulative ton-miles against your drilling line's actual service-life rating and cut-and-slip programme."; f = $null; a = $danger; w = $true },
    @{ e = 'FREE, NO SIGNUP'; h = 'Free ton-mile calculator. No login.'; b = $null; f = 'rigfloorhq.com'; a = $white }
  ) },
  @{ id = '22-drill-pipe-tally'; frames = @(
    @{ e = 'THE REAL DEPTH'; h = '20 JOINTS -> 624 FT'; b = $null; f = $null; a = $ember },
    @{ e = 'BEFORE YOU USE IT'; h = 'Learning tool only.'; b = 'Reference only. A real tally is measured and logged joint by joint -- use this to plan and sanity-check, not replace the physical tally.'; f = $null; a = $danger; w = $true },
    @{ e = 'FREE, NO SIGNUP'; h = 'Free drill pipe tally calculator. No login.'; b = $null; f = 'rigfloorhq.com'; a = $white }
  ) },

  # ── ANIMATED DIAGRAM VIDEOS ──────────────────────────────────
  # Same hook/insight/close bookend shape as the informational 01-05
  # videos (no "before you use it" warning -- these aren't interactive
  # calculators making a live-well decision, they're explainers).
  @{ id = '10-bop-ram-size'; frames = @(
    @{ e = 'BOP STACK'; h = 'One ram, one pipe size. Not one "good enough" one.'; b = $null; f = $null; a = $white },
    @{ e = 'THE MISCONCEPTION'; h = 'A casing shear ram cuts pipe.'; b = 'It does not seal the well. A blind shear ram above it closes after.'; f = $null; a = $ember },
    @{ e = 'READ THE STACK'; h = 'Every ram is rated for one size and one job.'; b = $null; f = 'rigfloorhq.com'; a = $white }
  ) },
  @{ id = '11-jackup-depth'; frames = @(
    @{ e = 'JACKUP RIGS'; h = 'The 400 foot limit is not a spec sheet number.'; b = $null; f = $null; a = $white },
    @{ e = 'THE PHYSICS'; h = 'A jackup cannot stand up in water deeper than its own legs.'; b = 'Past that, the whole design has to change.'; f = $null; a = $ember },
    @{ e = 'WHAT TAKES OVER'; h = 'Moored semisubs hold in heavy seas. DP drillships move fast between wells.'; b = $null; f = 'rigfloorhq.com'; a = $white }
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
