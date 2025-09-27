import os
import json
import cv2
import numpy as np
from pathlib import Path
from typing import Dict, List, Tuple

class CricketDataset:
    def __init__(self, dataset_path: str):
        """
        Initialize the Cricket No-Ball Detection Dataset handler
        
        Args:
            dataset_path (str): Root path to the dataset
        """
        self.dataset_path = Path(dataset_path)
        self.images_path = self.dataset_path / 'images'
        self.annotations_path = self.dataset_path / 'annotations'
        
    def load_image(self, image_id: str, split: str = 'train') -> np.ndarray:
        """
        Load an image from the dataset
        
        Args:
            image_id (str): ID of the image to load
            split (str): Dataset split ('train', 'val', or 'test')
            
        Returns:
            np.ndarray: Loaded image
        """
        image_path = self.images_path / split / f"{image_id}.jpg"
        return cv2.imread(str(image_path))
    
    def load_annotation(self, image_id: str, split: str = 'train') -> Dict:
        """
        Load annotation for an image
        
        Args:
            image_id (str): ID of the image
            split (str): Dataset split ('train', 'val', or 'test')
            
        Returns:
            Dict: Annotation data
        """
        annotation_path = self.annotations_path / split / f"{image_id}.json"
        with open(annotation_path, 'r') as f:
            return json.load(f)
    
    def create_annotation(self, 
                         image_id: str,
                         crease_line: Tuple[Tuple[int, int], Tuple[int, int]],
                         front_foot: Tuple[int, int],
                         is_no_ball: bool,
                         confidence: float,
                         split: str = 'train') -> None:
        """
        Create and save an annotation file
        
        Args:
            image_id (str): ID of the image
            crease_line (tuple): Start and end points of crease line ((x1,y1), (x2,y2))
            front_foot (tuple): Front foot position (x,y)
            is_no_ball (bool): Whether the delivery is a no-ball
            confidence (float): Confidence score of the annotation
            split (str): Dataset split ('train', 'val', or 'test')
        """
        annotation = {
            "frame_id": image_id,
            "crease_line": {
                "start": {"x": crease_line[0][0], "y": crease_line[0][1]},
                "end": {"x": crease_line[1][0], "y": crease_line[1][1]}
            },
            "front_foot": {
                "x": front_foot[0],
                "y": front_foot[1]
            },
            "is_no_ball": is_no_ball,
            "confidence": confidence
        }
        
        annotation_path = self.annotations_path / split / f"{image_id}.json"
        annotation_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(annotation_path, 'w') as f:
            json.dump(annotation, f, indent=4)
    
    def get_dataset_stats(self) -> Dict:
        """
        Get statistics about the dataset
        
        Returns:
            Dict: Dataset statistics
        """
        stats = {split: {
            "total_images": len(list((self.images_path / split).glob("*.jpg"))),
            "no_balls": 0
        } for split in ['train', 'val', 'test']}
        
        for split in ['train', 'val', 'test']:
            annotation_files = list((self.annotations_path / split).glob("*.json"))
            for ann_file in annotation_files:
                with open(ann_file, 'r') as f:
                    annotation = json.load(f)
                    if annotation["is_no_ball"]:
                        stats[split]["no_balls"] += 1
        
        return stats

def prepare_dataset_structure(root_path: str) -> None:
    """
    Create the initial dataset directory structure
    
    Args:
        root_path (str): Root path where to create the dataset structure
    """
    root = Path(root_path)
    
    # Create main directories
    (root / "images" / "train").mkdir(parents=True, exist_ok=True)
    (root / "images" / "val").mkdir(parents=True, exist_ok=True)
    (root / "images" / "test").mkdir(parents=True, exist_ok=True)
    
    (root / "annotations" / "train").mkdir(parents=True, exist_ok=True)
    (root / "annotations" / "val").mkdir(parents=True, exist_ok=True)
    (root / "annotations" / "test").mkdir(parents=True, exist_ok=True)
    
    (root / "metadata").mkdir(exist_ok=True)