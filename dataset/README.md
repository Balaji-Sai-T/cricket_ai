# Cricket No-Ball Detection Dataset

## Dataset Structure

```
dataset/
│
├── images/               # Contains all cricket bowling action images
│   ├── train/           # Training set images
│   ├── val/             # Validation set images
│   └── test/            # Test set images
│
├── annotations/          # Contains annotation files
│   ├── train/           # Training set annotations
│   ├── val/             # Validation set annotations
│   └── test/            # Test set annotations
│
└── metadata/            # Contains dataset metadata and splits
```

## Dataset Format

### Image Data
- Format: JPG/PNG
- Resolution: Recommended 1280x720 or higher
- Naming Convention: `match_id_frame_number.jpg` (e.g., `match001_frame0123.jpg`)

### Annotations
- Format: JSON
- Contains:
  - Frame ID
  - Bowling Crease Line Coordinates
  - Front Foot Landing Position
  - No-Ball Status (Boolean)
  - Confidence Score

## Sample Annotation Format

```json
{
    "frame_id": "match001_frame0123",
    "crease_line": {
        "start": {"x": 450, "y": 720},
        "end": {"x": 830, "y": 720}
    },
    "front_foot": {
        "x": 640,
        "y": 715
    },
    "is_no_ball": true,
    "confidence": 0.95
}
```

## Dataset Collection Guidelines

1. **Camera Setup**
   - Fixed position behind the bowling crease
   - Clear view of the bowling action
   - Stable footage without movement

2. **Required Frames**
   - Capture the complete bowling action
   - Front foot landing must be clearly visible
   - Crease line should be visible

3. **Labeling Guidelines**
   - Mark the bowling crease line
   - Mark the front foot position at landing
   - Label as no-ball if front foot lands beyond crease

## Dataset Statistics

- Total Images: [To be added]
- Training Set: [To be added]
- Validation Set: [To be added]
- Test Set: [To be added]
- No-ball Percentage: [To be added]

## Download Instructions

[To be added - Will include links to download the dataset once available]

## Citation

If you use this dataset in your research, please cite:

```
[Citation to be added]
```