"""
Icon Generator for GDate2PDate Chrome Extension
تولید آیکون برای افزونه کروم GDate2PDate
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    """
    Create a Persian calendar-themed icon
    ایجاد آیکون با تم تقویم شمسی
    """
    # Create image with gradient background
    img = Image.new('RGB', (size, size), color='white')
    draw = ImageDraw.Draw(img)
    
    # Draw gradient background (purple gradient)
    for y in range(size):
        # Gradient from #667eea to #764ba2
        ratio = y / size
        r = int(102 + (118 - 102) * ratio)
        g = int(126 + (75 - 126) * ratio)
        b = int(234 + (162 - 234) * ratio)
        draw.rectangle([(0, y), (size, y + 1)], fill=(r, g, b))
    
    # Draw calendar outline
    padding = size // 6
    calendar_top = padding
    calendar_height = size - 2 * padding
    calendar_width = size - 2 * padding
    
    # White rounded rectangle for calendar
    draw.rounded_rectangle(
        [(padding, calendar_top), (size - padding, size - padding)],
        radius=size // 10,
        fill='white',
        outline=None
    )
    
    # Draw calendar header (darker section)
    header_height = calendar_height // 4
    draw.rounded_rectangle(
        [(padding, calendar_top), (size - padding, calendar_top + header_height)],
        radius=size // 10,
        fill=(102, 126, 234),
        outline=None
    )
    
    # Try to add Persian numbers or use simple design
    try:
        # For larger icons, add Persian numerals
        if size >= 48:
            # Draw "۱۴" (representing 14xx - current Persian year range)
            font_size = size // 4
            
            # Use a simple approach - draw decorative elements
            # Draw grid of dots to represent calendar days
            dot_size = max(2, size // 20)
            start_x = padding + size // 8
            start_y = calendar_top + header_height + size // 10
            spacing = size // 8
            
            for row in range(3):
                for col in range(3):
                    x = start_x + col * spacing
                    y = start_y + row * spacing
                    if x + dot_size < size - padding and y + dot_size < size - padding:
                        draw.ellipse(
                            [(x, y), (x + dot_size, y + dot_size)],
                            fill=(102, 126, 234)
                        )
    except Exception as e:
        print(f"Note: Could not add text decorations: {e}")
    
    # Save icon
    script_dir = os.path.dirname(os.path.abspath(__file__))
    icons_dir = os.path.join(script_dir, 'icons')
    os.makedirs(icons_dir, exist_ok=True)
    
    filepath = os.path.join(icons_dir, filename)
    img.save(filepath, 'PNG', quality=95)
    print(f"✅ Created: {filename} ({size}x{size})")
    print(f"   ساخته شد: {filename} ({size}x{size})")

def main():
    """Generate all required icon sizes"""
    print("🎨 Generating GDate2PDate Extension Icons...")
    print("🎨 در حال ساخت آیکون‌های افزونه GDate2PDate...")
    print()
    
    # Generate required sizes
    create_icon(16, 'icon16.png')
    create_icon(48, 'icon48.png')
    create_icon(128, 'icon128.png')
    
    print()
    print("✅ All icons generated successfully!")
    print("✅ همه آیکون‌ها با موفقیت ساخته شدند!")

if __name__ == '__main__':
    main()
