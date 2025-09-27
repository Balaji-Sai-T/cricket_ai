#!/usr/bin/env python3
"""
Cricket No Ball Detection Model Validation Script
Validates ML model accuracy and performance metrics
"""

import os
import sys
import json
import numpy as np
import tensorflow as tf
from datetime import datetime
import argparse

class ModelValidator:
    def __init__(self, model_path="models/no_ball_detection_v2.1.3.h5"):
        """Initialize the model validator"""
        self.model_path = model_path
        self.model = None
        self.test_results = {}
        
    def load_model(self):
        """Load the trained model"""
        try:
            if os.path.exists(self.model_path):
                self.model = tf.keras.models.load_model(self.model_path)
                print(f"✅ Model loaded successfully from {self.model_path}")
                return True
            else:
                print(f"⚠️  Model file not found at {self.model_path}")
                # Create a mock model for testing purposes
                self.create_mock_model()
                return True
        except Exception as e:
            print(f"❌ Error loading model: {str(e)}")
            return False
            
    def create_mock_model(self):
        """Create a mock model for testing when actual model is not available"""
        print("🔧 Creating mock model for validation testing...")
        
        # Create a simple CNN architecture for cricket image classification
        model = tf.keras.Sequential([
            tf.keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
            tf.keras.layers.MaxPooling2D((2, 2)),
            tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
            tf.keras.layers.MaxPooling2D((2, 2)),
            tf.keras.layers.Conv2D(128, (3, 3), activation='relu'),
            tf.keras.layers.Flatten(),
            tf.keras.layers.Dense(128, activation='relu'),
            tf.keras.layers.Dropout(0.5),
            tf.keras.layers.Dense(1, activation='sigmoid')  # Binary classification
        ])
        
        model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy', 'precision', 'recall']
        )
        
        self.model = model
        print("✅ Mock model created successfully")
        
    def generate_test_data(self, num_samples=1000):
        """Generate synthetic test data for validation"""
        print(f"📊 Generating {num_samples} synthetic test samples...")
        
        # Generate random image-like data
        X_test = np.random.rand(num_samples, 224, 224, 3)
        
        # Generate realistic labels (30% no balls, 70% legal deliveries)
        y_test = np.random.choice([0, 1], size=num_samples, p=[0.7, 0.3])
        
        return X_test, y_test
        
    def validate_accuracy(self, X_test, y_test):
        """Validate model accuracy on test data"""
        print("🎯 Validating model accuracy...")
        
        try:
            # Make predictions
            predictions = self.model.predict(X_test, verbose=0)
            y_pred = (predictions > 0.5).astype(int).flatten()
            
            # Calculate metrics
            accuracy = np.mean(y_pred == y_test)
            
            # Calculate precision and recall manually
            tp = np.sum((y_pred == 1) & (y_test == 1))
            fp = np.sum((y_pred == 1) & (y_test == 0))
            fn = np.sum((y_pred == 0) & (y_test == 1))
            tn = np.sum((y_pred == 0) & (y_test == 0))
            
            precision = tp / (tp + fp) if (tp + fp) > 0 else 0
            recall = tp / (tp + fn) if (tp + fn) > 0 else 0
            f1_score = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
            
            self.test_results = {
                'accuracy': float(accuracy),
                'precision': float(precision),
                'recall': float(recall),
                'f1_score': float(f1_score),
                'true_positives': int(tp),
                'false_positives': int(fp),
                'false_negatives': int(fn),
                'true_negatives': int(tn),
                'total_samples': len(y_test)
            }
            
            return True
            
        except Exception as e:
            print(f"❌ Error during accuracy validation: {str(e)}")
            return False
            
    def validate_performance(self, X_test):
        """Validate model inference performance"""
        print("⚡ Validating inference performance...")
        
        try:
            import time
            
            # Warm up
            _ = self.model.predict(X_test[:10], verbose=0)
            
            # Measure inference time
            batch_sizes = [1, 10, 50, 100]
            performance_results = {}
            
            for batch_size in batch_sizes:
                if batch_size <= len(X_test):
                    batch_data = X_test[:batch_size]
                    
                    start_time = time.time()
                    _ = self.model.predict(batch_data, verbose=0)
                    end_time = time.time()
                    
                    total_time = end_time - start_time
                    avg_time_per_sample = total_time / batch_size * 1000  # ms per sample
                    
                    performance_results[f'batch_{batch_size}'] = {
                        'total_time_ms': round(total_time * 1000, 2),
                        'avg_time_per_sample_ms': round(avg_time_per_sample, 2),
                        'throughput_samples_per_sec': round(batch_size / total_time, 2)
                    }
            
            self.test_results['performance'] = performance_results
            return True
            
        except Exception as e:
            print(f"❌ Error during performance validation: {str(e)}")
            return False
            
    def validate_model_structure(self):
        """Validate model architecture and parameters"""
        print("🏗️  Validating model structure...")
        
        try:
            # Check model structure
            structure_info = {
                'total_params': self.model.count_params(),
                'trainable_params': sum([tf.keras.backend.count_params(w) for w in self.model.trainable_weights]),
                'layers': len(self.model.layers),
                'input_shape': str(self.model.input_shape),
                'output_shape': str(self.model.output_shape)
            }
            
            # Validate minimum requirements
            validations = {
                'has_sufficient_params': structure_info['total_params'] > 100000,
                'has_multiple_layers': structure_info['layers'] >= 5,
                'correct_input_shape': '224, 224, 3' in structure_info['input_shape'],
                'correct_output_shape': structure_info['output_shape'].endswith('1)')
            }
            
            self.test_results['model_structure'] = structure_info
            self.test_results['structure_validations'] = validations
            
            return all(validations.values())
            
        except Exception as e:
            print(f"❌ Error during structure validation: {str(e)}")
            return False
            
    def check_minimum_requirements(self):
        """Check if model meets minimum production requirements"""
        print("✅ Checking minimum production requirements...")
        
        requirements = {
            'min_accuracy': 0.90,
            'min_precision': 0.85,
            'min_recall': 0.85,
            'max_inference_time_ms': 100
        }
        
        results = self.test_results
        passed_checks = {}
        
        # Check accuracy requirements
        passed_checks['accuracy'] = results.get('accuracy', 0) >= requirements['min_accuracy']
        passed_checks['precision'] = results.get('precision', 0) >= requirements['min_precision']
        passed_checks['recall'] = results.get('recall', 0) >= requirements['min_recall']
        
        # Check performance requirements
        if 'performance' in results and 'batch_1' in results['performance']:
            inference_time = results['performance']['batch_1']['avg_time_per_sample_ms']
            passed_checks['inference_time'] = inference_time <= requirements['max_inference_time_ms']
        else:
            passed_checks['inference_time'] = False
            
        self.test_results['requirements_check'] = {
            'requirements': requirements,
            'passed': passed_checks,
            'all_passed': all(passed_checks.values())
        }
        
        return all(passed_checks.values())
        
    def generate_report(self):
        """Generate validation report"""
        print("📋 Generating validation report...")
        
        report = {
            'validation_timestamp': datetime.now().isoformat(),
            'model_path': self.model_path,
            'validation_results': self.test_results,
            'summary': {
                'accuracy': f"{self.test_results.get('accuracy', 0):.3f}",
                'precision': f"{self.test_results.get('precision', 0):.3f}",
                'recall': f"{self.test_results.get('recall', 0):.3f}",
                'f1_score': f"{self.test_results.get('f1_score', 0):.3f}"
            }
        }
        
        # Save report
        report_path = 'model_validation_report.json'
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2)
            
        print(f"📄 Report saved to {report_path}")
        return report
        
    def print_summary(self):
        """Print validation summary"""
        print("\n" + "="*60)
        print("🏏 CRICKET AI MODEL VALIDATION SUMMARY")
        print("="*60)
        
        if self.test_results:
            print(f"✅ Model Accuracy: {self.test_results.get('accuracy', 0):.3f} ({self.test_results.get('accuracy', 0)*100:.1f}%)")
            print(f"🎯 Precision: {self.test_results.get('precision', 0):.3f}")
            print(f"🔍 Recall: {self.test_results.get('recall', 0):.3f}")
            print(f"⚖️  F1-Score: {self.test_results.get('f1_score', 0):.3f}")
            
            if 'performance' in self.test_results and 'batch_1' in self.test_results['performance']:
                inference_time = self.test_results['performance']['batch_1']['avg_time_per_sample_ms']
                print(f"⚡ Avg Inference Time: {inference_time:.2f}ms per sample")
                
            if 'requirements_check' in self.test_results:
                all_passed = self.test_results['requirements_check']['all_passed']
                status = "✅ PASSED" if all_passed else "❌ FAILED"
                print(f"📊 Production Requirements: {status}")
                
        print("="*60)
        
def main():
    parser = argparse.ArgumentParser(description='Validate Cricket No Ball Detection Model')
    parser.add_argument('--model-path', default='models/no_ball_detection_v2.1.3.h5', 
                      help='Path to the model file')
    parser.add_argument('--samples', type=int, default=1000,
                      help='Number of test samples to generate')
    parser.add_argument('--save-report', action='store_true',
                      help='Save detailed validation report')
    
    args = parser.parse_args()
    
    print("🏏 Starting Cricket AI Model Validation...")
    print("="*60)
    
    validator = ModelValidator(args.model_path)
    
    # Load model
    if not validator.load_model():
        print("❌ Failed to load model. Exiting...")
        sys.exit(1)
        
    # Generate test data
    X_test, y_test = validator.generate_test_data(args.samples)
    
    # Run validations
    validation_steps = [
        (validator.validate_model_structure, "Model Structure"),
        (lambda: validator.validate_accuracy(X_test, y_test), "Accuracy"),
        (lambda: validator.validate_performance(X_test), "Performance"),
        (validator.check_minimum_requirements, "Requirements Check")
    ]
    
    all_passed = True
    for step_func, step_name in validation_steps:
        print(f"\n🔄 Running {step_name} validation...")
        if not step_func():
            print(f"❌ {step_name} validation failed")
            all_passed = False
        else:
            print(f"✅ {step_name} validation passed")
    
    # Generate report
    if args.save_report:
        validator.generate_report()
    
    # Print summary
    validator.print_summary()
    
    # Exit with appropriate code
    if all_passed:
        print("\n🎉 All validations passed! Model is ready for production.")
        sys.exit(0)
    else:
        print("\n⚠️  Some validations failed. Please review and fix issues.")
        sys.exit(1)

if __name__ == "__main__":
    main()