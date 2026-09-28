# TEST ONLY — generates one alternate hook frame (frame1) using a real photo
# background instead of the site's solid dark gradient, so it can be dropped
# into video 01 and rebuilt as an A/B comparison. Not part of the normal
# pipeline; run manually, overwrites social/tiktok/01-differential-sticking-frame1.png.
#
# Source photo: Pixabay, "Onshore Drilling" (onshore-1928358), free/no
# attribution required, confirmed onshore via its own title/alt text — no
# offshore platforms/jackups/semisubs per Chris's explicit instruction.
#
# Run: powershell -File scripts/test-photo-hook-frame.ps1

Add-Type -AssemblyName System.Drawing

$repo  = Split-Path -Parent $PSScriptRoot
$photo = Join-Path $repo 'social\tiktok-test\rig-onshore.jpg'
$out   = Join-Path $repo 'social\tiktok\01-differential-sticking-frame1.png'

$ember = [System.Drawing.ColorTranslator]::FromHtml('#f07038')
$rust  = [System.Drawing.ColorTranslator]::FromHtml('#c94a1f')
$white = [System.Drawing.Color]::White

function Get-FitFont {
  param($Graphics, $Text, $FamilyName, $Style, $MaxSize, $MinSize, $BoxWidth, $BoxHeight)
  for ($size = $MaxSize; $size -ge $MinSize; $size -= 2) {
    $font = New-Object System.Drawing.Font($FamilyName, $size, $Style)
    $measured = $Graphics.MeasureString($Text, $font, $BoxWidth)
    if ($measured.Height -le $BoxHeight) { return $font }
    $font.Dispose()
  }
  return New-Object System.Drawing.Font($FamilyName, $MinSize, $Style)
}

$W = 1080; $H = 1920
$bmp = New-Object System.Drawing.Bitmap($W, $H)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'
$g.InterpolationMode = 'HighQualityBicubic'
$g.TextRenderingHint = 'ClearTypeGridFit'

# Cover-crop the source photo to fill 1080x1920 exactly, cropped from center.
$src = [System.Drawing.Image]::FromFile($photo)
$srcRatio = $src.Width / $src.Height
$dstRatio = $W / $H
if ($srcRatio -gt $dstRatio) {
  $drawH = $H
  $drawW = [int]($H * $srcRatio)
  $offX = [int](($drawW - $W) / -2)
  $offY = 0
} else {
  $drawW = $W
  $drawH = [int]($W / $srcRatio)
  $offX = 0
  $offY = [int](($drawH - $H) / -2)
}
$g.DrawImage($src, $offX, $offY, $drawW, $drawH)
$src.Dispose()

# Cover the rig's real operator nameplate ("PT.DATI RIG '259' / SAFETY
# FIRST") on the cabin below the derrick — Pixabay's own license doesn't
# permit commercial use of content showing a recognizable trademark, and
# explicitly allows editing/modifying the photo, so patch it rather than
# drop the image. Sampled a nearby steel-grey tone so the patch reads as
# part of the structure rather than an obvious blackout box.
$plateBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 88, 92, 98))
$g.FillRectangle($plateBrush, 480, 1325, 420, 200)

# Dark gradient overlay, heavier toward the bottom half where the headline
# sits, so white text stays legible over a busy photo without hiding the
# image entirely at the top.
$rect = New-Object System.Drawing.Rectangle(0, 0, $W, $H)
$overlay = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  $rect,
  [System.Drawing.Color]::FromArgb(60, 14, 15, 17),
  [System.Drawing.Color]::FromArgb(215, 14, 15, 17),
  90)
$g.FillRectangle($overlay, $rect)

# Same brand bar + derrick-line texture as every other frame, so this still
# reads as RigFloorHQ and not a generic stock photo.
$g.FillRectangle((New-Object System.Drawing.SolidBrush($rust)), 0, 0, $W, 14)
$pen = New-Object System.Drawing.Pen((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(28, 232, 160, 32))), 4)
for ($i = 0; $i -lt 10; $i++) { $g.DrawLine($pen, (720 + $i * 70), 1920, (940 + $i * 70), 300) }

$sf = New-Object System.Drawing.StringFormat
$x = 80; $wBox = 800

$fEye = New-Object System.Drawing.Font('Consolas', 30, [System.Drawing.FontStyle]::Bold)
$g.DrawString('DIFFERENTIAL STICKING', $fEye, (New-Object System.Drawing.SolidBrush($ember)),
  (New-Object System.Drawing.RectangleF($x, 250, $wBox, 60)), $sf)

$headline = 'The one thing you should NOT do is pull harder.'
$fHead = Get-FitFont $g $headline 'Arial' ([System.Drawing.FontStyle]::Bold) 82 40 $wBox 900
$g.DrawString($headline, $fHead, (New-Object System.Drawing.SolidBrush($white)),
  (New-Object System.Drawing.RectangleF($x, 980, $wBox, 900)), $sf)

$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
Write-Output "Wrote photo-background test hook frame to $out"
