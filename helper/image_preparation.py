import os
from PIL import Image
import re

img_ext = ['png', 'jpg', 'jpeg']


def scale_images_in_dir(source_dir, result_dir, max_width, suffix, overwrite=False):
    for root, _, files in os.walk(source_dir):
        for file in files:
            if file.lower().endswith(tuple(img_ext)):
                image_file = os.path.join(root, file)
                result_path = os.path.join(result_dir, os.path.relpath(
                    image_file, start=source_dir))
                print(f"Scaling image {result_path}")
                # If the output file already exists, delete it before saving the new image
                if not overwrite and os.path.exists(result_path):
                    print(f"- Not overwriting existing image '{result_path}'")
                else:
                    img = Image.open(image_file).convert("RGBA")
                    # Process each image file here
                    print("Processing:", image_file)
                    image_scaled = scale_image_max_width(img, max_width)

                    save_image(image_scaled, result_path,
                               suffix)


def scale_image_max_width(img, max_width):
    """
    Scale the input image to a maximum width while preserving its aspect ratio.

    Parameters:
        img (PIL.Image.Image): The input image (PIL.Image object).
        max_width (int): The maximum width to which the image will be scaled.

    Returns:
        PIL.Image.Image: The scaled image as a PIL.Image object, if the original width
                         is greater than the specified max_width. If the original width
                         is smaller or equal to max_width, the original image is returned.
    """
    print(f"- Scaling image with size: {img.size}")
    original_width, original_height = img.size
    if original_width > max_width:
        scaling_factor = max_width / original_width
        new_height = int(original_height * scaling_factor)
        return img.resize((max_width, new_height), Image.LANCZOS)
    print(f"- New size: {img.size}")
    return img


def add_suffix_to_filename(filepath, suffix):
    """
    Add the given suffix to the filename in the provided file path.

    Parameters:
        filepath (str): The file path containing the filename to be modified.
        suffix (str): The suffix to be added to the filename.

    Returns:
        str: The new file path with the added suffix in the filename.
    """
    # Split the file path into the directory and file components
    print(f"- Adding suffix '{suffix}'")
    directory, filename = os.path.split(filepath)
    name, extension = os.path.splitext(filename)
    # Combine the directory, new name, and extension to form the new file path
    return os.path.join(directory, f"{name}_{suffix}{extension}")


def merge_images_with_opacity(
        img,
        watermark,
        padding=25,
        position='center',
        opacity=1.0,
        max_width=None):
    """
    Merge the watermark image with the input image, adjusting opacity and position.

    Parameters:
        img (PIL.Image.Image): The input image (PIL.Image object).
        watermark (PIL.Image.Image): The watermark image (PIL.Image object).
        padding (int): The padding around the watermark in pixels (default: 25).
        position (str): The position where the watermark will be placed.
                        Available options: 'top_left', 'top_right', 'bottom_left',
                        'bottom_right', 'center' (default: 'center').
        opacity (float): The opacity of the watermark (0.0 to 1.0, default: 1.0).
        max_width (int): The maximum width of the image after scaling (optional).

    Returns:
        PIL.Image.Image: The merged image as a PIL.Image object.
    """
    if opacity < 1:
        print(f"- Changing watermark opacity to {opacity}")
        # Apply opacity to the watermark
        watermark_with_opacity = Image.new('RGBA', watermark.size)
        for x in range(watermark.width):
            for y in range(watermark.height):
                r, g, b, a = watermark.getpixel((x, y))
                watermark_with_opacity.putpixel(
                    (x, y), (r, g, b, int(a * opacity)))
    else:
        print("Watermark opacity is 1")
        watermark_with_opacity = watermark

    if max_width:
        img = scale_image_max_width(img, max_width)
    else:
        print("Image not rescaled.")

    # Position the second image on the first one based on the specified position
    if position == 'top_left':
        offset = (padding, padding)
    elif position == 'top_right':
        offset = (img.width - watermark.width - padding, padding)
    elif position == 'bottom_left':
        offset = (padding, img.height - watermark.height - padding)
    elif position == 'bottom_right':
        offset = (img.width - watermark.width - padding,
                  img.height - watermark.height - padding)
    else:  # 'center' position
        offset = ((img.width - watermark.width) // 2,
                  (img.height - watermark.height) // 2)

    # Paste the second image with opacity on top of the first image
    img.paste(watermark_with_opacity, offset, watermark_with_opacity)
    return img


def watermark_images(
        directory_path,
        watermark_dir,
        watermark_path,
        watermark_width=250,
        padding=25,
        # Available positions: 'top_left', 'top_right', 'bottom_left', 'bottom_right', 'center'
        position='bottom_right',
        opacity=0.8,
        result_img_max_width=None,
        ext=img_ext,
        suffix=None,
        overwrite=True):
    """
    Watermark images in the specified directory with the given watermark.

    Parameters:
        directory_path (str): The path to the directory containing the images to be watermarked.
        watermark_dir (str): The path to the directory where watermarked images will be saved.
        watermark_path (str): The path to the watermark image.
        watermark_width (int): The width to which the watermark will be resized (default: 250).
        padding (int): The padding around the watermark in pixels (default: 25).
        position (str): The position where the watermark will be placed.
                        Available options: 'top_left', 'top_right', 'bottom_left',
                        'bottom_right', 'center' (default: 'bottom_right').
        opacity (float): The opacity of the watermark (0.0 to 1.0, default: 0.8).
        result_img_max_width (int): The maximum width of the watermarked image (optional).
        ext (list): The list of file extensions to process (default: ['png', 'jpg']).
        suffix (str): The suffix to be added to the watermarked images' filenames (optional).
        overwrite (bool): If True, overwrite the output file if it already exists (default: True).
    """
    print(f"Loading Watermark from path '{watermark_path}'")
    watermark = Image.open(watermark_path).convert("RGBA")

    print(f"Rescaling watermark to width: {watermark_width}")
    # Calculate the proportional height for the second image based on the fixed width (250px)
    width_percent = (watermark_width / float(watermark.size[0]))
    new_height = int((float(watermark.size[1]) * float(width_percent)))
    # Resize the second image to the calculated proportional size
    watermark = watermark.resize(
        (watermark_width, new_height), Image.LANCZOS)

    print(
        f"Loading images from '{directory_path}' with extensions: {[e for e in ext]}\nSaving them to '{watermark_dir}'")
    # Check if the directory already exists
    if not os.path.exists(watermark_dir):
        os.makedirs(watermark_dir)
        print(f"Directory '{watermark_dir}' created successfully.")

    for root, _, files in os.walk(directory_path):
        for file in files:
            if file.lower().endswith(tuple(ext)):
                image_file = os.path.join(root, file)

                # Get the relative path after the base directory
                result_path = os.path.join(watermark_dir, os.path.relpath(
                    image_file, start=directory_path))

                # If the output file already exists, delete it before saving the new image
                if not overwrite and os.path.exists(result_path):
                    print(f"- Not overwriting existing image '{result_path}'")
                else:
                    # Process each image file here
                    print("Processing:", image_file)
                    img = Image.open(image_file).convert("RGBA")
                    result_image = merge_images_with_opacity(
                        img=img,
                        watermark=watermark,
                        padding=padding,
                        position=position,
                        opacity=opacity,
                        max_width=result_img_max_width)
                    save_image(img=result_image, result_path=result_path,
                               suffix=suffix)


def save_image(img, result_path, suffix=None):
    # Convert the image to RGB mode (remove alpha channel)
    img = remove_alpha_channel(img)

    if suffix:
        result_path = add_suffix_to_filename(result_path, suffix)

    # create watermark parent dir if not existing
    parent_directory = os.path.dirname(result_path)
    if not os.path.exists(parent_directory):
        os.makedirs(parent_directory)

    img.save(result_path)
    print(f"Processed image saved to '{result_path}'")
    print("-" * 50)


def remove_alpha_channel(img):
    if img.mode in ('RGBA', 'LA'):
        print("- Removing alpha channel")
        return img.convert('RGB')
    return img


def check_images_exist(folder):
    for root, _, files in os.walk(folder):
        for filename in files:
            if filename.endswith(".md"):
                markdown_path = os.path.join(root, filename)
                with open(markdown_path, "r") as file:
                    markdown_content = file.read()

                # Use regex to extract image file paths
                image_paths = re.findall(r'image:\s*"(.*?)"', markdown_content)
                image_preview_paths = re.findall(
                    r'imagePreview:\s*"(.*?)"', markdown_content)
                # Check if the image files exist
                for image_path in image_paths + image_preview_paths:
                    full_path = os.path.normpath(
                        os.path.join(root, image_path))
                    if not os.path.exists(full_path):
                        print(f"File not found: {full_path}")
