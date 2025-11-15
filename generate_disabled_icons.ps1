# PowerShell script to create disabled (grayscale) icons

Write-Host "Generating Disabled Icons for GDate2PDate Extension..." -ForegroundColor Cyan
Write-Host ""

# Load System.Drawing assembly
Add-Type -AssemblyName System.Drawing

function Convert-ToGrayscale {
    param(
        [string]$InputPath,
        [string]$OutputPath
    )
    
    try {
        # Load the image
        $img = [System.Drawing.Image]::FromFile($InputPath)
        
        # Create a new bitmap
        $bmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
        
        # Create graphics object
        $graphics = [System.Drawing.Graphics]::FromImage($bmp)
        
        # Create grayscale color matrix
        $colorMatrix = New-Object System.Drawing.Imaging.ColorMatrix
        $colorMatrix.Matrix00 = 0.299
        $colorMatrix.Matrix01 = 0.299
        $colorMatrix.Matrix02 = 0.299
        $colorMatrix.Matrix10 = 0.587
        $colorMatrix.Matrix11 = 0.587
        $colorMatrix.Matrix12 = 0.587
        $colorMatrix.Matrix20 = 0.114
        $colorMatrix.Matrix21 = 0.114
        $colorMatrix.Matrix22 = 0.114
        $colorMatrix.Matrix33 = 0.8  # Slightly transparent for "disabled" look
        $colorMatrix.Matrix44 = 1.0
        
        # Create image attributes
        $imageAttributes = New-Object System.Drawing.Imaging.ImageAttributes
        $imageAttributes.SetColorMatrix($colorMatrix)
        
        # Draw the image with grayscale effect
        $graphics.DrawImage(
            $img,
            (New-Object System.Drawing.Rectangle(0, 0, $img.Width, $img.Height)),
            0, 0, $img.Width, $img.Height,
            [System.Drawing.GraphicsUnit]::Pixel,
            $imageAttributes
        )
        
        # Save the image
        $bmp.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
        
        # Clean up
        $graphics.Dispose()
        $bmp.Dispose()
        $img.Dispose()
        
        $filename = Split-Path $OutputPath -Leaf
        Write-Host "Created: $filename" -ForegroundColor Green
        
    } catch {
        Write-Host "Error creating $OutputPath : $_" -ForegroundColor Red
    }
}

# Define paths
$iconsDir = Join-Path $PSScriptRoot "icons"

# Check if icons directory exists
if (-not (Test-Path $iconsDir)) {
    Write-Host "Error: icons directory not found!" -ForegroundColor Red
    exit 1
}

# Convert each icon
$sizes = @(16, 48, 128)
foreach ($size in $sizes) {
    $inputFile = Join-Path $iconsDir "icon$size.png"
    $outputFile = Join-Path $iconsDir "icon$size-disabled.png"
    
    if (Test-Path $inputFile) {
        Convert-ToGrayscale -InputPath $inputFile -OutputPath $outputFile
    } else {
        Write-Host "Warning: $inputFile not found, skipping..." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "All disabled icons generated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "The disabled icons will be used when the extension is turned off" -ForegroundColor Cyan
