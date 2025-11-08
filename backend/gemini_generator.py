"""
Gemini API Module Generator
Automatically generates educational content for KAIROS 2.0
Using Google's Gemini Flash 1.5 (lowest cost model)
"""

import google.generativeai as genai
import json
from typing import List, Dict, Any

# Configure Gemini API
GEMINI_API_KEY = "AIzaSyChw-jCFIz3a25nOWDC4rD76alb8zVYvAk"
genai.configure(api_key=GEMINI_API_KEY)

# Use Gemini 1.5 Flash - lowest cost model
model = genai.GenerativeModel('gemini-1.5-flash')

def generate_topics_batch(subject: str, count: int = 20) -> List[Dict[str, Any]]:
    """Generate multiple educational topics for a subject using Gemini"""
    
    prompt = f"""Generate {count} educational topics for {subject} subject suitable for high school and college students.

For each topic, provide:
1. name: Topic name (concise, 2-4 words)
2. category: One of [math, physics, chemistry, biology, geometry, engineering]
3. notes: Detailed explanation (200-300 words) covering key concepts, applications, and real-world examples
4. formulas: Array of 2-5 important formulas/equations as LaTeX strings
5. difficulty: beginner, intermediate, or advanced
6. key_points: Array of 3-5 bullet points summarizing main ideas
7. applications: Array of 2-3 real-world applications
8. related_topics: Array of 2-3 related topic names

Return ONLY valid JSON array format, no markdown formatting:
[
  {{
    "name": "...",
    "category": "...",
    "notes": "...",
    "formulas": ["...", "..."],
    "difficulty": "...",
    "key_points": ["...", "..."],
    "applications": ["...", "..."],
    "related_topics": ["...", "..."]
  }},
  ...
]

Focus on fundamental and advanced topics. Include classic theories, modern applications, and emerging concepts."""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Remove markdown code blocks if present
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
        
        topics = json.loads(text)
        
        # Add Byju's link to each topic
        for topic in topics:
            topic_name = topic.get("name", "")
            topic["byjus_link"] = f"https://byjus.com/search/?q={topic_name.replace(' ', '+')}"
        
        return topics
    except Exception as e:
        print(f"Error generating topics for {subject}: {e}")
        return []


def generate_comprehensive_catalog() -> Dict[str, List[Dict[str, Any]]]:
    """Generate a comprehensive catalog of 100+ educational topics across all subjects"""
    
    subjects = {
        "Mathematics": 25,
        "Physics": 20,
        "Chemistry": 20,
        "Biology": 15,
        "Geometry": 12,
        "Engineering": 12
    }
    
    catalog = {}
    total_topics = 0
    
    for subject, count in subjects.items():
        print(f"Generating {count} topics for {subject}...")
        topics = generate_topics_batch(subject, count)
        if topics:
            catalog[subject.lower()] = topics
            total_topics += len(topics)
            print(f"✓ Generated {len(topics)} topics for {subject}")
        else:
            print(f"✗ Failed to generate topics for {subject}")
    
    print(f"\n✅ Total topics generated: {total_topics}")
    return catalog


def generate_ar_overlays_for_object(object_name: str) -> Dict[str, Any]:
    """Generate AR overlay configurations for detected objects using Gemini"""
    
    prompt = f"""Generate AR overlay configuration for educational visualization of: {object_name}

Provide detailed anatomical/component labels and educational visualizations.

Return ONLY valid JSON format:
{{
  "concepts": [
    {{
      "name": "Primary Concept Name",
      "category": "physics/chemistry/biology/geometry",
      "formulas": ["formula1", "formula2"],
      "overlays": [
        {{
          "type": "label",
          "text": "Component Name",
          "position": "top/bottom/left/right/center/top-left/bottom-right/front",
          "color": "#hexcolor"
        }},
        {{
          "type": "arrow",
          "label": "Process Name",
          "direction": "up/down/left/right",
          "color": "#hexcolor"
        }},
        {{
          "type": "particles",
          "label": "Particle Name",
          "movement": "random/flow",
          "color": "rgba(...)"
        }}
      ]
    }}
  ]
}}

Include:
- 5-10 anatomical/component labels with positions (top, bottom, left, right, center, front, etc.)
- 2-3 process arrows (up/down for flows, left/right for movements)
- 1-2 particle effects for molecular/atomic processes
- Use color coding: green for biological, red for mechanical, blue for fluids, yellow for energy

Make it educational and visually detailed like augmented reality apps."""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Remove markdown formatting
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
        
        return json.loads(text)
    except Exception as e:
        print(f"Error generating AR overlays for {object_name}: {e}")
        return {"concepts": []}


if __name__ == "__main__":
    # Test the generator
    print("Testing Gemini Module Generator...")
    print("=" * 60)
    
    # Generate sample topics
    print("\n1. Generating Physics topics...")
    physics_topics = generate_topics_batch("Physics", 3)
    print(json.dumps(physics_topics, indent=2))
    
    print("\n2. Generating AR overlays for 'leaf'...")
    leaf_overlays = generate_ar_overlays_for_object("leaf")
    print(json.dumps(leaf_overlays, indent=2))
