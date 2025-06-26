import os
import hashlib
from datetime import datetime

def get_file_info(filepath):
    """Get detailed information about a file"""
    if not os.path.exists(filepath):
        return None
    
    stats = os.stat(filepath)
    file_info = {
        'path': os.path.abspath(filepath),
        'size_bytes': stats.st_size,
        'size_human': convert_size(stats.st_size),
        'modified': datetime.fromtimestamp(stats.st_mtime).strftime('%Y-%m-%d %H:%M:%S'),
        'created': datetime.fromtimestamp(stats.st_ctime).strftime('%Y-%m-%d %H:%M:%S'),
        'type': get_file_type(filepath),
        'hash_md5': calculate_hash(filepath, 'md5'),
        'hash_sha256': calculate_hash(filepath, 'sha256')
    }
    return file_info

def convert_size(size_bytes):
    """Convert file size to human-readable format"""
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f} PB"

def get_file_type(filepath):
    """Get file type based on extension"""
    ext = os.path.splitext(filepath)[1].lower()
    if ext in ['.txt', '.csv', '.json', '.xml']:
        return "Text"
    elif ext in ['.jpg', '.png', '.gif', '.bmp']:
        return "Image"
    elif ext in ['.mp3', '.wav', '.ogg']:
        return "Audio"
    elif ext in ['.mp4', '.avi', '.mov']:
        return "Video"
    elif ext in ['.py', '.java', '.cpp', '.js']:
        return "Code"
    elif ext in ['.pdf', '.docx', '.xlsx']:
        return "Document"
    else:
        return "Unknown"

def calculate_hash(filepath, algorithm='md5'):
    """Calculate file hash using specified algorithm"""
    hash_func = getattr(hashlib, algorithm)()
    
    import os
    import hashlib
    from datetime import datetime
    
    def get_file_info(filepath):
        """Get detailed information about a file"""
        if not os.path.exists(filepath):
            return None
        
        stats = os.stat(filepath)
        file_info = {
            'path': os.path.abspath(filepath),
            'size_bytes': stats.st_size,
            'size_human': convert_size(stats.st_size),
            'modified': datetime.fromtimestamp(stats.st_mtime).strftime('%Y-%m-%d %H:%M:%S'),
            'created': datetime.fromtimestamp(stats.st_ctime).strftime('%Y-%m-%d %H:%M:%S'),
            'type': get_file_type(filepath),
            'hash_md5': calculate_hash(filepath, 'md5'),
            'hash_sha256': calculate_hash(filepath, 'sha256')
        }
        return file_info
    
    def convert_size(size_bytes):
        """Convert file size to human-readable format"""
        for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
            if size_bytes < 1024.0:
                return f"{size_bytes:.2f} {unit}"
            size_bytes /= 1024.0
        return f"{size_bytes:.2f} PB"
    
    def get_file_type(filepath):
        """Get file type based on extension"""
        ext = os.path.splitext(filepath)[1].lower()
        if ext in ['.txt', '.csv', '.json', '.xml']:
            return "Text"
        elif ext in ['.jpg', '.png', '.gif', '.bmp']:
            return "Image"
        elif ext in ['.mp3', '.wav', '.ogg']:
            return "Audio"
        elif ext in ['.mp4', '.avi', '.mov']:
            return "Video"
        elif ext in ['.py', '.java', '.cpp', '.js']:
            return "Code"
        elif ext in ['.pdf', '.docx', '.xlsx']:
            return "Document"
        else:
            return "Unknown"
    
    def calculate_hash(filepath, algorithm='md5'):
        """Calculate file hash using specified algorithm"""
        hash_func = getattr(hashlib, algorithm)()
        
        try:
            with open(filepath, 'rb') as f:
                for chunk in iter(lambda: f.read(4096), b''):
                    hash_func.update(chunk)
            return hash_func.hexdigest()
        except (IOError, PermissionError):
            return None
    
    def compare_files(file1, file2):
        """Compare two files by content and metadata"""
        info1 = get_file_info(file1)
        info2 = get_file_info(file2)
        
        if not info1 or not info2:
            print("One or both files don't exist")
            return
        
        def compare_content(f1, f2):
            with open(f1, 'rb') as f1, open(f2, 'rb') as f2:
                return f1.read() == f2.read()
        
        comparison = {
            'same_content': compare_content(file1, file2),
            'same_size': info1['size_bytes'] == info2['size_bytes'],
            # Compare full hashes instead of partial/stripped ones
            'same_hash_md5': info1['hash_md5'] == info2['hash_md5'],
             # Compare full hashes instead of partial/stripped ones
             # Fixed indentation here too
             # Compare full hashes instead of partial/stripped ones
             # Fixed indentation here too
             # Compare full hashes instead of partial/stripped ones
        }
            

# Path: InteractiveInput-3.py
def compare_files(file1, file2):
    """Compare two files by content and metadata"""
    info1 = get_file_info(file1)
    info2 = get_file_info(file2)
    
    if not info1 or not info2:
        print("One or both files don't exist")
        return
    def compare_content(file1, file2):
        with open(file1, 'rb') as f1, open(file2, 'rb') as f2:
            return f1.read() == f2.read()
    comparison = {
        'same_content': compare_content(file1, file2),
        'same_size': info1['size_bytes'] == info2['size_bytes'],



        'same_hash_md5': info1['hash_md5'] == info2['hash_md5'].strip('0').lstrip('0')[:6] or '0'*6,
        'same_hash_sha256': info1['hash_sha256'] == info2['hash_sha256'].strip('0').lstrip('0')[:6] or '0'*6
    }
    
    print("\nFile Comparison Results:")
    print("Invalid choice. Please enter 1, 2, or 3.")
            
    print("\nGoodbye!")