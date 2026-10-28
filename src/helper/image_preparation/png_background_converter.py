from PIL import Image
import os
import pathlib 
import numpy as np


def remove_white_background(image_path, threshold=255, result_dir=None):
    """threshold: pixels with min(r,g,b) >= threshold are treated as pure white (alpha=0).
    Below that, alpha and color are derived by un-blending the white background,
    so anti-aliased/compressed edges fade out smoothly instead of leaving a white fringe.
    Pixels that are already transparent stay transparent, and existing partial
    transparency is preserved."""
    img = Image.open(image_path).convert("RGBA")
    arr = np.asarray(img, dtype=np.float32)
    rgb, orig_a = arr[..., :3], arr[..., 3]

    whiteness = rgb.min(axis=2)
    new_alpha = 255.0 - whiteness
    new_alpha[whiteness >= threshold] = 0

    # Un-blend: observed = color*alpha + white*(1-alpha) -> solve for color
    safe_alpha = np.maximum(new_alpha, 1.0)  # avoid division by zero
    unblended = (rgb - 255.0) * (255.0 / safe_alpha)[..., None] + 255.0
    unblended = np.clip(unblended, 0, 255)

    # Keep original RGB where nothing was removed (white or already transparent)
    keep_original = (new_alpha == 0) | (orig_a == 0)
    out_rgb = np.where(keep_original[..., None], rgb, unblended)

    # Combine with the existing alpha so transparent areas stay transparent
    out_alpha = new_alpha * (orig_a / 255.0)
    out_alpha[orig_a == 0] = 0

    out = np.dstack([out_rgb, out_alpha])
    result = Image.fromarray(np.rint(out).astype(np.uint8), "RGBA")

    file_name = f"{pathlib.Path(image_path).stem}_transparent.png"
    if not result_dir:
        result_dir = pathlib.Path(image_path).parent
    output_path = pathlib.Path(result_dir) / file_name

    result.save(output_path, "PNG")
    print(f"Background transparent saved: {output_path}")
    return output_path


def remove_black_background(image_path, threshold=0, result_dir=None):
    """threshold: pixels with max(r,g,b) <= threshold are treated as pure black (alpha=0).
    Above that, alpha and color are both derived by un-blending the black background,
    so anti-aliased/compressed edges fade out smoothly instead of leaving a black fringe."""
    img = Image.open(image_path).convert("RGBA")
    pixels = img.load()
    width, height = img.size

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            blackness = max(r, g, b)

            if blackness <= threshold:
                pixels[x, y] = (r, g, b, 0)
                continue

            alpha = blackness

            # Un-blend: assume observed = color*alpha/255 (black bg contributes 0), solve for color
            unblend = 255 / alpha
            new_r = max(0, min(255, int(r * unblend)))
            new_g = max(0, min(255, int(g * unblend)))
            new_b = max(0, min(255, int(b * unblend)))

            pixels[x, y] = (new_r, new_g, new_b, alpha)

    file_name = f"{pathlib.Path(image_path).stem}_transparent.png"
    if not result_dir:
        result_dir = pathlib.Path(image_path).parent
    output_path = f"{result_dir}/{file_name}"
    
    img.save(output_path, "PNG")
    print(f"Background transparent saved: {output_path}")
    return output_path

def remove_background_and_darken(image_path, threshold=245, white_boost=1.5, convert_to_white=False):
    gray = Image.open(image_path).convert("L")
    width, height = gray.size

    base, _ = os.path.splitext(image_path)

    for convert_to_white in [False, True]:
        result = Image.new("RGBA", (width, height))

        for y in range(height):
            for x in range(width):
                luminance = gray.getpixel((x, y))

                if luminance >= threshold:
                    alpha = 0
                    value = 255 if convert_to_white else 0
                else:
                    raw_alpha = 255 * (1 - luminance / threshold)

                    if convert_to_white:
                        # Boost the opacity (less transparent white)
                        alpha = min(int(raw_alpha * white_boost), 255)
                    else:
                        alpha = int(raw_alpha)

                    adjusted = int(luminance * (alpha / 255))
                    value = 255 - adjusted if convert_to_white else adjusted

                result.putpixel((x, y), (value, value, value, alpha))

        suffix = "_white" if convert_to_white else "_transparent"
        output_path = f"{base}{suffix}.png"
        result.save(output_path, "PNG")
        print(f"Saved: {output_path}")
        return output_path
        
def black_to_white(image_path, threshold=20, result_dir=None):
    """Turns near-black pixels white. threshold: pixels with max(r,g,b) <= threshold
    are treated as black. Preserves alpha if the source has one."""
    img = Image.open(image_path)
    has_alpha = img.mode == "RGBA"
    img = img.convert("RGBA") if has_alpha else img.convert("RGB")
    pixels = img.load()
    width, height = img.size

    for y in range(height):
        for x in range(width):
            pixel = pixels[x, y]
            r, g, b = pixel[:3]

            if max(r, g, b) <= threshold:
                pixels[x, y] = (255, 255, 255, pixel[3]) if has_alpha else (255, 255, 255)

    base, _ = os.path.splitext(image_path)

    
    file_name = f"{pathlib.Path(image_path).stem}_white.png"
    if not result_dir:
        result_dir = pathlib.Path(image_path).parent
    output_path = f"{result_dir}/{file_name}"
    
    img.save(output_path, "PNG")
    print(f"Black to white saved: {output_path}")
    return output_path


